// =============================================================================
// Protected Risk Engine & Server-Side Execution Safeguard
// =============================================================================

import { NormalizedOperationalCase, RiskPrediction, UserRole } from '../types/opsguard';
import { RiskEngine } from '../risk-engine/riskEngine';
import { ModelIntegrity } from './modelIntegrity';
import { ModelRegistry } from '../ml/modelRegistry';
import { PolicyEngine } from './policyEngine';
import { SystemProtection } from './systemProtection';

export class ProtectedRiskEngine {
  public static evaluateUntrustedInput(
    rawCase: NormalizedOperationalCase,
    actorRole: UserRole,
    actorName: string
  ): RiskPrediction {
    // 1. Check Policy Authorization
    PolicyEngine.enforce(actorRole, 'ANALYZE_RISK', 'evaluate operational risk', actorName);

    // 2. Check System Integrity (Protected Mode)
    const activeModel = ModelRegistry.getActiveModel(rawCase.domain);
    if (activeModel) {
      const integrity = ModelIntegrity.verifyModelIntegrity(activeModel);
      if (!integrity.isValid) {
        SystemProtection.triggerProtectedMode(`Active model "${activeModel.modelId}" failed SHA-256 integrity verification.`);
        throw new Error('⚠ MODEL INTEGRITY FAILURE: Active inference model failed SHA-256 hash check. Evaluation blocked.');
      }
    }

    // 3. SANITIZATION: Strip any client-injected risk scores or overrides
    const sanitizedCase: NormalizedOperationalCase = {
      ...rawCase,
      structuredFeatures: { ...rawCase.structuredFeatures }
    };
    delete (sanitizedCase.structuredFeatures as any).riskScore;
    delete (sanitizedCase.structuredFeatures as any).probability;
    delete (sanitizedCase.structuredFeatures as any).severity;

    // 4. Execute Trusted Risk Engine Calculation
    const prediction = RiskEngine.evaluate(sanitizedCase);

    return prediction;
  }
}
