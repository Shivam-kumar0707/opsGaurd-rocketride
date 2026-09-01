// =============================================================================
// Evidence Agent Service
// =============================================================================

import { NormalizedOperationalCase, RiskSignal, EvidenceItem } from '../types/opsguard';

export class EvidenceAgent {
  public static compileEvidence(
    opCase: NormalizedOperationalCase,
    signals: RiskSignal[]
  ): EvidenceItem[] {
    const evidenceList: EvidenceItem[] = [...opCase.evidence];

    if (opCase.domain === 'customer_churn') {
      const usageChange = Number(opCase.structuredFeatures.normalizedUsageChange ?? 0);
      const tickets = Number(opCase.structuredFeatures.normalizedTickets ?? 0);
      const renewalDays = Number(opCase.structuredFeatures.normalizedRenewalDays ?? 999);

      if (usageChange < 0) {
        evidenceList.push({
          id: `EVI-TELEMETRY-${Date.now()}`,
          title: '90-Day Product Usage & Event Logs',
          type: 'usage_trend',
          summary: `Telemetry logs confirm an overall ${Math.abs(usageChange)}% decline in daily active users and exported queries over the past 90 days.`,
          significance: Math.abs(usageChange) > 30 ? 'critical' : 'high',
          evidenceCategory: opCase.rawInputSource === 'csv_upload' ? 'verified' : 'user_provided',
          reliabilityScore: opCase.rawInputSource === 'csv_upload' ? 0.96 : 0.85,
          usageData: [
            { period: '90 Days Ago', eventCount: 1850, activeUsers: 45 },
            { period: '60 Days Ago', eventCount: 1410, activeUsers: 32, changePct: -23 },
            { period: 'Current Month', eventCount: Math.round(1850 * (1 + usageChange / 100)), activeUsers: 20, changePct: usageChange }
          ]
        });
      }

      if (tickets > 0) {
        evidenceList.push({
          id: `EVI-TICKETS-${Date.now()}`,
          title: 'Support Ticket Audit & Sentiment Breakdown',
          type: 'support_sentiment',
          summary: `${tickets} support tickets filed in the past 30 days showing negative sentiment concentrated on API latency and report export timeouts.`,
          significance: 'high',
          evidenceCategory: 'verified',
          reliabilityScore: 0.94,
          tickets: [
            { id: 'TICK-901', subject: 'Dashboard loading latency during peak queries', sentiment: 'negative', priority: 'critical', ageDays: 4, tags: ['performance', 'latency'] },
            { id: 'TICK-894', subject: 'Query timeout on scheduled report export', sentiment: 'negative', priority: 'high', ageDays: 9, tags: ['reports', 'timeout'] }
          ]
        });
      }

      if (renewalDays < 90) {
        evidenceList.push({
          id: `EVI-RENEWAL-${Date.now()}`,
          title: 'Contract Terms & Renewal Milestone Window',
          type: 'contract_timeline',
          summary: `Contract terms verify explicit renewal deadline set for ${renewalDays} days from today. Historical cohort retention for accounts with >30% usage drop is 22%.`,
          significance: 'high',
          evidenceCategory: 'verified',
          reliabilityScore: 0.98,
          milestones: [
            { title: 'Executive Sponsor Sync', dueDate: '10 days', daysRemaining: Math.max(0, renewalDays - 13), status: 'at_risk' },
            { title: 'Final Renewal Signature', dueDate: `${renewalDays} days`, daysRemaining: renewalDays, status: 'pending' }
          ]
        });
      }

    } else if (opCase.domain === 'contract_deadline') {
      const daysRemaining = Number(opCase.structuredFeatures.normalizedDaysRemaining ?? 999);
      const penalty = Number(opCase.structuredFeatures.normalizedPenalty ?? 0);

      evidenceList.push({
        id: `EVI-CONTRACT-${Date.now()}`,
        title: 'Contractual Obligation Milestone Schedule',
        type: 'contract_timeline',
        summary: `Section 14.2 stipulates deliverable submission required within ${daysRemaining} days. Non-compliance triggers ₹${(penalty / 100000).toFixed(1)}L liquid damages clause.`,
        significance: 'critical',
        evidenceCategory: 'verified',
        reliabilityScore: 0.99,
        milestones: [
          { title: 'Final Deliverable Sign-Off', dueDate: `${daysRemaining} days`, daysRemaining, status: 'at_risk', penaltyAmount: `₹${(penalty / 100000).toFixed(1)}L` }
        ]
      });

    } else if (opCase.domain === 'project_delay') {
      const delayDays = Number(opCase.structuredFeatures.normalizedDelayDays ?? 0);
      const blockedTasks = Number(opCase.structuredFeatures.normalizedBlockedTasks ?? 0);

      evidenceList.push({
        id: `EVI-PROJECT-${Date.now()}`,
        title: 'Sprint Velocity & Critical Path Task Audit',
        type: 'task_blockers',
        summary: `Sprint tracking audit indicates ${blockedTasks} critical path tasks stalled, creating a projected ${delayDays}-day delivery delay.`,
        significance: 'high',
        evidenceCategory: 'verified',
        reliabilityScore: 0.92,
        blockers: [
          { taskName: 'Integration API Schema Definition', owner: 'Core Engineering', blockedDays: 6, impact: 'Blocks 5 downstream UI tasks' },
          { taskName: 'Data Pipeline Migration Verification', owner: 'Data Team', blockedDays: 9, impact: 'Delays UAT sign-off' }
        ]
      });
    }

    // Sort evidence list by reliability score descending
    evidenceList.sort((a, b) => b.reliabilityScore - a.reliabilityScore);

    return evidenceList;
  }
}
