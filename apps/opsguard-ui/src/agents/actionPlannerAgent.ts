// =============================================================================
// Action Planner Agent Service
// =============================================================================

import { NormalizedOperationalCase, RiskPrediction, ReasoningOutput, Recommendation, RecommendedStep } from '../types/opsguard';
import { RagOperationalMemory } from '../learning/ragOperationalMemory';

export class ActionPlannerAgent {
  public static planActions(
    opCase: NormalizedOperationalCase,
    prediction: RiskPrediction,
    reasoning: ReasoningOutput
  ): Recommendation {
    const ragContext = RagOperationalMemory.retrieveContext(opCase.domain, opCase.entityName);
    const steps: RecommendedStep[] = [];
    let actionTitle = '';
    let expectedOutcome = '';
    let expectedImpact = '';
    let timeline = '2-3 business days';
    const requiredApprovalRoles: string[] = ['Operations Lead'];

    if (opCase.domain === 'customer_churn') {
      const valPattern = ragContext.validatedPatterns.find(p => p.status === 'VALIDATED');
      actionTitle = valPattern 
        ? valPattern.preferredHumanIntervention
        : 'Executive Account Recovery & Technical SLA Escalation';
      steps.push({
        id: 1,
        title: 'Assign Senior CSM Lead',
        detail: `Reassign Senior CSM lead to directly manage ${opCase.entityName} account recovery.`,
        assignedRole: 'CSM Manager',
        priority: 'high',
        deadlineHours: 24
      });
      steps.push({
        id: 2,
        title: 'Engineering Emergency Bug SLA Escalation',
        detail: 'Escalate open critical performance tickets to Core Platform Engineering with a 48-hour SLA mandate.',
        assignedRole: 'VP Engineering',
        priority: 'critical',
        deadlineHours: 48
      });
      steps.push({
        id: 3,
        title: 'Executive Sponsor Review Call',
        detail: 'Schedule VP-level alignment call to review technical resolution roadmap and confirm success metrics.',
        assignedRole: 'VP Sales',
        priority: 'high',
        deadlineHours: 72
      });
      steps.push({
        id: 4,
        title: 'Approved Renewal Recovery Terms',
        detail: 'Offer an approved 20% renewal discount for 90 days plus complimentary priority support tier.',
        assignedRole: 'Finance Director',
        priority: 'medium',
        deadlineHours: 96
      });

      expectedOutcome = `Reduce churn probability score from ${prediction.riskScore}% to <35%.`;
      expectedImpact = `Protect ${prediction.financialExposureFormatted} annual contract value.`;
      requiredApprovalRoles.push('Finance Director', 'VP Sales');

    } else if (opCase.domain === 'contract_deadline') {
      actionTitle = 'Fast-Track Emergency Legal & CISO Sign-Off';
      steps.push({
        id: 1,
        title: 'Assign Legal Operations Owner',
        detail: `Assign primary Legal Counsel lead for ${opCase.entityName} compliance deliverable.`,
        assignedRole: 'Legal Ops Lead',
        priority: 'critical',
        deadlineHours: 12
      });
      steps.push({
        id: 2,
        title: 'Obtain CISO Digital Signature',
        detail: 'Route pre-compiled compliance audit package to CISO for priority DocuSign sign-off.',
        assignedRole: 'CISO',
        priority: 'critical',
        deadlineHours: 24
      });
      steps.push({
        id: 3,
        title: 'Formal Client Portal Delivery',
        detail: 'Submit verified compliance package via client vendor portal and log delivery confirmation receipt.',
        assignedRole: 'Legal Counsel',
        priority: 'high',
        deadlineHours: 36
      });

      expectedOutcome = `Completely avoid ${prediction.financialExposureFormatted} financial penalty.`;
      expectedImpact = 'Fulfills contractual obligation ahead of deadline.';
      timeline = '24-48 hours';
      requiredApprovalRoles.push('Head of Legal', 'CISO');

    } else if (opCase.domain === 'project_delay') {
      actionTitle = 'Engineering Swat Team Allocation & Blocker Unblock';
      steps.push({
        id: 1,
        title: 'Temporary Senior Engineer Reallocation',
        detail: 'Reassign 1 Senior Backend Engineer for 3 days to finalize integration API schema.',
        assignedRole: 'Engineering Manager',
        priority: 'critical',
        deadlineHours: 24
      });
      steps.push({
        id: 2,
        title: 'Daily Standup Blocker Sync',
        detail: 'Institute daily 15-minute blocker review standup until sprint velocity recovers.',
        assignedRole: 'Project Manager',
        priority: 'high',
        deadlineHours: 24
      });

      expectedOutcome = 'Recover 8 days of schedule drift, placing delivery within safe buffer margin.';
      expectedImpact = 'Protects project milestone billing payment.';
      timeline = '3-5 business days';
      requiredApprovalRoles.push('VP Engineering');
    }

    return {
      id: `REC-${Date.now()}`,
      actionTitle,
      steps,
      expectedOutcome,
      expectedImpact,
      financialImpactFormatted: `Protect ${prediction.financialExposureFormatted}`,
      estimatedEffort: 'medium',
      timeline,
      requiredApprovalRoles,
      status: 'proposed'
    };
  }
}
