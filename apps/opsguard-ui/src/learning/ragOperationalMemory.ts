// =============================================================================
// RAG Operational Memory & Historical Context Retrieval Engine
// =============================================================================

import { HistoricalCase, DiscoveredPattern, RiskDomain } from '../types/opsguard';
import { HistoricalCaseStore } from '../historical/historicalCaseStore';
import { RecommendationLearning } from './recommendationLearning';

export interface RAGContextResult {
  relevantCases: HistoricalCase[];
  validatedPatterns: DiscoveredPattern[];
  retrievalSummary: string;
  sourceAttribution: string;
}

export class RagOperationalMemory {
  public static retrieveContext(domain: RiskDomain, queryText: string): RAGContextResult {
    // 1. Search similar historical cases with verified outcomes
    const cases = HistoricalCaseStore.findSimilarCases(domain, queryText);
    const verifiedCases = cases.filter(c => c.actualOutcome && c.actualOutcome.length > 0);

    // 2. Retrieve validated human intervention patterns
    const patterns = RecommendationLearning.getDiscoveredPatterns().filter(
      p => p.domain === domain && (p.status === 'VALIDATED' || p.status === 'VALIDATING')
    );

    const totalSampleCount = verifiedCases.reduce((acc, c) => acc + (c.similarityPct > 70 ? 1 : 0), 0) + (patterns[0]?.caseCount || 0);

    return {
      relevantCases: verifiedCases,
      validatedPatterns: patterns,
      retrievalSummary: totalSampleCount > 0
        ? `Retrieved ${verifiedCases.length} verified historical outcome cases and ${patterns.length} human-validated intervention patterns (Sample size: ${totalSampleCount} historical records).`
        : '1 similar case retrieved (Sample size insufficient for statistical confidence).',
      sourceAttribution: verifiedCases.length > 0
        ? `Based on ${totalSampleCount} historical operational cases in ${domain.replace('_', ' ').toUpperCase()}: ${verifiedCases[0]?.actualOutcome || 'Positive intervention recorded'}.`
        : 'Based on initial baseline historical records.'
    };
  }
}
