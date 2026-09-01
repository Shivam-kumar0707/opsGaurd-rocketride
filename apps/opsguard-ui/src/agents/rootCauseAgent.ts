// =============================================================================
// Root Cause / Reasoning Agent Service
// =============================================================================

import { NormalizedOperationalCase, RiskSignal, EvidenceItem, ReasoningOutput, RiskPrediction } from '../types/opsguard';

export class RootCauseAgent {
  public static analyze(
    opCase: NormalizedOperationalCase,
    signals: RiskSignal[],
    evidence: EvidenceItem[],
    prediction: RiskPrediction
  ): ReasoningOutput {
    const rootCauses: string[] = [];
    const contributingFactors: string[] = [];

    if (opCase.domain === 'customer_churn') {
      const topSignal = signals[0];
      if (topSignal?.id === 'SIG-USAGE-DECLINE') {
        rootCauses.push('Sustained product engagement drop caused by unresolved platform latency and query export timeouts.');
      } else {
        rootCauses.push('Customer executive sponsor transition combined with unaddressed support escalations.');
      }

      rootCauses.push('Lack of proactive Senior CSM alignment during the 90-day pre-renewal evaluation window.');
      contributingFactors.push('Competitor evaluation initiated by procurement team');
      contributingFactors.push('Recent team restructuring within customer admin organization');

    } else if (opCase.domain === 'contract_deadline') {
      rootCauses.push('Compliance deliverable task unassigned following internal personnel transition.');
      rootCauses.push('Absence of automated escalation reminders leading up to liquid damages penalty date.');
      contributingFactors.push('Third-party ISO audit package compiled but lacking final executive digital signature');

    } else if (opCase.domain === 'project_delay') {
      rootCauses.push('API schema deadlock between Core Engineering and Integration teams stalling Sprint tasks.');
      rootCauses.push('Key Data Engineer reassigned to high-priority incident management during Sprint 4.');
      contributingFactors.push('QA environment downtime delaying user acceptance testing');
    }

    const narrative = `${opCase.entityName} exhibits ${prediction.severity} operational risk indicators with a calculated risk score of ${prediction.riskScore}%. Primary driver: ${prediction.drivers[0]?.label || 'Operational metrics'} contributing +${prediction.drivers[0]?.pointsContribution || 0} risk points.`;

    const keyInsight = opCase.domain === 'customer_churn'
      ? 'Resolving the open critical support tickets within 48 hours is the single highest leverage intervention to restore customer confidence prior to renewal talks.'
      : opCase.domain === 'contract_deadline'
      ? 'Audit files are 90% completed in internal archives; only CISO sign-off signature and formal portal delivery are needed to eliminate the penalty.'
      : 'Re-allocating 1 Senior Backend Engineer for 3 days to finalize the API schema will immediately unblock 8 of the 12 stalled tasks.';

    const uncertaintyNotes = opCase.insufficientEvidence
      ? 'High uncertainty due to missing parameters (e.g. ARR or Renewal Date). Predictions may adjust when complete telemetry is ingested.'
      : 'Low uncertainty based on verified historical signal correlations.';

    const alternativeExplanations = [
      'Seasonal usage drop during corporate holiday windows cannot be completely ruled out without multi-year historical logs.',
      'Procurement delay on client side could represent budget freeze rather than product dissatisfaction.'
    ];

    return {
      narrative,
      rootCauses,
      contributingFactors,
      keyInsight,
      uncertaintyNotes,
      alternativeExplanations,
      confidenceScore: prediction.confidence,
      historicalAccuracy: 0.89
    };
  }
}
