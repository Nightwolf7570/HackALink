import { LinkedInScraperLegal } from '../linkedin-scraper-legal';
import { LLMAnalyzer } from '../llm-client';
import type {
  Participant,
  TalkingPoint,
  SimilarityMatch,
  TeamSuggestion,
  AnalysisProgress,
} from '@/types';

export class ParticipantService {
  private llmAnalyzer: LLMAnalyzer;

  constructor() {
    this.llmAnalyzer = new LLMAnalyzer();
  }

  async processParticipants(
    participantList: Array<{
      name: string;
      email?: string;
      company?: string;
      linkedinUrl?: string;
      linkedinData?: any; // Manual input data
    }>,
    userProfile?: Participant,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<{
    participants: Participant[];
    heavyHitters: Participant[];
    talkingPoints: TalkingPoint[];
    similarBackgrounds: SimilarityMatch[];
    teamSuggestions: TeamSuggestion[];
  }> {
    // Stage 1: Process participant data
    onProgress?.({
      stage: 'Processing participant data',
      progress: 0.2,
      message: 'Organizing participant information...',
    });

    // Stage 2: Try to fetch via LinkedIn Official API if configured, otherwise use manual data
    onProgress?.({
      stage: 'Fetching LinkedIn data',
      progress: 0.3,
      message: 'Using legal data access methods...',
    });

    const participants: Participant[] = await Promise.all(
      participantList.map(async (p) => {
        let linkedinData = p.linkedinData;

        // Try to fetch profile data using available methods
        if (!linkedinData) {
          // Method 1: Try SerpAPI if configured (searches Google for LinkedIn profiles)
          const serpApiKey = process.env.SERPAPI_API_KEY;
          if (serpApiKey && serpApiKey !== 'your_serpapi_api_key_here') {
            try {
              const index = participantList.findIndex(participant => participant.name === p.name);
              onProgress?.({
                stage: 'Fetching LinkedIn data',
                progress: 0.3 + (index / participantList.length) * 0.3,
                message: `Searching for ${p.name}'s LinkedIn profile...`,
              });
              linkedinData = await LinkedInScraperLegal.fetchViaSerpAPI(p.name, p.company);
              if (linkedinData) {
                console.log(`✅ Found LinkedIn data for ${p.name}`);
              } else {
                console.warn(`⚠️ No LinkedIn profile found for ${p.name} via SerpAPI`);
              }
            } catch (error) {
              console.warn(`Could not fetch ${p.name} via SerpAPI:`, error);
            }
          } else {
            console.warn(`⚠️ SerpAPI not configured. Skipping LinkedIn lookup for ${p.name}. Add SERPAPI_API_KEY to .env.local`);
          }

          // Method 2: Try LinkedIn Official API if configured
          if (!linkedinData && p.linkedinUrl && process.env.LINKEDIN_ACCESS_TOKEN) {
            try {
              linkedinData = await LinkedInScraperLegal.fetchViaOfficialAPI(p.linkedinUrl);
            } catch (error) {
              console.warn(`Could not fetch ${p.name} via LinkedIn API:`, error);
            }
          }
        }

        // If manual data provided, parse it (if not already a LinkedInProfile)
        if (linkedinData && typeof linkedinData === 'object' && !linkedinData.profileUrl) {
          linkedinData = LinkedInScraperLegal.parseManualInput(linkedinData);
        }

        return {
          id: this.generateId(p.name),
          name: p.name,
          email: p.email,
          linkedinUrl: p.linkedinUrl,
          linkedinData,
          background: this.extractBackground(linkedinData),
        };
      })
    );

    // Stage 4: Analyze with LLM (even if no LinkedIn data)
    onProgress?.({
      stage: 'Analyzing participants',
      progress: 0.7,
      message: 'Identifying key participants...',
    });

    // Filter out participants with no data for analysis, but keep them in the list
    const participantsWithData = participants.filter((p: Participant) => p.linkedinData);
    
    // If no LinkedIn data found, still analyze based on names/companies
    const participantsToAnalyze = participantsWithData.length > 0 
      ? participantsWithData 
      : participants; // Fallback to all participants even without LinkedIn data

    const [heavyHitters] = await Promise.all([
      this.llmAnalyzer.identifyHeavyHitters(participantsToAnalyze),
    ]);

    onProgress?.({
      stage: 'Generating talking points',
      progress: 0.8,
      message: 'Creating personalized conversation starters...',
    });

    // Only generate talking points for participants with LinkedIn data
    const talkingPoints = await this.generateAllTalkingPoints(participantsWithData);

    onProgress?.({
      stage: 'Finding connections',
      progress: 0.9,
      message: 'Matching similar backgrounds...',
    });

    const [similarBackgrounds, teamSuggestions] = await Promise.all([
      userProfile
        ? this.llmAnalyzer.findSimilarBackgrounds(participants, userProfile)
        : Promise.resolve([]),
      this.llmAnalyzer.suggestTeams(participants),
    ]);

    // Count how many participants have LinkedIn data (reuse the variable from above)
    const dataFoundMessage = participantsWithData.length > 0
      ? `Found LinkedIn data for ${participantsWithData.length} of ${participants.length} participants`
      : `No LinkedIn data found. Analysis based on names only.`;

    onProgress?.({
      stage: 'Complete',
      progress: 1.0,
      message: `Analysis complete! ${dataFoundMessage}`,
    });

    return {
      participants,
      heavyHitters,
      talkingPoints,
      similarBackgrounds,
      teamSuggestions,
    };
  }

  private async generateAllTalkingPoints(
    participants: Participant[]
  ): Promise<TalkingPoint[]> {
    const talkingPoints: TalkingPoint[] = [];
    
    // Limit to top 10 participants to avoid too many API calls
    const limitedParticipants = participants.slice(0, 10);
    console.log(`Generating talking points for ${limitedParticipants.length} participants (limited from ${participants.length})`);

    // Process in parallel with timeout
    const timeout = (ms: number) => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    );

    const promises = limitedParticipants.map(async participant => {
      if (!participant.linkedinData) return null;
      try {
        // 30 second timeout per participant
        const points = await Promise.race([
          this.llmAnalyzer.generateTalkingPoints(participant),
          timeout(30000)
        ]) as string[];
        
        return {
          participantId: participant.id,
          participantName: participant.name,
          points,
          source: 'linkedin' as const,
        };
      } catch (error) {
        console.warn(`Timeout or error generating talking points for ${participant.name}:`, error);
        return {
          participantId: participant.id,
          participantName: participant.name,
          points: ['Could not generate talking points - try again later.'],
          source: 'linkedin' as const,
        };
      }
    });

    const results = await Promise.all(promises);
    talkingPoints.push(...(results.filter(Boolean) as TalkingPoint[]));

    return talkingPoints;
  }

  private extractBackground(linkedinData?: any) {
    if (!linkedinData) return undefined;

    return {
      schools: linkedinData.education?.map((e: any) => e.school) || [],
      companies: linkedinData.experience?.map((e: any) => e.company) || [],
      internships: linkedinData.experience?.filter((e: any) =>
        e.title.toLowerCase().includes('intern')
      ).map((e: any) => e.company) || [],
      research: linkedinData.experience?.filter((e: any) =>
        e.title.toLowerCase().includes('research')
      ).map((e: any) => e.company) || [],
      skills: linkedinData.skills || [],
    };
  }

  private generateId(name: string): string {
    return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  }
}

