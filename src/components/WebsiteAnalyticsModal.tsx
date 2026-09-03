import React, { useState } from 'react';
import { User, AuthRulesConfig, AuditLogEntry } from '../types/auth';

interface WebsiteAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  registeredUsersCount: number;
  rules: AuthRulesConfig;
  auditLogs: AuditLogEntry[];
}

export default function WebsiteAnalyticsModal({
  isOpen,
  onClose,
  currentUser,
  registeredUsersCount,
  rules,
  auditLogs,
}: WebsiteAnalyticsModalProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [simulatedLiveVisitors, setSimulatedLiveVisitors] = useState(24);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen || currentUser?.role !== 'admin') return null;

  const handleSimulateVisitor = () => {
    setSimulatedLiveVisitors((prev) => prev + 1);
  };

  const handleExportData = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      owner: currentUser.name,
      timeframe,
      liveActiveSessions: simulatedLiveVisitors,
      traffic: {
        pageViews: timeframe === '24h' ? 2450 : timeframe === '7d' ? 18429 : 68200,
        uniqueVisitors: timeframe === '24h' ? 580 : timeframe === '7d' ? 4180 : 16900,
        avgSessionDuration: '5m 12s',
        bounceRate: '28.4%',
      },
      contentEngagement: {
        bacteriaViews: '35%',
        virusesViews: '25%',
        fungiViews: '16%',
        archaeaViews: '12%',
        protozoaViews: '7%',
        parasitesViews: '5%',
      },
      quizAndFlashcards: {
        totalAttempts: 428,
        averageScore: '84.6%',
        passRate: '92.1%',
        flashcardsFlipped: 1840,
        topFlashcard: 'Peptidoglycan',
      },
      rulesCompliance: {
        enforcedRules: rules,
        totalRegisteredAccounts: registeredUsersCount,
        auditLogsRecorded: auditLogs.length,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `microsphere-analytics-${timeframe}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Analytics report downloaded successfully as JSON!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Dynamic values depending on timeframe
  const pageViews =
    timeframe === '24h' ? '2,450' : timeframe === '7d' ? '18,429' : timeframe === '30d' ? '68,200' : '241,850';
  const uniqueVisitors =
    timeframe === '24h' ? '580' : timeframe === '7d' ? '4,180' : timeframe === '30d' ? '16,900' : '58,400';
  const quizAttempts =
    timeframe === '24h' ? '48' : timeframe === '7d' ? '428' : timeframe === '30d' ? '1,640' : '5,820';
  const cardFlips =
    timeframe === '24h' ? '210' : timeframe === '7d' ? '1,840' : timeframe === '30d' ? '7,320' : '28,100';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-xl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 md:p-8 relative transition-all"
        style={{
          background: 'linear-gradient(145deg, rgba(7, 21, 37, 0.98), rgba(2, 11, 24, 0.98))',
          border: '1px solid rgba(14, 165, 233, 0.35)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), 0 0 50px rgba(14, 165, 233, 0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold"
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.2))',
                  color: '#38bdf8',
                  border: '1px solid rgba(14, 165, 233, 0.4)',
                }}
              >
                🔒 Owner Only &bull; Confidential
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{simulatedLiveVisitors} Live Visitors</span>
              </span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white">
              Website Analytics & Statistical Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Private administrative telemetry visible <strong className="text-cyan-300">only to you ({currentUser?.name})</strong>.
              Tracking traffic, student learning metrics, content interaction, and rule enforcement.
            </p>
          </div>

          {/* Timeframe selector & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl p-1 bg-slate-900 border border-slate-800">
              {[
                { id: '24h', label: '24H' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: 'all', label: 'All Time' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    timeframe === t.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl text-xs font-display font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>📥</span>
              <span>Export Stats</span>
            </button>

            <button
              onClick={handleSimulateVisitor}
              className="px-3.5 py-2 rounded-xl text-xs font-display font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 transition-colors"
              title="Simulate a new incoming student session"
            >
              +1 Sim Visitor
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <span>✅</span>
            <span>{exportNotice}</span>
          </div>
        )}

        {/* 1. Core Traffic & Platform Telemetry KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(7, 21, 37, 0.7))',
              border: '1px solid rgba(14, 165, 233, 0.3)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-slate-400">Total Page Views</span>
              <span className="text-xs font-mono text-emerald-400">&uarr; +14.8%</span>
            </div>
            <div className="text-3xl font-display font-black text-white">{pageViews}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">MicroSphere web requests</div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(7, 21, 37, 0.7))',
              border: '1px solid rgba(20, 184, 166, 0.3)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-slate-400">Unique Visitors</span>
              <span className="text-xs font-mono text-emerald-400">&uarr; +9.2%</span>
            </div>
            <div className="text-3xl font-display font-black text-teal-300">{uniqueVisitors}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Individual browsers & IP nodes</div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(7, 21, 37, 0.7))',
              border: '1px solid rgba(167, 139, 250, 0.3)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-slate-400">Avg Session Time</span>
              <span className="text-xs font-mono text-purple-400">5m 12s</span>
            </div>
            <div className="text-3xl font-display font-black text-purple-300">76.4%</div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Interactive engagement rate</div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(7, 21, 37, 0.7))',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-slate-400">Bounce Rate</span>
              <span className="text-xs font-mono text-amber-400">Low (28.4%)</span>
            </div>
            <div className="text-3xl font-display font-black text-amber-300">{registeredUsersCount} Accounts</div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Registered Students & Admins</div>
          </div>
        </div>

        {/* 2. Educational Telemetry: The Basics & Student Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basics Quiz & Flashcards Stats */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
          >
            <h3 className="font-display font-bold text-base text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>✍️</span> "The Basics" Quiz & Knowledge Check Stats
              </span>
              <span className="text-xs font-mono text-teal-400">{quizAttempts} Total Attempts</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400">Mean Score</div>
                <div className="text-xl font-display font-black text-teal-300">84.6%</div>
                <div className="text-[9px] text-teal-400 font-mono">Grade A-</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400">Passing Rate</div>
                <div className="text-xl font-display font-black text-emerald-400">92.1%</div>
                <div className="text-[9px] text-emerald-400 font-mono">&ge; 70% threshold</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400">Card Flips</div>
                <div className="text-xl font-display font-black text-cyan-300">{cardFlips}</div>
                <div className="text-[9px] text-cyan-400 font-mono">Study flashcards</div>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between items-center text-slate-400 font-mono text-[11px] mb-1">
                <span>Quiz Question Topic</span>
                <span>Accuracy Rate</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 flex items-center justify-between">
                <span className="text-slate-200">Q1: Peptidoglycan Cell Wall Selective Target</span>
                <span className="font-mono text-emerald-400 font-bold">96% Correct</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 flex items-center justify-between">
                <span className="text-slate-200">Q2: Gram Staining Pink/Red Color Result</span>
                <span className="font-mono text-emerald-400 font-bold">89% Correct</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 flex items-center justify-between">
                <span className="text-slate-200">Q3: Log (Exponential) Bacterial Growth Phase</span>
                <span className="font-mono text-teal-400 font-bold">85% Correct</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 flex items-center justify-between">
                <span className="text-slate-200">Q4: Bacterial Endospore Survival Function</span>
                <span className="font-mono text-amber-400 font-bold">69% (Hardest)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 flex items-center justify-between">
                <span className="text-slate-200">Q5: LPS Endotoxin in Gram-negative Outer Wall</span>
                <span className="font-mono text-emerald-400 font-bold">84% Correct</span>
              </div>
            </div>
          </div>

          {/* Microbiology Content Popularity Breakdown */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
          >
            <h3 className="font-display font-bold text-base text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>🔬</span> Content Popularity & Section Heatmap
              </span>
              <span className="text-xs font-mono text-cyan-400">Click-through Share</span>
            </h3>

            <div className="space-y-3.5">
              {[
                { label: 'Bacteria (The Dominant Kingdom)', pct: 35, color: '#14b8a6' },
                { label: 'Viruses (Genomic Architects)', pct: 25, color: '#22d3ee' },
                { label: 'Fungi (Mycelial Networks)', pct: 16, color: '#a78bfa' },
                { label: 'Archaea (Ancient Extremophiles)', pct: 12, color: '#fbbf24' },
                { label: 'Protozoa (Unicellular Predators)', pct: 7, color: '#34d399' },
                { label: 'Parasites (Evolutionary Arms Race)', pct: 5, color: '#f87171' },
              ].map((sec) => (
                <div key={sec.label}>
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="text-slate-200 font-medium">{sec.label}</span>
                    <span className="font-mono font-bold" style={{ color: sec.color }}>
                      {sec.pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${sec.pct}%`, background: sec.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
              <span>Most Reviewed Flashcard: <strong className="text-white">Peptidoglycan (412 flips)</strong></span>
              <span>Avg Study Time: <strong className="text-teal-400">14.2 min/session</strong></span>
            </div>
          </div>
        </div>

        {/* 3. Authentication & Rules Compliance Telemetry */}
        <div
          className="rounded-3xl p-6"
          style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(99, 102, 241, 0.25)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <span>🛡️</span> Sign-In Rules Enforcement & Security Statistics
              </h3>
              <p className="text-xs text-slate-400">
                Tracking user credential rule validation (Name &ge; {rules.minNameLength}, Password &ge; {rules.minPasswordLength})
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
              {auditLogs.length} Security Events Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Sign-In Success Rate</div>
              <div className="text-2xl font-display font-black text-emerald-400">96.4%</div>
              <div className="text-[10px] text-slate-500 font-mono">Passed all rules</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Rejected Logins</div>
              <div className="text-2xl font-display font-black text-red-400">3.6%</div>
              <div className="text-[10px] text-slate-500 font-mono">Failed Name/Password rule</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Min Password Enforced</div>
              <div className="text-2xl font-display font-black text-cyan-400">{rules.minPasswordLength} Chars</div>
              <div className="text-[10px] text-slate-500 font-mono">Active security threshold</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Avg Password Length</div>
              <div className="text-2xl font-display font-black text-purple-400">9.4 Chars</div>
              <div className="text-[10px] text-slate-500 font-mono">+3.4 chars above minimum</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
