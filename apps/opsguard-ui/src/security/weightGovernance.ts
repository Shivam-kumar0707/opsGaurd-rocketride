// =============================================================================
// Risk Engine Model Weight Governance Service
// =============================================================================

import { RiskDomain, UserRole, SecurityEvent } from '../types/opsguard';
import { defaultModelWeights } from '../risk-engine/config';
import { PolicyEngine } from './policyEngine';

export interface WeightConfigVersion {
  versionId: string;
  domain: RiskDomain;
  weights: Record<string, number>;
  modifiedBy: string;
  modifiedByRole: UserRole;
  modifiedAt: string;
}

export class WeightGovernance {
  private static activeWeights: Record<RiskDomain, Record<string, number>> = { ...defaultModelWeights };
  private static configHistory: WeightConfigVersion[] = [];

  public static updateWeights(
    domain: RiskDomain,
    newWeights: Record<string, number>,
    actorRole: UserRole,
    actorName: string
  ): void {
    // 1. Enforce ADMIN permission check
    PolicyEngine.enforce(actorRole, 'MODIFY_WEIGHTS', 'update model feature weights', actorName);

    const oldWeights = { ...this.activeWeights[domain] };
    this.activeWeights[domain] = { ...newWeights };

    const version: WeightConfigVersion = {
      versionId: `WGT-${Date.now().toString().slice(-4)}`,
      domain,
      weights: { ...newWeights },
      modifiedBy: actorName,
      modifiedByRole: actorRole,
      modifiedAt: new Date().toISOString()
    };

    this.configHistory.unshift(version);

    // 2. Log Security Event
    const secEvent: SecurityEvent = {
      id: `SEC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'WEIGHTS_UPDATED',
      severity: 'HIGH',
      actor: actorName,
      actorRole,
      details: `Model feature weights updated for ${domain.toUpperCase()}. Modified by ${actorName}. New configuration version: ${version.versionId}.`
    };
    PolicyEngine.logSecurityEvent(secEvent);
  }

  public static getActiveWeights(domain: RiskDomain): Record<string, number> {
    return this.activeWeights[domain] || defaultModelWeights[domain];
  }
}
