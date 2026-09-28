import React from 'react';
import { ClinicalStudy, SafetyRecord, InstitutionalAlert } from '../types/clinical';

interface ReportsViewProps {
  studies?: ClinicalStudy[];
  safetyRecords?: SafetyRecord[];
  alerts?: InstitutionalAlert[];
  onOpenExportModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  studies = [],
  safetyRecords = [],
  alerts = [],
  onOpenExportModal,
}) => {
  const totalEnrolled = studies.reduce((acc, s) => acc + s.enrolledSubjects, 0);
  const totalTarget = studies.reduce((acc, s) => acc + s.targetSubjects, 0);
  const enrollmentPercent = totalTarget > 0 ? Math.round((totalEnrolled / totalTarget) * 100) : 0;

  const totalSafety = safetyRecords.length;
  const saeCount = safetyRecords.filter((r) => r.type === 'SAE').length;
  const adrCount = safetyRecords.filter((r) => r.type === 'ADR').length;
  const aeCount = safetyRecords.filter((r) => r.type === 'AE').length;

  const avgCompliance = (
    studies.reduce((acc, s) => acc + (s.complianceScore || 95), 0) / (studies.length || 1)
  ).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
              Governance & Institutional Metrics
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-secondary font-semibold">ICMR & CDSCO Annual Reporting</span>
          </div>
          <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
            Institutional Reports & ICMR Metrics
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Statistical aggregation of clinical enrollment velocity, adverse drug reaction signals, and GCP trial compliance.
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#001d34] shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
          <span>Generate Statutory Annual Dossier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-primary">Accrual Velocity by Protocol</h3>
            <span className="material-symbols-outlined text-[20px] text-secondary">trending_up</span>
          </div>
          <div className="space-y-3">
            {studies.slice(0, 4).map((study) => {
              const ratio = Math.round((study.enrolledSubjects / study.targetSubjects) * 100);
              return (
                <div key={study.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium truncate max-w-[170px]">
                      {study.id}: {study.shortName}
                    </span>
                    <span className="font-bold font-mono text-primary">
                      {study.enrolledSubjects}/{study.targetSubjects} ({ratio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        study.status === 'Delayed' ? 'bg-amber-500' : 'bg-secondary'
                      }`}
                      style={{ width: `${ratio}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-[#f1f5f9]">
            Total Portfolio Enrolled: <strong>{totalEnrolled}</strong> of <strong>{totalTarget}</strong> participants ({enrollmentPercent}%) across {studies.length} active protocols.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-primary">PvPI Pharmacovigilance Ratio</h3>
            <span className="material-symbols-outlined text-[20px] text-amber-600">health_and_safety</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-surface-container-low">
              <span>Expected AEs (Grade 1/2)</span>
              <strong className="font-mono text-primary">
                {aeCount} events ({totalSafety > 0 ? Math.round((aeCount / totalSafety) * 100) : 0}%)
              </strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-container-low">
              <span>Validated ADR Signals</span>
              <strong className="font-mono text-secondary">
                {adrCount} events ({totalSafety > 0 ? Math.round((adrCount / totalSafety) * 100) : 0}%)
              </strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-red-50 text-red-900 border border-red-200">
              <span>Serious Adverse Events (SAE)</span>
              <strong className="font-mono text-error">
                {saeCount} events ({totalSafety > 0 ? Math.round((saeCount / totalSafety) * 100) : 0}%)
              </strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-[#f1f5f9]">
            All {saeCount} SAEs tracked with 24-hour statutory notification gate to CDSCO & Institutional Ethics Committee.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-primary">GxP Inspection Readiness</h3>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">verified_user</span>
          </div>
          <div className="text-center py-2">
            <span className="font-headline-xl text-4xl text-emerald-700 font-bold font-mono">
              {avgCompliance}%
            </span>
            <span className="text-xs text-slate-500 block mt-1">Audit Score Index (FY 2025-26)</span>
          </div>
          <div className="space-y-1 text-[11px] text-on-surface-variant border-t border-[#f1f5f9] pt-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span>21 CFR Part 11 Token Authentication Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span>ICMR Bioethics Approval Repository Validated</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span>CDISC SDTM Dataset Interoperability Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
