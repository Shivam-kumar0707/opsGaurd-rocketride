# OpsGuard — Active RocketRide Pipeline Registry

This document lists all active RocketRide pipelines registered and executed by OpsGuard.

---

## 1. Core Pipeline Registry

### 1. `opsguard.analyzeRisk`
- **Purpose**: Primary operational risk analysis pipeline combining identity verification, security policy checks, prompt injection sanitization, normalizer, trusted deterministic risk scoring, RAG historical retrieval, multi-agent pipeline, critic agent review, model SHA-256 integrity check, and tamper-evident audit logging.
- **Trigger**: Primary CTA **"⚡ Analyze New Operational Risk"** or UI `AnalyzeRiskWorkflow.tsx`.
- **Definition File**: [analyzeRisk.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/analyzeRisk.pipe)
- **Input Schema**: `{ domain: RiskDomain, entityName: string, rawText?: string, formFields?: Record<string, any>, jsonPayload?: any }`
- **Output Schema**: `{ normalizedCase: NormalizedOperationalCase, incident: OperationalIncident }`
- **Native Nodes**: `webhook`, `anonymize_text`, `parse`, `embedding_transformer`, `qdrant`, `agent_rocketride`, `llm_openai`, `memory_internal`, `guardrails`, `response_json`.
- **Security Requirements**: OAuth2 Host Identity, `ANALYZE_RISK` Policy Check, SHA-256 Model Hash Verification, Hash-Chained Audit Append.

---

### 2. `opsguard.customerChurnRisk`
- **Purpose**: Domain-specific pipeline evaluating Customer Churn Risk signals (ARR value, usage decline %, active seats, support ticket escalations, renewal proximity).
- **Trigger**: Domain selection tab in `AnalyzeRiskWorkflow.tsx`.
- **Definition File**: [customerChurn.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/customerChurn.pipe)
- **Input Schema**: `{ domain: "customer_churn", formFields: { arrRupees, usageChangePct, activeUsers, supportTicketCount, renewalDays } }`
- **Output Schema**: `{ churnRiskScore: number, pointDrivers: Array<{ label, pointsContribution }> }`
- **Native Nodes**: `webhook`, `agent_rocketride`, `llm_openai`, `memory_internal`, `response_json`.

---

### 3. `opsguard.simulateRisk`
- **Purpose**: What-If Risk Simulation Pipeline recalculating deterministic risk scores under modified feature slider values.
- **Trigger**: `RiskSimulatorView.tsx`.
- **Definition File**: [simulateRisk.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/simulateRisk.pipe)
- **Input Schema**: `{ opCase: NormalizedOperationalCase, sliderAdjustments: Record<string, number> }`
- **Output Schema**: `{ baselineScore: number, simulatedScore: number, delta: number, changedDrivers: Driver[] }`
- **Native Nodes**: `webhook`, `agent_rocketride`, `llm_openai`, `memory_internal`, `response_json`.

---

### 4. `opsguard.approveAction`
- **Purpose**: Human Approval State Machine Pipeline executing state transitions (`PROPOSED` -> `APPROVED` | `MODIFIED` | `REJECTED` -> `EXECUTED`).
- **Trigger**: `[✓ APPROVE ACTION]`, `[✎ MODIFY PLAN]`, `[✕ REJECT]` in `RiskWorkspace.tsx`.
- **Definition File**: [approval.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/approval.pipe)
- **Input Schema**: `{ incidentId: string, targetState: "APPROVED" | "MODIFIED" | "REJECTED", actorRole: UserRole, actorName: string, idempotencyKey: string, notes?: string }`
- **Output Schema**: `{ updatedIncident: OperationalIncident, auditEventHash: string }`
- **Native Nodes**: `webhook`, `agent_rocketride`, `llm_openai`, `memory_internal`, `response_json`.
