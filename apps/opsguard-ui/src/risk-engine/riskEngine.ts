// =============================================================================
// Core Risk Engine Service
// =============================================================================

import { NormalizedOperationalCase, RiskPrediction } from '../types/opsguard';
import { BaselineRiskModels } from './baselineModels';

export class RiskEngine {
  public static evaluate(
    opCase: NormalizedOperationalCase,
    customWeights?: Record<string, number>
  ): RiskPrediction {
    return BaselineRiskModels.calculate(opCase, customWeights);
  }
}
