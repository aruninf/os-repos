import React, { useEffect, useState } from 'react';
import { 
  X, Github, Globe, Star, Terminal, Zap, 
  Check, Copy, Bookmark, ExternalLink, Briefcase, MapPin
} from 'lucide-react';
import { Repo } from '../types';
import { getCategoryDetails } from '../utils/categories';

interface RepoDetailModalProps {
  repo: Repo | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const RepoDetailModal: React.FC<RepoDetailModalProps> = ({
  repo,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShowToast
}) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedDocker, setCopiedDocker] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !repo) return null;

  const catDetails = getCategoryDetails(repo.cat);
  const cloneCmd = `git clone https://github.com/${repo.repo}.git`;
  const dockerCmd = repo.dockerCommand || `docker run -d --name ${repo.name.toLowerCase()} -p 8080:8080 ${repo.repo.toLowerCase()}:latest`;

  const copyText = (text: string, type: 'clone' | 'docker') => {
    navigator.clipboard.writeText(text);
    if (type === 'clone') {
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
      onShowToast('Git clone command copied');
    } else {
      setCopiedDocker(true);
      setTimeout(() => setCopiedDocker(false), 2000);
      onShowToast('Deployment command copied');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative bg-[#0d0f17] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header bar */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${catDetails.badgeClass}`}>
                {catDetails.icon}
                <span>{catDetails.label}</span>
              </span>

              <div className="flex items-center gap-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                <Star size={12} className="fill-amber-400" />
                <span>{repo.stars} stars</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={`https://github.com/${repo.repo.split('/')[0]}.png?size=96`}
                alt={repo.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-12 h-12 rounded-xl border border-white/10 bg-[#07080c] object-cover flex-shrink-0 shadow-md"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {repo.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                  github.com/{repo.repo}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleFavorite(repo.id);
                onShowToast(isFavorite ? `Removed ${repo.name}` : `Saved ${repo.name}`);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Bookmark"
            >
              <Bookmark size={18} className={isFavorite ? 'fill-amber-400' : ''} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-6">
          
          {/* Banner Preview Image */}
          <div className="relative w-full aspect-[16/9] sm:h-56 rounded-2xl overflow-hidden border border-white/10 bg-[#07080c] shadow-lg">
            <img
              src={repo.image || `https://opengraph.githubassets.com/1/${repo.repo}`}
              alt={`${repo.name} preview banner`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.parentElement?.classList.add('hidden');
              }}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Software Replacement Card */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Zap size={14} /> Replaces Commercial Software
              </span>
              {repo.monthlySavingsUsd ? (
                <span className="text-emerald-400 font-mono">
                  ~${repo.monthlySavingsUsd}/mo Saved
                </span>
              ) : null}
            </div>
            <p className="text-base sm:text-lg font-bold text-white">
              {repo.pays !== '-' ? repo.pays : 'Standard proprietary cloud software'}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              By deploying this open-source solution, organizations avoid per-seat license fees, user limits, and vendor lock-in.
            </p>
          </div>

          {/* Deployment Guide & Client Opportunities */}
          <div className="bg-[#111420] p-4 sm:p-5 rounded-2xl border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Briefcase size={14} /> Deployment & Client Service Opportunities
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
              {repo.note}
            </p>
          </div>

          {/* Where to Use */}
          {repo.use && (
            <div className="bg-[#111420] p-4 sm:p-5 rounded-2xl border border-sky-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 uppercase tracking-wider">
                <MapPin size={14} /> Where to Use & Monetization Gigs
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
                {repo.use}
              </p>
            </div>
          )}

          {/* Quick Deployment Snippets */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Terminal size={14} /> Setup & Run Commands
            </h4>

            {/* Docker Run / Compose */}
            <div className="bg-[#07080c] rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center mb-1 text-[11px] text-slate-500 font-mono">
                <span>Docker / Compose</span>
                <button
                  onClick={() => copyText(dockerCmd, 'docker')}
                  className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiedDocker ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedDocker ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap select-all py-1">
                {dockerCmd}
              </pre>
            </div>

            {/* Git Clone */}
            <div className="bg-[#07080c] rounded-xl p-3 border border-white/5">
              <div className="flex justify-between items-center mb-1 text-[11px] text-slate-500 font-mono">
                <span>Git Clone</span>
                <button
                  onClick={() => copyText(cloneCmd, 'clone')}
                  className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiedClone ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto select-all py-1">
                {cloneCmd}
              </pre>
            </div>
          </div>

          {/* Tags */}
          {repo.tags && repo.tags.length > 0 && (
            <div>
              <span className="block text-[11px] uppercase font-semibold text-slate-500 tracking-wider mb-2">
                Tags & Features
              </span>
              <div className="flex flex-wrap gap-1.5">
                {repo.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <a
            href={`https://github.com/${repo.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-colors"
          >
            <Github size={16} />
            <span>Open on GitHub</span>
            <ExternalLink size={13} />
          </a>

          {repo.website && (
            <a
              href={repo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors"
            >
              <Globe size={15} />
              <span>Official Website</span>
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
