// =============================================================================
// Model Improvement & Candidate vs Active Comparison Engine
// =============================================================================

import { ModelVersion, RiskDomain } from '../types/opsguard';
import { ModelRegistry } from '../ml/modelRegistry';

export interface ModelComparisonResult {
  activeModel: ModelVersion;
  candidateModel: ModelVersion;
  metricsDelta: {
    accuracyDelta: number;
    precisionDelta: number;
    recallDelta: number;
    f1ScoreDelta: number;
    rocAucDelta: number;
  };
  isCandidateBetter: boolean;
  recommendationNote: string;
}

export class ModelImprovement {
  public static compareCandidateWithActive(domain: RiskDomain): ModelComparisonResult | null {
    const activeModel = ModelRegistry.getActiveModel(domain);
    const candidates = ModelRegistry.getModels(domain).filter((m: ModelVersion) => m.status === 'candidate');
    const candidateModel = candidates[candidates.length - 1];

    if (!activeModel || !candidateModel) return null;

    const metricsDelta = {
      accuracyDelta: candidateModel.metrics.accuracy - activeModel.metrics.accuracy,
      precisionDelta: candidateModel.metrics.precision - activeModel.metrics.precision,
      recallDelta: candidateModel.metrics.recall - activeModel.metrics.recall,
      f1ScoreDelta: candidateModel.metrics.f1Score - activeModel.metrics.f1Score,
      rocAucDelta: candidateModel.metrics.rocAuc - activeModel.metrics.rocAuc
    };

    const isCandidateBetter = metricsDelta.rocAucDelta > 0 || metricsDelta.f1ScoreDelta > 0;

    return {
      activeModel,
      candidateModel,
      metricsDelta,
      isCandidateBetter,
      recommendationNote: isCandidateBetter
        ? `Candidate Model "${candidateModel.name}" improves ROC-AUC by +${(metricsDelta.rocAucDelta * 100).toFixed(1)}%. Explicit ADMIN activation recommended.`
        : `Candidate Model "${candidateModel.name}" does not outperform Active Model. Maintain current production model.`
    };
  }
}
