import React, { useState } from 'react';
import { SafetyRecord } from '../types/clinical';

interface NewAeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: SafetyRecord) => void;
}

export const NewAeModal: React.FC<NewAeModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
}) => {
  const [studyId, setStudyId] = useState('AYT-002');
  const [subjectId, setSubjectId] = useState('AYT-002-DEL-048');
  const [type, setType] = useState<'SAE' | 'ADR' | 'AE'>('AE');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Critical'>('Moderate');
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [causalityRating, setCausalityRating] = useState<'Possible' | 'Probable' | 'Definite' | 'Unlikely'>('Possible');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) {
      return;
    }

    const reportId = `${type}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: SafetyRecord = {
      id: `safety-${Date.now()}`,
      reportId,
      studyId,
      studyName: studyId === 'AYT-002' ? 'Panchakarma in Knee OA' : 'Clinical Protocol',
      protocolTitle: `Trial ${studyId}`,
      type,
      severity,
      incidentTitle,
      incidentDescription: incidentDescription || incidentTitle,
      subjectId,
      subjectAge: 55,
      subjectGender: 'F',
      subjectCohort: 'Intervention Arm',
      dateReported: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      deadlineHoursRemaining: type === 'SAE' ? 24 : 72,
      isExpedited: type === 'SAE',
      causalityNaranjoScore: causalityRating === 'Definite' ? 8 : causalityRating === 'Probable' ? 6 : 4,
      causalityRating,
      whoUmcCategory: `${causalityRating} adverse event`,
      status: 'Pending Review',
      interventionPaused: severity === 'Critical' || severity === 'Severe',
      actionsTaken: ['Logged into institutional pharmacovigilance safety register', 'Investigator informed for clinical assessment'],
      assignedMedicalMonitor: 'Dr. Rajeshwar Sharma',
      cdscoSubmissionStatus: 'Pending Sign-off',
    };

    onAddRecord(newRecord);
    setIncidentTitle('');
    setIncidentDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-error">add_alert</span>
            <h3 className="font-bold text-base text-primary">Report Clinical Adverse Event</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Study Protocol</label>
              <select
                value={studyId}
                onChange={(e) => setStudyId(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="AYT-002">AYT-002 (Panchakarma Knee OA)</option>
                <option value="AYT-001">AYT-001 (Nishamlaki Diabetes)</option>
                <option value="AYT-003">AYT-003 (Shallaki & Guggulu RA)</option>
                <option value="AYT-004">AYT-004 (Ayush-82 Metabolic)</option>
                <option value="AYT-005">AYT-005 (Ashwagandha MCI)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Subject ID Code</label>
              <input
                type="text"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
                className="w-full font-mono font-bold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Event Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="AE">Adverse Event (AE)</option>
                <option value="ADR">Adverse Drug Reaction (ADR)</option>
                <option value="SAE">Serious Adverse Event (SAE)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Severity Grade</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Causality</label>
              <select
                value={causalityRating}
                onChange={(e) => setCausalityRating(e.target.value as any)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="Possible">Possible</option>
                <option value="Probable">Probable</option>
                <option value="Definite">Definite</option>
                <option value="Unlikely">Unlikely</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-on-surface-variant block mb-1">Incident Headline</label>
            <input
              type="text"
              placeholder="e.g. Acute urticaria and transient dizziness post-ingestion..."
              value={incidentTitle}
              onChange={(e) => setIncidentTitle(e.target.value)}
              required
              className="w-full font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="font-bold text-on-surface-variant block mb-1">Clinical Details & Interventions</label>
            <textarea
              rows={3}
              placeholder="Provide chronological details, vitals, actions taken, and patient status"
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              className="w-full font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-error text-white font-bold hover:bg-[#9a1414] shadow-sm"
            >
              Log Safety Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
