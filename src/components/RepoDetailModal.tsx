import React, { useEffect, useState } from 'react';
import { 
  X, Github, Globe, Star, Terminal, Zap, 
  Check, Copy, Bookmark, ExternalLink, Briefcase, MapPin,
  Share2, Users, Monitor, Sparkles, CheckCircle2, ArrowRight
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
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeHowTab, setActiveHowTab] = useState<'user' | 'dev'>('user');

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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?repo=${encodeURIComponent(repo.id)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
    onShowToast(`Copied share link for ${repo.name}!`);
  };

  // Plain English explanation fallback
  const plainDescription = repo.description || (
    repo.pays && repo.pays !== '-'
      ? `${repo.name} is a self-hosted open-source software solution that replaces expensive commercial platforms like ${repo.pays}. ${repo.note}`
      : `${repo.name} is an open-source tool designed to provide full data ownership, privacy, and unlimited usage without recurring subscription fees. ${repo.note}`
  );

  // Target audience fallback
  const audienceList = repo.targetAudience || [
    "Businesses & Teams seeking zero recurring SaaS costs",
    "Agencies & Freelancers delivering client setups",
    "Creators, Marketers & Builders wanting full control of their data",
    "Developers & System Admins self-hosting on private servers"
  ];

  // Helper for Category-specific Use Cases
  const getCategoryUseCases = () => {
    if (repo.use) {
      return [
        {
          title: "Primary Client & Business Use Case",
          desc: repo.use
        },
        {
          title: "Avoid SaaS Price Hikes & Limits",
          desc: `Eliminate per-seat fees from ${repo.pays !== '-' ? repo.pays : 'proprietary vendors'}. Manage unlimited accounts, workflows, and datasets without monthly bills.`
        },
        {
          title: "Monetization & Consulting Retainers",
          desc: `Offer deployment, maintenance, and backup management for ${repo.name} to local business clients for $100-$300/mo retainer fees.`
        }
      ];
    }

    switch (repo.cat) {
      case 'marketing':
        return [
          {
            title: "Multi-Brand & Client Campaign Scheduling",
            desc: "Manage multiple social networks or marketing channels from a single dashboard without per-account subscription fees."
          },
          {
            title: "Content Batching & Automated Publishing",
            desc: "Plan and schedule an entire month of promotional posts, threads, and updates in advance to keep an active presence."
          },
          {
            title: "Agency Client Retainers",
            desc: `Deploy and manage ${repo.name} for marketing clients, charging $100-$300/mo for a turnkey self-hosted publishing engine.`
          }
        ];
      case 'automation':
        return [
          {
            title: "Workflow & Webhook Orchestration",
            desc: "Connect your databases, APIs, webhooks, and forms without paying per-task execution fees to Zapier or Make."
          },
          {
            title: "Data Syncing & Alerting",
            desc: "Sync CRM records, payment events, Slack/Discord alerts, and customer notifications automatically."
          },
          {
            title: "Custom Business Integrations",
            desc: "Build proprietary back-office integrations for clients who have strict privacy or data sovereignty requirements."
          }
        ];
      case 'ai':
        return [
          {
            title: "Self-Hosted & Private AI Inference",
            desc: "Run AI models, agents, and generative pipelines locally or in private cloud without sending confidential data to third parties."
          },
          {
            title: "Zero Token / Subscription Costs",
            desc: "Eliminate recurring SaaS subscription fees by running open-weights models and specialized fine-tunes on your own hardware."
          },
          {
            title: "Custom AI Tooling & Gigs",
            desc: "Package custom AI workflows or internal copilots for enterprise clients at agency rates ($2k-$10k setup)."
          }
        ];
      default:
        return [
          {
            title: "Zero Recurring SaaS Licensing",
            desc: `Replaces expensive tools like ${repo.pays !== '-' ? repo.pays : 'commercial software'}, saving your team recurring monthly overhead.`
          },
          {
            title: "Complete Data Sovereignty & Privacy",
            desc: "Self-host on your own infrastructure or cloud VPS so your team retains 100% control over customer and business data."
          },
          {
            title: "Client Deployment & Setup Services",
            desc: `${repo.note}. Set up and maintain this system for companies seeking managed open-source infrastructure.`
          }
        ];
    }
  };

  // Structured How-To-Use Guide
  const userSteps: string[] = (() => {
    if (repo.howToUse) {
      if (Array.isArray(repo.howToUse)) return repo.howToUse;
      if (repo.howToUse.forUsers && repo.howToUse.forUsers.length > 0) return repo.howToUse.forUsers;
    }
    return [
      `Access the Web Interface: Once launched, open the dashboard in your web browser and sign in to the administrator portal.`,
      `Connect Your Accounts & Integrations: Follow the setup prompts to connect external services, databases, or API keys.`,
      `Operate Daily Workflows: Use the visual calendar, dashboard, or editor to perform tasks without per-user subscription fees.`,
      `Collaborate & Export Data: Add team members with custom permissions and retain 100% ownership of your records.`
    ];
  })();

  const devSteps: string[] = (() => {
    if (repo.howToUse && !Array.isArray(repo.howToUse) && repo.howToUse.forDevs && repo.howToUse.forDevs.length > 0) {
      return repo.howToUse.forDevs;
    }
    return [
      `Clone the repository: git clone https://github.com/${repo.repo}.git`,
      `Deploy using Docker: ${dockerCmd}`,
      `Open your browser at http://localhost:8080 and follow the initial configuration wizard.`,
      `To put into production, route via a reverse proxy (Nginx, Caddy, or Cloudflare Tunnel) with SSL.`
    ];
  })();

  const useCases = getCategoryUseCases();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog (Spacious & Wide: max-w-5xl) */}
      <div 
        className="relative bg-[#0d0f17] border border-white/10 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* ========================================================= */}
        {/* Sticky Header: ALWAYS visible at top */}
        {/* ========================================================= */}
        <div className="flex-shrink-0 bg-[#0d0f17]/95 backdrop-blur-md border-b border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <img
              src={`https://github.com/${repo.repo.split('/')[0]}.png?size=96`}
              alt={repo.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/10 bg-[#07080c] object-cover flex-shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${catDetails.badgeClass}`}>
                  {catDetails.icon}
                  <span>{catDetails.label}</span>
                </span>

                <div className="flex items-center gap-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  <Star size={12} className="fill-amber-400" />
                  <span>{repo.stars} stars</span>
                </div>

                {repo.monthlySavingsUsd ? (
                  <span className="hidden md:inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                    Save ~${repo.monthlySavingsUsd}/mo
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                  {repo.name}
                </h2>
                <a 
                  href={`https://github.com/${repo.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 font-mono transition-colors"
                >
                  <span>github.com/{repo.repo}</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Header Direct Open on GitHub */}
            <a
              href={`https://github.com/${repo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-all hover:scale-105"
              title="Open repository on GitHub"
            >
              <Github size={15} />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink size={12} />
            </a>

            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${
                copiedShare 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Copy shareable link to this repo"
            >
              {copiedShare ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => {
                onToggleFavorite(repo.id);
                onShowToast(isFavorite ? `Removed ${repo.name}` : `Saved ${repo.name}`);
              }}
              className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Bookmark"
            >
              <Bookmark size={18} className={isFavorite ? 'fill-amber-400' : ''} />
            </button>

            {/* Header Close (X) - Always visible! */}
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all hover:scale-105"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Scrollable Content Body */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          
          {/* Top Banner Image */}
          <div className="relative w-full aspect-[21/9] sm:h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#07080c] shadow-lg">
            <img
              src={repo.image || `https://opengraph.githubassets.com/1/${repo.repo}`}
              alt={`${repo.name} preview banner`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.parentElement?.classList.add('hidden');
              }}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                github.com/{repo.repo}
              </span>
              {repo.website && (
                <a 
                  href={repo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Globe size={12} />
                  <span>{repo.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: Plain-English "What is this?" for Everyone */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-br from-emerald-950/30 via-[#10131d] to-[#0c0e15] p-5 sm:p-6 rounded-2xl border border-emerald-500/20 space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles size={15} /> In Simple Words: What is {repo.name}?
              </span>
              <span className="text-xs text-slate-400 font-mono bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                Easy Guide for Teams & Clients
              </span>
            </div>

            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
              {plainDescription}
            </p>

            {/* Target Audience Pills */}
            <div className="pt-2 border-t border-white/5">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users size={13} className="text-emerald-400" /> Who is this helpful for?
              </span>
              <div className="flex flex-wrap gap-2">
                {audienceList.map((aud, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                    <span>{aud}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: Commercial Value & Software Replacement Card */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Replaces Tool */}
            <div className="glass-panel p-5 rounded-2xl border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <Zap size={15} /> Replaces Commercial Software
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white mb-2">
                  {repo.pays !== '-' ? repo.pays : 'Proprietary Cloud Services'}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Eliminates per-seat licensing, monthly invoice surprises, and artificial account tiers. You own the code and host as many accounts as you need.
                </p>
              </div>

              {repo.monthlySavingsUsd ? (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Estimated Cost Avoidance</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    ~${repo.monthlySavingsUsd}/month saved
                  </span>
                </div>
              ) : null}
            </div>

            {/* Deployment & Client Service Opportunities */}
            <div className="glass-panel p-5 rounded-2xl border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                  <Briefcase size={15} /> Agency & Freelancer Opportunity
                </div>
                <p className="text-base sm:text-lg font-bold text-white mb-2">
                  Service & Implementation Gigs
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {repo.note}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Great turnkey deliverable for consulting clients</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: Where It's Helpful & Real-World Use Cases */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                <MapPin size={15} className="text-sky-400" /> Where It's Helpful & Practical Use Cases
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {useCases.map((uc, idx) => (
                <div 
                  key={idx}
                  className="bg-[#10131d] p-4 rounded-xl border border-white/5 hover:border-sky-500/30 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold font-mono mb-2.5">
                      0{idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">
                      {uc.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {uc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 4: How To Use (User Workflow vs Developer Setup) */}
          {/* ========================================================= */}
          <div className="bg-[#10131f] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Monitor size={17} className="text-emerald-400" />
                  <span>How to Use {repo.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clear step-by-step guidance whether you are an end-user, marketer, or technical builder.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-[#090b11] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  onClick={() => setActiveHowTab('user')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeHowTab === 'user'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  For End-Users & Teams
                </button>
                <button
                  onClick={() => setActiveHowTab('dev')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeHowTab === 'dev'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  For Developers & DevOps
                </button>
              </div>
            </div>

            {/* Tab 1: For End-Users / Marketers */}
            {activeHowTab === 'user' ? (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userSteps.map((step, idx) => {
                    const [title, ...descParts] = step.split(':');
                    const desc = descParts.join(':');
                    return (
                      <div 
                        key={idx}
                        className="bg-[#090b11] p-3.5 rounded-xl border border-white/5 flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          {desc ? (
                            <>
                              <span className="block text-xs font-bold text-white mb-0.5">
                                {title}
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {desc.trim()}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {step}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Tab 2: For Developers & DevOps */
              <div className="space-y-3 animate-fade-in">
                <div className="space-y-2.5">
                  {devSteps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#090b11] p-3 rounded-xl border border-white/5 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs font-mono text-slate-200 leading-relaxed pt-0.5 select-all">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION 5: Quick Terminal Commands */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Terminal size={14} /> Quick Setup & Run Commands
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
            <div className="pt-2">
              <span className="block text-[11px] uppercase font-semibold text-slate-500 tracking-wider mb-2">
                Tags & Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {repo.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* Sticky Footer: ALWAYS visible at bottom */}
        {/* ========================================================= */}
        <div className="flex-shrink-0 bg-[#0b0d14]/95 backdrop-blur-md border-t border-white/10 px-5 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-20">
          
          {/* Left: Close Button & Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              title="Close modal"
            >
              <X size={16} />
              <span>Close</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              title="Share direct link to this repo"
            >
              {copiedShare ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
              <span className="hidden sm:inline">{copiedShare ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Right: Primary CTAs */}
          <div className="flex items-center gap-2.5 justify-end">
            {repo.website && (
              <a
                href={repo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                <Globe size={15} />
                <span>Website</span>
              </a>
            )}

            {/* Primary "Open on GitHub" CTA (Always visible!) */}
            <a
              href={`https://github.com/${repo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Github size={17} />
              <span>Open on GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
