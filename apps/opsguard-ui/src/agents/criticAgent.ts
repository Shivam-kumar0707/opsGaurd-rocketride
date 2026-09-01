// =============================================================================
// Critic Agent Service
// =============================================================================

import { NormalizedOperationalCase, RiskPrediction, Recommendation, CritiqueResult } from '../types/opsguard';

export class CriticAgent {
  public static critique(
    opCase: NormalizedOperationalCase,
    prediction: RiskPrediction,
    recommendation: Recommendation
  ): CritiqueResult {
    const challenges: string[] = [];
    const unsupportedClaims: string[] = [];
    const riskOverestimations: string[] = [];
    const suggestedAdjustments: string[] = [];

    if (opCase.domain === 'customer_churn') {
      const discountStep = recommendation.steps.find(s => s.detail.includes('discount'));
      if (discountStep) {
        challenges.push('CRITIC WARNING: Proposed 20% renewal discount is premature. Primary churn driver is platform latency & API timeouts, not pricing sensitivity.');
        suggestedAdjustments.push('Condition any financial discount upon successful 48-hour resolution of open critical support tickets TICK-901 and TICK-888.');
      }

      if (prediction.confidence > 0.90 && opCase.insufficientEvidence) {
        unsupportedClaims.push('Confidence score (91%) is over-optimistic given missing historical NPS data and incomplete renewal survey feedback.');
      }

    } else if (opCase.domain === 'contract_deadline') {
      const daysRemaining = Number(opCase.structuredFeatures.normalizedDaysRemaining ?? 999);
      if (daysRemaining < 3) {
        challenges.push('CRITIC WARNING: Proposed 48-hour timeline exceeds the remaining 3-day deadline buffer. Immediate 12-hour escalation required.');
        suggestedAdjustments.push('Compress CISO digital sign-off window from 24 hours to 6 hours max.');
      }

    } else if (opCase.domain === 'project_delay') {
      challenges.push('CRITIC NOTE: Engineering reallocation of 1 Senior Backend Engineer may cause minor velocity drop in parallel Sprint 5 tasks.');
      suggestedAdjustments.push('Ensure temporary assignment is capped strictly at 3 days with daily check-ins.');
    }

    const overallVerdict: CritiqueResult['overallVerdict'] = challenges.length > 0 ? 'approved_with_notes' : 'approved';

    return {
      criticName: 'OpsGuard Critic Agent v1.2',
      challenges,
      unsupportedClaims,
      riskOverestimations,
      suggestedAdjustments,
      overallVerdict,
      critiqueTimestamp: new Date().toISOString()
    };
  }
}
