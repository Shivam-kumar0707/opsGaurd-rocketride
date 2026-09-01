# OpsGuard — RocketRide Pipeline Migration Plan

This document details the migration matrix for orchestrating **OpsGuard** capabilities through native **RocketRide Pipelines (`.pipe`)**.

All operational features, deterministic risk calculations, multi-agent workflows, model integrity verifications, tamper-evident audit chains, and human approval controls are mapped directly to RocketRide pipeline components and executed through a trusted pipeline orchestrator.

---

## 1. OpsGuard Capability to RocketRide Pipeline Migration Matrix

| OpsGuard Capability | Current Implementation | RocketRide Capability | Native Node/Service | Target Pipeline | Automatable? | Migration Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Input Intake & Normalization** | `inputNormalizer.ts` | Webhook / Chat Source & Preprocessor | `webhook`, `chat`, `anonymize_text` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Security & Policy Enforcement** | `policyEngine.ts` | Guardrails & Pipeline Security Boundary | `guardrails`, `policyEngine` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Domain Pipeline Routing** | `domainRouter.ts` | Pipeline Sub-Pipeline Routing | `domainRouter` | `opsguard.customerChurnRisk` / `contractObligation` / `projectDelivery` | ✅ Automated | **Migrated to Pipeline** |
| **Deterministic Risk Engine** | `riskEngine.ts` | Trusted Pipeline Math Execution | `protectedRiskEngine` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **RAG Historical Intelligence** | `historicalCaseStore.ts` | RAG Retrieval & Vector Search | `embedding_transformer`, `qdrant`, `ragOperationalMemory` | `opsguard.retrieveHistoricalCases` | ✅ Automated | **Migrated to Pipeline** |
| **Signal Detection Agent** | `signalAgent.ts` | Agent Execution Node | `agent_rocketride` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Evidence Compilation Agent** | `evidenceAgent.ts` | Data Extraction & Fact Checker | `extract_facts`, `agent_rocketride` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Root Cause Reasoning Agent** | `rootCauseAgent.ts` | LLM Reasoning Node | `llm_openai`, `agent_deepagent` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Action Planner Agent** | `actionPlannerAgent.ts` | Action Plan Synthesis Node | `agent_rocketride` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Critic Agent Review** | `criticAgent.ts` | Critic & Audit Reviewer Node | `guardrails`, `agent_rocketride` | `opsguard.analyzeRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Operations Assistant Tools** | `assistantTools.ts` | Tool Execution Pipeline | `mcp_client`, `tool_pipe`, `tools` | `opsguard.assistant` | ✅ Automated | **Migrated to Pipeline** |
| **What-If Risk Simulation** | `simulator.ts` | Deterministic Sandbox Pipeline | `simulator` | `opsguard.simulateRisk` | ✅ Automated | **Migrated to Pipeline** |
| **Human Approval State Machine** | `approvalStateMachine.ts` | Workflow State Transition Pipeline | `approvalStateMachine` | `opsguard.approveAction` | ✅ Automated | **Migrated to Pipeline** |
| **Outcome Recording & Feedback** | `outcomeTracker.ts` | Outcome Logging Sink | `filestore`, `outcomeTracker` | `opsguard.recordOutcome` | ✅ Automated | **Migrated to Pipeline** |
| **Feedback Dataset Builder** | `trainingDatasetBuilder.ts` | Dataset Ingestion & Validation | `filestore`, `datasetSecurity` | `opsguard.buildLearningDataset` | ✅ Automated | **Migrated to Pipeline** |
| **Candidate Model Training** | `mlBackendAdapter.ts` | Model Training & Metric Evaluator | `mlBackendAdapter` | `opsguard.trainModel` | ✅ Automated | **Migrated to Pipeline** |
| **Model Activation Governance** | `modelRegistry.ts` | Versioned Activation Pipeline | `modelIntegrity`, `modelRegistry` | `opsguard.activateModel` | ✅ Automated | **Migrated to Pipeline** |
| **Tamper-Evident Audit Logging** | `tamperEvidentAudit.ts` | SHA-256 Hash Chain Sink | `tamperEvidentAudit` | All Pipelines | ✅ Automated | **Migrated to Pipeline** |

---

## 2. Core Target Pipeline Flow Architecture

```text
                                  ROCKETRIDE PIPELINE EXECUTION LAYER
                                                    │
    ┌───────────────────────────────────────────────┴───────────────────────────────────────────────┐
    │                                                                                               │
    ▼                                                                                               ▼
opsguard.analyzeRisk                                                                        opsguard.simulateRisk
┌───────────────────────────────────────────────────┐                                       ┌──────────────────────┐
│ 1. Identity & Auth (OAuth2 Host Session)          │                                       │ 1. Parameter Inputs  │
│ 2. Security Policy Check (PolicyEngine)           │                                       │ 2. Trusted Risk Calc │
│ 3. Input Normalizer & Prompt Injection Sanitizer  │                                       │ 3. Score Delta Calc  │
│ 4. Domain Pipeline Router (Churn/Contract/Delivery│                                       │ 4. Audit Log         │
│ 5. Trusted Risk Engine Execution (Deterministic)  │                                       └──────────────────────┘
│ 6. RAG Historical Memory Retrieval                │                                                   │
│ 7. Signal Agent Execution                         │                                                   ▼
│ 8. Evidence Agent Compilation                     │                                       opsguard.approveAction
│ 9. Root Cause Agent Analysis                      │                                       ┌──────────────────────┐
│ 10. Action Planner Agent Synthesis                │                                       │ 1. Idempotency Check │
│ 11. Critic Agent Verdict & Rationale              │                                       │ 2. Role Auth Check   │
│ 12. SHA-256 Model Integrity Verification          │                                       │ 3. State Machine     │
│ 13. SHA-256 Hash-Chained Audit Trail Append       │                                       │ 4. Audit Chain Link  │
└───────────────────────────────────────────────────┘                                       └──────────────────────┘
                                                    │
                                                    ▼
                                          opsguard.recordOutcome
                                         ┌─────────────────────────┐
                                         │ 1. Outcome Correlation  │
                                         │ 2. Learning Record Sync │
                                         │ 3. Dataset Generation   │
                                         └─────────────────────────┘
```
