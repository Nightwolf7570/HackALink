import OpenAI from 'openai';
import type { Participant, TalkingPoint, SimilarityMatch, TeamSuggestion } from '@/types';

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({
    apiKey,
  });
}

export class LLMAnalyzer {
  async identifyHeavyHitters(participants: Participant[]): Promise<Participant[]> {
    const prompt = `Analyze these hackathon participants and rank them by job prestige, industry influence, and career achievements.

Participants:
${participants.map((p, idx) => `
${idx + 1}. ${p.name}
   - Position: ${p.linkedinData?.currentPosition || 'Unknown'}
   - Company: ${p.linkedinData?.company || 'Unknown'}
   - Education: ${p.linkedinData?.education?.map(e => `${e.degree} at ${e.school}`).join(', ') || 'Unknown'}
   - Experience: ${p.linkedinData?.experience?.length || 0} positions
   - Skills: ${p.linkedinData?.skills?.slice(0, 10).join(', ') || 'None'}
`).join('\n')}

Return a JSON object with a "rankings" array of participant names ranked from most prestigious/influential to least, with a brief reasoning for each top 10. Format:
{
  "rankings": [
    {"name": "Name", "reasoning": "Why they're influential", "score": 0.95}
  ]
}`;

    try {
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const rankings = result.rankings || [];

      // Map rankings back to participants
      return rankings
        .map((r: any) => {
          const participant = participants.find(p => p.name === r.name);
          if (participant) {
            return { ...participant, score: r.score };
          }
          return null;
        })
        .filter(Boolean) as Participant[];
    } catch (error) {
      console.error('Error identifying heavy hitters:', error);
      return [];
    }
  }

  async generateTalkingPoints(participant: Participant): Promise<string[]> {
    if (!participant.linkedinData) {
      return ['No LinkedIn data available for this participant.'];
    }

    const prompt = `You're at a hackathon and want to network with this person. Generate 5 SHORT, punchy conversation openers that will actually work in a loud, busy hackathon environment.

THEIR INFO:
- Name: ${participant.name}
- Role: ${participant.linkedinData.currentPosition || 'Unknown'}
- Company: ${participant.linkedinData.company || 'Unknown'}
- Bio: ${participant.linkedinData.about?.substring(0, 200) || participant.linkedinData.headline || 'None'}

RULES:
1. Each opener should be 1-2 sentences MAX
2. Be casual and genuine, NOT corporate or cringe
3. Reference something specific about them (company, role, or background)
4. Include a question to get them talking
5. Avoid generic compliments like "I love your work"

EXAMPLES OF GOOD OPENERS:
- "Hey! I saw you're at ${participant.linkedinData.company || 'a cool company'} - what's the tech stack like there?"
- "Quick question - as someone in ${participant.linkedinData.currentPosition || 'your field'}, what's the biggest problem you'd want to solve this weekend?"

Return as JSON: {"talkingPoints": ["opener 1", "opener 2", ...]}`;

    try {
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log(`[LLM] Generated talking points for ${participant.name}`);
      return result.talkingPoints || [];
    } catch (error) {
      console.error(`Error generating talking points for ${participant.name}:`, error);
      return ['Error generating talking points.'];
    }
  }

  async findSimilarBackgrounds(
    participants: Participant[],
    userProfile: Participant
  ): Promise<SimilarityMatch[]> {
    const matches: SimilarityMatch[] = [];

    for (const participant of participants) {
      if (participant.id === userProfile.id) continue;

      const commonalities = this.findCommonalities(userProfile, participant);
      if (commonalities.score > 0.3) {
        matches.push({
          participant1: userProfile.id,
          participant2: participant.id,
          participant1Name: userProfile.name,
          participant2Name: participant.name,
          similarityScore: commonalities.score,
          commonalities: commonalities.details,
        });
      }
    }

    return matches.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  private findCommonalities(p1: Participant, p2: Participant): {
    score: number;
    details: SimilarityMatch['commonalities'];
  } {
    const p1Bg = p1.background || { schools: [] as string[], companies: [] as string[], skills: [] as string[] };
    const p2Bg = p2.background || { schools: [] as string[], companies: [] as string[], skills: [] as string[] };

    const commonSchools = p1Bg.schools.filter(s => p2Bg.schools.includes(s));
    const commonCompanies = p1Bg.companies.filter(c => p2Bg.companies.includes(c));
    const commonSkills = p1Bg.skills.filter(s => p2Bg.skills.includes(s));

    let score = 0;
    if (commonSchools.length > 0) score += 0.4;
    if (commonCompanies.length > 0) score += 0.3;
    if (commonSkills.length > 2) score += 0.2;
    if (commonSkills.length > 5) score += 0.1;

    return {
      score: Math.min(score, 1.0),
      details: {
        schools: commonSchools,
        companies: commonCompanies,
        skills: commonSkills,
      },
    };
  }

  async suggestTeams(
    participants: Participant[],
    teamSize: number = 4
  ): Promise<TeamSuggestion[]> {
    const prompt = `Analyze these hackathon participants and suggest ${teamSize}-person teams with complementary skills:

Participants:
${participants.map((p, idx) => `
${idx + 1}. ${p.name}
   - Skills: ${p.linkedinData?.skills?.join(', ') || 'Unknown'}
   - Experience: ${p.linkedinData?.experience?.map(e => e.title).join(', ') || 'None'}
   - Education: ${p.linkedinData?.education?.map(e => e.field || e.degree).join(', ') || 'None'}
`).join('\n')}

Suggest 3-5 teams with:
- Complementary technical skills
- Diverse backgrounds
- Good collaboration potential

Return JSON format:
{
  "teams": [
    {
      "participants": ["Name1", "Name2", ...],
      "reasoning": "Why this team works well",
      "complementarySkills": ["skill1", "skill2", ...]
    }
  ]
}`;

    try {
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const teams = result.teams || [];

      return teams.map((team: any) => ({
        participants: team.participants
          .map((name: string) => participants.find(p => p.name === name))
          .filter(Boolean) as Participant[],
        reasoning: team.reasoning,
        complementarySkills: team.complementarySkills || [],
      }));
    } catch (error) {
      console.error('Error suggesting teams:', error);
      return [];
    }
  }

  async generateLinkedInPost(
    hackathonName: string,
    heavyHitters: Participant[],
    userExperience?: string
  ): Promise<string> {
    const prompt = `Generate a professional LinkedIn post about attending ${hackathonName}.

Notable participants (mention subtly, not by name unless very appropriate):
${heavyHitters.slice(0, 5).map(p => `- ${p.linkedinData?.currentPosition} at ${p.linkedinData?.company}`).join('\n')}

${userExperience ? `User's experience: ${userExperience}` : ''}

Make it:
- Professional and engaging
- Highlight networking opportunities
- Mention the quality of participants
- Include relevant hashtags
- 2-3 paragraphs, LinkedIn-appropriate length`;

    try {
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating LinkedIn post:', error);
      return 'Error generating post.';
    }
  }
}

