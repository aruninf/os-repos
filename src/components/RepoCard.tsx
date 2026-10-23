import React, { useState } from 'react';
import { 
  Star, ArrowUpRight, Github, Zap, Code2, 
  Bookmark, Copy, Check, ExternalLink, MapPin
} from 'lucide-react';
import { Repo } from '../types';
import { getCategoryDetails } from '../utils/categories';

interface RepoCardProps {
  repo: Repo;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectRepo: (repo: Repo) => void;
  onShowToast: (message: string) => void;
  animationDelayMs?: number;
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  isFavorite,
  onToggleFavorite,
  onSelectRepo,
  onShowToast,
  animationDelayMs = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const catDetails = getCategoryDetails(repo.cat);
  const hasDirectReplacement = repo.pays && repo.pays !== '-';

  const [owner] = repo.repo.split('/');
  const avatarUrl = `https://github.com/${owner}.png?size=96`;
  const previewUrl = repo.image || `https://opengraph.githubassets.com/1/${repo.repo}`;

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const command = `git clone https://github.com/${repo.repo}.git`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    onShowToast(`Copied clone command for ${repo.name}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(repo.id);
    onShowToast(isFavorite ? `Removed ${repo.name} from saved` : `Saved ${repo.name} to bookmarks`);
  };

  return (
    <article 
      onClick={() => onSelectRepo(repo)}
      className="group relative glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 flex flex-col h-full cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        animation: 'fadeInUp 0.4s ease-out forwards',
        animationDelay: `${animationDelayMs}ms`
      }}
    >
      {/* Subtle border glow highlight on card hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Main card content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* ========================================================= */}
        {/* Visual Media Header: OpenGraph Preview Banner / Fallback */}
        {/* ========================================================= */}
        <div className="relative w-full aspect-[16/9] sm:h-44 rounded-xl overflow-hidden mb-4 bg-[#0a0c13] border border-white/10 group-hover:border-emerald-500/30 transition-colors shadow-inner flex-shrink-0">
          
          {!imageError ? (
            <img
              src={previewUrl}
              alt={`${repo.name} preview`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : null}

          {/* Fallback Graphic Banner if image fails or while loading */}
          {(!imageLoaded || imageError) && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#121522] via-[#0d0f18] to-[#151929] ${imageLoaded && !imageError ? 'hidden' : ''}`}>
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {!avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={owner}
                    onError={() => setAvatarError(true)}
                    className="w-12 h-12 rounded-xl border border-white/10 shadow-lg mb-2 object-cover bg-black/40"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 text-emerald-400">
                    <Github size={24} />
                  </div>
                )}
                <span className="text-sm font-bold text-white tracking-tight">{repo.name}</span>
                <span className="text-[11px] font-mono text-slate-400 mt-0.5">{repo.repo}</span>
              </div>
            </div>
          )}

          {/* Gradient shadow for crisp contrast over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Floating Category Badge (Top-Left) */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/70 border ${catDetails.badgeClass} shadow-md`}>
              {catDetails.icon}
              <span>{catDetails.label}</span>
            </span>
          </div>

          {/* Floating Bookmark Button (Top-Right) */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg backdrop-blur-md transition-all shadow-md ${
              isFavorite 
                ? 'bg-amber-500/30 border border-amber-400/80 text-amber-300' 
                : 'bg-black/60 border border-white/15 text-slate-300 hover:text-white hover:bg-black/80'
            }`}
            title={isFavorite ? 'Remove bookmark' : 'Bookmark project'}
            aria-label="Bookmark project"
          >
            <Bookmark size={14} className={isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
          </button>

          {/* Floating Stars Pill (Bottom-Right) */}
          <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 text-[11px] font-mono font-bold backdrop-blur-md bg-black/80 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/25 shadow-md">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{repo.stars}</span>
          </div>

          {/* Floating Monthly Savings Pill (Bottom-Left) */}
          {repo.monthlySavingsUsd && repo.monthlySavingsUsd > 0 ? (
            <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 text-[11px] font-mono font-semibold backdrop-blur-md bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30 shadow-md">
              <span>Save ~${repo.monthlySavingsUsd}/mo</span>
            </div>
          ) : null}
        </div>

        {/* ========================================================= */}
        {/* Project Identity & Header */}
        {/* ========================================================= */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {!avatarError ? (
              <img
                src={avatarUrl}
                alt={owner}
                onError={() => setAvatarError(true)}
                className="w-10 h-10 rounded-xl border border-white/10 bg-[#0d0f17] object-cover flex-shrink-0 shadow-sm"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                <Github size={18} />
              </div>
            )}
            
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 truncate">
                <span className="truncate">{repo.name}</span>
                <ArrowUpRight size={15} className="opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-emerald-400 flex-shrink-0" />
              </h3>
              
              <a 
                href={`https://github.com/${repo.repo}`} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 mt-0.5 transition-colors font-mono truncate"
              >
                <Github size={12} className="flex-shrink-0" />
                <span className="truncate">{repo.repo}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Body Cards: Replaces, Where to Use, Opportunity Note */}
        {/* ========================================================= */}
        <div className="space-y-2.5 mb-4 flex-grow">
          {/* Replaces Tool */}
          <div className="bg-[#0e1017] rounded-xl p-3 border border-white/5 flex items-start gap-2.5">
            <div className="mt-0.5 bg-rose-500/10 text-rose-400 p-1 rounded-md flex-shrink-0">
              <Zap size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Replaces Paid Software
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                {hasDirectReplacement ? repo.pays : <span className="text-slate-500 italic">Self-standing tool</span>}
              </p>
            </div>
          </div>

          {/* Where to Use & Monetization Gigs */}
          {repo.use && (
            <div className="bg-[#0e1017] rounded-xl p-3 border border-sky-500/15 flex items-start gap-2.5">
              <div className="mt-0.5 bg-sky-500/10 text-sky-400 p-1 rounded-md flex-shrink-0">
                <MapPin size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-0.5">
                  Where to Use
                </span>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {repo.use}
                </p>
              </div>
            </div>
          )}

          {/* Opportunity & Deployment Note */}
          <div className="bg-[#0e1017] rounded-xl p-3 border border-white/5 flex items-start gap-2.5">
            <div className="mt-0.5 bg-emerald-500/10 text-emerald-400 p-1 rounded-md flex-shrink-0">
              <Code2 size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Opportunity & Deployment Note
              </span>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {repo.note}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Tags Pill List */}
        {repo.tags && repo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {repo.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                #{tag}
              </span>
            ))}
            {repo.tags.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-slate-500">
                +{repo.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* Card Footer: Quick Actions */}
        {/* ========================================================= */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
          {/* Copy clone command */}
          <button
            onClick={handleCopyClone}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-300 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Copy git clone command"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Clone'}</span>
          </button>

          {/* Open Deep-dive Modal */}
          <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors">
            <span>Guide & Setup</span>
            <ExternalLink size={12} />
          </span>
        </div>

      </div>
    </article>
  );
};
