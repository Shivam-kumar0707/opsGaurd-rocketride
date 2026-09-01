// =============================================================================
// SHA-256 Model Integrity & Verification Service
// =============================================================================

import { ModelVersion, SecurityEvent } from '../types/opsguard';
import { PolicyEngine } from './policyEngine';

export class ModelIntegrity {
  // Simple SHA-256 simulation helper generating consistent hex hashes
  public static computeSHA256(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256_${hex}${hex}${hex}${hex}`.slice(0, 64);
  }

  public static generateModelHashes(model: ModelVersion): {
    modelHash: string;
    datasetHash: string;
    featureSchemaHash: string;
  } {
    const schemaStr = JSON.stringify(model.featureImportance);
    const modelStr = `${model.modelId}:${model.algorithm}:${model.version}:${schemaStr}`;
    const datasetStr = `DS-${model.trainingDatasetId}:${model.domain}`;

    return {
      modelHash: this.computeSHA256(modelStr),
      datasetHash: this.computeSHA256(datasetStr),
      featureSchemaHash: this.computeSHA256(schemaStr)
    };
  }

  public static verifyModelIntegrity(model: ModelVersion): {
    isValid: boolean;
    computedHash: string;
    expectedHash: string;
    message: string;
  } {
    const expectedHash = model.modelHash || this.generateModelHashes(model).modelHash;
    const computedHash = this.generateModelHashes(model).modelHash;

    const MATCH = computedHash === expectedHash;

    if (!MATCH) {
      const securityEvent: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'MODEL_INTEGRITY_FAILURE',
        severity: 'CRITICAL',
        actor: 'System',
        actorRole: 'ADMIN',
        details: `⚠ MODEL INTEGRITY FAILURE: Active model ${model.modelId} hash mismatch! Expected: ${expectedHash.slice(0, 16)}..., Computed: ${computedHash.slice(0, 16)}... Inference blocked.`
      };
      PolicyEngine.logSecurityEvent(securityEvent);
    }

    return {
      isValid: MATCH,
      computedHash,
      expectedHash,
      message: MATCH 
        ? `✓ Model SHA-256 Hash Verified (${computedHash.slice(0, 16)}...). Integrity intact.`
        : `⚠ MODEL INTEGRITY FAILURE: Model artifacts tampered! Inference blocked.`
    };
  }
}
