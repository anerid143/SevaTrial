import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'cdisc' | 'merkle' | 'ctri'>('pdf');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);

      // Create download blob
      let filename = 'SevaTrial_Regulatory_Dossier.pdf';
      let content = 'SevaTrial Regulatory Dossier - 21 CFR Part 11 Validated';
      let mimeType = 'text/plain';

      if (selectedFormat === 'cdisc') {
        filename = 'AIIA_CDISC_define_v2.1.xml';
        content = '<?xml version="1.0" encoding="UTF-8"?><ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"><Study OID="AIIA.AYT002"><GlobalVariables><StudyName>AYT-002</StudyName></GlobalVariables></ODM>';
        mimeType = 'application/xml';
      } else if (selectedFormat === 'merkle') {
        filename = 'AIIA_Merkle_Proof_Manifest.json';
        content = JSON.stringify({
          entity: 'All India Institute of Ayurveda',
          blockSequence: 849201,
          rootHash: '0x8f2ac4b99182bde771829038cb419081e824190bda841893cfa1894b8109312d',
          timestampAuthority: 'National Informatics Centre (NIC) Cert',
          validRecordsCount: 18492,
          fipsCompliance: 'FIPS 140-2 Level 3',
        }, null, 2);
        mimeType = 'application/json';
      } else if (selectedFormat === 'ctri') {
        filename = 'CTRI_Institutional_Manifest_2026.xml';
        content = '<CTRI_Export date="2026-09-28"><Studies count="24"/></CTRI_Export>';
        mimeType = 'application/xml';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">download_for_offline</span>
            <div>
              <h3 className="font-bold text-base text-primary">Export Regulatory Inspection Bundle</h3>
              <p className="text-[11px] text-slate-500">21 CFR Part 11 & CDSCO Audit Package</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <label className="font-bold text-on-surface-variant block">Select Regulatory Deliverable:</label>

          <div className="space-y-2">
            <div
              onClick={() => setSelectedFormat('pdf')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedFormat === 'pdf'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-[#e2e8f0] bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-red-600">picture_as_pdf</span>
                <div>
                  <h4 className="font-bold text-primary">Regulatory Dossier (PDF/A-1)</h4>
                  <p className="text-[11px] text-slate-500">Full portfolio summary, milestone gates & signed audit stamps</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Digital Sign Valid
              </span>
            </div>

            <div
              onClick={() => setSelectedFormat('cdisc')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedFormat === 'cdisc'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-[#e2e8f0] bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-secondary">data_object</span>
                <div>
                  <h4 className="font-bold text-primary">CDISC define.xml + CSV Bundle (v2.1)</h4>
                  <p className="text-[11px] text-slate-500">SDTM clinical trial dataset compliant with FDA/CDSCO e-Submission</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                CDISC SDTM
              </span>
            </div>

            <div
              onClick={() => setSelectedFormat('merkle')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedFormat === 'merkle'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-[#e2e8f0] bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-emerald-600">lock</span>
                <div>
                  <h4 className="font-bold text-primary">Raw Merkle Proof Manifest (JSON-LD)</h4>
                  <p className="text-[11px] text-slate-500">SHA-256 HMAC immutable blockchain audit log verification file</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                18,492 Blocks
              </span>
            </div>

            <div
              onClick={() => setSelectedFormat('ctri')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedFormat === 'ctri'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-[#e2e8f0] bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-amber-600">cloud_sync</span>
                <div>
                  <h4 className="font-bold text-primary">CTRI National Registry Manifest (XML)</h4>
                  <p className="text-[11px] text-slate-500">Official Clinical Trials Registry - India gateway schema</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                CTRI v3.4
              </span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl text-[11px] text-slate-500 leading-relaxed">
            Exports generated from SevaTrial carry an automated cryptographic seal validated by the National Informatics Centre (NIC) and are legally recognized under Rule 122DAB of the Drugs and Cosmetics Rules.
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#001d34] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExporting ? 'hourglass_top' : 'file_download'}
            </span>
            <span>{isExporting ? 'Generating Bundle...' : 'Download Bundle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
