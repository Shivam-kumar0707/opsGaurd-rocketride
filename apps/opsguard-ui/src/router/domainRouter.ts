// =============================================================================
// DomainRouter Service
// =============================================================================

import { NormalizedOperationalCase, RiskDomain } from '../types/opsguard';

export type PipelineHandler = (opCase: NormalizedOperationalCase) => Promise<unknown>;

export class DomainRouter {
  private static domainPipelines: Map<RiskDomain, string> = new Map([
    ['customer_churn', 'Customer Churn Risk Pipeline'],
    ['contract_deadline', 'Contract Obligation Risk Pipeline'],
    ['project_delay', 'Project Delivery Risk Pipeline']
  ]);

  public static getPipelineName(domain: RiskDomain): string {
    return this.domainPipelines.get(domain) || 'Generic Operational Risk Pipeline';
  }

  public static registerDomain(domain: RiskDomain, pipelineName: string): void {
    this.domainPipelines.set(domain, pipelineName);
  }
}
