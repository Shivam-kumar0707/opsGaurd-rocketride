// =============================================================================
// Assistant Tool Registry & Implementation
// =============================================================================

import { OperationalIncident, RiskDomain, NormalizedOperationalCase } from '../types/opsguard';
import { InputNormalizer, RawInputPayload } from '../normalizer/inputNormalizer';
import { RiskEngine } from '../risk-engine/riskEngine';
import { RiskSimulator, SimulationOverridePayload } from '../risk-engine/simulator';
import { SignalAgent } from './signalAgent';
import { EvidenceAgent } from './evidenceAgent';
import { RootCauseAgent } from './rootCauseAgent';
import { ActionPlannerAgent } from './actionPlannerAgent';
import { CriticAgent } from './criticAgent';

export class AssistantTools {
  public static analyzeRisk(payload: RawInputPayload): {
    normalizedCase: NormalizedOperationalCase;
    incident: OperationalIncident;
  } {
    const normalizedCase = InputNormalizer.normalize(payload);
    const prediction = RiskEngine.evaluate(normalizedCase);
    const signals = SignalAgent.detectSignals(normalizedCase);
    const evidence = EvidenceAgent.compileEvidence(normalizedCase, signals);
    const reasoning = RootCauseAgent.analyze(normalizedCase, signals, evidence, prediction);
    const recommendation = ActionPlannerAgent.planActions(normalizedCase, prediction, reasoning);
    const critique = CriticAgent.critique(normalizedCase, prediction, recommendation);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const incident: OperationalIncident = {
      id: `INC-${Date.now().toString().slice(-6)}`,
      title: `${normalizedCase.entityName} — Operational ${normalizedCase.domain.replace('_', ' ').toUpperCase()} Analysis`,
      entityName: normalizedCase.entityName,
      entityType: normalizedCase.domain === 'customer_churn' ? 'Customer' : normalizedCase.domain === 'contract_deadline' ? 'Contract' : 'Project',
      entityId: normalizedCase.entityId,
      riskDomain: normalizedCase.domain,
      riskScore: prediction.riskScore,
      probability: prediction.probability,
      severity: prediction.severity,
      confidenceScore: Math.round(prediction.confidence * 100),
      primaryMetric: prediction.financialExposureFormatted,
      exposureAmountRupees: prediction.financialExposureRupees,
      status: 'pending_approval',
      lastUpdated: 'Just now',
      prediction,
      signals,
      evidence,
      reasoning,
      recommendation,
      critique,
      agentTimeline: [
        { agentName: 'Input Normalizer', status: 'completed', timestamp: nowStr, duration: '0.4s', description: 'Normalized input features & validated field completeness.' },
        { agentName: 'Signal Agent', status: 'completed', timestamp: nowStr, duration: '0.8s', description: `Flagged ${signals.length} measurable risk signals.` },
        { agentName: 'Evidence Agent', status: 'completed', timestamp: nowStr, duration: '1.2s', description: `Compiled & categorized ${evidence.length} evidence items (Verified vs User Provided).` },
        { agentName: 'Risk Engine', status: 'completed', timestamp: nowStr, duration: '0.5s', description: `Calculated Risk Score of ${prediction.riskScore}% (${prediction.severity.toUpperCase()}).` },
        { agentName: 'Reasoning Agent', status: 'completed', timestamp: nowStr, duration: '2.1s', description: 'Synthesized primary root causes & operational insights.' },
        { agentName: 'Action Planner', status: 'completed', timestamp: 'Just now', duration: '1.4s', description: 'Generated structured intervention steps.' },
        { agentName: 'Critic Agent', status: 'completed', timestamp: 'Just now', duration: '0.9s', description: `Critiqued proposed action plan. Verdict: ${critique.overallVerdict.toUpperCase()}.` },
        { agentName: 'Human Approval', status: 'pending', timestamp: 'Awaiting Review', description: 'Pending Operations Lead decision.' }
      ],
      auditHistory: [
        { id: `AUD-${Date.now()}`, timestamp: nowStr, actor: 'Input Normalizer', actorRole: 'System Agent', eventType: 'input_normalized', summary: 'Normalized operational payload.' },
        { id: `AUD-${Date.now()+1}`, timestamp: nowStr, actor: 'Risk Engine', actorRole: 'System Agent', eventType: 'risk_scored', summary: `Calculated Risk Score ${prediction.riskScore}%.` },
        { id: `AUD-${Date.now()+2}`, timestamp: nowStr, actor: 'Critic Agent', actorRole: 'System Agent', eventType: 'critique_performed', summary: `Critique completed: ${critique.challenges[0] || 'No critical challenges.'}` }
      ]
    };

    return { normalizedCase, incident };
  }

  public static simulateRisk(
    opCase: NormalizedOperationalCase,
    overrides: SimulationOverridePayload
  ) {
    return RiskSimulator.simulate(opCase, overrides);
  }
}
