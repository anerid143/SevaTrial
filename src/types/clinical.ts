export type StudyStatus = 'Active' | 'Recruiting' | 'Delayed' | 'Completed' | 'On Hold' | 'Critical';

export type UserRole = 'Principal Investigator' | 'Safety Officer / DSMB' | 'Regulatory Auditor' | 'Clinical Coordinator';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress' | 'delayed' | 'pending';
  note?: string;
  badge?: string;
}

export interface SubjectRecord {
  id: string;
  subjectCode: string;
  site: string;
  age: number;
  gender: 'M' | 'F';
  baselineScore: number;
  currentScore: number;
  cycle: string;
  adherence: number;
  status: 'Active' | 'Follow-up' | 'Adverse Event' | 'Completed' | 'Withdrawn';
  enrolledDate: string;
}

export interface ClinicalSite {
  id: string;
  name: string;
  location: string;
  pi: string;
  target: number;
  enrolled: number;
  status: 'Active' | 'Initiating' | 'Monitoring Due' | 'Closed';
}

export interface ProtocolDeviation {
  id: string;
  date: string;
  subjectCode: string;
  type: 'Inclusion Criteria' | 'Visit Window' | 'Concomitant Medication' | 'Dosage Non-compliance';
  severity: 'Major' | 'Minor' | 'Critical';
  description: string;
  capaStatus: 'Approved' | 'Under Review' | 'Remediated';
}

export interface ClinicalStudy {
  id: string;
  ctriId: string;
  ctriStatus: 'Registered' | 'Pending Amendment' | 'Submitted' | 'Verified';
  protocolNumber: string;
  title: string;
  shortName: string;
  subtitle: string;
  therapeuticArea: string;
  department: string;
  phase: string;
  studyType: string;
  pi: string;
  piRole: string;
  coPi: string;
  sponsor: string;
  sitesCount: number;
  sites: string[];
  detailedSites?: ClinicalSite[];
  targetSubjects: number;
  enrolledSubjects: number;
  progressPercent: number;
  ethicsStatus: 'IEC Approved' | 'Pending Review' | 'Amendment Due';
  ethicsRef: string;
  iecMeetingDate?: string;
  iecRenewalDue?: string;
  status: StudyStatus;
  lastUpdate: string;
  startDate: string;
  targetEndDate: string;
  activeInterventions: string;
  milestones: Milestone[];
  deviationsCount: number;
  deviationsList?: ProtocolDeviation[];
  queriesCount: number;
  dataQualityScore: number;
  complianceScore: number;
  overdueVisitsCount: number;
  saeCount: number;
}

export interface SafetyRecord {
  id: string;
  reportId: string;
  studyId: string;
  studyName: string;
  protocolTitle: string;
  type: 'SAE' | 'ADR' | 'AE';
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Mild';
  incidentTitle: string;
  incidentDescription: string;
  subjectId: string;
  subjectAge: number;
  subjectGender: 'M' | 'F';
  subjectCohort: string;
  dateReported: string;
  deadlineHoursRemaining: number;
  isExpedited: boolean;
  causalityNaranjoScore: number;
  causalityRating: 'Definite' | 'Probable' | 'Possible' | 'Unlikely';
  whoUmcCategory: string;
  status: 'Active Dossier' | 'Medical Review' | 'Reported (On Time)' | 'Pending Review' | 'Closed / Compliant';
  interventionPaused: boolean;
  actionsTaken: string[];
  assignedMedicalMonitor: string;
  cdscoSubmissionStatus: 'Pending Sign-off' | 'Transmitted' | 'Acknowledged';
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  timeOnly: string;
  dateOnly: string;
  ipAddress: string;
  terminalLocation: string;
  operatorName: string;
  operatorRole: string;
  tokenId: string;
  recordIdentifier: string;
  category: 'Safety & SAE' | 'Protocol Modifications' | 'Consent & Enrollment' | 'User Permissions' | 'System Automated';
  actionContext: string;
  actionSummary: string;
  stateDeltaPrev: string;
  stateDeltaNew: string;
  cryptographicHash: string;
  signatureValid: boolean;
  merkleBlockNumber: number;
}

export interface InstitutionalAlert {
  id: string;
  studyId: string;
  category: 'Safety' | 'Regulatory' | 'Recruitment' | 'Data Quality' | 'Site Operations';
  severity: 'Critical' | 'Warning' | 'Informational';
  title: string;
  description: string;
  createdDate: string;
  deadlineNotice?: string;
  deadlineHoursRemaining?: number;
  assignedTo: string;
  status: 'Escalated to Chair' | 'In Triage' | 'Open / Unreviewed' | 'In Progress' | 'Resolved';
  actionLabel: string;
  actionType: 'sae_drawer' | 'ctri_sync' | 'dsmb_review' | 'cra_schedule' | 'funnel_analysis';
  statutoryMandate?: string;
  read: boolean;
}
