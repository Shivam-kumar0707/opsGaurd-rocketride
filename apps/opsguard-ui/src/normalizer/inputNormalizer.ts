// =============================================================================
// InputNormalizer Service
// =============================================================================

import { NormalizedOperationalCase, RiskDomain, EvidenceItem } from '../types/opsguard';

export interface RawInputPayload {
  domain: RiskDomain;
  entityName?: string;
  rawText?: string;
  jsonPayload?: Record<string, unknown>;
  formFields?: Record<string, string | number | boolean>;
  csvRows?: Record<string, string | number>[];
}

export class InputNormalizer {
  public static normalize(payload: RawInputPayload): NormalizedOperationalCase {
    const caseId = `CASE-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();
    const missingFields: string[] = [];
    const structuredFeatures: Record<string, string | number | boolean> = {};

    let entityName = payload.entityName || 'Unspecified Entity';
    let entityId = `ENT-${Math.floor(1000 + Math.random() * 9000)}`;
    let financialExposureRupees = 0;
    let contractValueARRRupees = 0;
    let penaltyRupees = 0;
    let projectValueRupees = 0;
    let rawInputSource: NormalizedOperationalCase['rawInputSource'] = 'structured_form';

    if (payload.jsonPayload) {
      rawInputSource = 'json';
      Object.assign(structuredFeatures, payload.jsonPayload);
      if (payload.jsonPayload.entityName) entityName = String(payload.jsonPayload.entityName);
      if (payload.jsonPayload.entityId) entityId = String(payload.jsonPayload.entityId);
    } else if (payload.csvRows && payload.csvRows.length > 0) {
      rawInputSource = 'csv_upload';
      const firstRow = payload.csvRows[0];
      Object.assign(structuredFeatures, firstRow);
      if (firstRow.customer_name) entityName = String(firstRow.customer_name);
      if (firstRow.contract_name) entityName = String(firstRow.contract_name);
      if (firstRow.project_name) entityName = String(firstRow.project_name);
    } else if (payload.formFields) {
      rawInputSource = 'structured_form';
      Object.assign(structuredFeatures, payload.formFields);
      if (payload.formFields.entityName) entityName = String(payload.formFields.entityName);
    } else if (payload.rawText) {
      rawInputSource = 'free_text';
    }

    // Domain-Specific Normalization & Validation Rules
    if (payload.domain === 'customer_churn') {
      const arr = Number(structuredFeatures.arrRupees || structuredFeatures.contract_value || structuredFeatures.arr || 0);
      const usageChange = Number(structuredFeatures.usageChangePct ?? structuredFeatures.monthly_usage_change ?? 0);
      const tickets = Number(structuredFeatures.supportTicketCount ?? structuredFeatures.ticket_count ?? 0);
      const negativeTickets = Number(structuredFeatures.negativeSentimentTickets ?? structuredFeatures.negative_sentiment ?? 0);
      const renewalDays = Number(structuredFeatures.daysUntilRenewal ?? structuredFeatures.days_until_renewal ?? 999);

      if (!arr) missingFields.push('Contract Value / ARR');
      if (structuredFeatures.usageChangePct === undefined && structuredFeatures.monthly_usage_change === undefined) missingFields.push('Usage Change %');
      if (structuredFeatures.daysUntilRenewal === undefined && structuredFeatures.days_until_renewal === undefined) missingFields.push('Days Until Renewal');

      contractValueARRRupees = arr;
      financialExposureRupees = arr;
      structuredFeatures.normalizedARR = arr;
      structuredFeatures.normalizedUsageChange = usageChange;
      structuredFeatures.normalizedTickets = tickets;
      structuredFeatures.normalizedNegativeTickets = negativeTickets;
      structuredFeatures.normalizedRenewalDays = renewalDays;

    } else if (payload.domain === 'contract_deadline') {
      const value = Number(structuredFeatures.contractValue || structuredFeatures.value || 0);
      const penalty = Number(structuredFeatures.penaltyAmountRupees || structuredFeatures.penalty || 0);
      const daysRemaining = Number(structuredFeatures.daysRemaining || structuredFeatures.days_remaining || 999);
      const completionPct = Number(structuredFeatures.completionPct || structuredFeatures.completion_pct || 0);

      if (!penalty) missingFields.push('Penalty Amount');
      if (structuredFeatures.daysRemaining === undefined && structuredFeatures.days_remaining === undefined) missingFields.push('Days Remaining');

      penaltyRupees = penalty;
      financialExposureRupees = penalty > 0 ? penalty : value;
      structuredFeatures.normalizedContractValue = value;
      structuredFeatures.normalizedPenalty = penalty;
      structuredFeatures.normalizedDaysRemaining = daysRemaining;
      structuredFeatures.normalizedCompletionPct = completionPct;

    } else if (payload.domain === 'project_delay') {
      const projectValue = Number(structuredFeatures.projectValue || structuredFeatures.value || 0);
      const delayDays = Number(structuredFeatures.delayDays || structuredFeatures.delay_days || 0);
      const blockedTasks = Number(structuredFeatures.blockedTaskCount || structuredFeatures.blocked_tasks || 0);

      if (!delayDays && !blockedTasks) missingFields.push('Expected Delay Days / Blocked Tasks');

      projectValueRupees = projectValue;
      financialExposureRupees = projectValue * 0.15 || 500000; // Estimated financial impact of delay
      structuredFeatures.normalizedProjectValue = projectValue;
      structuredFeatures.normalizedDelayDays = delayDays;
      structuredFeatures.normalizedBlockedTasks = blockedTasks;
    }

    const insufficientEvidence = missingFields.length >= 2;
    const guidance = insufficientEvidence
      ? `Insufficient evidence to compute a high-confidence prediction. Missing key metrics: ${missingFields.join(', ')}. Please provide these inputs to increase prediction accuracy.`
      : undefined;

    // Create Initial Verified Evidence Item
    const evidenceItems: EvidenceItem[] = [];
    if (Object.keys(structuredFeatures).length > 0) {
      evidenceItems.push({
        id: `EVI-${Date.now()}`,
        title: 'User Provided Operational Parameters',
        type: 'usage_trend',
        summary: `Submitted ${Object.keys(structuredFeatures).length} structured parameter values for ${entityName}.`,
        significance: 'high',
        evidenceCategory: 'user_provided',
        reliabilityScore: 0.85
      });
    }

    return {
      caseId,
      domain: payload.domain,
      entityName,
      entityId,
      structuredFeatures,
      textualContext: payload.rawText || '',
      evidence: evidenceItems,
      timestamp,
      financialExposureRupees,
      contractValueARRRupees,
      penaltyRupees,
      projectValueRupees,
      missingFields,
      insufficientEvidence,
      guidance,
      rawInputSource
    };
  }
}
