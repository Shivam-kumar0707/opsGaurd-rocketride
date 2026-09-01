// =============================================================================
// Outcome Tracker Service
// =============================================================================

import { OperationalOutcome, OperationalIncident } from '../types/opsguard';
import { HistoricalCaseStore } from '../historical/historicalCaseStore';

export class OutcomeTracker {
  private static outcomes: OperationalOutcome[] = [];

  public static recordOutcome(
    incident: OperationalIncident,
    actualOutcome: OperationalOutcome['actualOutcome'],
    financialSavedRupees: number,
    notes?: string
  ): OperationalOutcome {
    const outcomeRecord: OperationalOutcome = {
      id: `OUT-${Date.now()}`,
      caseId: incident.id,
      incidentId: incident.id,
      originalRiskScore: incident.riskScore,
      originalPredictionProbability: incident.probability || (incident.riskScore / 100),
      recommendedAction: incident.recommendation.actionTitle,
      humanDecision: incident.recommendation.status === 'modified' ? 'modified' : incident.recommendation.status === 'rejected' ? 'rejected' : 'approved',
      userNotes: incident.recommendation.userNotes,
      finalActionExecuted: incident.recommendation.actionTitle,
      actualOutcome,
      financialSavedRupees,
      notes,
      timestamp: new Date().toISOString()
    };

    this.outcomes.unshift(outcomeRecord);

    // Also add to Historical Case Store as outcome feedback
    HistoricalCaseStore.addCase({
      id: `HIST-${Date.now().toString().slice(-4)}`,
      title: `${incident.entityName} — ${actualOutcome.replace('_', ' ').toUpperCase()}`,
      domain: incident.riskDomain,
      entityName: incident.entityName,
      similarityPct: 92,
      riskScore: incident.riskScore,
      primaryMetric: `₹${(financialSavedRupees / 100000).toFixed(1)}L Impact`,
      keyDrivers: incident.signals.slice(0, 3).map(s => `${s.name}: ${s.value}`),
      recommendationGiven: incident.recommendation.actionTitle,
      humanActionTaken: outcomeRecord.humanDecision,
      actualOutcome: `Outcome recorded: ${actualOutcome.replace('_', ' ')}.${notes ? ` Notes: ${notes}` : ''}`,
      outcomeCategory: actualOutcome,
      financialSavedRupees,
      dateRecorded: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });

    return outcomeRecord;
  }

  public static getOutcomes(): OperationalOutcome[] {
    return this.outcomes;
  }
}
