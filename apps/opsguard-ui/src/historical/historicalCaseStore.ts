// =============================================================================
// Historical Case Store Service
// =============================================================================

import { HistoricalCase, RiskDomain } from '../types/opsguard';

export const initialHistoricalCases: HistoricalCase[] = [
  {
    id: 'CASE-1023',
    title: 'GlobalTech Corp — High Churn Signal Recovery',
    domain: 'customer_churn',
    entityName: 'GlobalTech Corp',
    similarityPct: 91,
    riskScore: 82,
    primaryMetric: '₹32,00,000 ARR Saved',
    keyDrivers: ['Usage drop -40%', 'Support tickets: 6', 'Renewal in 30 days'],
    recommendationGiven: 'Assign Senior CSM + Emergency Engineering SLA fix for API timeout',
    humanActionTaken: 'approved',
    actualOutcome: 'Customer retained after technical intervention within 48h',
    outcomeCategory: 'retained',
    financialSavedRupees: 3200000,
    dateRecorded: 'May 14, 2026'
  },
  {
    id: 'CASE-876',
    title: 'Acme Logistics — Unresolved Support Friction Churn',
    domain: 'customer_churn',
    entityName: 'Acme Logistics',
    similarityPct: 84,
    riskScore: 79,
    primaryMetric: '₹18,00,000 ARR Churned',
    keyDrivers: ['Usage drop -48%', 'Unresolved critical bug > 14 days'],
    recommendationGiven: 'Offer 15% discount without technical fix',
    humanActionTaken: 'modified',
    actualOutcome: 'Customer churned due to unresolved core platform friction',
    outcomeCategory: 'churned',
    financialSavedRupees: 0,
    dateRecorded: 'March 22, 2026'
  },
  {
    id: 'CASE-409',
    title: 'FinCorp NDA Obligation — Fast-Track Sign-Off',
    domain: 'contract_deadline',
    entityName: 'FinCorp Contract #409',
    similarityPct: 95,
    riskScore: 88,
    primaryMetric: '₹10,00,000 Penalty Avoided',
    keyDrivers: ['5 days remaining', '₹10L liquid damages', 'Unassigned owner'],
    recommendationGiven: 'Assign Legal lead + 12h CISO digital sign-off',
    humanActionTaken: 'approved',
    actualOutcome: 'Deliverable submitted 2 days ahead of deadline; penalty completely avoided',
    outcomeCategory: 'penalty_avoided',
    financialSavedRupees: 1000000,
    dateRecorded: 'June 08, 2026'
  },
  {
    id: 'CASE-312',
    title: 'Cloud Core Migration — Engineer Reallocation Unblock',
    domain: 'project_delay',
    entityName: 'Cloud Core Migration',
    similarityPct: 89,
    riskScore: 74,
    primaryMetric: 'Recovered 7 Days Schedule Drift',
    keyDrivers: ['12 days projected delay', 'API schema blocker'],
    recommendationGiven: 'Re-allocate 1 Senior Dev for 3 days to unblock schema',
    humanActionTaken: 'approved',
    actualOutcome: 'Unblocked 9 dependent tasks; project launched on schedule buffer',
    outcomeCategory: 'resolved',
    financialSavedRupees: 500000,
    dateRecorded: 'July 19, 2026'
  }
];

export class HistoricalCaseStore {
  private static cases: HistoricalCase[] = [...initialHistoricalCases];

  public static getCases(domain?: RiskDomain): HistoricalCase[] {
    if (domain) {
      return this.cases.filter(c => c.domain === domain);
    }
    return this.cases;
  }

  public static findSimilarCases(domain: RiskDomain, queryText?: string): HistoricalCase[] {
    const domainCases = this.cases.filter(c => c.domain === domain);
    if (!queryText) return domainCases;

    const q = queryText.toLowerCase();
    return domainCases.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.entityName.toLowerCase().includes(q) ||
      c.keyDrivers.some(d => d.toLowerCase().includes(q))
    );
  }

  public static addCase(newCase: HistoricalCase): void {
    this.cases.unshift(newCase);
  }
}
