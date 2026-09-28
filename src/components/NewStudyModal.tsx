import React, { useState } from 'react';
import { ClinicalStudy } from '../types/clinical';

interface NewStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudy: (study: ClinicalStudy) => void;
}

export const NewStudyModal: React.FC<NewStudyModalProps> = ({
  isOpen,
  onClose,
  onAddStudy,
}) => {
  const [studyId, setStudyId] = useState('AYT-025');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [therapeuticArea, setTherapeuticArea] = useState('Ayurvedic Orthopedics & Rheumatology');
  const [department, setDepartment] = useState('Panchakarma');
  const [phase, setPhase] = useState('Phase II RCT');
  const [pi, setPi] = useState('Dr. S. Patel, MD');
  const [targetSubjects, setTargetSubjects] = useState(100);
  const [sitesCount, setSitesCount] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    const newStudy: ClinicalStudy = {
      id: studyId,
      ctriId: `CTRI/2026/09/${Math.floor(100000 + Math.random() * 900000)}`,
      ctriStatus: 'Registered',
      protocolNumber: `AYU-PROTO-2026-${Math.floor(10 + Math.random() * 90)}`,
      shortName: `${studyId} Protocol`,
      title,
      subtitle: subtitle || 'Prospective Multicentric Clinical Investigation',
      therapeuticArea,
      department,
      phase,
      studyType: 'Double-Blind Randomized Controlled Trial',
      pi,
      piRole: 'Principal Investigator',
      coPi: 'Dr. Ananya Sen, MD',
      sponsor: 'AIIA Central Council / Ministry of AYUSH',
      sitesCount,
      sites: ['AIIA New Delhi (Main Campus)', 'AIIA Jaipur Satellite'],
      targetSubjects: Number(targetSubjects),
      enrolledSubjects: 0,
      progressPercent: 0,
      ethicsStatus: 'IEC Approved',
      ethicsRef: `IEC-AIIA-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Recruiting',
      dataQualityScore: 98.0,
      complianceScore: 100.0,
      lastUpdate: 'Just now',
      startDate: '01 Oct 2026',
      targetEndDate: '30 Sep 2027',
      activeInterventions: 'Standardized classical formulation vs matching comparator',
      deviationsCount: 0,
      queriesCount: 0,
      overdueVisitsCount: 0,
      saeCount: 0,
      milestones: [
        { id: 'm1', title: 'Protocol Sign-off', date: 'Sep 2026', status: 'completed' },
        { id: 'm2', title: 'IEC Ethics Clearance', date: 'Oct 2026', status: 'completed' },
        { id: 'm3', title: 'Cohort Enrollment', date: 'In-progress', status: 'in_progress' },
      ],
    };

    onAddStudy(newStudy);
    setTitle('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">add_circle</span>
            <h3 className="font-bold text-base text-primary">Register New Clinical Protocol</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Study Identifier</label>
              <input
                type="text"
                value={studyId}
                onChange={(e) => setStudyId(e.target.value)}
                required
                className="w-full font-mono font-bold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Phase / Type</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="Phase II RCT">Phase II RCT</option>
                <option value="Phase III Double-Blind">Phase III Double-Blind</option>
                <option value="Panchakarma Protocol">Panchakarma Protocol</option>
                <option value="Observational Cohort">Observational Cohort</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-on-surface-variant block mb-1">Study Name / Title</label>
            <input
              type="text"
              placeholder="e.g. Standardized Rasayana in Metabolic Health..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="font-bold text-on-surface-variant block mb-1">Subtitle / Clinical Objectives</label>
            <input
              type="text"
              placeholder="Brief description of primary clinical endpoints"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Therapeutic Vertical</label>
              <select
                value={therapeuticArea}
                onChange={(e) => setTherapeuticArea(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="Ayurvedic Orthopedics & Rheumatology">Orthopedics & Rheumatology</option>
                <option value="Metabolic & Endocrine Disorders">Metabolic & Diabetes</option>
                <option value="Neuro-regenerative & Psychiatry">Neuro-regenerative</option>
                <option value="Immunology & Rasayana">Immunology & Rasayana</option>
                <option value="Pulmonology & Respiratory Medicine">Pulmonology</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full font-semibold bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="Panchakarma">Panchakarma</option>
                <option value="Kayachikitsa">Kayachikitsa</option>
                <option value="Dravyaguna">Dravyaguna</option>
                <option value="Shalya Tantra">Shalya Tantra</option>
                <option value="Kaumarbhritya">Kaumarbhritya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Principal Investigator</label>
              <input
                type="text"
                value={pi}
                onChange={(e) => setPi(e.target.value)}
                required
                className="w-full font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Target Subjects</label>
              <input
                type="number"
                value={targetSubjects}
                onChange={(e) => setTargetSubjects(Number(e.target.value))}
                required
                className="w-full font-mono font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface-variant block mb-1">Sites Count</label>
              <input
                type="number"
                value={sitesCount}
                onChange={(e) => setSitesCount(Number(e.target.value))}
                required
                className="w-full font-mono font-medium bg-surface-container-low border border-[#e2e8f0] rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
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
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-[#001d34] shadow-sm"
            >
              Save & Register Protocol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
