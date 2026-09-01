// =============================================================================
// Human Recommendation Pattern Discovery Engine
// =============================================================================

import { DiscoveredPattern } from '../types/opsguard';

export class RecommendationLearning {
  private static patterns: DiscoveredPattern[] = [
    {
      id: 'PAT-001',
      domain: 'customer_churn',
      signalPattern: 'Technical Ticket Surge + API Latency + Usage Drop',
      aiDefaultRecommendation: 'Offer 15% Commercial Renewal Discount',
      preferredHumanIntervention: 'Prioritize Technical Escalation & API Bug Resolution before Commercial Offers',
      observedOutcome: 'Higher Retention (84% retained across 47 historical cases)',
      caseCount: 47,
      successRatePct: 84.2,
      status: 'VALIDATED',
      lastObservedAt: '2026-08-31'
    },
    {
      id: 'PAT-002',
      domain: 'contract_deadline',
      signalPattern: 'Sub-40% Milestone Completion + <10 Days Remaining',
      aiDefaultRecommendation: 'Request Formal Milestone Scope Extension from Customer',
      preferredHumanIntervention: 'Approve Overtime Surge & Technical Resource Injection',
      observedOutcome: 'Penalty Avoidance (91% avoided across 34 historical cases)',
      caseCount: 34,
      successRatePct: 91.1,
      status: 'VALIDATED',
      lastObservedAt: '2026-08-30'
    },
    {
      id: 'PAT-003',
      domain: 'project_delay',
      signalPattern: 'Database Migration Blockers > 10 Tasks',
      aiDefaultRecommendation: 'Compress QA Testing Timeline by 50%',
      preferredHumanIntervention: 'Reassign 2 Senior DevOps Engineers to clear pipeline bottlenecks',
      observedOutcome: 'Schedule Drift Recovered (78% resolved without quality regressions)',
      caseCount: 23,
      successRatePct: 78.3,
      status: 'VALIDATING',
      lastObservedAt: '2026-08-29'
    }
  ];

  public static getDiscoveredPatterns(): DiscoveredPattern[] {
    return this.patterns;
  }
}
