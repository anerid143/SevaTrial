import React, { useState } from 'react';
import { SafetyRecord } from '../types/clinical';

interface SaeSignoffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: SafetyRecord;
  onSignAndTransmit: (reportId: string, signerName: string, role: string, reason: string) => void;
}

export const SaeSignoffDrawer: React.FC<SaeSignoffDrawerProps> = ({
  isOpen,
  onClose,
  record,
  onSignAndTransmit,
}) => {
  const [signerName, setSignerName] = useState<string>('Dr. Rajeshwar Sharma, MD');
  const [signerRole, setSignerRole] = useState<string>('Chair, Institutional Safety Monitoring Board');
  const [signingPin, setSigningPin] = useState<string>('8841');
  const [signingReason, setSigningReason] = useState<string>(
    'I have medically evaluated this Serious Adverse Event, confirmed the Naranjo causality assessment (Score 6 - Probable), and authorize expedited statutory transmission to CDSCO and Institutional Ethics Committee in accordance with Schedule Y & NDCT Rules 2019.'
  );
  const [consentChecked, setConsentChecked] = useState<boolean>(true);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<boolean>(false);
  const [ackReceipt, setAckReceipt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setErrorMessage('Please check the 21 CFR Part 11 electronic signature confirmation box before proceeding.');
      return;
    }
    setErrorMessage('');
    setIsTransmitting(true);
    setTimeout(() => {
      const receipt = `CDSCO-SUGAM-EXP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setAckReceipt(receipt);
      setIsTransmitting(false);
      setTransmissionSuccess(true);
      onSignAndTransmit(record.reportId, signerName, signerRole, signingReason);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#e2e8f0]">
        {/* Header */}
        <div className="p-5 border-b border-[#e2e8f0] bg-surface-container-lowest sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-error text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-error uppercase tracking-wider bg-red-100 px-2 py-0.5 rounded">
                  21 CFR Part 11 Electronic Signature
                </span>
                <span className="text-xs font-mono font-bold text-red-600">
                  {record.deadlineHoursRemaining > 0 ? `${record.deadlineHoursRemaining}h remaining` : 'Expedited'}
                </span>
              </div>
              <h3 className="font-headline-md text-base text-primary font-bold">
                SAE-1024 Expedited Dossier & Statutory Transmission
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1">
          {transmissionSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
              <div className="h-16 w-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <h4 className="font-bold text-lg text-emerald-900">
                Statutory CDSCO Expedited Submission Successfully Transmitted
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Electronic signature authenticated under 21 CFR Part 11. Dossier uploaded to CDSCO SUGAM & AIIA Institutional Ethics Committee portal.
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 inline-block text-left text-xs font-mono space-y-1">
                <div><strong>SUGAM Ack No:</strong> {ackReceipt}</div>
                <div><strong>Timestamp:</strong> {new Date().toUTCString()}</div>
                <div><strong>Merkle Hash:</strong> 0x7c92b814a091fe829038cb419081e824190bda...</div>
                <div><strong>Signer:</strong> {signerName} ({signerRole})</div>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-sm"
                >
                  Close & Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Clinical Incident Brief */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                  <span className="font-bold text-xs text-primary uppercase">Subject & Incident Dossier</span>
                  <span className="font-mono text-xs text-slate-500 font-bold">{record.subjectId}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Protocol:</span>
                    <span className="font-bold text-primary">{record.studyId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Subject Demographics:</span>
                    <span className="font-bold text-primary">{record.subjectAge}y {record.subjectGender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Causality:</span>
                    <span className="font-bold text-amber-700">{record.causalityRating} (Score {record.causalityNaranjoScore})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Severity:</span>
                    <span className="font-bold text-error">{record.severity}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {record.incidentDescription}
                </p>
              </div>

              {/* Actions Taken Roster */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-[#e2e8f0] space-y-2">
                <span className="font-bold text-xs text-primary uppercase block">Emergency Actions Logged</span>
                <ul className="space-y-1.5 text-xs text-on-surface-variant">
                  {record.actionsTaken.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5">check_circle</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form for Electronic Signature */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[#f1f5f9]">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">encrypted</span>
                  <span>21 CFR Part 11 Electronic Signature Verification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                      Signatory Full Name
                    </label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      required
                      className="w-full text-xs font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                      Signatory Clinical Role
                    </label>
                    <input
                      type="text"
                      value={signerRole}
                      onChange={(e) => setSignerRole(e.target.value)}
                      required
                      className="w-full text-xs font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                    Regulatory Reason for Signing
                  </label>
                  <textarea
                    rows={3}
                    value={signingReason}
                    onChange={(e) => setSigningReason(e.target.value)}
                    required
                    className="w-full text-xs font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                    FIPS 140-2 Hardware Token PIN / Digital Passcode
                  </label>
                  <input
                    type="password"
                    value={signingPin}
                    onChange={(e) => setSigningPin(e.target.value)}
                    required
                    className="w-full sm:w-48 text-xs font-mono font-bold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 tracking-widest focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Token #e-8841 Active on Secure AIIA Intranet Terminal
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs font-semibold text-error flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="part11Check"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="part11Check" className="text-[11px] text-amber-900 leading-relaxed cursor-pointer">
                    <strong>21 CFR Part 11 Legal Attestation:</strong> I understand that by checking this box and entering my cryptographic passcode, this action constitutes an electronic signature legally equivalent to a handwritten signature for CDSCO & ICMR GCP submission.
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTransmitting}
                    className="px-5 py-2.5 rounded-xl bg-error hover:bg-[#9a1414] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>{isTransmitting ? 'Transmitting to CDSCO...' : 'Sign & Transmit to CDSCO / ICMR'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
