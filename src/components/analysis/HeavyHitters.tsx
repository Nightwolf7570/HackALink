'use client';

import { useState } from 'react';
import type { Participant, TalkingPoint } from '@/types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

interface Props {
  participants: Participant[];
  talkingPoints?: TalkingPoint[];
}

export default function HeavyHitters({ participants, talkingPoints = [] }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getTalkingPointsForParticipant = (participantId: string) => {
    return talkingPoints.find(tp => tp.participantId === participantId)?.points || [];
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { class: 'bg-blue-600 text-white', label: '1' };
    if (rank === 2) return { class: 'bg-blue-400 text-white', label: '2' };
    if (rank === 3) return { class: 'bg-blue-300 text-white', label: '3' };
    return { class: 'bg-gray-200 text-gray-700', label: String(rank) };
  };

  return (
    <Card 
      title="People to Talk To" 
      subtitle="Top participants ranked by industry influence - click for conversation starters"
    >
      <div className="space-y-3">
        {participants.slice(0, 15).map((participant, idx) => {
          const linkedin = participant.linkedinData;
          const rank = idx + 1;
          const points = getTalkingPointsForParticipant(participant.id);
          const isExpanded = expandedId === participant.id;

          return (
            <div 
              key={participant.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div 
                className={`group flex items-start gap-4 p-4 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 border cursor-pointer ${
                  isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => setExpandedId(isExpanded ? null : participant.id)}
              >
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(rank).class}`}>
                  {getRankBadge(rank).label}
                </div>
                
                {/* Avatar */}
                <Avatar 
                  src={linkedin?.profileImage} 
                  name={participant.name} 
                  size="lg"
                />
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-900 text-lg truncate group-hover:text-blue-600 transition-colors">
                      {participant.name}
                    </h3>
                    {linkedin?.profileUrl && (
                      <a
                        href={linkedin.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-[#0077b5] hover:text-[#005582] transition-colors"
                        title="View LinkedIn Profile"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {/* Expand indicator */}
                    <svg 
                      className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {linkedin?.headline && (
                    <p className="text-neutral-600 text-sm mt-1 line-clamp-1">
                      {linkedin.headline}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {linkedin?.company && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {linkedin.company}
                      </span>
                    )}
                    {participant.score && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {Math.round(participant.score * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Conversation Starters */}
              {isExpanded && (
                <div className="mt-2 ml-14 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">
                    Conversation Starters
                  </h4>
                  {points.length > 0 ? (
                    <ul className="space-y-2">
                      {points.slice(0, 3).map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <p className="text-sm text-neutral-700 leading-relaxed">"{point}"</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-500 italic">
                      Click "Analyze Participants" to generate conversation starters
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {participants.length > 15 && (
        <p className="text-center text-neutral-500 text-sm mt-4">
          Showing top 15 of {participants.length} participants
        </p>
      )}
    </Card>
  );
}
