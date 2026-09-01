// =============================================================================
// OpsGuard Type Definitions — Security, Risk & Continuous Learning Architecture
// =============================================================================

export type RiskDomain = 'customer_churn' | 'contract_deadline' | 'project_delay';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'resolved';

export type IncidentStatus = 
  | 'detecting'
  | 'investigating'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'actioned'
  | 'resolved';

export type IncidentState = 
  | 'PROPOSED'
  | 'CRITIC_REVIEWED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'MODIFIED'
  | 'EXECUTED';

// RBAC Roles & Permissions
export type UserRole = 'ADMIN' | 'OPERATIONS_LEAD' | 'ANALYST' | 'VIEWER';

export type SecurityPermission = 
  | 'ANALYZE_RISK'
  | 'VIEW_INCIDENT'
  | 'APPROVE_ACTION'
  | 'MODIFY_ACTION'
  | 'REJECT_ACTION'
  | 'RECORD_OUTCOME'
  | 'RUN_SIMULATION'
  | 'VIEW_HISTORICAL'
  | 'UPLOAD_DATASET'
  | 'TRAIN_MODEL'
  | 'ACTIVATE_MODEL'
  | 'MODIFY_WEIGHTS'
  | 'MANAGE_SECURITY';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 
    | 'AUTHENTICATION_SUCCESS'
    | 'AUTHORIZATION_FAILURE'
    | 'MODEL_HASH_VERIFIED'
    | 'MODEL_INTEGRITY_FAILURE'
    | 'MODEL_ACTIVATION_ATTEMPT'
    | 'MODEL_ACTIVATED'
    | 'DATASET_VALIDATION'
    | 'WEIGHT_CHANGE_ATTEMPT'
    | 'WEIGHTS_UPDATED'
    | 'APPROVAL_EXECUTED'
    | 'DUPLICATE_EXECUTION_PREVENTED'
    | 'PROMPT_INJECTION_DETECTED'
    | 'AUDIT_VERIFIED'
    | 'AUDIT_TAMPER_DETECTED'
    | 'PROTECTED_MODE_TRIGGERED';
  severity: SecuritySeverity;
  actor: string;
  actorRole: UserRole;
  details: string;
  ipAddress?: string;
}

export interface TamperVerificationResult {
  isIntegrityValid: boolean;
  checkedEventsCount: number;
  tamperedEventId?: string;
  message: string;
  verifiedAt: string;
}

// Continuous Learning Layer Types
export interface LearningRecord {
  id: string;
  caseId: string;
  domain: RiskDomain;
  entityName: string;
  inputFeatures: Record<string, string | number | boolean>;
  riskPrediction: RiskPrediction;
  aiRecommendation: Recommendation;
  criticResult?: CritiqueResult;
  humanDecision: 'APPROVED' | 'MODIFIED' | 'REJECTED';
  humanModificationText?: string;
  humanReason?: string;
  finalActionExecuted: string;
  actualOutcome?: 'retained' | 'churned' | 'resolved' | 'missed_deadline' | 'penalty_avoided' | 'penalty_incurred';
  financialSavedRupees?: number;
  actor: string;
  createdAt: string;
}

export type PatternStatus = 'OBSERVED' | 'VALIDATING' | 'VALIDATED' | 'REJECTED';

export interface DiscoveredPattern {
  id: string;
  domain: RiskDomain;
  signalPattern: string;
  aiDefaultRecommendation: string;
  preferredHumanIntervention: string;
  observedOutcome: string;
  caseCount: number;
  successRatePct: number;
  status: PatternStatus;
  lastObservedAt: string;
}

export interface FeedbackMetrics {
  totalReviewed: number;
  approvedCount: number;
  modifiedCount: number;
  rejectedCount: number;
  approvalRatePct: number;
  modificationRatePct: number;
  rejectionRatePct: number;
  domainBreakdown: Record<RiskDomain, {
    total: number;
    approved: number;
    modified: number;
    rejected: number;
    approvalRatePct: number;
  }>;
}

export interface LLMTrainingJob {
  jobId: string;
  status: 'IDLE' | 'ADAPTER_CONNECTED_STANDBY' | 'DATASET_PREPARED' | 'TRAINING' | 'COMPLETED';
  trainingRecordCount: number;
  datasetHash: string;
  backendNotes: string;
}

export type EvidenceCategory = 'verified' | 'user_provided' | 'inferred';

export interface RiskSignal {
  id: string;
  name: string;
  value: string | number;
  impact: 'HIGH' | 'MED' | 'LOW';
  description: string;
  weight: number;
  severityScore: number;
  confidence: number;
  source: 'user_input' | 'telemetry' | 'ticket_system' | 'contract_db' | 'project_pm';
}

export interface UsageDataPoint {
  period: string;
  eventCount: number;
  activeUsers: number;
  changePct?: number;
}

export interface TicketBreakdown {
  id: string;
  subject: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  priority: 'critical' | 'high' | 'medium' | 'low';
  ageDays: number;
  tags: string[];
}

export interface ContractMilestone {
  title: string;
  dueDate: string;
  daysRemaining: number;
  status: 'pending' | 'at_risk' | 'completed';
  penaltyAmount?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'usage_trend' | 'support_sentiment' | 'contract_timeline' | 'task_blockers';
  summary: string;
  significance: 'critical' | 'high' | 'medium';
  evidenceCategory: EvidenceCategory;
  reliabilityScore: number;
  usageData?: UsageDataPoint[];
  tickets?: TicketBreakdown[];
  milestones?: ContractMilestone[];
  blockers?: { taskName: string; owner: string; blockedDays: number; impact: string }[];
}

export interface NormalizedOperationalCase {
  caseId: string;
  domain: RiskDomain;
  entityName: string;
  entityId: string;
  structuredFeatures: Record<string, string | number | boolean>;
  textualContext: string;
  evidence: EvidenceItem[];
  timestamp: string;
  financialExposureRupees: number;
  contractValueARRRupees?: number;
  penaltyRupees?: number;
  projectValueRupees?: number;
  missingFields: string[];
  insufficientEvidence: boolean;
  guidance?: string;
  rawInputSource: 'structured_form' | 'free_text' | 'json' | 'csv_upload';
}

export interface RiskDriver {
  featureName: string;
  label: string;
  value: string | number;
  pointsContribution: number;
  percentageImpact: number;
  category: string;
}

export interface RiskPrediction {
  riskScore: number;
  probability: number;
  severity: SeverityLevel;
  confidence: number;
  financialExposureRupees: number;
  financialExposureFormatted: string;
  modelVersion: string;
  drivers: RiskDriver[];
  explanation: string;
  calculatedAt: string;
}

export interface ReasoningOutput {
  narrative: string;
  rootCauses: string[];
  contributingFactors: string[];
  keyInsight: string;
  uncertaintyNotes?: string;
  alternativeExplanations?: string[];
  confidenceScore: number;
  historicalAccuracy: number;
}

export interface RecommendedStep {
  id: number;
  title: string;
  detail: string;
  assignedRole?: string;
  priority?: 'critical' | 'high' | 'medium';
  deadlineHours?: number;
}

export interface Recommendation {
  id: string;
  actionTitle: string;
  steps: RecommendedStep[];
  expectedOutcome: string;
  expectedImpact: string;
  financialImpactFormatted: string;
  estimatedEffort: 'low' | 'medium' | 'high';
  timeline: string;
  requiredApprovalRoles: string[];
  status: 'proposed' | 'approved' | 'rejected' | 'modified';
  userNotes?: string;
  modifiedActionText?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface CritiqueResult {
  criticName: string;
  challenges: string[];
  unsupportedClaims: string[];
  riskOverestimations: string[];
  suggestedAdjustments: string[];
  overallVerdict: 'approved_with_notes' | 'revisions_required' | 'approved';
  critiqueTimestamp: string;
}

export interface AgentTimelineStep {
  agentName: 'Monitor Agent' | 'Input Normalizer' | 'Signal Agent' | 'Evidence Agent' | 'Risk Engine' | 'Reasoning Agent' | 'Action Planner' | 'Critic Agent' | 'Human Approval';
  status: 'completed' | 'in_progress' | 'pending';
  timestamp?: string;
  duration?: string;
  description: string;
  metaDetails?: string[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  eventType: 
    | 'risk_detected'
    | 'input_normalized'
    | 'evidence_compiled'
    | 'risk_scored'
    | 'reasoning_generated'
    | 'action_proposed'
    | 'critique_performed'
    | 'user_note_added'
    | 'action_modified'
    | 'action_approved'
    | 'action_rejected'
    | 'outcome_logged'
    | 'security_event';
  summary: string;
  details?: Record<string, unknown>;
  modelVersionUsed?: string;
  previousEventHash?: string;
  eventHash?: string;
}

export interface HistoricalCase {
  id: string;
  title: string;
  domain: RiskDomain;
  entityName: string;
  similarityPct: number;
  riskScore: number;
  primaryMetric: string;
  keyDrivers: string[];
  recommendationGiven: string;
  humanActionTaken: 'approved' | 'modified' | 'rejected';
  actualOutcome: string;
  outcomeCategory: 'retained' | 'churned' | 'resolved' | 'missed_deadline' | 'penalty_avoided' | 'penalty_incurred';
  financialSavedRupees: number;
  dateRecorded: string;
}

export interface OperationalIncident {
  id: string;
  title: string;
  entityName: string;
  entityType: 'Customer' | 'Contract' | 'Project';
  entityId: string;
  riskDomain: RiskDomain;
  riskScore: number;
  probability: number;
  severity: SeverityLevel;
  confidenceScore: number;
  primaryMetric: string;
  exposureAmountRupees: number;
  status: IncidentStatus;
  state?: IncidentState;
  idempotencyKey?: string;
  recordHash?: string;
  lastUpdated: string;
  owner?: string;
  prediction?: RiskPrediction;
  signals: RiskSignal[];
  evidence: EvidenceItem[];
  reasoning: ReasoningOutput;
  recommendation: Recommendation;
  critique?: CritiqueResult;
  agentTimeline: AgentTimelineStep[];
  auditHistory: AuditEvent[];
  similarCases?: HistoricalCase[];
  outcome?: OperationalOutcome;
}

export interface OperationalOutcome {
  id: string;
  caseId: string;
  incidentId: string;
  originalRiskScore: number;
  originalPredictionProbability: number;
  recommendedAction: string;
  humanDecision: 'approved' | 'modified' | 'rejected';
  userNotes?: string;
  finalActionExecuted: string;
  actualOutcome: 'retained' | 'churned' | 'resolved' | 'missed_deadline' | 'penalty_avoided' | 'penalty_incurred';
  financialSavedRupees: number;
  notes?: string;
  timestamp: string;
}

export interface DatasetColumnDef {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'text';
  sampleValues: (string | number)[];
  missingCount: number;
}

export interface TrainingDataset {
  datasetId: string;
  filename: string;
  domain: RiskDomain;
  recordCount: number;
  featureCount: number;
  columns: DatasetColumnDef[];
  targetColumn: string;
  missingValuesCount: number;
  duplicateRowsCount: number;
  classImbalanceRatio: string;
  isValid: boolean;
  validationNotes: string[];
  uploadedAt: string;
  datasetHash?: string;
}

export interface ModelVersion {
  modelId: string;
  domain: RiskDomain;
  name: string;
  version: string;
  trainingDatasetId: string;
  trainedDate: string;
  algorithm: 'Configurable Weighted Baseline' | 'Logistic Regression (Tabular)' | 'Random Forest Classifier' | 'XGBoost Risk Estimator';
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
  };
  featureImportance: { feature: string; importancePct: number }[];
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  status: 'active' | 'candidate' | 'deprecated';
  modelHash?: string;
  datasetHash?: string;
  featureSchemaHash?: string;
}

export interface OpsGuardMetrics {
  activeRisks: number;
  criticalRisks: number;
  pendingApprovals: number;
  potentialExposureRupees: number;
  resolvedThisWeek: number;
  avgResolutionDays: number;
}

export interface ModelWeightConfig {
  domain: RiskDomain;
  weights: Record<string, number>;
}

export interface OpsGuardSettings {
  churnThresholdPct: number;
  contractAlertWindowDays: number;
  projectDelayThresholdPct: number;
  realtimeCriticalAlerts: boolean;
  dailyDigestEmail: boolean;
  autoEscalateUnapprovedHours: number;
  currencySymbol: string;
  activeModelVersions: Record<RiskDomain, string>;
  modelWeights: Record<RiskDomain, Record<string, number>>;
}
