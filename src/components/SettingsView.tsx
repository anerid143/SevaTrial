import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [ctriSyncInterval, setCtriSyncInterval] = useState('15 mins');
  const [sessionTimeout, setSessionTimeout] = useState('30 mins');
  const [signatureExpiry, setSignatureExpiry] = useState('365 days');
  const [autoDsmbEscalation, setAutoDsmbEscalation] = useState(true);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
            System Administration
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-secondary font-semibold">21 CFR Part 11 Rule Engine</span>
        </div>
        <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
          Platform & Regulatory Configuration
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
          Configure statutory reporting intervals, digital signature HSM settings, and national clinical trial gateway parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">hub</span>
            <span>National Regulatory Gateway Gateways</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">
                Clinical Trials Registry - India (CTRI) Sync Interval
              </label>
              <select
                value={ctriSyncInterval}
                onChange={(e) => setCtriSyncInterval(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="15 mins">Every 15 minutes (Real-time polling)</option>
                <option value="1 hour">Every 1 hour</option>
                <option value="6 hours">Every 6 hours</option>
                <option value="24 hours">Daily Batch at 00:00 IST</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-on-surface-variant block mb-1">
                CDSCO SUGAM Portal Gateway Endpoint
              </label>
              <input
                type="text"
                disabled
                value="https://sugam.gov.in/api/v3.2/integrative-ayush/pv-stream"
                className="w-full font-mono bg-slate-50 border border-[#e2e8f0] text-slate-600 rounded-xl py-2 px-3"
              />
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                ✓ Endpoint Online & TLS 1.3 Certified (Mutual mTLS Active)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-[#e2e8f0] flex items-center justify-between">
              <div>
                <span className="font-bold text-primary block">Automated DSMB Safety Escalation</span>
                <span className="text-[11px] text-slate-500">Auto-flag ALT/AST &gt; 3x ULN or Grade 3 syncope</span>
              </div>
              <input
                type="checkbox"
                checked={autoDsmbEscalation}
                onChange={(e) => setAutoDsmbEscalation(e.target.checked)}
                className="h-4 w-4 rounded text-secondary focus:ring-secondary"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">security</span>
            <span>21 CFR Part 11 Electronic Signature Security</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">
                Inactivity Session Timeout (Part 11 Compliance)
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="15 mins">15 minutes (Strict Clinical Ward)</option>
                <option value="30 mins">30 minutes (Standard Investigator)</option>
                <option value="60 mins">60 minutes (Auditor Read-only)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-on-surface-variant block mb-1">
                HSM Hardware Token Certificate Validity
              </label>
              <select
                value={signatureExpiry}
                onChange={(e) => setSignatureExpiry(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="365 days">365 days (Annual Re-issuance)</option>
                <option value="180 days">180 days</option>
              </select>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
              <span className="font-bold text-primary block">NIC Timestamp Authority (TSA) Certificate</span>
              <p className="text-[11px] text-slate-500 font-mono">
                Serial: 2026-NIC-AIIA-771892 • SHA-256 with RSA 4096-bit • Valid until 31-Dec-2028
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
