import React, { useState } from 'react';
import { 
  Star, Github, ExternalLink, Bookmark, Copy, Check, Zap, MapPin, Share2
} from 'lucide-react';
import { Repo } from '../types';
import { getCategoryDetails } from '../utils/categories';

interface RepoTableViewProps {
  repos: Repo[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectRepo: (repo: Repo) => void;
  onShowToast: (message: string) => void;
}

export const RepoTableView: React.FC<RepoTableViewProps> = ({
  repos,
  favorites,
  onToggleFavorite,
  onSelectRepo,
  onShowToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyClone = (e: React.MouseEvent, repo: Repo) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone https://github.com/${repo.repo}.git`);
    setCopiedId(repo.id);
    onShowToast(`Copied clone command for ${repo.name}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (e: React.MouseEvent, repo: Repo) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?repo=${encodeURIComponent(repo.id)}`;
    navigator.clipboard.writeText(shareUrl);
    onShowToast(`Copied share link for ${repo.name}!`);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
      {/* Mobile/Tablet Horizontal Scroll Helper Hint */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 text-[11px] text-slate-400">
        <span>Scroll horizontally to view all columns</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] text-left text-sm text-slate-300 border-collapse table-auto">
          <thead className="bg-background text-xs text-slate-400 font-semibold border-b border-white/5">
            <tr>
              <th scope="col" className="py-4 px-4 sm:px-6 w-[260px] min-w-[240px]">Project</th>
              <th scope="col" className="py-4 px-3 w-[100px] min-w-[90px] whitespace-nowrap">Stars</th>
              <th scope="col" className="py-4 px-3 w-[180px] min-w-[160px] whitespace-nowrap">Category</th>
              <th scope="col" className="py-4 px-4 w-[210px] min-w-[190px]">Replaces</th>
              <th scope="col" className="py-4 px-4 min-w-[320px]">Deployment Opportunity & Value</th>
              <th scope="col" className="py-4 px-4 sm:px-6 w-[100px] min-w-[95px] text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-normal">
            {repos.map((repo) => {
              const catDetails = getCategoryDetails(repo.cat);
              const isFav = favorites.includes(repo.id);
              const isCopied = copiedId === repo.id;

              return (
                <tr 
                  key={repo.id}
                  onClick={() => onSelectRepo(repo)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Project Name, Repo, and Logo Avatar */}
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(repo.id);
                          onShowToast(isFav ? `Removed ${repo.name} from saved` : `Saved ${repo.name}`);
                        }}
                        className={`p-1 rounded-md transition-colors mt-0.5 flex-shrink-0 ${
                          isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={isFav ? 'Remove bookmark' : 'Bookmark'}
                      >
                        <Bookmark size={15} className={isFav ? 'fill-amber-400' : ''} />
                      </button>

                      <img
                        src={`https://github.com/${repo.repo.split('/')[0]}.png?size=64`}
                        alt={repo.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-8 h-8 rounded-lg border border-white/10 bg-surface-300 object-cover flex-shrink-0 mt-0.5"
                        loading="lazy"
                      />

                      <div className="min-w-0">
                        <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{repo.name}</span>
                        </div>
                        <a
                          href={`https://github.com/${repo.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1 font-mono truncate mt-0.5"
                        >
                          <Github size={11} className="flex-shrink-0" />
                          <span className="truncate">{repo.repo}</span>
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Stars Pill */}
                  <td className="py-3.5 px-3 align-top whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      <Star size={11} className="fill-amber-400" />
                      <span>{repo.stars === '—' ? 'Unrated' : repo.stars}</span>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-3.5 px-3 align-top whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${catDetails.badgeClass}`}>
                      {catDetails.icon}
                      <span>{catDetails.label}</span>
                    </span>
                  </td>

                  {/* Replaces Tool & Savings - Styled block with no line-height bleed */}
                  <td className="py-3.5 px-4 align-top">
                    {repo.pays !== '-' ? (
                      <div className="flex flex-col items-start gap-1 max-w-[190px]">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium leading-normal break-words">
                          <Zap size={11} className="flex-shrink-0 text-rose-400" />
                          <span className="break-words">{repo.pays}</span>
                        </span>
                        {repo.monthlySavingsUsd && repo.monthlySavingsUsd > 0 ? (
                          <span className="text-[11px] font-mono text-emerald-400 font-medium pl-0.5 whitespace-nowrap">
                            ~${repo.monthlySavingsUsd}/mo saved
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs italic">None</span>
                    )}
                  </td>

                  {/* Notes & Opportunity & Where to Use */}
                  <td className="py-3.5 px-4 align-top text-xs text-slate-300">
                    <div className="space-y-1.5 max-w-xl">
                      <p className="line-clamp-2 leading-relaxed">
                        {repo.note}
                      </p>
                      {repo.use && (
                        <div className="flex items-start gap-1.5 text-[11px] text-sky-300/90 leading-relaxed bg-sky-500/5 border border-sky-500/10 px-2 py-1 rounded-md">
                          <MapPin size={11} className="flex-shrink-0 text-sky-400 mt-0.5" />
                          <span className="line-clamp-1">{repo.use}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleShare(e, repo)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copy share link"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleCopyClone(e, repo)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copy git clone command"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => onSelectRepo(repo)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                        title="View Details"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
