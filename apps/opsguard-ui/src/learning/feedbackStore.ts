// =============================================================================
// Human Feedback Store & Learning Record Repository
// =============================================================================

import { LearningRecord, RiskDomain, OperationalIncident } from '../types/opsguard';
import { TamperEvidentAudit } from '../security/tamperEvidentAudit';

export class FeedbackStore {
  private static records: LearningRecord[] = [
    {
      id: 'LRN-101',
      caseId: 'INC-2026-001',
      domain: 'customer_churn',
      entityName: 'Acme Enterprise Corp',
      inputFeatures: { arrRupees: 2400000, usageChangePct: -42, supportTicketCount: 5, negativeSentimentTickets: 4, daysUntilRenewal: 23, nps: 3 },
      riskPrediction: {
        riskScore: 83,
        probability: 0.83,
        severity: 'critical',
        confidence: 0.91,
        financialExposureRupees: 2400000,
        financialExposureFormatted: '₹24.0 Lakhs',
        modelVersion: 'churn_weighted_v1.2',
        drivers: [
          { featureName: 'usage_change', label: 'Usage Decline (-42%)', value: -42, pointsContribution: 24, percentageImpact: 29, category: 'Usage' },
          { featureName: 'ticket_sentiment', label: 'Negative Support Tickets (4)', value: 4, pointsContribution: 17, percentageImpact: 20, category: 'Support' }
        ],
        explanation: 'Critical churn risk driven by rapid usage drop (-42%) and 4 negative sentiment tickets.',
        calculatedAt: '2026-09-01'
      },
      aiRecommendation: {
        id: 'REC-101',
        actionTitle: 'Offer 15% renewal discount & deploy executive sponsor',
        steps: [{ id: 1, title: 'Commercial Discount', detail: 'Offer 15% discount' }],
        expectedOutcome: 'Retain ARR',
        expectedImpact: 'High',
        financialImpactFormatted: '₹24.0 Lakhs',
        estimatedEffort: 'medium',
        timeline: ' Immediate',
        requiredApprovalRoles: ['OPERATIONS_LEAD'],
        status: 'modified'
      },
      humanDecision: 'MODIFIED',
      humanModificationText: 'Escalate to Engineering Lead to fix cloud API latency; hold commercial discount',
      humanReason: 'Primary root cause is technical API downtime, not pricing. Offering discount without fixing API fails.',
      finalActionExecuted: 'Escalate to Engineering Lead to fix cloud API latency; hold commercial discount',
      actualOutcome: 'retained',
      financialSavedRupees: 2400000,
      actor: 'Sarah (Operations Lead)',
      createdAt: '2026-08-28'
    },
    {
      id: 'LRN-102',
      caseId: 'INC-2026-002',
      domain: 'contract_deadline',
      entityName: 'Nexus Tech SLA Obligation',
      inputFeatures: { contractValue: 4000000, penaltyAmountRupees: 800000, daysRemaining: 7, completionPct: 45 },
      riskPrediction: {
        riskScore: 76,
        probability: 0.76,
        severity: 'high',
        confidence: 0.88,
        financialExposureRupees: 800000,
        financialExposureFormatted: '₹8.0 Lakhs',
        modelVersion: 'contract_deadline_v1.0',
        drivers: [
          { featureName: 'days_remaining', label: 'Short Window (7 days remaining)', value: 7, pointsContribution: 30, percentageImpact: 39, category: 'Timeline' }
        ],
        explanation: 'High penalty risk due to 7 days remaining with only 45% completion.',
        calculatedAt: '2026-09-01'
      },
      aiRecommendation: {
        id: 'REC-102',
        actionTitle: 'Approve 20-hour engineering overtime surge & submit partial milestone waiver',
        steps: [{ id: 1, title: 'Overtime Surge', detail: 'Approve 20 hours' }],
        expectedOutcome: 'Prevent ₹8L penalty',
        expectedImpact: 'High',
        financialImpactFormatted: '₹8.0 Lakhs',
        estimatedEffort: 'high',
        timeline: ' Immediate',
        requiredApprovalRoles: ['OPERATIONS_LEAD'],
        status: 'approved'
      },
      humanDecision: 'APPROVED',
      humanReason: 'Overtime surge approved as recommended to hit milestone target before deadline.',
      finalActionExecuted: 'Approve 20-hour engineering overtime surge & submit partial milestone waiver',
      actualOutcome: 'penalty_avoided',
      financialSavedRupees: 800000,
      actor: 'Sarah (Operations Lead)',
      createdAt: '2026-08-29'
    },
    {
      id: 'LRN-103',
      caseId: 'INC-2026-003',
      domain: 'project_delay',
      entityName: 'Project Alpha Migration',
      inputFeatures: { projectValue: 6500000, delayDays: 11, blockedTaskCount: 12 },
      riskPrediction: {
        riskScore: 68,
        probability: 0.68,
        severity: 'high',
        confidence: 0.85,
        financialExposureRupees: 6500000,
        financialExposureFormatted: '₹65.0 Lakhs',
        modelVersion: 'project_delay_v1.1',
        drivers: [
          { featureName: 'blocked_tasks', label: 'High Blocked Tasks (12 tasks)', value: 12, pointsContribution: 25, percentageImpact: 37, category: 'Execution' }
        ],
        explanation: 'Delivery risk driven by 12 blocked tasks on critical migration path.',
        calculatedAt: '2026-09-01'
      },
      aiRecommendation: {
        id: 'REC-103',
        actionTitle: 'Reassign 2 Senior DevOps Engineers to unblock migration pipeline',
        steps: [{ id: 1, title: 'DevOps Reassignment', detail: 'Reassign 2 engineers' }],
        expectedOutcome: 'Recover 6 days schedule drift',
        expectedImpact: 'Medium',
        financialImpactFormatted: '₹65.0 Lakhs',
        estimatedEffort: 'medium',
        timeline: 'Within 24 Hours',
        requiredApprovalRoles: ['OPERATIONS_LEAD'],
        status: 'approved'
      },
      humanDecision: 'APPROVED',
      humanReason: 'Reassigning DevOps engineers is required to clear pipeline bottlenecks.',
      finalActionExecuted: 'Reassign 2 Senior DevOps Engineers to unblock migration pipeline',
      actualOutcome: 'resolved',
      financialSavedRupees: 6500000,
      actor: 'Sarah (Operations Lead)',
      createdAt: '2026-08-30'
    }
  ];

  public static addRecord(
    incident: OperationalIncident,
    humanDecision: 'APPROVED' | 'MODIFIED' | 'REJECTED',
    actor: string,
    humanReason?: string,
    humanModificationText?: string
  ): LearningRecord {
    const record: LearningRecord = {
      id: `LRN-${Date.now().toString().slice(-4)}`,
      caseId: incident.id,
      domain: incident.riskDomain,
      entityName: incident.entityName,
      inputFeatures: incident.prediction?.drivers ? Object.fromEntries(incident.prediction.drivers.map(d => [d.featureName, d.value])) : {},
      riskPrediction: incident.prediction || {
        riskScore: incident.riskScore,
        probability: incident.probability,
        severity: incident.severity,
        confidence: incident.confidenceScore,
        financialExposureRupees: incident.exposureAmountRupees,
        financialExposureFormatted: `₹${(incident.exposureAmountRupees / 100000).toFixed(1)} Lakhs`,
        modelVersion: 'active_v1',
        drivers: [],
        explanation: incident.title,
        calculatedAt: new Date().toISOString()
      },
      aiRecommendation: incident.recommendation,
      criticResult: incident.critique,
      humanDecision,
      humanModificationText,
      humanReason,
      finalActionExecuted: humanDecision === 'MODIFIED' && humanModificationText ? humanModificationText : incident.recommendation.actionTitle,
      actor,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.records.unshift(record);

    TamperEvidentAudit.appendEvent(
      actor,
      'OPERATIONS_LEAD',
      'user_note_added',
      `Learning Record created: Decision = ${humanDecision} for ${incident.entityName}.${humanReason ? ` Reason: "${humanReason}"` : ''}`,
      { recordId: record.id, domain: record.domain, humanDecision }
    );

    return record;
  }

  public static getRecords(): LearningRecord[] {
    return this.records;
  }
}
