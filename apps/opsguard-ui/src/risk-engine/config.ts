// =============================================================================
// Risk Engine Configuration & Weights
// =============================================================================

import { RiskDomain } from '../types/opsguard';

export interface DomainWeights {
  [featureKey: string]: number; // Weight points contribution (sums to 100)
}

export const defaultModelWeights: Record<RiskDomain, DomainWeights> = {
  customer_churn: {
    usage_decline: 25,
    support_escalation: 20,
    negative_sentiment: 20,
    renewal_proximity: 15,
    nps_score: 10,
    payment_delay: 10
  },
  contract_deadline: {
    days_remaining: 35,
    penalty_severity: 25,
    completion_gap: 20,
    owner_unassigned: 10,
    blocker_count: 10
  },
  project_delay: {
    delay_days: 35,
    blocked_tasks: 25,
    velocity_drop: 20,
    critical_dependency_unmet: 20
  }
};
