import React, { useState, useEffect } from 'react';
import { ClinicalStudy } from '../types/clinical';

interface ClinicalStudiesViewProps {
  studies: ClinicalStudy[];
  onSelectStudy: (studyId: string) => void;
  onOpenNewStudyModal: () => void;
  onOpenExportModal: () => void;
  initialStatusFilter?: string;
}

export const ClinicalStudiesView: React.FC<ClinicalStudiesViewProps> = ({
  studies,
  onSelectStudy,
  onOpenNewStudyModal,
  onOpenExportModal,
  initialStatusFilter,
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<string>(initialStatusFilter || 'All');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string>('');

  useEffect(() => {
    if (initialStatusFilter) {
      setActiveStatusTab(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  // Tab counts
  const tabCounts = {
    All: studies.length,
    Active: studies.filter((s) => s.status === 'Active').length,
    Recruiting: studies.filter((s) => s.status === 'Recruiting').length,
    Delayed: studies.filter((s) => s.status === 'Delayed').length,
    Completed: studies.filter((s) => s.status === 'Completed').length,
  };

  const filteredStudies = studies.filter((study) => {
    // Status filter
    if (activeStatusTab !== 'All' && study.status !== activeStatusTab) {
      return false;
    }

    // Phase filter
    if (selectedPhase !== 'All' && !study.phase.toLowerCase().includes(selectedPhase.toLowerCase())) {
      return false;
    }

    // Search filter
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match =
        study.id.toLowerCase().includes(q) ||
        study.title.toLowerCase().includes(q) ||
        study.shortName.toLowerCase().includes(q) ||
        study.pi.toLowerCase().includes(q) ||
        study.studyType.toLowerCase().includes(q) ||
        study.protocolNumber.toLowerCase().includes(q) ||
        study.ctriId.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setActiveStatusTab('All');
    setSelectedPhase('All');
    setSearchFilter('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-emerald-600 hover:text-emerald-900">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
              Clinical Studies Directory • CTMS Multi-Protocol Registry
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-secondary font-semibold">21 CFR Part 11 & CDSCO Audited</span>
          </div>
          <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold tracking-tight">
            Clinical Studies Directory
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Active trials registry, investigator protocols, target accrual tracking, and ethical approval statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-container border border-[#e2e8f0] hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export CTRI Manifest</span>
          </button>
          <button
            onClick={onOpenNewStudyModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#001d34] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add New Study</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Section */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-on-surface-variant uppercase mr-1">Status Filter:</span>
            {(['All', 'Active', 'Recruiting', 'Delayed', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeStatusTab === tab
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeStatusTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tabCounts[tab] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-primary">{filteredStudies.length}</strong> of {studies.length} Protocols
          </div>
        </div>

        {/* Phase Filter & Search Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2">
            <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">
              Search Clinical Studies
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search by Study ID (AYT-001...), protocol title, PI name, CTRI code..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs font-medium bg-surface-container-low border border-[#e2e8f0] text-primary rounded-xl py-2 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Phase Filter */}
          <div>
            <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">
              Phase Filter
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full text-xs font-semibold bg-surface-container-low border border-[#e2e8f0] text-primary rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer"
            >
              <option value="All">All Phases</option>
              <option value="Phase II">Phase II (RCT / Interventional)</option>
              <option value="Phase III">Phase III Double-Blind</option>
            </select>
          </div>
        </div>

        {/* Reset filter button if active */}
        {(activeStatusTab !== 'All' || selectedPhase !== 'All' || searchFilter) && (
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 font-medium">Filtered Results Active</span>
            <button
              onClick={clearFilters}
              className="text-secondary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Working Clinical Studies Table with ALL required columns */}
        <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-surface-container-low text-[11px] font-bold text-primary uppercase tracking-wider">
                <th className="py-3 px-3">Study ID</th>
                <th className="py-3 px-3">Study Name</th>
                <th className="py-3 px-3">PI</th>
                <th className="py-3 px-3">Study Type</th>
                <th className="py-3 px-3">Phase</th>
                <th className="py-3 px-3 text-center">Sites</th>
                <th className="py-3 px-3 text-center">Target</th>
                <th className="py-3 px-3 text-center">Enrolled</th>
                <th className="py-3 px-3 min-w-[120px]">Recruitment %</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Ethics Status</th>
                <th className="py-3 px-3">CTRI Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredStudies.map((study) => {
                const ratio = Math.round((study.enrolledSubjects / study.targetSubjects) * 100);
                const isAYT002 = study.id === 'AYT-002';
                return (
                  <tr
                    key={study.id}
                    onClick={() => onSelectStudy(study.id)}
                    className={`hover:bg-surface-container-low/70 transition-colors cursor-pointer ${
                      isAYT002 ? 'bg-[#f4f9fc]' : ''
                    }`}
                  >
                    {/* 1. Study ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-primary whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isAYT002 && <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>}
                        <span>{study.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block">{study.protocolNumber}</span>
                    </td>

                    {/* 2. Study Name */}
                    <td className="py-3.5 px-3 max-w-xs">
                      <span className="font-bold text-primary block truncate">{study.title}</span>
                      <span className="text-[11px] text-slate-500 truncate block">{study.subtitle}</span>
                    </td>

                    {/* 3. PI */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-medium text-primary block">{study.pi}</span>
                      <span className="text-[10px] text-slate-500">{study.department}</span>
                    </td>

                    {/* 4. Study Type */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-700">
                      <span className="truncate block max-w-[130px] font-medium" title={study.studyType}>
                        {study.studyType}
                      </span>
                    </td>

                    {/* 5. Phase */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-semibold text-primary">
                        {study.phase}
                      </span>
                    </td>

                    {/* 6. Sites */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {study.sitesCount}
                      </span>
                    </td>

                    {/* 7. Target */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-center font-semibold text-slate-700">
                      {study.targetSubjects}
                    </td>

                    {/* 8. Enrolled */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-center font-bold text-primary">
                      {study.enrolledSubjects}
                    </td>

                    {/* 9. Recruitment % */}
                    <td className="py-3.5 px-3 whitespace-nowrap min-w-[120px]">
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="font-bold">{ratio}%</span>
                        <span className="text-slate-400">({study.enrolledSubjects}/{study.targetSubjects})</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            study.status === 'Delayed' ? 'bg-amber-500' : 'bg-secondary'
                          }`}
                          style={{ width: `${ratio}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* 10. Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          study.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : study.status === 'Recruiting'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : study.status === 'Delayed'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {study.status}
                      </span>
                    </td>

                    {/* 11. Ethics Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          study.ethicsStatus === 'IEC Approved' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {study.ethicsStatus === 'IEC Approved' ? 'check_circle' : 'pending'}
                        </span>
                        <span>{study.ethicsStatus}</span>
                      </span>
                    </td>

                    {/* 12. CTRI Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          study.ctriStatus === 'Registered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {study.ctriStatus}
                      </span>
                    </td>

                    {/* Actions: Study Detail Button */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectStudy(study.id)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#001d34] transition-all flex items-center gap-1 shadow-sm ml-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        <span>Study Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
