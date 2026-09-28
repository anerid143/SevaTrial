import React, { useState, useEffect } from 'react';
import { InstitutionalAlert } from '../types/clinical';

interface AlertsViewProps {
  alerts: InstitutionalAlert[];
  onMarkAllAsRead: () => void;
  onTriageAlert: (alertId: string, actionType: string) => void;
  onOpenSaeDrawer: (recordId: string) => void;
  onOpenExportModal: () => void;
  initialCategory?: string;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onMarkAllAsRead,
  onTriageAlert,
  onOpenSaeDrawer,
  onOpenExportModal,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [sortBy, setSortBy] = useState<'urgency' | 'deadline' | 'study'>('urgency');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Centralized dynamic alert counts derived from alerts prop
  const criticalCount = alerts.filter((a) => a.severity === 'Critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'Warning').length;
  const infoCount = alerts.filter((a) => a.severity === 'Informational').length;

  const categoryCounts: Record<string, number> = {
    All: alerts.length,
    Critical: criticalCount,
    Regulatory: alerts.filter((a) => a.category === 'Regulatory').length,
    Safety: alerts.filter((a) => a.category === 'Safety').length,
    Recruitment: alerts.filter((a) => a.category === 'Recruitment').length,
    'Site Operations': alerts.filter((a) => a.category === 'Site Operations').length,
  };

  const filteredAlerts = alerts
    .filter((a) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Critical') return a.severity === 'Critical';
      return a.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'urgency') {
        const priorityOrder: Record<string, number> = { Critical: 1, Warning: 2, Informational: 3 };
        return priorityOrder[a.severity] - priorityOrder[b.severity];
      }
      if (sortBy === 'study') {
        return a.studyId.localeCompare(b.studyId);
      }
      return (a.deadlineHoursRemaining || 999) - (b.deadlineHoursRemaining || 999);
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-wider">
              Live Triage Mode • 21 CFR Part 11 & CDSCO Compliant
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-secondary font-semibold">Priority Escalation Engine</span>
          </div>
          <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
            Institutional Alert Center
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Centralized triaging of clinical safety escalations, protocol deviations, regulatory deadlines, and enrollment alerts across all active multicentric trials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            <span>Mark All as Read</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
            <span>Export Alert Manifest</span>
          </button>
        </div>
      </div>

      {/* 3 Alert Priority Summary Cards with Centralized Dynamic Counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedCategory('Critical')}
          className="bg-surface-container-lowest p-5 rounded-2xl border-2 border-red-300 bg-red-50/20 shadow-sm flex items-start gap-4 cursor-pointer hover:border-red-500 transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-error text-white flex items-center justify-center flex-shrink-0 animate-pulse">
            <span className="material-symbols-outlined text-[28px]">crisis_alert</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg text-2xl font-bold text-error">{criticalCount}</span>
              <span className="text-xs font-bold uppercase text-error tracking-wider">Critical Alerts</span>
            </div>
            <p className="text-xs font-semibold text-primary mt-1">Action Required &lt; 24h</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Expedited statutory reports pending DCGI / CDSCO and DSMB review
            </p>
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory('All')}
          className="bg-surface-container-lowest p-5 rounded-2xl border border-amber-300 bg-amber-50/20 shadow-sm flex items-start gap-4 cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg text-2xl font-bold text-amber-700">{warningCount}</span>
              <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">Warning Alerts</span>
            </div>
            <p className="text-xs font-semibold text-primary mt-1">Action Required &lt; 48h</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Site audits and milestone enrollment deviations requiring remediation
            </p>
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory('All')}
          className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-start gap-4 cursor-pointer hover:border-primary/40 transition-all"
        >
          <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]">info</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg text-2xl font-bold text-primary">{infoCount}</span>
              <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">Informational</span>
            </div>
            <p className="text-xs font-semibold text-primary mt-1">IEC Routine Schedule</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Upcoming protocol annual renewals, quarterly checkpoints & data locks
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Triage Section */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'All', label: 'All Alerts' },
              { id: 'Critical', label: 'Critical' },
              { id: 'Regulatory', label: 'Regulatory' },
              { id: 'Safety', label: 'Safety' },
              { id: 'Recruitment', label: 'Recruitment' },
              { id: 'Site Operations', label: 'Site Operations' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === f.id
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>{f.label}</span>
                <span className="ml-1.5 font-mono text-[10px] opacity-80">
                  ({categoryCounts[f.id] || 0})
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-surface-container border border-[#e2e8f0] text-primary rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer"
            >
              <option value="urgency">Urgency (Critical First)</option>
              <option value="deadline">Statutory Deadline</option>
              <option value="study">Study Code</option>
            </select>
          </div>
        </div>

        {/* Alert Cards List */}
        <div className="space-y-4">
          {filteredAlerts.map((altItem) => {
            const isCritical = altItem.severity === 'Critical';
            const isWarning = altItem.severity === 'Warning';

            return (
              <div
                key={altItem.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCritical
                    ? 'border-2 border-red-300 bg-red-50/20'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-[#e2e8f0] bg-surface-container-low'
                } ${altItem.read ? 'opacity-70' : ''}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isCritical
                            ? 'bg-error text-white'
                            : isWarning
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {altItem.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-xs font-mono font-bold text-primary">
                        {altItem.studyId}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">{altItem.category} Escalation</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">Created: {altItem.createdDate}</span>
                    </div>

                    <h4 className="font-bold text-base text-primary leading-tight">
                      {altItem.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {altItem.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1">
                      {altItem.deadlineNotice && (
                        <span className="flex items-center gap-1 text-error font-bold font-mono">
                          <span className="material-symbols-outlined text-[16px]">timer</span>
                          <span>{altItem.deadlineNotice}</span>
                        </span>
                      )}
                      <span className="text-slate-500">
                        Assigned: <strong>{altItem.assignedTo}</strong>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-semibold">
                        Status: {altItem.status}
                      </span>
                    </div>

                    {altItem.statutoryMandate && (
                      <div className="text-[11px] font-mono text-slate-500">
                        Statutory Mandate: <strong>{altItem.statutoryMandate}</strong>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 flex-shrink-0 pt-2 lg:pt-0">
                    {altItem.actionType === 'sae_drawer' ? (
                      <>
                        <button
                          onClick={() => onOpenSaeDrawer('sae-1')}
                          className="px-3.5 py-2 rounded-xl bg-error text-white text-xs font-bold hover:bg-[#9a1414] shadow-sm flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified_user</span>
                          <span>Triage & Sign-off</span>
                        </button>
                        <button
                          onClick={() => onTriageAlert(altItem.id, 'dcgi_escalate')}
                          className="px-3 py-1.5 rounded-xl bg-surface-container border border-[#e2e8f0] text-primary text-xs font-semibold hover:bg-surface-container-high"
                        >
                          Escalate to DCGI
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onTriageAlert(altItem.id, altItem.actionType)}
                        className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#001d34] shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">task_alt</span>
                        <span>{altItem.actionLabel}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
