// =============================================================================
// What-If Risk Simulator Service
// =============================================================================

import { NormalizedOperationalCase, RiskPrediction } from '../types/opsguard';
import { RiskEngine } from './riskEngine';

export interface SimulationOverridePayload {
  usageChangePct?: number;
  supportTicketCount?: number;
  negativeSentimentTickets?: number;
  daysUntilRenewal?: number;
  daysRemaining?: number;
  penaltyAmountRupees?: number;
  delayDays?: number;
  blockedTaskCount?: number;
}

export interface SimulationResult {
  baselinePrediction: RiskPrediction;
  simulatedPrediction: RiskPrediction;
  scoreDelta: number; // e.g. -26 points
  probabilityDelta: number;
  exposureDeltaRupees: number;
  modifiedFields: string[];
}

export class RiskSimulator {
  public static simulate(
    originalCase: NormalizedOperationalCase,
    overrides: SimulationOverridePayload
  ): SimulationResult {
    const baselinePrediction = RiskEngine.evaluate(originalCase);

    // Create shallow copy of case with modified features
    const modifiedFeatures = { ...originalCase.structuredFeatures };
    const modifiedFields: string[] = [];

    if (overrides.usageChangePct !== undefined) {
      modifiedFeatures.normalizedUsageChange = overrides.usageChangePct;
      modifiedFeatures.usageChangePct = overrides.usageChangePct;
      modifiedFields.push(`Usage Change (${overrides.usageChangePct}%)`);
    }

    if (overrides.supportTicketCount !== undefined) {
      modifiedFeatures.normalizedTickets = overrides.supportTicketCount;
      modifiedFeatures.supportTicketCount = overrides.supportTicketCount;
      modifiedFields.push(`Support Tickets (${overrides.supportTicketCount})`);
    }

    if (overrides.negativeSentimentTickets !== undefined) {
      modifiedFeatures.normalizedNegativeTickets = overrides.negativeSentimentTickets;
      modifiedFeatures.negativeSentimentTickets = overrides.negativeSentimentTickets;
      modifiedFields.push(`Negative Sentiment (${overrides.negativeSentimentTickets})`);
    }

    if (overrides.daysUntilRenewal !== undefined) {
      modifiedFeatures.normalizedRenewalDays = overrides.daysUntilRenewal;
      modifiedFeatures.daysUntilRenewal = overrides.daysUntilRenewal;
      modifiedFields.push(`Renewal Proximity (${overrides.daysUntilRenewal} days)`);
    }

    if (overrides.daysRemaining !== undefined) {
      modifiedFeatures.normalizedDaysRemaining = overrides.daysRemaining;
      modifiedFeatures.daysRemaining = overrides.daysRemaining;
      modifiedFields.push(`Deadline Proximity (${overrides.daysRemaining} days)`);
    }

    if (overrides.penaltyAmountRupees !== undefined) {
      modifiedFeatures.normalizedPenalty = overrides.penaltyAmountRupees;
      modifiedFeatures.penaltyAmountRupees = overrides.penaltyAmountRupees;
      modifiedFields.push(`Penalty Amount (₹${(overrides.penaltyAmountRupees / 100000).toFixed(1)}L)`);
    }

    if (overrides.delayDays !== undefined) {
      modifiedFeatures.normalizedDelayDays = overrides.delayDays;
      modifiedFeatures.delayDays = overrides.delayDays;
      modifiedFields.push(`Schedule Delay (${overrides.delayDays} days)`);
    }

    if (overrides.blockedTaskCount !== undefined) {
      modifiedFeatures.normalizedBlockedTasks = overrides.blockedTaskCount;
      modifiedFeatures.blockedTaskCount = overrides.blockedTaskCount;
      modifiedFields.push(`Blocked Tasks (${overrides.blockedTaskCount})`);
    }

    const simulatedCase: NormalizedOperationalCase = {
      ...originalCase,
      structuredFeatures: modifiedFeatures
    };

    const simulatedPrediction = RiskEngine.evaluate(simulatedCase);

    const scoreDelta = simulatedPrediction.riskScore - baselinePrediction.riskScore;
    const probabilityDelta = Number((simulatedPrediction.probability - baselinePrediction.probability).toFixed(2));
    const exposureDeltaRupees = simulatedPrediction.financialExposureRupees - baselinePrediction.financialExposureRupees;

    return {
      baselinePrediction,
      simulatedPrediction,
      scoreDelta,
      probabilityDelta,
      exposureDeltaRupees,
      modifiedFields
    };
  }
}
