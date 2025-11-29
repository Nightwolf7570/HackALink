'use client';

import type { TeamSuggestion } from '@/types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

interface Props {
  suggestions: TeamSuggestion[];
}

export default function TeamSuggestions({ suggestions }: Props) {
  return (
    <Card 
      title="Suggested Teams" 
      subtitle="AI-generated team compositions with complementary skills"
      action={
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {suggestions.length} teams
        </span>
      }
    >
      <div className="space-y-4">
        {suggestions.map((team, idx) => (
          <div 
            key={idx} 
            className="animate-fade-in p-5 bg-slate-50 rounded-xl border border-slate-100"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900">Team {idx + 1}</h3>
              <span className="px-2.5 py-1 bg-white text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
                {team.participants.length} members
              </span>
            </div>
            
            {/* Team Members */}
            <div className="flex flex-wrap gap-2 mb-4">
              {team.participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 border border-slate-200">
                  <Avatar src={p.linkedinData?.profileImage} name={p.name} size="sm" />
                  <span className="text-sm font-medium text-slate-700">{p.name}</span>
                </div>
              ))}
            </div>
            
            {/* Reasoning */}
            <p className="text-slate-500 text-sm mb-4 italic leading-relaxed">
              "{team.reasoning}"
            </p>
            
            {/* Skills */}
            {team.complementarySkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {team.complementarySkills.slice(0, 6).map((skill, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 bg-white text-slate-600 rounded-lg text-xs font-medium border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
