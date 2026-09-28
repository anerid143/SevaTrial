import React from 'react';
import { ClinicalStudy, InstitutionalAlert, SafetyRecord } from '../types/clinical';

interface DashboardViewProps {
  studies: ClinicalStudy[];
  alerts: InstitutionalAlert[];
  safetyRecords: SafetyRecord[];
  onNavigate: (path: string, studyId?: string, initialFilter?: string) => void;
  onOpenNewStudyModal: () => void;
  onOpenExportModal: () => void;
  onOpenSaeDrawer: (recordId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studies,
  alerts,
  safetyRecords,
  onNavigate,
  onOpenNewStudyModal,
  onOpenExportModal,
  onOpenSaeDrawer,
}) => {
  // 1. Centralized dynamic KPI calculations (NO hardcoded numbers!)
  const totalStudies = studies.length;
  const activeStudies = studies.filter((s) => s.status === 'Active').length;
  const recruitingStudies = studies.filter((s) => s.status === 'Recruiting').length;
  const delayedStudies = studies.filter((s) => s.status === 'Delayed').length;
  const totalParticipants = studies.reduce((acc, s) => acc + s.enrolledSubjects, 0);
  const totalTarget = studies.reduce((acc, s) => acc + s.targetSubjects, 0);
  const enrollmentPercent = totalTarget > 0 ? Math.round((totalParticipants / totalTarget) * 100) : 0;

  const criticalSafetyAlerts = alerts.filter((a) => a.severity === 'Critical' && a.category === 'Safety').length;
  const pendingRegulatoryActions = alerts.filter((a) => a.category === 'Regulatory').length;

  const avgDataQuality = (
    studies.reduce((acc, s) => acc + (s.dataQualityScore || 95), 0) / (studies.length || 1)
  ).toFixed(1);

  const avgCompliance = (
    studies.reduce((acc, s) => acc + (s.complianceScore || 95), 0) / (studies.length || 1)
  ).toFixed(1);

  const criticalAlertsList = alerts.filter((a) => a.severity === 'Critical');

  // Regulatory deadlines list
  const upcomingDeadlines = [
    {
      id: 'd1',
      title: 'CDSCO Expedited SAE-1024 Submission Window',
      studyId: 'AYT-002',
      deadline: '28 Sep 2026, 22:15 IST (11h 48m left)',
      urgency: 'Immediate',
      badgeColor: 'bg-error text-white',
    },
    {
      id: 'd2',
      title: 'CTRI Portal Protocol Amendment v2.1 Sync',
      studyId: 'AYT-004',
      deadline: 'Statutory 14-day limit expired (1d overdue)',
      urgency: 'Overdue',
      badgeColor: 'bg-red-700 text-white',
    },
    {
      id: 'd3',
      title: 'Site 02 (Jaipur Center) CRA SDV Monitoring Visit',
      studyId: 'AYT-002',
      deadline: '30 Sep 2026 (2 days left)',
      urgency: 'Upcoming',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'd4',
      title: 'Institutional Ethics Committee (IEC) Annual Re-submission',
      studyId: 'AYT-002',
      deadline: '04 Dec 2026 (Annual Renewal Gate)',
      urgency: 'Scheduled',
      badgeColor: 'bg-slate-700 text-white',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
              AIIA Institutional CTMS • Live Command Center
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-secondary font-semibold">21 CFR Part 11 & CDSCO Validated</span>
          </div>
          <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
            Clinical Research Command Center
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Real-time multi-protocol oversight, participant recruitment velocity, and pharmacovigilance safety gates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span className="hidden sm:inline">Export CTMS Summary</span>
          </button>
          <button
            onClick={onOpenNewStudyModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#001d34] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Register New Trial</span>
          </button>
        </div>
      </div>

      {/* 9 Core Clickable KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Studies */}
        <div
          onClick={() => onNavigate('clinical-studies', undefined, 'All')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view all Clinical Studies"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary">
              Total Studies
            </span>
            <span className="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform">
              science
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold tracking-tight">
              {totalStudies}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">Active CTMS Registry</span>
          </div>
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
            <span>View All Directory</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>

        {/* KPI 2: Active Studies */}
        <div
          onClick={() => onNavigate('clinical-studies', undefined, 'Active')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Active Clinical Studies"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-secondary">
              Active Studies
            </span>
            <span className="material-symbols-outlined text-[20px] text-secondary group-hover:scale-110 transition-transform">
              clinical_notes
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-secondary font-bold tracking-tight">
              {activeStudies}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">Under Protocol Execution</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Filter Active</span>
          </span>
        </div>

        {/* KPI 3: Recruiting Studies */}
        <div
          onClick={() => onNavigate('clinical-studies', undefined, 'Recruiting')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Recruiting Studies"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-700">
              Recruiting Studies
            </span>
            <span className="material-symbols-outlined text-[20px] text-teal-600 group-hover:scale-110 transition-transform">
              group_add
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-teal-700 font-bold tracking-tight">
              {recruitingStudies}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">Enrolling New Patients</span>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
            <span>Filter Recruiting</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>

        {/* KPI 4: Total Participants & Enrollment % */}
        <div
          onClick={() => onNavigate('clinical-studies')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Participant Accrual"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary">
              Total Participants
            </span>
            <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold tracking-tight">
                {totalParticipants}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ {totalTarget}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-0.5">
              <span className="text-slate-500">Pace:</span>
              <span className="font-bold text-secondary font-mono">{enrollmentPercent}% Enrolled</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-secondary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${enrollmentPercent}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 5: Critical Safety Alerts */}
        <div
          onClick={() => onNavigate('alerts', undefined, 'Critical')}
          className="bg-red-50/40 p-4 rounded-2xl border-2 border-red-300 shadow-sm hover:border-red-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Critical Safety Alerts"
        >
          <div className="flex items-center justify-between text-error">
            <span className="text-[11px] font-bold uppercase tracking-wider text-error">
              Critical Safety
            </span>
            <span className="material-symbols-outlined text-[20px] text-error animate-pulse">
              emergency
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-error font-bold tracking-tight">
              {criticalSafetyAlerts}
            </span>
            <span className="block text-[11px] text-slate-600 mt-0.5">SAE-1024 (&lt;12h Window)</span>
          </div>
          <span className="text-[11px] font-bold text-error flex items-center gap-1">
            <span>Triage Alerts ({criticalSafetyAlerts})</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>

        {/* KPI 6: Pending Regulatory Actions */}
        <div
          onClick={() => onNavigate('alerts', undefined, 'Regulatory')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Pending Regulatory Actions"
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Regulatory Actions
            </span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">
              rule
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-amber-800 font-bold tracking-tight">
              {pendingRegulatoryActions}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">CTRI / IEC Filings Due</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
            <span>Resolve Filings</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>

        {/* KPI 7: Data Quality Score */}
        <div
          onClick={() => onNavigate('audit-trail')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Data Quality & Audit Trail"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary">
              Data Quality
            </span>
            <span className="material-symbols-outlined text-[20px] text-primary">
              fact_check
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold tracking-tight font-mono">
              {avgDataQuality}%
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">eCRF Validation Index</span>
          </div>
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
            <span>Audit Trail Ledger</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>

        {/* KPI 8: Compliance Score */}
        <div
          onClick={() => onNavigate('reports')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view Compliance Score & ICMR Reports"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
              Compliance Score
            </span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">
              verified
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-emerald-700 font-bold tracking-tight font-mono">
              {avgCompliance}%
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">GCP / ICMR Audit Score</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <span>View ICMR Metrics</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>

        {/* KPI 9: Safety Records */}
        <div
          onClick={() => onNavigate('pharmacovigilance')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group col-span-2 sm:col-span-1"
          title="Click to view Pharmacovigilance Safety Records"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary">
              Safety Reports
            </span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">
              health_and_safety
            </span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold tracking-tight">
              {safetyRecords.length}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">SAE, ADR & AE Logged</span>
          </div>
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
            <span>PvPI Register</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </span>
        </div>
      </div>

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Enrollment vs Target Chart (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-headline-md text-base text-primary font-bold">
                  Enrollment vs Target by Study
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Actual enrolled subjects compared to protocol target across the portfolio
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 bg-surface-container rounded-lg">
                {totalParticipants} / {totalTarget} Total
              </span>
            </div>

            {/* Dynamic Comparison Bar Chart */}
            <div className="space-y-3.5 my-3">
              {studies.map((study) => {
                const ratio = Math.round((study.enrolledSubjects / study.targetSubjects) * 100);
                const isDelayed = study.status === 'Delayed';
                return (
                  <div
                    key={study.id}
                    onClick={() => onNavigate('clinical-studies', study.id)}
                    className="p-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-[#e2e8f0]"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{study.id}</span>
                        <span className="text-slate-600 truncate max-w-[240px]">{study.shortName}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-slate-500">
                          {study.enrolledSubjects} / {study.targetSubjects}
                        </span>
                        <span className={`font-bold ${isDelayed ? 'text-amber-700' : 'text-secondary'}`}>
                          {ratio}%
                        </span>
                      </div>
                    </div>
                    {/* Visual Comparison Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isDelayed ? 'bg-amber-500' : 'bg-secondary'
                        }`}
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recruitment Trend line info */}
          <div className="pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">show_chart</span>
              <span className="font-bold text-primary">Recruitment Trend (2026):</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
              <span>Jan: 48</span>
              <span>&rarr;</span>
              <span>Mar: 142</span>
              <span>&rarr;</span>
              <span>Jun: 278</span>
              <span>&rarr;</span>
              <span className="font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
                Sep: {totalParticipants} Active
              </span>
            </div>
          </div>
        </div>

        {/* Chart 2: Study Status Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-headline-md text-base text-primary font-bold">
                  Study Status Distribution
                </h3>
                <p className="text-xs text-on-surface-variant">Real-time breakdown of all {totalStudies} monitored protocols</p>
              </div>
              <span className="material-symbols-outlined text-[20px] text-slate-400">pie_chart</span>
            </div>

            <div className="space-y-2.5 my-2">
              <div
                onClick={() => onNavigate('clinical-studies', undefined, 'Active')}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-primary">Active Protocols</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-primary">{activeStudies}</span>
                  <span className="text-slate-400">({Math.round((activeStudies / totalStudies) * 100)}%)</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('clinical-studies', undefined, 'Recruiting')}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-secondary"></span>
                  <span className="text-xs font-bold text-primary">Recruiting Cohorts</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-primary">{recruitingStudies}</span>
                  <span className="text-slate-400">({Math.round((recruitingStudies / totalStudies) * 100)}%)</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('clinical-studies', undefined, 'Delayed')}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/50 border border-amber-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-bold text-amber-900">Delayed Milestones</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-amber-900">{delayedStudies}</span>
                  <span className="text-amber-700">({Math.round((delayedStudies / totalStudies) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs text-on-surface-variant">
            <span>Overall Registry Health: <strong className="text-emerald-700">Audit Ready</strong></span>
            <button
              onClick={() => onNavigate('clinical-studies')}
              className="text-secondary font-bold hover:underline"
            >
              Open Studies Directory &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Critical Alerts & Upcoming Regulatory Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Alerts List (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-5 rounded-2xl border border-red-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-error">emergency</span>
              <h3 className="font-headline-md text-base text-primary font-bold">
                Critical Safety & Compliance Alerts
              </h3>
            </div>
            <button
              onClick={() => onNavigate('alerts', undefined, 'Critical')}
              className="text-xs font-bold text-error hover:underline"
            >
              View All in Alerts Center &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalAlertsList.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-xl border border-red-200 bg-red-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-error text-white text-[10px] font-bold uppercase">
                      {alt.severity}
                    </span>
                    <span className="font-mono font-bold text-xs text-primary">{alt.studyId}</span>
                    <span className="text-[11px] text-slate-400">• {alt.category}</span>
                  </div>
                  <h4 className="font-bold text-xs text-primary">{alt.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{alt.description}</p>
                  {alt.deadlineNotice && (
                    <span className="text-[10px] font-mono font-bold text-red-600 block">
                      {alt.deadlineNotice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {alt.actionType === 'sae_drawer' ? (
                    <button
                      onClick={() => onOpenSaeDrawer('sae-1')}
                      className="px-3 py-1.5 rounded-lg bg-error hover:bg-[#9a1414] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">verified_user</span>
                      <span>Review SAE</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('alerts', undefined, alt.category)}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-[#001d34] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      {alt.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Regulatory Deadlines (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">timer</span>
              <h3 className="font-headline-md text-base text-primary font-bold">
                Upcoming Regulatory Deadlines
              </h3>
            </div>
            <button
              onClick={() => onNavigate('audit-trail')}
              className="text-xs font-semibold text-secondary hover:underline"
            >
              Audit Trail &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface-container-low border border-[#e2e8f0] flex flex-col justify-between gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary">{item.studyId}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badgeColor}`}>
                    {item.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{item.title}</p>
                <span className="text-[11px] font-mono text-slate-500">{item.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
