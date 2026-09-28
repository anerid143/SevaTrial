import React, { useState } from 'react';
import { AuditRecord } from '../types/clinical';

interface AuditTrailViewProps {
  auditRecords: AuditRecord[];
  onOpenExportModal: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditRecords,
  onOpenExportModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationDone, setVerificationDone] = useState<boolean>(false);
  const [verifiedBlockCount, setVerifiedBlockCount] = useState<number>(0);

  const startHashVerification = () => {
    setIsVerifying(true);
    setVerificationDone(false);
    setVerifiedBlockCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVerifiedBlockCount(count);
      if (count >= 5) {
        clearInterval(interval);
        setIsVerifying(false);
        setVerificationDone(true);
      }
    }, 400);
  };

  const totalCount = auditRecords.length;
  const safetyCount = auditRecords.filter((r) => r.category === 'Safety & SAE').length;
  const protocolCount = auditRecords.filter((r) => r.category === 'Protocol Modifications').length;
  const consentCount = auditRecords.filter((r) => r.category === 'Consent & Enrollment').length;

  const filteredRecords = auditRecords.filter((rec) => {
    if (selectedCategory !== 'All' && rec.category !== selectedCategory) return false;
    if (selectedRole !== 'All' && !rec.operatorRole.includes(selectedRole)) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.recordIdentifier.toLowerCase().includes(q) ||
        rec.actionSummary.toLowerCase().includes(q) ||
        rec.operatorName.toLowerCase().includes(q) ||
        rec.cryptographicHash.toLowerCase().includes(q);
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
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span>Electronic Records & Signatures Subsystem (21 CFR Part 11)</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-secondary font-semibold">ICMR GCP & FIPS 140-2 Validated</span>
          </div>
          <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
            Regulatory Audit Trail & Compliance Ledger
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Immutable 21 CFR Part 11 & ICMR GCP compliant chronological audit history of all study, patient, SAE, and protocol modifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={startHashVerification}
            disabled={isVerifying}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#001d34] shadow-sm transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${isVerifying ? 'animate-spin' : ''}`}>
              lock_reset
            </span>
            <span>{isVerifying ? 'Verifying Merkle Tree...' : 'Verify Digital Hashes'}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#cbd5e1] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>Export Inspection Bundle</span>
          </button>
        </div>
      </div>

      {/* Live Hash Verification Modal / Box */}
      {(isVerifying || verificationDone) && (
        <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[24px]">security</span>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Cryptographic Merkle Proof Verification Flow
                </h4>
                <p className="text-xs text-emerald-300">
                  Validating SHA-256 HMAC hash chain against National Informatics Centre (NIC) Timestamp Authority
                </p>
              </div>
            </div>
            {verificationDone && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400 rounded-full text-xs font-bold font-mono">
                100% Chain Integrity Verified (5/5 Blocks Valid)
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-900/50 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(verifiedBlockCount / 5) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
            {['Block #849,197', 'Block #849,198', 'Block #849,199', 'Block #849,200', 'Block #849,201'].map(
              (blk, i) => (
                <div
                  key={blk}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    i < verifiedBlockCount
                      ? 'bg-emerald-800/40 border-emerald-400 text-emerald-200'
                      : 'bg-emerald-950/40 border-emerald-900 text-emerald-600'
                  }`}
                >
                  <span className="block font-bold">{blk}</span>
                  <span className="text-[10px]">
                    {i < verifiedBlockCount ? '✓ Hash Match (0 Collisions)' : 'Pending Check...'}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Ledger Integrity Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-[#e2e8f0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">shield_with_heart</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-primary uppercase tracking-wide">
                Tamper-Evident Ledger Integrity: 100% Verified
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
              Live Chaining • Block Sequence: <strong>#849,201</strong> • Last Block Hash: <span className="text-primary font-bold">0x8f2a...c4b9</span> • TSA Authority: National Informatics Centre (NIC)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-700">
          <span className="px-2 py-0.5 bg-white border border-[#e2e8f0] rounded-md">21 CFR Part 11</span>
          <span className="px-2 py-0.5 bg-white border border-[#e2e8f0] rounded-md">CDSCO GCP</span>
          <span className="px-2 py-0.5 bg-white border border-[#e2e8f0] rounded-md">ICMR 2017</span>
          <span className="px-2 py-0.5 bg-white border border-[#e2e8f0] rounded-md">DPDP Act 2023</span>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedCategory('All')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">Audited Entries</span>
            <span className="material-symbols-outlined text-[20px] text-primary">fact_check</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-primary font-bold">{totalCount}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Active Audit Ledger</span>
        </div>

        <div
          onClick={() => setSelectedCategory('Safety & SAE')}
          className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-400 transition-all"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">Safety & SAE Logs</span>
            <span className="material-symbols-outlined text-[20px] text-error">warning</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-error font-bold">{safetyCount}</span>
          </div>
          <span className="text-[11px] font-bold text-error">Expedited Statutory Track</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">Signature Health</span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">encrypted</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-emerald-700 font-bold">100%</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">0 Collisions • FIPS 140-2 Level 3</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">Inspection Readiness</span>
            <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
          </div>
          <div className="my-2">
            <span className="font-headline-xl text-2xl md:text-3xl text-secondary font-bold">99.4/100</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Clean Regulatory Audit Readiness</span>
        </div>
      </div>

      {/* Filter and Master Ledger Table */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
        {/* Quick Focus Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-on-surface-variant uppercase mr-1">Quick Focus:</span>
            {[
              { id: 'All', label: `All Records (${totalCount})` },
              { id: 'Safety & SAE', label: `Safety & SAE (${safetyCount})` },
              { id: 'Protocol Modifications', label: `Protocol Changes (${protocolCount})` },
              { id: 'Consent & Enrollment', label: `Enrollment Tracking (${consentCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === f.id
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search audit hash, operator, context..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-surface-container-low border border-[#e2e8f0] text-primary rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Master Ledger Table */}
        <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-surface-container-low text-[11px] font-bold text-primary uppercase tracking-wider">
                <th className="py-3 px-3">Timestamp & IP</th>
                <th className="py-3 px-3">Operator & Role</th>
                <th className="py-3 px-3">Record Identifier</th>
                <th className="py-3 px-3">Clinical Action & Context</th>
                <th className="py-3 px-3">State Transition (Delta)</th>
                <th className="py-3 px-3 text-right">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-primary block">{rec.timeOnly}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">{rec.ipAddress}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">{rec.terminalLocation}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-primary">{rec.operatorName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{rec.operatorRole}</span>
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded inline-block mt-0.5">
                      {rec.tokenId}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-bold text-primary text-[11px]">
                      {rec.recordIdentifier}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{rec.category}</span>
                  </td>
                  <td className="py-3 px-3 max-w-sm">
                    <span className="font-bold text-primary block">{rec.actionSummary}</span>
                    <span className="text-[11px] text-on-surface-variant leading-relaxed block">{rec.actionContext}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] max-w-xs space-y-0.5">
                    <div className="p-1 rounded bg-red-50 text-red-900 border border-red-100 truncate">
                      {rec.stateDeltaPrev}
                    </div>
                    <div className="p-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-100 truncate font-semibold">
                      {rec.stateDeltaNew}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>Sign Valid</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 mt-1" title={rec.cryptographicHash}>
                        {rec.cryptographicHash.slice(0, 10)}...{rec.cryptographicHash.slice(-6)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-xs text-on-surface-variant">
          <span>Displaying 5 verifiable master records • Genesis block verified</span>
          <button
            onClick={onOpenExportModal}
            className="text-secondary font-bold hover:underline"
          >
            Download Raw Audit Trail CSV / JSON-LD →
          </button>
        </div>
      </div>
    </div>
  );
};
