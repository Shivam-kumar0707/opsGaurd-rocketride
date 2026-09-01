// =============================================================================
// Deterministic Baseline Risk Models
// =============================================================================

import { NormalizedOperationalCase, RiskPrediction, RiskDriver, SeverityLevel } from '../types/opsguard';
import { defaultModelWeights } from './config';

export class BaselineRiskModels {
  public static calculate(
    opCase: NormalizedOperationalCase,
    customWeights?: Record<string, number>
  ): RiskPrediction {
    const weights = customWeights || defaultModelWeights[opCase.domain] || {};

    let totalPoints = 0;
    const drivers: RiskDriver[] = [];

    if (opCase.domain === 'customer_churn') {
      const usageChange = Number(opCase.structuredFeatures.normalizedUsageChange ?? opCase.structuredFeatures.usageChangePct ?? 0);
      const tickets = Number(opCase.structuredFeatures.normalizedTickets ?? opCase.structuredFeatures.supportTicketCount ?? 0);
      const negativeTickets = Number(opCase.structuredFeatures.normalizedNegativeTickets ?? opCase.structuredFeatures.negativeSentimentTickets ?? 0);
      const renewalDays = Number(opCase.structuredFeatures.normalizedRenewalDays ?? opCase.structuredFeatures.daysUntilRenewal ?? 999);
      const nps = Number(opCase.structuredFeatures.nps ?? 7);
      const paymentDelay = Number(opCase.structuredFeatures.paymentDelayDays ?? 0);

      // 1. Usage Decline Driver (Weight: 25 max)
      const usageWeightMax = weights.usage_decline ?? 25;
      let usagePoints = 0;
      if (usageChange < 0) {
        usagePoints = Math.min(usageWeightMax, Math.round((Math.abs(usageChange) / 50) * usageWeightMax));
      }
      if (usagePoints > 0) {
        drivers.push({
          featureName: 'usage_decline',
          label: 'Usage Decline',
          value: `${usageChange}%`,
          pointsContribution: usagePoints,
          percentageImpact: Math.round((usagePoints / usageWeightMax) * 100),
          category: 'Telemetry'
        });
      }
      totalPoints += usagePoints;

      // 2. Support Escalation Driver (Weight: 20 max)
      const ticketWeightMax = weights.support_escalation ?? 20;
      const ticketPoints = Math.min(ticketWeightMax, Math.round((tickets / 5) * ticketWeightMax));
      if (ticketPoints > 0) {
        drivers.push({
          featureName: 'support_escalation',
          label: 'Support Escalation',
          value: `${tickets} tickets`,
          pointsContribution: ticketPoints,
          percentageImpact: Math.round((ticketPoints / ticketWeightMax) * 100),
          category: 'Support'
        });
      }
      totalPoints += ticketPoints;

      // 3. Negative Sentiment Driver (Weight: 20 max)
      const sentimentWeightMax = weights.negative_sentiment ?? 20;
      const sentimentPoints = Math.min(sentimentWeightMax, Math.round((negativeTickets / 4) * sentimentWeightMax));
      if (sentimentPoints > 0) {
        drivers.push({
          featureName: 'negative_sentiment',
          label: 'Negative Sentiment',
          value: `${negativeTickets} critical complaints`,
          pointsContribution: sentimentPoints,
          percentageImpact: Math.round((sentimentPoints / sentimentWeightMax) * 100),
          category: 'Support'
        });
      }
      totalPoints += sentimentPoints;

      // 4. Renewal Proximity Driver (Weight: 15 max)
      const renewalWeightMax = weights.renewal_proximity ?? 15;
      let renewalPoints = 0;
      if (renewalDays < 90) {
        renewalPoints = Math.min(renewalWeightMax, Math.round(((90 - renewalDays) / 90) * renewalWeightMax));
      }
      if (renewalPoints > 0) {
        drivers.push({
          featureName: 'renewal_proximity',
          label: 'Renewal Proximity',
          value: `${renewalDays} days remaining`,
          pointsContribution: renewalPoints,
          percentageImpact: Math.round((renewalPoints / renewalWeightMax) * 100),
          category: 'Contract'
        });
      }
      totalPoints += renewalPoints;

      // 5. NPS Driver (Weight: 10 max)
      const npsWeightMax = weights.nps_score ?? 10;
      let npsPoints = 0;
      if (nps < 7) {
        npsPoints = Math.round(((7 - nps) / 7) * npsWeightMax);
      }
      if (npsPoints > 0) {
        drivers.push({
          featureName: 'nps_score',
          label: 'NPS Score',
          value: `NPS ${nps}`,
          pointsContribution: npsPoints,
          percentageImpact: Math.round((npsPoints / npsWeightMax) * 100),
          category: 'Feedback'
        });
      }
      totalPoints += npsPoints;

      // 6. Payment Delay Driver (Weight: 10 max)
      const paymentWeightMax = weights.payment_delay ?? 10;
      let paymentPoints = 0;
      if (paymentDelay > 0) {
        paymentPoints = Math.min(paymentWeightMax, Math.round((paymentDelay / 30) * paymentWeightMax));
      }
      if (paymentPoints > 0) {
        drivers.push({
          featureName: 'payment_delay',
          label: 'Payment Delays',
          value: `${paymentDelay} days overdue`,
          pointsContribution: paymentPoints,
          percentageImpact: Math.round((paymentPoints / paymentWeightMax) * 100),
          category: 'Finance'
        });
      }
      totalPoints += paymentPoints;

    } else if (opCase.domain === 'contract_deadline') {
      const daysRemaining = Number(opCase.structuredFeatures.normalizedDaysRemaining ?? 999);
      const penalty = Number(opCase.structuredFeatures.normalizedPenalty ?? 0);
      const completionPct = Number(opCase.structuredFeatures.normalizedCompletionPct ?? 0);
      const isUnassigned = opCase.structuredFeatures.owner === 'Unassigned' || opCase.structuredFeatures.owner === undefined;

      // 1. Days Remaining (Weight: 35 max)
      const daysWeightMax = weights.days_remaining ?? 35;
      let daysPoints = 0;
      if (daysRemaining < 30) {
        daysPoints = Math.min(daysWeightMax, Math.round(((30 - daysRemaining) / 30) * daysWeightMax));
      }
      if (daysPoints > 0) {
        drivers.push({
          featureName: 'days_remaining',
          label: 'Deadline Proximity',
          value: `${daysRemaining} days left`,
          pointsContribution: daysPoints,
          percentageImpact: Math.round((daysPoints / daysWeightMax) * 100),
          category: 'Deadline'
        });
      }
      totalPoints += daysPoints;

      // 2. Penalty Severity (Weight: 25 max)
      const penaltyWeightMax = weights.penalty_severity ?? 25;
      let penaltyPoints = 0;
      if (penalty > 0) {
        penaltyPoints = Math.min(penaltyWeightMax, Math.round((penalty / 1000000) * penaltyWeightMax) || 15);
      }
      if (penaltyPoints > 0) {
        drivers.push({
          featureName: 'penalty_severity',
          label: 'Financial Penalty Severity',
          value: `₹${(penalty / 100000).toFixed(1)}L Penalty`,
          pointsContribution: penaltyPoints,
          percentageImpact: Math.round((penaltyPoints / penaltyWeightMax) * 100),
          category: 'Legal'
        });
      }
      totalPoints += penaltyPoints;

      // 3. Completion Gap (Weight: 20 max)
      const completionWeightMax = weights.completion_gap ?? 20;
      let completionPoints = 0;
      if (completionPct < 100) {
        completionPoints = Math.round(((100 - completionPct) / 100) * completionWeightMax);
      }
      if (completionPoints > 0) {
        drivers.push({
          featureName: 'completion_gap',
          label: 'Incomplete Deliverables',
          value: `${completionPct}% completed`,
          pointsContribution: completionPoints,
          percentageImpact: Math.round((completionPoints / completionWeightMax) * 100),
          category: 'Execution'
        });
      }
      totalPoints += completionPoints;

      // 4. Owner Unassigned (Weight: 10 max)
      const ownerWeightMax = weights.owner_unassigned ?? 10;
      if (isUnassigned) {
        drivers.push({
          featureName: 'owner_unassigned',
          label: 'Unassigned Compliance Lead',
          value: 'Unassigned',
          pointsContribution: ownerWeightMax,
          percentageImpact: 100,
          category: 'Governance'
        });
        totalPoints += ownerWeightMax;
      }

    } else if (opCase.domain === 'project_delay') {
      const delayDays = Number(opCase.structuredFeatures.normalizedDelayDays ?? 0);
      const blockedTasks = Number(opCase.structuredFeatures.normalizedBlockedTasks ?? 0);

      // 1. Delay Days (Weight: 35 max)
      const delayWeightMax = weights.delay_days ?? 35;
      const delayPoints = Math.min(delayWeightMax, Math.round((delayDays / 15) * delayWeightMax));
      if (delayPoints > 0) {
        drivers.push({
          featureName: 'delay_days',
          label: 'Estimated Schedule Delay',
          value: `${delayDays} days delay`,
          pointsContribution: delayPoints,
          percentageImpact: Math.round((delayPoints / delayWeightMax) * 100),
          category: 'Timeline'
        });
      }
      totalPoints += delayPoints;

      // 2. Blocked Tasks (Weight: 25 max)
      const blockedWeightMax = weights.blocked_tasks ?? 25;
      const blockedPoints = Math.min(blockedWeightMax, Math.round((blockedTasks / 15) * blockedWeightMax));
      if (blockedPoints > 0) {
        drivers.push({
          featureName: 'blocked_tasks',
          label: 'Blocked Sprint Tasks',
          value: `${blockedTasks} blocked tasks`,
          pointsContribution: blockedPoints,
          percentageImpact: Math.round((blockedPoints / blockedWeightMax) * 100),
          category: 'Blockers'
        });
      }
      totalPoints += blockedPoints;
    }

    const riskScore = Math.min(100, Math.max(5, totalPoints));
    const probability = Number((riskScore / 100).toFixed(2));

    let severity: SeverityLevel = 'low';
    if (riskScore >= 75) severity = 'critical';
    else if (riskScore >= 60) severity = 'high';
    else if (riskScore >= 40) severity = 'medium';

    const confidence = opCase.insufficientEvidence ? 0.65 : 0.91;

    // Financial Exposure calculation
    const exposureAmount = opCase.financialExposureRupees || (riskScore * 25000);
    const exposureFormatted = exposureAmount >= 10000000
      ? `₹${(exposureAmount / 10000000).toFixed(2)} Cr`
      : exposureAmount >= 100000
      ? `₹${(exposureAmount / 100000).toFixed(1)} Lakhs`
      : `₹${exposureAmount.toLocaleString('en-IN')}`;

    // Sort drivers by highest points contribution
    drivers.sort((a, b) => b.pointsContribution - a.pointsContribution);

    return {
      riskScore,
      probability,
      severity,
      confidence,
      financialExposureRupees: exposureAmount,
      financialExposureFormatted: exposureFormatted,
      modelVersion: `baseline-${opCase.domain}-v1`,
      drivers,
      explanation: `Deterministic risk score of ${riskScore}% calculated based on ${drivers.length} active risk drivers. Top contributor: ${drivers[0]?.label || 'General indicators'} (+${drivers[0]?.pointsContribution || 0} points).`,
      calculatedAt: new Date().toISOString()
    };
  }
}
