import React, { useState } from 'react';
import { SafetyRecord } from '../types/clinical';

interface PharmacovigilanceViewProps {
  safetyRecords: SafetyRecord[];
  onOpenSaeDrawer: (recordId: string) => void;
  onOpenNewAeModal: () => void;
  onOpenExportModal: () => void;
}

export const PharmacovigilanceView: React.FC<PharmacovigilanceViewProps> = ({
  safetyRecords,
  onOpenSaeDrawer,
  onOpenNewAeModal,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'SAE' | 'ADR' | 'AE' | 'Critical'>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Centralized calculations derived dynamically from safetyRecords
  const totalReports = safetyRecords.length;
  const saeCount = safetyRecords.filter((r) => r.type === 'SAE').length;
  const adrCount = safetyRecords.filter((r) => r.type === 'ADR').length;
  const aeCount = safetyRecords.filter((r) => r.type === 'AE').length;
  const criticalCount = safetyRecords.filter((r) => r.severity === 'Critical').length;
  const pendingCount = safetyRecords.filter((r) => r.cdscoSubmissionStatus !== 'Transmitted' && r.status !== 'Reported (On Time)').length;
  const urgentCutoffCount = safetyRecords.filter((r) => r.deadlineHoursRemaining > 0 && r.deadlineHoursRemaining <= 24).length;

  const tabCounts = {
    All: totalReports,
    SAE: saeCount,
    ADR: adrCount,
    AE: aeCount,
    Critical: criticalCount,
  };

  const filteredRecords = safetyRecords.filter((rec) => {
    if (activeTab === 'SAE' && rec.type !== 'SAE') return false;
    if (activeTab === 'ADR' && rec.type !== 'ADR') return false;
    if (activeTab === 'AE' && rec.type !== 'AE') return false;
    if (activeTab === 'Critical' && rec.severity !== 'Critical') return false;

    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match =
        rec.reportId.toLowerCase().includes(q) ||
        rec.studyId.toLowerCase().includes(q) ||
        rec.subjectId.toLowerCase().includes(q) ||
        rec.incidentTitle.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-wider">
              24h Expedited Safety Surveillance • CDSCO & ICMR GCP Compliant
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-secondary font-semibold">Pharmacovigilance Programme of India (PvPI)</span>
          </div>
          <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
            Pharmacovigilance & Safety
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            AE / ADR / SAE monitoring, regulatory reporting deadlines & ICMR/CDSCO compliance surveillance across all active herbal & integrative clinical trials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Generate CIOMS / SUSAR</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span>Expedited CDSCO Export</span>
          </button>
          <button
            onClick={onOpenNewAeModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-[#9a1414] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>+ Report New Adverse Event</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Stat Cards with Dynamic Centralized Counts */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => setActiveTab('All')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Reports</span>
            <span className="material-symbols-outlined text-[20px] text-primary">analytics</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold">{totalReports}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">All protocols</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Active Register</span>
        </div>

        <div
          onClick={() => setActiveTab('AE')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-secondary transition-all"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">Adverse Events</span>
            <span className="material-symbols-outlined text-[20px] text-secondary">healing</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-secondary font-bold">{aeCount}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Mild / Moderate</span>
          </div>
          <span className="text-[11px] text-slate-500">GI, derm, somnolence</span>
        </div>

        <div
          onClick={() => setActiveTab('SAE')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-400 transition-all"
        >
          <div className="flex items-center justify-between text-error">
            <span className="text-[11px] font-bold uppercase tracking-wider">SAE Active</span>
            <span className="material-symbols-outlined text-[20px] text-error animate-pulse">emergency</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-error font-bold">{saeCount}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Serious Reactions</span>
          </div>
          <span className="text-[11px] font-bold text-error">Req. 24h statutory triage</span>
        </div>

        <div
          onClick={() => setActiveTab('ADR')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">ADR Validated</span>
            <span className="material-symbols-outlined text-[20px] text-primary">medication</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold">{adrCount}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Validated Reactions</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Causality evaluated</span>
        </div>

        <div
          onClick={() => setActiveTab('All')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Review</span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">hourglass_top</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-amber-700 font-bold">{pendingCount}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">In Triage Queue</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Medical safety triage</span>
        </div>

        <div
          onClick={() => setActiveTab('Critical')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-red-300 bg-red-100/30 shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-500 transition-all"
        >
          <div className="flex items-center justify-between text-error">
            <span className="text-[11px] font-bold uppercase tracking-wider">Critical Deadlines</span>
            <span className="material-symbols-outlined text-[20px] text-error animate-pulse">alarm</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-error font-bold">{urgentCutoffCount}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Expedited Statutory</span>
          </div>
          <span className="text-[11px] font-bold text-error">&lt; 24h to CDSCO cutoff</span>
        </div>
      </div>

      {/* Featured Urgent SAE Dossier Card */}
      <div className="p-5 rounded-2xl border-2 border-red-300 bg-gradient-to-r from-red-50/50 via-white to-red-50/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-error text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-error text-white text-[10px] font-bold uppercase">
                  Immediate 24h Statutory Filing Due
                </span>
                <span className="text-xs font-mono font-bold text-error">11h 48m Remaining</span>
              </div>
              <h3 className="font-bold text-base text-primary mt-0.5">
                SAE-1024 Dossier: Severe Syncope & Urticarial Flare in Subject AYT-002-DEL-041
              </h3>
            </div>
          </div>

          <button
            onClick={() => onOpenSaeDrawer('sae-1')}
            className="px-4 py-2 rounded-xl bg-error hover:bg-[#9a1414] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Review & Transmit to CDSCO / ICMR</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Study Protocol</span>
            <span className="font-bold text-primary block">AYT-002 (Knee Osteoarthritis)</span>
            <span className="text-[11px] text-slate-500">Cohort B (Virechana Arm)</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Patient Demographics</span>
            <span className="font-bold text-primary block">Subject #041 • 58y Female</span>
            <span className="text-[11px] text-slate-500">Site: AIIA New Delhi (Integrative Ward)</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Naranjo Algorithm Score</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-amber-700">Score 6</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Probable ADR</span>
            </div>
            <span className="text-[11px] text-slate-500">WHO-UMC: Probable / Likely</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Intervention Status</span>
            <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold inline-block">
              Intervention Paused
            </span>
            <span className="text-[11px] text-slate-500 block">Patient HDU Monitored • Stable</span>
          </div>
        </div>
      </div>

      {/* Register Table with Tabs & Search */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'SAE', 'ADR', 'AE', 'Critical'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span>{tab}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search reports, subjects, studies..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs font-medium bg-surface-container-low border border-[#e2e8f0] text-primary rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Safety Table */}
        <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-surface-container-low text-[11px] font-bold text-primary uppercase tracking-wider">
                <th className="py-3 px-3">Report ID</th>
                <th className="py-3 px-3">Study & Protocol</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Severity / Incident</th>
                <th className="py-3 px-3">Subject ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Deadline / SLA</th>
                <th className="py-3 px-3">Causality</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredRecords.map((rec) => {
                const isSAE1024 = rec.reportId === 'SAE-1024';
                return (
                  <tr
                    key={rec.id}
                    className={`hover:bg-surface-container-low/70 transition-colors ${
                      isSAE1024 ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">
                      {rec.reportId}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold text-primary block">{rec.studyId}</span>
                      <span className="text-[10px] text-slate-500 truncate block max-w-[150px]">{rec.studyName}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.type === 'SAE'
                            ? 'bg-error-container text-on-error-container border border-red-300'
                            : rec.type === 'ADR'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <span className="font-semibold text-primary block">{rec.incidentTitle}</span>
                      <span className="text-[11px] text-on-surface-variant line-clamp-1">{rec.incidentDescription}</span>
                    </td>
                    <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-700">
                      {rec.subjectId}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {rec.dateReported.split(',')[0]}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {rec.deadlineHoursRemaining > 0 ? (
                        <span
                          className={`font-mono font-bold text-xs ${
                            rec.deadlineHoursRemaining <= 12 ? 'text-error animate-pulse' : 'text-amber-700'
                          }`}
                        >
                          {rec.deadlineHoursRemaining}h remaining
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>Reported On Time</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.causalityRating === 'Definite'
                            ? 'bg-red-100 text-red-800'
                            : rec.causalityRating === 'Probable'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rec.causalityRating} (Score {rec.causalityNaranjoScore})
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-slate-700 text-[10px] font-semibold">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-right">
                      {isSAE1024 ? (
                        <button
                          onClick={() => onOpenSaeDrawer(rec.id)}
                          className="px-2.5 py-1 rounded-lg bg-error text-white text-xs font-bold hover:bg-[#9a1414] transition-all"
                        >
                          Active Dossier
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenSaeDrawer(rec.id)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-all"
                        >
                          View Dossier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs text-on-surface-variant">
          <span>Showing 1-5 of 128 safety records • 2 Critical Alerts require same-day statutory filing</span>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="px-2 py-1 bg-surface-container rounded font-bold">1</span>
            <span className="px-2 py-1 hover:bg-surface-container rounded cursor-pointer">2</span>
            <span className="px-2 py-1 hover:bg-surface-container rounded cursor-pointer">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
