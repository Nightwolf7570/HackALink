'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  const features = [
    {
      title: 'Top Candidates',
      description: 'Identify the most influential participants based on their background and experience',
    },
    {
      title: 'Talking Points',
      description: 'Get AI-generated conversation starters personalized for each person',
    },
    {
      title: 'Team Builder',
      description: 'Find complementary teammates with matching skills and diverse backgrounds',
    },
    {
      title: 'Profile Discovery',
      description: 'Automatically find and enrich LinkedIn profiles for all participants',
    },
    {
      title: 'Smart Rankings',
      description: 'See participants ranked by influence, similarity to you, and team fit',
    },
    {
      title: 'Post Generator',
      description: 'Create professional LinkedIn posts about your hackathon experience',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-slate-900 py-24 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-slate-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            AI-Powered Networking
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Find Your
            <span className="block text-slate-400">Dream Team</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your hackathon participant list and discover who to network with, 
            get personalized talking points, and find complementary teammates.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Get Started
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/participants">
              <Button variant="ghost" size="lg" className="text-slate-400 hover:text-white hover:bg-slate-800">
                View Participants
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
              Everything You Need for Hackathon Networking
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Our AI-powered platform helps you make the most of your hackathon experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="card p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-semibold mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-8 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
            Ready to Level Up Your Networking?
          </h2>
          <p className="text-slate-400 mb-8">
            Upload your participant list and let AI help you make the most valuable connections
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Start Analyzing
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto text-center text-slate-400 text-sm">
          <p>Built for Thanksgiving Hackathon 2025</p>
        </div>
      </div>
    </div>
  );
}
