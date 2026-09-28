import React, { useState } from 'react';
import { ClinicalStudy, SubjectRecord, SafetyRecord, AuditRecord } from '../types/clinical';
import { sampleSubjectsAYT002 } from '../data/clinicalData';

interface StudyDetailViewProps {
  study: ClinicalStudy;
  onBack: () => void;
  onOpenSaeDrawer: (recordId: string) => void;
  onOpenExportModal: () => void;
  safetyRecords?: SafetyRecord[];
  auditRecords?: AuditRecord[];
}

export const StudyDetailView: React.FC<StudyDetailViewProps> = ({
  study,
  onBack,
  onOpenSaeDrawer,
  onOpenExportModal,
  safetyRecords = [],
  auditRecords = [],
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'recruitment' | 'sites' | 'milestones' | 'safety' | 'deviations' | 'data-quality' | 'iec' | 'ctri' | 'audit-trail'
  >('overview');

  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Active' | 'Adverse Event' | 'Withdrawn'>('All');
  const [actionNotice, setActionNotice] = useState<string>('');

  // Study-specific records
  const studySafetyRecords = (safetyRecords || []).filter((s) => s.studyId === study.id);
  const studyAuditRecords = (auditRecords || []).filter((a) => a.recordIdentifier.includes(study.id) || a.actionContext.includes(study.id));
  const recruitmentRatio = study.targetSubjects > 0 ? Math.round((study.enrolledSubjects / study.targetSubjects) * 100) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'menu_book' },
    { id: 'recruitment', label: 'Recruitment', icon: 'group' },
    { id: 'sites', label: 'Sites', icon: 'apartment', badge: `${study.sitesCount}` },
    { id: 'milestones', label: 'Milestones', icon: 'flag' },
    { id: 'safety', label: 'Safety', icon: 'emergency', badge: study.saeCount > 0 ? `${study.saeCount} SAE` : undefined },
    { id: 'deviations', label: 'Protocol Deviations', icon: 'assignment_late', badge: study.deviationsCount > 0 ? `${study.deviationsCount}` : undefined },
    { id: 'data-quality', label: 'Data Quality', icon: 'fact_check' },
    { id: 'iec', label: 'IEC', icon: 'verified_user' },
    { id: 'ctri', label: 'CTRI', icon: 'how_to_reg' },
    { id: 'audit-trail', label: 'Audit Trail', icon: 'history_edu' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Action Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-emerald-600 hover:text-emerald-900">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Back button & Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>&larr; Back to Clinical Studies Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-mono font-bold text-primary">
            {study.id}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-mono text-slate-700">
            {study.protocolNumber}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              study.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : study.status === 'Recruiting'
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {study.status}
          </span>
        </div>
      </div>

      {/* Main Study Title Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-primary text-white text-xs font-mono font-bold">
                {study.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-xs font-mono text-slate-700">
                {study.ctriId}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-xs font-mono text-slate-700">
                {study.phase}
              </span>
              {study.status === 'Delayed' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>Delayed Milestone Accrual</span>
                </span>
              )}
            </div>

            <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
              {study.title}
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant font-medium">
              {study.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant pt-1">
              <span>PI: <strong>{study.pi}</strong> ({study.department})</span>
              <span>•</span>
              <span>Co-PI: <strong>{study.coPi}</strong></span>
              <span>•</span>
              <span>Sponsor: <strong>{study.sponsor}</strong></span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {study.saeCount > 0 && (
              <button
                onClick={() => onOpenSaeDrawer('sae-1')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-[#9a1414] shadow-sm transition-all animate-pulse"
              >
                <span className="material-symbols-outlined text-[16px]">emergency</span>
                <span>Active Safety Dossier</span>
              </button>
            )}
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">summarize</span>
              <span>Generate Dossier PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#f1f5f9]">
          <div className="p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase block">Enrollment Progress</span>
            <span className="text-base font-bold text-primary font-mono block mt-0.5">
              {study.enrolledSubjects} / {study.targetSubjects} ({recruitmentRatio}%)
            </span>
            <span className="text-[11px] text-slate-500">{study.targetSubjects - study.enrolledSubjects} remaining</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase block">Trial Timeline</span>
            <span className="text-sm font-bold text-primary block mt-0.5">{study.startDate} — {study.targetEndDate}</span>
            <span className="text-[11px] text-slate-500">Active Interventional Phase</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase block">Data Quality</span>
            <span className="text-base font-bold text-emerald-700 font-mono block mt-0.5">{study.dataQualityScore}%</span>
            <span className="text-[11px] text-slate-500">{study.queriesCount} Open Queries</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase block">Ethics & CTRI</span>
            <span className="text-sm font-bold text-primary block mt-0.5">{study.ethicsStatus}</span>
            <span className="text-[11px] text-slate-500">CTRI: {study.ctriStatus}</span>
          </div>
        </div>
      </div>

      {/* 10 Required Tabs Navigation */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f1f5f9] pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    tab.id === 'safety' ? 'bg-error text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-2">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">clinical_notes</span>
                <span>Protocol Summary & Interventions</span>
              </h4>
              <p className="text-on-surface-variant leading-relaxed text-xs">
                {study.title}. The study implements a prospective, controlled comparative protocol investigating systemic therapeutic outcomes in clinical patients under GCP monitoring.
              </p>
              <div className="pt-2 text-xs">
                <span className="font-bold text-primary block mb-1">Active Interventional Regimen:</span>
                <p className="p-2.5 rounded-lg bg-white border border-[#e2e8f0] font-medium text-slate-700">
                  {study.activeInterventions}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-2">
                <h4 className="font-bold text-primary">Governance & Administrative Matrix</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div><strong>Therapeutic Vertical:</strong> {study.therapeuticArea}</div>
                  <div><strong>Department:</strong> {study.department}</div>
                  <div><strong>Study Type:</strong> {study.studyType}</div>
                  <div><strong>Phase:</strong> {study.phase}</div>
                  <div><strong>Sponsor:</strong> {study.sponsor}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-2">
                <h4 className="font-bold text-primary">Compliance & Trial Parameters</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div><strong>Target Cohort Size:</strong> {study.targetSubjects} participants</div>
                  <div><strong>Currently Enrolled:</strong> {study.enrolledSubjects} ({recruitmentRatio}%)</div>
                  <div><strong>Participating Centers:</strong> {study.sitesCount} Clinical Sites</div>
                  <div><strong>Ethics Committee Ref:</strong> {study.ethicsRef}</div>
                  <div><strong>CTRI Identifier:</strong> {study.ctriId} ({study.ctriStatus})</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RECRUITMENT TAB */}
        {activeTab === 'recruitment' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-primary">Participant Enrollment Accrual</h4>
                <p className="text-slate-500">
                  Total Enrolled: <strong>{study.enrolledSubjects}</strong> of <strong>{study.targetSubjects}</strong> target participants ({recruitmentRatio}% completion)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-primary">{study.enrolledSubjects}/{study.targetSubjects}</span>
              </div>
            </div>

            {/* Accrual Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  study.status === 'Delayed' ? 'bg-amber-500' : 'bg-secondary'
                }`}
                style={{ width: `${recruitmentRatio}%` }}
              ></div>
            </div>

            {/* Subject Roster */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-primary">Cohort Participant Registry</h4>
                <div className="flex items-center gap-1.5">
                  {(['All', 'Active', 'Adverse Event', 'Withdrawn'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSubjectFilter(filter)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                        subjectFilter === filter
                          ? 'bg-primary text-white font-bold'
                          : 'bg-surface-container text-slate-600'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-surface-container-low font-bold text-primary">
                      <th className="py-2.5 px-3">Subject ID</th>
                      <th className="py-2.5 px-3">Site</th>
                      <th className="py-2.5 px-3">Age/Sex</th>
                      <th className="py-2.5 px-3">Cycle</th>
                      <th className="py-2.5 px-3">Adherence</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {sampleSubjectsAYT002
                      .filter((s) => subjectFilter === 'All' || s.status === subjectFilter)
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-surface-container-low/70">
                          <td className="py-2.5 px-3 font-mono font-bold text-primary">{s.subjectCode}</td>
                          <td className="py-2.5 px-3">{s.site}</td>
                          <td className="py-2.5 px-3 font-mono">{s.age}y / {s.gender}</td>
                          <td className="py-2.5 px-3">{s.cycle}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{s.adherence}%</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                s.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : s.status === 'Adverse Event'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {s.status === 'Adverse Event' ? (
                              <button
                                onClick={() => onOpenSaeDrawer('sae-1')}
                                className="px-2 py-0.5 rounded bg-error text-white text-[11px] font-bold hover:bg-[#9a1414] cursor-pointer"
                              >
                                View SAE
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setActionNotice(`Case report form for ${s.subjectCode} opened and verified.`);
                                  setTimeout(() => setActionNotice(''), 3500);
                                }}
                                className="px-2 py-0.5 rounded bg-surface-container text-primary text-[11px] font-semibold hover:bg-primary hover:text-white cursor-pointer"
                              >
                                View eCRF
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. SITES TAB */}
        {activeTab === 'sites' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-primary">Participating Clinical Investigation Sites</h4>
                <p className="text-slate-500">Multicentric trial centers active under protocol {study.protocolNumber}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container font-mono font-bold text-primary">
                {study.sitesCount} Sites Total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(study.detailedSites || [
                { id: 's1', name: study.sites[0] || 'AIIA New Delhi Main Center', location: 'New Delhi', pi: study.pi, target: 60, enrolled: 38, status: 'Active' },
                { id: 's2', name: study.sites[1] || 'AIIA Jaipur Satellite', location: 'Jaipur', pi: 'Dr. R. K. Vyas', target: 40, enrolled: 16, status: 'Monitoring Due' },
              ]).map((site) => (
                <div key={site.id} className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-primary">{site.name}</h5>
                      <span className="text-[11px] text-slate-500">{site.location} • Lead PI: {site.pi}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        site.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {site.status}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Enrollment Pace</span>
                      <span>{site.enrolled} / {site.target} ({Math.round((site.enrolled / site.target) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${Math.round((site.enrolled / site.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f1f5f9] flex justify-end">
                    <button
                      onClick={() => {
                        setActionNotice(`Inspecting site logs for ${site.name}. Source Data Verification ready.`);
                        setTimeout(() => setActionNotice(''), 3500);
                      }}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-white transition-all text-[11px] font-semibold text-primary cursor-pointer"
                    >
                      Inspect Site Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MILESTONES TAB */}
        {activeTab === 'milestones' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h4 className="font-bold text-sm text-primary">Protocol Lifecycle & Milestone Checkpoints</h4>
            <div className="space-y-3">
              {study.milestones.map((m, i) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    m.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : m.status === 'delayed'
                      ? 'border-amber-300 bg-amber-50/40'
                      : m.status === 'in_progress'
                      ? 'border-secondary/40 bg-teal-50/20'
                      : 'border-slate-200 bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-400">0{i + 1}</span>
                    <div>
                      <h5 className="font-bold text-primary">{m.title}</h5>
                      <span className="text-[11px] text-slate-500">{m.date} {m.note ? `• ${m.note}` : ''}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      m.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'delayed'
                        ? 'bg-amber-100 text-amber-800'
                        : m.status === 'in_progress'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SAFETY TAB */}
        {activeTab === 'safety' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-primary">Adverse Events & Safety Dossier</h4>
                <p className="text-slate-500">Expedited statutory surveillance and active safety incidents for {study.id}</p>
              </div>
              {study.saeCount > 0 && (
                <button
                  onClick={() => onOpenSaeDrawer('sae-1')}
                  className="px-3.5 py-1.5 rounded-xl bg-error text-white font-bold hover:bg-[#9a1414] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Open SAE-1024 Review</span>
                </button>
              )}
            </div>

            {studySafetyRecords.length === 0 ? (
              <div className="p-6 rounded-xl bg-surface-container-low text-center text-slate-500">
                No active Serious Adverse Events logged for this trial.
              </div>
            ) : (
              <div className="space-y-3">
                {studySafetyRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-red-200 bg-red-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-error text-white font-bold text-[10px] uppercase">
                          {rec.type} • {rec.severity}
                        </span>
                        <span className="font-mono font-bold text-primary">{rec.reportId}</span>
                        <span className="text-slate-500">• Subject: {rec.subjectId}</span>
                      </div>
                      <h5 className="font-bold text-primary">{rec.incidentTitle}</h5>
                      <p className="text-slate-600">{rec.incidentDescription}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <span>Causality: <strong>{rec.causalityRating}</strong> (Score {rec.causalityNaranjoScore})</span>
                        <span>•</span>
                        <span>Date: {rec.dateReported}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenSaeDrawer(rec.id)}
                      className="px-3 py-1.5 rounded-lg bg-error text-white font-bold hover:bg-[#9a1414] flex-shrink-0 cursor-pointer"
                    >
                      Inspect SAE Dossier
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. PROTOCOL DEVIATIONS TAB */}
        {activeTab === 'deviations' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-primary">Protocol Deviations & Violations Log</h4>
                <p className="text-slate-500">Documented GCP compliance variances and Corrective Actions (CAPA)</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container font-mono font-bold text-primary">
                {study.deviationsCount} Deviations
              </span>
            </div>

            {study.deviationsList && study.deviationsList.length > 0 ? (
              <div className="space-y-2.5">
                {study.deviationsList.map((dev) => (
                  <div key={dev.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{dev.id}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {dev.type} • {dev.severity}
                        </span>
                        <span className="text-slate-500 font-mono">Subject: {dev.subjectCode}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        CAPA: {dev.capaStatus}
                      </span>
                    </div>
                    <p className="text-slate-700 pt-1">{dev.description}</p>
                    <span className="text-[10px] text-slate-400 block">Logged: {dev.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-surface-container-low text-center text-slate-500">
                No active protocol deviations reported for this study.
              </div>
            )}
          </div>
        )}

        {/* 7. DATA QUALITY TAB */}
        {activeTab === 'data-quality' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h4 className="font-bold text-sm text-primary">Electronic Data Capture (EDC) & Data Quality Index</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0]">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Data Quality Index</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono text-emerald-700">{study.dataQualityScore}%</span>
                </div>
                <span className="text-slate-500">Based on CDISC CDASH validation gates</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0]">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Open eCRF Queries</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono text-primary">{study.queriesCount}</span>
                </div>
                <span className="text-slate-500">Average resolution velocity: 3.2 days</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0]">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Missing Data Rate</span>
                <div className="my-1">
                  <span className="text-2xl font-bold font-mono text-secondary">0.6%</span>
                </div>
                <span className="text-slate-500">Below the 2.0% ICH-GCP threshold</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-1">
              <span className="font-bold text-primary block">Active Query Audit Checklist</span>
              <p className="text-slate-600 leading-relaxed">
                4 queries pending clinical laboratory biomarker reconciliation; 3 queries related to concomitant medication log timestamps. All queries assigned to Site Lead Investigators.
              </p>
            </div>
          </div>
        )}

        {/* 8. IEC TAB */}
        {activeTab === 'iec' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h4 className="font-bold text-sm text-primary">Institutional Ethics Committee (IEC) Dossier</h4>
            <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-3">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <span className="font-bold text-primary">IEC Sanction Reference:</span>
                <span className="font-mono font-bold text-emerald-700">{study.ethicsRef}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Approval Status:</span>
                  <span className="font-bold text-primary">{study.ethicsStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Last Committee Review:</span>
                  <span className="font-bold text-primary">{study.iecMeetingDate || '05 Dec 2025'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Annual Renewal Due:</span>
                  <span className="font-bold text-amber-700">{study.iecRenewalDue || '04 Dec 2026'}</span>
                </div>
              </div>
              <p className="text-slate-600 pt-1 leading-relaxed">
                Informed Consent Documents (ICD) and Subject Information Sheets (SIS) verified in English, Hindi, and regional languages adhering to ICMR 2017 Bioethics guidelines.
              </p>
            </div>
          </div>
        )}

        {/* 9. CTRI TAB */}
        {activeTab === 'ctri' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h4 className="font-bold text-sm text-primary">Clinical Trials Registry - India (CTRI) Gateway</h4>
            <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-3">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <span className="font-bold text-primary">National CTRI Code:</span>
                <span className="font-mono font-bold text-primary">{study.ctriId}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Registration Status:</span>
                  <span className="font-bold text-emerald-700">{study.ctriStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Registry Gate:</span>
                  <span className="font-bold text-primary">Level IV (Publicly Visible)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Last Portal Sync:</span>
                  <span className="font-bold text-slate-700">{study.lastUpdate}</span>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActionNotice(`Triggered live CTRI metadata sync for ${study.id}. Portal status validated.`);
                    setTimeout(() => setActionNotice(''), 3500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold hover:bg-[#001d34] cursor-pointer"
                >
                  Verify CTRI Portal Gateway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 10. AUDIT TRAIL TAB */}
        {activeTab === 'audit-trail' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <h4 className="font-bold text-sm text-primary">21 CFR Part 11 Audit Trail for {study.id}</h4>
            <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-surface-container-low font-bold text-primary">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Operator</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Cryptographic Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {studyAuditRecords.map((aud) => (
                    <tr key={aud.id} className="hover:bg-surface-container-low/70">
                      <td className="py-2.5 px-3 font-mono text-slate-600">{aud.timestamp}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-primary">{aud.operatorName}</span>
                        <span className="text-[10px] text-slate-400 block">{aud.operatorRole}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-primary">{aud.actionSummary}</span>
                        <span className="text-[11px] text-slate-500 block">{aud.actionContext}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-emerald-700">
                        {aud.cryptographicHash.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
