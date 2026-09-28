import React, { useState } from 'react';
import { UserRole, InstitutionalAlert } from '../types/clinical';

interface HeaderProps {
  currentPath: string;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (path: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alerts: InstitutionalAlert[];
  onOpenNewStudyModal: () => void;
  onOpenExportModal: () => void;
  onOpenNewAeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  activeRole,
  onRoleChange,
  onNavigate,
  searchQuery,
  onSearchChange,
  alerts,
  onOpenNewStudyModal,
  onOpenExportModal,
  onOpenNewAeModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.read);

  const getBreadcrumbs = () => {
    switch (currentPath) {
      case 'dashboard':
        return { section: 'Surveillance & Portfolio', title: 'Clinical Research Command Center' };
      case 'clinical-studies':
        return { section: 'Trial Registry', title: 'Clinical Studies Directory' };
      case 'study-detail':
        return { section: 'Clinical Studies / AYT-002', title: 'Study Details & Monitoring' };
      case 'pharmacovigilance':
        return { section: 'Safety & Pharmacovigilance', title: 'Adverse Event Surveillance & Expedited SAEs' };
      case 'audit-trail':
        return { section: 'GxP Subsystem', title: 'Regulatory Audit Trail & 21 CFR Part 11 Ledger' };
      case 'alerts':
        return { section: 'Institutional Triage', title: 'Institutional Alert Center' };
      case 'reports':
        return { section: 'Compliance & Analytics', title: 'Institutional Reports & ICMR Metrics' };
      case 'settings':
        return { section: 'System Administration', title: 'Platform & Protocol Configurations' };
      default:
        return { section: 'Clinical Platform', title: 'SevaTrial' };
    }
  };

  const { section, title } = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-surface-container-lowest/90 backdrop-blur-md border-b border-[#e2e8f0] px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Breadcrumb & Section Name */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          <span className="font-semibold text-secondary">{section}</span>
          <span>•</span>
          <span className="truncate text-slate-500">All India Institute of Ayurveda, New Delhi</span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            21 CFR Part 11 Compliant
          </span>
        </div>
        <h1 className="font-headline-md text-lg md:text-xl text-primary font-bold tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative hidden lg:block w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search protocols, SAEs, subjects, PIs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-container-low border border-[#e2e8f0] text-xs rounded-xl pl-9 pr-3 py-2 text-on-surface placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Action Buttons based on path */}
        <div className="flex items-center gap-2">
          {currentPath === 'dashboard' && (
            <>
              <button
                onClick={onOpenExportModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
                <span>Export Portfolio PDF</span>
              </button>
              <button
                onClick={onOpenNewStudyModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#001d34] shadow-[0_2px_6px_0_rgba(0,37,65,0.25)] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Register New Trial</span>
              </button>
            </>
          )}

          {currentPath === 'clinical-studies' && (
            <>
              <button
                onClick={onOpenExportModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Export CTRI Manifest</span>
              </button>
              <button
                onClick={onOpenNewStudyModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#001d34] shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Add New Study</span>
              </button>
            </>
          )}

          {currentPath === 'pharmacovigilance' && (
            <>
              <button
                onClick={onOpenExportModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                <span>Expedited CDSCO Export</span>
              </button>
              <button
                onClick={onOpenNewAeModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-error hover:bg-[#9a1414] shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_alert</span>
                <span>+ Report Adverse Event</span>
              </button>
            </>
          )}

          {currentPath === 'audit-trail' && (
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-primary bg-surface-container border border-[#cbd5e1] hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span>Export Inspection Bundle</span>
            </button>
          )}

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all border border-[#e2e8f0]"
              title="Notifications & Regulatory Alerts"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-88 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-error">emergency</span>
                    <span className="font-bold text-xs text-primary uppercase tracking-wide">
                      Safety & Regulatory Alerts ({unreadAlerts.length})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('alerts');
                      setShowNotifications(false);
                    }}
                    className="text-[11px] text-secondary font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                  {alerts.slice(0, 4).map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        onNavigate('alerts');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-[#e2e8f0] cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            alt.severity === 'Critical'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alt.severity} • {alt.studyId}
                        </span>
                        <span className="text-[10px] text-slate-400">{alt.createdDate.split(',')[0]}</span>
                      </div>
                      <p className="text-xs font-semibold text-primary mt-1">{alt.title}</p>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{alt.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-[#f1f5f9] flex justify-between items-center text-[11px] text-slate-500">
                  <span>24h Regulatory SLA Monitoring</span>
                  <button
                    onClick={() => {
                      onNavigate('pharmacovigilance');
                      setShowNotifications(false);
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    Open SAE Dossier →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Capsule Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-[#e2e8f0]">
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
            <span className="text-xs font-bold text-primary">{activeRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
