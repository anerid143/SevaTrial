import React from 'react';
import { UserRole } from '../types/clinical';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  saeAlertCount: number;
  criticalAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  activeRole,
  onRoleChange,
  saeAlertCount,
  criticalAlertCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      badge: null,
    },
    {
      id: 'clinical-studies',
      label: 'Clinical Studies',
      icon: 'clinical_notes',
      badge: null,
    },
    {
      id: 'pharmacovigilance',
      label: 'Pharmacovigilance',
      icon: 'health_and_safety',
      badge: saeAlertCount > 0 ? saeAlertCount : null,
      badgeColor: 'bg-error-container text-on-error-container',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'notifications_active',
      badge: criticalAlertCount > 0 ? criticalAlertCount : null,
      badgeColor: 'bg-secondary-container text-on-secondary-container',
    },
    {
      id: 'audit-trail',
      label: 'Audit Trail',
      icon: 'verified_user',
      badge: '21 CFR',
      badgeColor: 'bg-surface-container-high text-primary font-mono text-[10px]',
    },
  ];

  const secondaryNavItems = [
    {
      id: 'reports',
      label: 'Reports & ICMR Metrics',
      icon: 'bar_chart',
    },
    {
      id: 'settings',
      label: 'Protocol & Regulatory Config',
      icon: 'tune',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex flex-col justify-between">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-space-lg border-b border-[#f1f5f9] flex items-center gap-space-sm cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">local_pharmacy</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-md text-[17px] text-primary tracking-tight font-bold">SevaTrial</span>
            </div>
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-semibold">Clinical Intelligence</span>
          </div>
        </div>

        {/* Primary Navigation Section */}
        <div className="px-space-md py-space-sm">
          <div className="font-label-sm text-[11px] text-on-surface-variant/70 uppercase tracking-wider px-space-sm mb-space-xs font-semibold">
            Operations & Trial Monitoring
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.id || (item.id === 'clinical-studies' && currentPath.startsWith('clinical-studies'));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-space-md py-2.5 rounded-xl transition-all text-left text-sm ${
                    isActive
                      ? 'bg-primary-container text-white font-medium shadow-[0_2px_6px_0_rgba(18,59,93,0.18)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-secondary-fixed' : 'text-on-surface-variant'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold leading-tight ${item.badgeColor || 'bg-error text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Governance & Registry Section */}
        <div className="px-space-md py-space-xs">
          <div className="font-label-sm text-[11px] text-on-surface-variant/70 uppercase tracking-wider px-space-sm mb-space-xs font-semibold">
            Governance & Analytics
          </div>
          <nav className="flex flex-col gap-1">
            {secondaryNavItems.map((item) => {
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-space-md py-2.5 rounded-xl transition-all text-left text-sm ${
                    isActive
                      ? 'bg-primary-container text-white font-medium'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* CTRI & GxP Compliance Badge */}
        <div className="mx-space-md mt-auto mb-3 p-3 bg-surface-container-low rounded-xl border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-primary tracking-wide uppercase">CTRI Gateway Connected</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Institutional Ethics Committee & CDSCO SUGAM v3.2 validated • 21 CFR Part 11 active
          </p>
        </div>
      </div>

      {/* Operator Card & Role Switcher */}
      <div className="p-space-md border-t border-[#e2e8f0] bg-surface-container-lowest">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Active Operator Persona</span>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">21 CFR Valid</span>
        </div>
        <div className="relative">
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="w-full text-xs font-semibold bg-surface-container border border-[#cbd5e1] text-primary rounded-lg py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-secondary/40 cursor-pointer"
          >
            <option value="Principal Investigator">Dr. S. Patel (PI - Panchakarma)</option>
            <option value="Safety Officer / DSMB">Dr. R. Sharma (Chair, DSMB & PV)</option>
            <option value="Regulatory Auditor">P. Verma (21 CFR Part 11 Auditor)</option>
            <option value="Clinical Coordinator">R. Mehra (Lead Clinical CRA)</option>
          </select>
        </div>
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-2 px-0.5">
          <span className="truncate">AIIA New Delhi Intranet</span>
          <span className="font-mono text-[10px] text-slate-400">#e-8841</span>
        </div>
      </div>
    </aside>
  );
};
