// =============================================================================
// Dataset Security & Immutable Versioning Service
// =============================================================================

import { TrainingDataset, SecurityEvent } from '../types/opsguard';
import { ModelIntegrity } from './modelIntegrity';
import { PolicyEngine } from './policyEngine';

export class DatasetSecurity {
  public static validateAndSecureDataset(
    dataset: TrainingDataset,
    rawCSVContent: string
  ): TrainingDataset {
    // 1. Check file size limits (< 5MB)
    const sizeBytes = new Blob([rawCSVContent]).size;
    if (sizeBytes > 5 * 1024 * 1024) {
      throw new Error('Dataset Security Failure: CSV file exceeds maximum 5MB size limit.');
    }

    // 2. Compute SHA-256 Hash of immutable dataset
    const datasetHash = ModelIntegrity.computeSHA256(rawCSVContent);

    // 3. Log security validation event
    const securityEvent: SecurityEvent = {
      id: `SEC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'DATASET_VALIDATION',
      severity: 'LOW',
      actor: 'System',
      actorRole: 'ANALYST',
      details: `Dataset "${dataset.filename}" validated successfully. Records: ${dataset.recordCount}, Target: ${dataset.targetColumn}, SHA-256: ${datasetHash.slice(0, 16)}...`
    };
    PolicyEngine.logSecurityEvent(securityEvent);

    return {
      ...dataset,
      datasetHash
    };
  }
}
