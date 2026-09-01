// =============================================================================
// Model Registry Service
// =============================================================================

import { ModelVersion, RiskDomain } from '../types/opsguard';

export const initialModelVersions: ModelVersion[] = [
  {
    modelId: 'MOD-CHURN-V1',
    domain: 'customer_churn',
    name: 'Customer Churn Baseline Weighted Model',
    version: 'v1.0 (Active)',
    trainingDatasetId: 'DS-CHURN-500',
    trainedDate: 'Aug 15, 2026',
    algorithm: 'Configurable Weighted Baseline',
    metrics: { accuracy: 0.86, precision: 0.84, recall: 0.83, f1Score: 0.835, rocAuc: 0.88 },
    featureImportance: [
      { feature: 'monthly_usage_change', importancePct: 35 },
      { feature: 'support_ticket_count', importancePct: 25 },
      { feature: 'days_until_renewal', importancePct: 20 },
      { feature: 'negative_sentiment', importancePct: 20 }
    ],
    confusionMatrix: { truePositive: 165, falsePositive: 30, trueNegative: 260, falseNegative: 45 },
    status: 'active'
  },
  {
    modelId: 'MOD-CONTRACT-V1',
    domain: 'contract_deadline',
    name: 'Contract Obligation Baseline Model',
    version: 'v1.0 (Active)',
    trainingDatasetId: 'DS-CONTRACT-500',
    trainedDate: 'Aug 18, 2026',
    algorithm: 'Configurable Weighted Baseline',
    metrics: { accuracy: 0.92, precision: 0.90, recall: 0.91, f1Score: 0.905, rocAuc: 0.94 },
    featureImportance: [
      { feature: 'days_remaining', importancePct: 40 },
      { feature: 'penalty_amount', importancePct: 30 },
      { feature: 'completion_pct', importancePct: 30 }
    ],
    confusionMatrix: { truePositive: 180, falsePositive: 15, trueNegative: 285, falseNegative: 20 },
    status: 'active'
  },
  {
    modelId: 'MOD-DELIVERY-V1',
    domain: 'project_delay',
    name: 'Project Delivery Schedule Drift Model',
    version: 'v1.0 (Active)',
    trainingDatasetId: 'DS-DELIVERY-500',
    trainedDate: 'Aug 20, 2026',
    algorithm: 'Configurable Weighted Baseline',
    metrics: { accuracy: 0.85, precision: 0.83, recall: 0.82, f1Score: 0.825, rocAuc: 0.87 },
    featureImportance: [
      { feature: 'delay_days', importancePct: 50 },
      { feature: 'blocked_tasks', importancePct: 50 }
    ],
    confusionMatrix: { truePositive: 150, falsePositive: 35, trueNegative: 265, falseNegative: 50 },
    status: 'active'
  }
];

export class ModelRegistry {
  private static models: ModelVersion[] = [...initialModelVersions];

  public static getModels(domain?: RiskDomain): ModelVersion[] {
    if (domain) {
      return this.models.filter(m => m.domain === domain);
    }
    return this.models;
  }

  public static getActiveModel(domain: RiskDomain): ModelVersion | undefined {
    return this.models.find(m => m.domain === domain && m.status === 'active');
  }

  public static addCandidateModel(newModel: ModelVersion): void {
    this.models.unshift(newModel);
  }

  public static activateModel(modelId: string): void {
    const targetModel = this.models.find(m => m.modelId === modelId);
    if (!targetModel) return;

    // Deprecate current active model for this domain
    this.models.forEach(m => {
      if (m.domain === targetModel.domain && m.status === 'active') {
        m.status = 'deprecated';
        m.version = m.version.replace(' (Active)', ' (Deprecated)');
      }
    });

    targetModel.status = 'active';
    targetModel.version = `${targetModel.version.replace(' (Candidate)', '')} (Active)`;
  }
}
