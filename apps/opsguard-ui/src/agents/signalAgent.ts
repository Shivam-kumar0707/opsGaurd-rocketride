// =============================================================================
// Signal Agent Service
// =============================================================================

import { NormalizedOperationalCase, RiskSignal } from '../types/opsguard';

export class SignalAgent {
  public static detectSignals(opCase: NormalizedOperationalCase): RiskSignal[] {
    const signals: RiskSignal[] = [];
    const feats = opCase.structuredFeatures;

    if (opCase.domain === 'customer_churn') {
      const usageChange = Number(feats.normalizedUsageChange ?? feats.usageChangePct ?? 0);
      const tickets = Number(feats.normalizedTickets ?? feats.supportTicketCount ?? 0);
      const negativeTickets = Number(feats.normalizedNegativeTickets ?? feats.negativeSentimentTickets ?? 0);
      const renewalDays = Number(feats.normalizedRenewalDays ?? feats.daysUntilRenewal ?? 999);
      const nps = Number(feats.nps ?? 7);
      const paymentDelay = Number(feats.paymentDelayDays ?? 0);

      if (usageChange < 0) {
        signals.push({
          id: 'SIG-USAGE-DECLINE',
          name: 'Product Usage Decline',
          value: `${usageChange}% over 90 days`,
          impact: Math.abs(usageChange) > 30 ? 'HIGH' : 'MED',
          description: 'Product event volume dropped across active user cohorts.',
          weight: 0.25,
          severityScore: Math.min(100, Math.abs(usageChange) * 2),
          confidence: 0.95,
          source: opCase.rawInputSource === 'csv_upload' ? 'telemetry' : 'user_input'
        });
      }

      if (tickets > 0) {
        signals.push({
          id: 'SIG-TICKET-VOLUME',
          name: 'Support Ticket Volume Escalation',
          value: `${tickets} tickets logged`,
          impact: tickets >= 4 ? 'HIGH' : 'MED',
          description: 'Increased volume of technical and billing support tickets.',
          weight: 0.20,
          severityScore: Math.min(100, tickets * 18),
          confidence: 0.92,
          source: 'ticket_system'
        });
      }

      if (negativeTickets > 0) {
        signals.push({
          id: 'SIG-NEGATIVE-SENTIMENT',
          name: 'Negative Sentiment & Latency Complaints',
          value: `${negativeTickets} critical complaints`,
          impact: 'HIGH',
          description: 'Customer expressed frustration regarding platform latency & timeouts.',
          weight: 0.20,
          severityScore: Math.min(100, negativeTickets * 25),
          confidence: 0.90,
          source: 'ticket_system'
        });
      }

      if (renewalDays < 90) {
        signals.push({
          id: 'SIG-RENEWAL-PROXIMITY',
          name: 'Contract Renewal Deadline Proximity',
          value: `${renewalDays} days remaining`,
          impact: renewalDays < 30 ? 'HIGH' : 'MED',
          description: 'Annual contract renewal deadline approaching.',
          weight: 0.15,
          severityScore: Math.min(100, Math.round(((90 - renewalDays) / 90) * 100)),
          confidence: 0.98,
          source: 'contract_db'
        });
      }

      if (nps < 7) {
        signals.push({
          id: 'SIG-LOW-NPS',
          name: 'Low Detractor NPS Score',
          value: `NPS ${nps}/10`,
          impact: nps <= 4 ? 'HIGH' : 'MED',
          description: 'Recent customer satisfaction survey indicated detractor rating.',
          weight: 0.10,
          severityScore: Math.round(((10 - nps) / 10) * 100),
          confidence: 0.88,
          source: 'user_input'
        });
      }

      if (paymentDelay > 0) {
        signals.push({
          id: 'SIG-PAYMENT-DELAY',
          name: 'Overdue Invoice Payment',
          value: `${paymentDelay} days past due`,
          impact: paymentDelay > 15 ? 'HIGH' : 'LOW',
          description: 'Invoice payment delayed beyond agreed payment terms.',
          weight: 0.10,
          severityScore: Math.min(100, paymentDelay * 3),
          confidence: 0.94,
          source: 'user_input'
        });
      }

    } else if (opCase.domain === 'contract_deadline') {
      const daysRemaining = Number(feats.normalizedDaysRemaining ?? 999);
      const penalty = Number(feats.normalizedPenalty ?? 0);
      const completionPct = Number(feats.normalizedCompletionPct ?? 0);
      const isUnassigned = feats.owner === 'Unassigned' || feats.owner === undefined;

      if (daysRemaining < 45) {
        signals.push({
          id: 'SIG-CONTRACT-DEADLINE',
          name: 'Obligation Due Date Proximity',
          value: `${daysRemaining} days remaining`,
          impact: daysRemaining < 14 ? 'HIGH' : 'MED',
          description: 'Contractual deliverable due date approaching.',
          weight: 0.35,
          severityScore: Math.min(100, Math.round(((45 - daysRemaining) / 45) * 100)),
          confidence: 0.98,
          source: 'contract_db'
        });
      }

      if (penalty > 0) {
        signals.push({
          id: 'SIG-PENALTY-EXPOSURE',
          name: 'Financial Liquidated Damages Clause',
          value: `₹${(penalty / 100000).toFixed(1)}L penalty`,
          impact: 'HIGH',
          description: 'Fixed penalty clause triggered automatically upon missed deadline.',
          weight: 0.25,
          severityScore: Math.min(100, Math.round((penalty / 1000000) * 100) || 75),
          confidence: 0.95,
          source: 'contract_db'
        });
      }

      if (completionPct < 100) {
        signals.push({
          id: 'SIG-COMPLETION-GAP',
          name: 'Deliverable Completion Deficit',
          value: `${completionPct}% completed`,
          impact: completionPct < 50 ? 'HIGH' : 'MED',
          description: 'Current deliverable progress is below 100% completion requirement.',
          weight: 0.20,
          severityScore: 100 - completionPct,
          confidence: 0.89,
          source: 'user_input'
        });
      }

      if (isUnassigned) {
        signals.push({
          id: 'SIG-UNASSIGNED-OWNER',
          name: 'Unassigned Responsible Lead',
          value: 'Unassigned',
          impact: 'HIGH',
          description: 'No primary compliance officer assigned to finalize deliverable.',
          weight: 0.20,
          severityScore: 90,
          confidence: 0.99,
          source: 'contract_db'
        });
      }

    } else if (opCase.domain === 'project_delay') {
      const delayDays = Number(feats.normalizedDelayDays ?? 0);
      const blockedTasks = Number(feats.normalizedBlockedTasks ?? 0);

      if (delayDays > 0) {
        signals.push({
          id: 'SIG-SCHEDULE-DRIFT',
          name: 'Project Milestone Schedule Drift',
          value: `${delayDays} days delay`,
          impact: delayDays > 7 ? 'HIGH' : 'MED',
          description: 'Project timeline projected to breach client target launch date.',
          weight: 0.50,
          severityScore: Math.min(100, delayDays * 7),
          confidence: 0.91,
          source: 'project_pm'
        });
      }

      if (blockedTasks > 0) {
        signals.push({
          id: 'SIG-BLOCKED-TASKS',
          name: 'Critical Path Task Blockers',
          value: `${blockedTasks} tasks blocked`,
          impact: blockedTasks > 5 ? 'HIGH' : 'MED',
          description: 'Sprint tasks stalled due to technical or resource dependencies.',
          weight: 0.50,
          severityScore: Math.min(100, blockedTasks * 8),
          confidence: 0.93,
          source: 'project_pm'
        });
      }
    }

    return signals;
  }
}
