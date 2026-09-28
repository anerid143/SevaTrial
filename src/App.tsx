import { useState } from 'react';
import { UserRole, ClinicalStudy, SafetyRecord, AuditRecord, InstitutionalAlert } from './types/clinical';
import { initialStudies, initialSafetyRecords, initialAuditRecords, initialAlerts } from './data/clinicalData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClinicalStudiesView } from './components/ClinicalStudiesView';
import { StudyDetailView } from './components/StudyDetailView';
import { PharmacovigilanceView } from './components/PharmacovigilanceView';
import { AuditTrailView } from './components/AuditTrailView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { SaeSignoffDrawer } from './components/SaeSignoffDrawer';
import { NewStudyModal } from './components/NewStudyModal';
import { NewAeModal } from './components/NewAeModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('dashboard');
  const [selectedStudyId, setSelectedStudyId] = useState<string>('AYT-002');
  const [activeRole, setActiveRole] = useState<UserRole>('Principal Investigator');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clinicalStudiesFilter, setClinicalStudiesFilter] = useState<string>('All');
  const [alertsFilter, setAlertsFilter] = useState<string>('All');

  // Domain Datasets
  const [studies, setStudies] = useState<ClinicalStudy[]>(initialStudies);
  const [safetyRecords, setSafetyRecords] = useState<SafetyRecord[]>(initialSafetyRecords);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(initialAuditRecords);
  const [alerts, setAlerts] = useState<InstitutionalAlert[]>(initialAlerts);

  // Modals & Drawers
  const [saeDrawerRecordId, setSaeDrawerRecordId] = useState<string | null>(null);
  const [isNewStudyModalOpen, setIsNewStudyModalOpen] = useState<boolean>(false);
  const [isNewAeModalOpen, setIsNewAeModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Navigation router with filter support
  const handleNavigate = (path: string, studyId?: string, filter?: string) => {
    if (studyId) {
      setSelectedStudyId(studyId);
      setCurrentPath('study-detail');
    } else {
      if (path === 'clinical-studies' && filter) {
        setClinicalStudiesFilter(filter);
      }
      if (path === 'alerts' && filter) {
        setAlertsFilter(filter);
      }
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Study Handler
  const handleAddStudy = (newStudy: ClinicalStudy) => {
    setStudies((prev) => [newStudy, ...prev]);

    // Add Audit Trail entry
    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-GB') + ' IST',
      timeOnly: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      dateOnly: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ipAddress: '10.14.82.112',
      terminalLocation: 'AIIA Intranet • Directorate Portal',
      operatorName: activeRole === 'Principal Investigator' ? 'Dr. S. Patel, MD' : 'Authorized Operator',
      operatorRole: activeRole,
      tokenId: 'Token #e-8841',
      recordIdentifier: `NEW-STUDY-${newStudy.id}`,
      category: 'Protocol Modifications',
      actionSummary: `New Clinical Trial Registered: ${newStudy.id}`,
      actionContext: `Protocol ${newStudy.protocolNumber} entered into institutional registry. Target: ${newStudy.targetSubjects} subjects.`,
      stateDeltaPrev: 'Registry: Not Registered',
      stateDeltaNew: `Registry: Active Protocol Registered (${newStudy.id})`,
      cryptographicHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      signatureValid: true,
      merkleBlockNumber: auditRecords[0]?.merkleBlockNumber ? auditRecords[0].merkleBlockNumber + 1 : 849202,
    };

    setAuditRecords((prev) => [newAudit, ...prev]);
  };

  // Add Safety Record Handler
  const handleAddAeRecord = (newRecord: SafetyRecord) => {
    setSafetyRecords((prev) => [newRecord, ...prev]);

    // If SAE, create critical alert
    if (newRecord.type === 'SAE') {
      const newAlert: InstitutionalAlert = {
        id: `alt-${Date.now()}`,
        studyId: newRecord.studyId,
        category: 'Safety',
        severity: 'Critical',
        title: `SAE Reported in ${newRecord.studyId}: ${newRecord.reportId}`,
        description: newRecord.incidentTitle,
        createdDate: new Date().toLocaleString('en-GB') + ' IST',
        deadlineNotice: 'Deadline: 24h statutory window',
        deadlineHoursRemaining: 24,
        assignedTo: 'Medical Safety Officer & DSMB',
        status: 'Open / Unreviewed',
        actionLabel: 'Triage & Sign-off',
        actionType: 'sae_drawer',
        statutoryMandate: 'Schedule Y Rule 122DAB',
        read: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  // Sign & Transmit SAE-1024
  const handleSignAndTransmit = (reportId: string, signerName: string, role: string, reason: string) => {
    // Update safety record
    setSafetyRecords((prev) =>
      prev.map((rec) =>
        rec.reportId === reportId
          ? {
              ...rec,
              status: 'Reported (On Time)',
              cdscoSubmissionStatus: 'Transmitted',
              deadlineHoursRemaining: 0,
            }
          : rec
      )
    );

    // Update alert
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.studyId === 'AYT-002' && alt.category === 'Safety'
          ? {
              ...alt,
              status: 'Resolved',
              title: `${alt.title} — Transmitted to CDSCO`,
              deadlineNotice: 'Statutory Transmission Complete',
              deadlineHoursRemaining: 0,
            }
          : alt
      )
    );

    // Add 21 CFR Part 11 Audit Record
    const newAudit: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-GB') + ' IST',
      timeOnly: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      dateOnly: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ipAddress: '10.14.80.2',
      terminalLocation: 'Directorate Secure Terminal • Medical Superintendent Office',
      operatorName: signerName,
      operatorRole: role,
      tokenId: 'Token #e-9901 (FIPS 140-2 Level 3)',
      recordIdentifier: `${reportId}-TRANSMIT`,
      category: 'Safety & SAE',
      actionSummary: `21 CFR Part 11 Electronic Signature Sign-off & CDSCO Transmission (${reportId})`,
      actionContext: reason,
      stateDeltaPrev: 'CDSCO Status: Pending Sign-off (12h SLA remaining)',
      stateDeltaNew: 'CDSCO Status: Transmitted & Legally Executed under Schedule Y',
      cryptographicHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      signatureValid: true,
      merkleBlockNumber: auditRecords[0]?.merkleBlockNumber ? auditRecords[0].merkleBlockNumber + 1 : 849202,
    };

    setAuditRecords((prev) => [newAudit, ...prev]);
  };

  // Mark all alerts as read
  const handleMarkAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  // Triage alert
  const handleTriageAlert = (alertId: string, actionType: string) => {
    if (actionType === 'ctri_sync') {
      showToast('CTRI Gateway Synchronized! Protocol Amendment v2.1 pushed to National Registry.');
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved', read: true } : a))
      );
    } else if (actionType === 'dsmb_review') {
      showToast('Data Safety Monitoring Board emergency convening notice dispatched to all members.');
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'In Progress', read: true } : a))
      );
    } else if (actionType === 'cra_schedule') {
      showToast('CRA Lead Dr. Ananya Sen assigned. Site visit scheduled for tomorrow 10:00 AM.');
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'In Progress', read: true } : a))
      );
    } else if (actionType === 'funnel_analysis') {
      handleNavigate('clinical-studies', 'AYT-002');
    } else if (actionType === 'dcgi_escalate') {
      showToast('Escalated SAE incident report to DCGI Licensing Authority under Rule 122DAB.');
    }
  };

  const activeSaeRecord = safetyRecords.find((r) => r.id === saeDrawerRecordId) || safetyRecords[0];
  const activeStudy = studies.find((s) => s.id === selectedStudyId) || studies[0];

  const saeAlertCount = safetyRecords.filter((r) => r.type === 'SAE' && r.status !== 'Reported (On Time)').length;
  const criticalAlertCount = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] font-sans flex">
      {/* Fixed Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        saeAlertCount={saeAlertCount}
        criticalAlertCount={criticalAlertCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        <Header
          currentPath={currentPath}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alerts={alerts}
          onOpenNewStudyModal={() => setIsNewStudyModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenNewAeModal={() => setIsNewAeModalOpen(true)}
        />

        <main className="flex-1 pb-16">
          {currentPath === 'dashboard' && (
            <DashboardView
              studies={studies}
              alerts={alerts}
              safetyRecords={safetyRecords}
              onNavigate={handleNavigate}
              onOpenNewStudyModal={() => setIsNewStudyModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenSaeDrawer={(recordId) => setSaeDrawerRecordId(recordId)}
            />
          )}

          {currentPath === 'clinical-studies' && (
            <ClinicalStudiesView
              studies={studies}
              onSelectStudy={(id) => handleNavigate('clinical-studies', id)}
              onOpenNewStudyModal={() => setIsNewStudyModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              initialStatusFilter={clinicalStudiesFilter}
            />
          )}

          {currentPath === 'study-detail' && (
            <StudyDetailView
              study={activeStudy}
              onBack={() => handleNavigate('clinical-studies')}
              onOpenSaeDrawer={(recordId) => setSaeDrawerRecordId(recordId)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              safetyRecords={safetyRecords}
              auditRecords={auditRecords}
            />
          )}

          {currentPath === 'pharmacovigilance' && (
            <PharmacovigilanceView
              safetyRecords={safetyRecords}
              onOpenSaeDrawer={(recordId) => setSaeDrawerRecordId(recordId)}
              onOpenNewAeModal={() => setIsNewAeModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {currentPath === 'audit-trail' && (
            <AuditTrailView
              auditRecords={auditRecords}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {currentPath === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onMarkAllAsRead={handleMarkAllAlertsAsRead}
              onTriageAlert={handleTriageAlert}
              onOpenSaeDrawer={(recordId) => setSaeDrawerRecordId(recordId)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              initialCategory={alertsFilter}
            />
          )}

          {currentPath === 'reports' && (
            <ReportsView
              studies={studies}
              safetyRecords={safetyRecords}
              alerts={alerts}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {currentPath === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Slide-over Drawer for SAE Electronic Sign-off */}
      <SaeSignoffDrawer
        isOpen={saeDrawerRecordId !== null}
        onClose={() => setSaeDrawerRecordId(null)}
        record={activeSaeRecord}
        onSignAndTransmit={handleSignAndTransmit}
      />

      {/* New Study Modal */}
      <NewStudyModal
        isOpen={isNewStudyModalOpen}
        onClose={() => setIsNewStudyModalOpen(false)}
        onAddStudy={handleAddStudy}
      />

      {/* New Adverse Event Modal */}
      <NewAeModal
        isOpen={isNewAeModalOpen}
        onClose={() => setIsNewAeModalOpen(false)}
        onAddRecord={handleAddAeRecord}
      />

      {/* Export Bundle Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-3 rounded-2xl shadow-2xl border border-secondary/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">info</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
