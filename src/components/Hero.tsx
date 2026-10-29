import React from 'react';
import { Star, DollarSign, Layers } from 'lucide-react';
import { Repo } from '../types';

interface HeroProps {
  repos: Repo[];
  categoriesCount: number;
  onSelectQuickTag?: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ repos }) => {
  const totalStarsCount = repos.reduce((acc, r) => acc + r.starCount, 0);
  const formattedStars = (totalStarsCount / 1000).toFixed(0) + 'k+';
  const estimatedSavings = repos.reduce((acc, r) => acc + (r.monthlySavingsUsd || 0), 0);

  return (
    <section className="relative pt-32 pb-12 sm:pb-16 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Title - Simple, Professional, SEO Friendly */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
        Discover Open-Source <br className="hidden sm:block" />
        <span className="text-emerald-400">
          High-Value Alternatives
        </span> to Paid Software
      </h1>

      {/* Subtitle - Simple Language */}
      <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
        Explore reliable, self-hosted open-source software that replaces expensive commercial subscriptions. Reduce team overhead, keep full data ownership, and build client services.
      </p>

      {/* Stat Cards Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10">
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-2xl sm:text-3xl font-mono mb-1">
            <Layers size={22} />
            <span>{repos.length}</span>
          </div>
          <span className="text-xs font-medium text-slate-400">Curated projects</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-2xl sm:text-3xl font-mono mb-1">
            <Star size={22} className="fill-amber-400/20" />
            <span>{formattedStars}</span>
          </div>
          <span className="text-xs font-medium text-slate-400">GitHub stars</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-2xl sm:text-3xl font-mono mb-1">
            <DollarSign size={22} />
            <span>${estimatedSavings.toLocaleString()}</span>
          </div>
          <span className="text-xs font-medium text-slate-400">Monthly replaced</span>
        </div>
      </div>
    </section>
  );
};
