# OpsGuard — AI Operational Risk Control System

[![RocketRide App](https://img.shields.io/badge/RocketRide-App-0052CC.svg)](https://github.com/Shivam-kumar0707/opsGaurd-rocketride)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

> **Prevent expensive operational failures before they happen.**
> 
> *Detect risk. Understand why. Decide what to do. Learn from what happens next.*

---

## 1. Executive Summary

**OpsGuard** is an enterprise AI-powered Operations Control System built as a **RocketRide App micro-frontend** in `apps/opsguard-ui/`.

It continuously monitors, analyzes, and manages operational risk across three primary enterprise domains:

1. **Customer Churn Risk** — Protecting ARR by detecting seat usage drops, support ticket escalations, negative sentiment, and contract renewal deadlines.
2. **Contract Obligation Risk** — Preventing liquid damages penalties by tracking compliance milestones, SLA deliverables, and CISO sign-off deadlines.
3. **Project Delivery Risk** — Eliminating schedule drift by identifying critical path task blockers, resource bottlenecks, and API schema deadlocks.

OpsGuard is **simple on the surface, sophisticated underneath**. An operations manager sees a clean Risk Command Center and 1-page Risk Workspace, while technical administrators and auditors can inspect deterministic scoring formulas, multi-agent reasoning logs, SHA-256 model integrity verifications, and tamper-evident audit chains.

---

## 2. Core Architecture & System Flow

```text
                                  ROCKETRIDE PLATFORM SHELL
                                              │
                                  Host Identity & OAuth2 Auth
                                              │
                            RocketRide Pipeline Execution Layer
                                              │
          ┌───────────────────────────────────┴───────────────────────────────────┐
          │                                                                       │
       ANALYSIS PIPELINE (`opsguard.analyzeRisk`)                     SIMULATION & APPROVAL PIPELINES
          │                                                                       │
          ▼                                                                       ▼
   Trusted Risk Engine (Deterministic)                                What-If Risk Sandbox (`opsguard.simulateRisk`)
          │                                                                       │
          ▼                                                                       ▼
   RAG Historical Retrieval (Qdrant Vector DB)                        Human Approval State Machine (`opsguard.approveAction`)
          │
          ▼
   Multi-Agent Pipeline (Signal -> Evidence -> Root Cause -> Action Planner)
          │
          ▼
   Critic Agent Review (Challenges premature recommendations)
          │
          ▼
   SHA-256 Model Hash Verification & Hash-Chained Audit Append
          │
          ▼
   Human Decision Controls ([✓ APPROVE] [✎ MODIFY] [✕ REJECT])
          │
          ▼
   Verified Operational Outcome & Continuous Learning Loop
```

---

## 3. Key Technical Highlights

### 🛡️ Deterministic Risk Scoring Engine
LLMs **never** fabricate risk numbers in OpsGuard. Risk scores ($0 - 100\%$) and driver point contributions ($+24, +19, +17...$) are calculated deterministically using weighted feature contribution formulas:
$$\text{Risk Score} = \min\left(100, \sum \text{Point Drivers}\right)$$

### 🤖 Multi-Agent Pipeline & Critic Governance
- **Signal Agent**: Detects domain signals with impact and confidence ratings.
- **Evidence Agent**: Categorizes evidence into *Verified*, *User-Provided*, and *Model Inferred*.
- **Root Cause Agent**: Synthesizes primary root causes, contributing factors, and alternative explanations.
- **Action Planner Agent**: Formulates a 4-step actionable intervention plan with assigned roles and deadlines.
- **Critic Agent**: Evaluates action plans for flaws (e.g., challenging premature commercial discounts when technical API failures are the primary driver).

### 🧠 Controlled Human-Guided Continuous Learning
OpsGuard enforces a controlled learning loop: human decision feedback (Approval, Modification, Rejection + Reasons) and real operational outcomes create structured `LearningRecord`s. Pre-prediction features generate data-leakage-free datasets with SHA-256 versioning, enabling candidate model retraining and side-by-side ROC-AUC evaluation under strict human admin activation.

### 🔒 Enterprise Security & Audit Integrity
- **RBAC Matrix**: 4 roles (`ADMIN`, `OPERATIONS_LEAD`, `ANALYST`, `VIEWER`).
- **Prompt Injection Defense**: Sanitizes free-text inputs and strips system instruction overrides.
- **SHA-256 Model Integrity**: Verifies pre-inference model weights against cryptographic SHA-256 hashes.
- **Tamper-Evident Audit Chain**: Append-only SHA-256 hash chaining ($\text{Hash}_n = \text{SHA256}(\text{Hash}_{n-1} + \text{Payload})$).

---

## 4. RocketRide Native `.pipe` Pipelines

OpsGuard capabilities are orchestrated through canonical RocketRide `.pipe` pipeline files located in `docs/rocketride/`:

| Pipeline ID | Purpose | Native Nodes Used | Definition File |
| :--- | :--- | :--- | :--- |
| `opsguard.analyzeRisk` | Primary operational risk analysis | `webhook`, `anonymize_text`, `embedding_transformer`, `qdrant`, `agent_rocketride`, `llm_openai`, `guardrails`, `response_json` | [analyzeRisk.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/analyzeRisk.pipe) |
| `opsguard.customerChurnRisk` | Churn domain risk evaluation | `webhook`, `agent_rocketride`, `llm_openai`, `memory_internal`, `response_json` | [customerChurn.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/customerChurn.pipe) |
| `opsguard.simulateRisk` | What-If parameter sandbox | `webhook`, `agent_rocketride`, `llm_openai`, `memory_internal`, `response_json` | [simulateRisk.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/simulateRisk.pipe) |
| `opsguard.approveAction` | Approval state transitions | `webhook`, `agent_rocketride`, `llm_openai`, `memory_internal`, `response_json` | [approval.pipe](file:///c:/Users/hp/OneDrive/Desktop/rocketride%20hackathon/docs/rocketride/approval.pipe) |

---

## 5. Monorepo & Directory Layout

```text
opsguard-rocketride/
├── ROCKETRIDE_MIGRATION_PLAN.md    # Capability migration matrix
├── ROCKETRIDE_MIGRATION_REPORT.md  # Migration report & manual task summary
├── OpsGuard_PRD.md                 # Product Requirements Document (Full Spec)
├── OpsGuard_BUILD_GUIDE.md           # 4-Phase Build Execution Guide
├── PROJECT_DOCUMENTATION.md        # Comprehensive Project Documentation
├── pnpm-workspace.yaml             # Monorepo workspace configuration
├── .env                            # RocketRide connection credentials
│
├── .rocketride/                    # Platform Vendor Directory
│   ├── docs/                       # RocketRide platform documentation specs
│   ├── services-catalog.json       # Catalog of 150+ RocketRide pipeline nodes
│   ├── schema/                     # JSON Schemas for pipeline components
│   ├── shell/shell.tgz             # Platform Shell package tarball & typings
│   └── client/rocketride.tgz       # Platform SDK package tarball
│
├── docs/                           # Documentation & Pipelines Directory
│   ├── ROCKETRIDE_PIPELINES.md     # Active pipeline registry documentation
│   └── rocketride/                 # Canonical RocketRide .pipe definition files
│       ├── analyzeRisk.pipe        # Primary opsguard.analyzeRisk pipeline
│       ├── customerChurn.pipe      # Churn domain pipeline
│       ├── simulateRisk.pipe       # Simulation pipeline
│       ├── approval.pipe           # Approval state machine pipeline
│       └── MANUAL_SETUP.md         # Graphical builder setup guide
│
└── apps/                           # Applications Monorepo Folder
    └── opsguard-ui/                # Primary OpsGuard RocketRide App
        ├── package.json            # App Manifest & Module Federation config
        ├── rsbuild.config.mts      # Rsbuild bundler config with .pipe loader
        ├── tsconfig.json           # Strict TypeScript configuration
        ├── opsguard.rrapp          # RocketRide App trigger file
        └── src/
            ├── App.tsx             # Root Layout with 12 operational views
            ├── AppDescriptor.ts    # Shell entry descriptor (`teamnext.opsguard`)
            ├── pipelines/          # RocketRide pipeline execution bridge
            ├── workspace/          # Unified 1-Page Risk Workspace
            ├── learning/           # Feedback store & RAG memory
            ├── security/           # RBAC, SHA-256 audit & model integrity
            ├── risk-engine/        # Deterministic scoring models
            ├── agents/             # Multi-Agent pipeline & Critic Agent
            ├── ml/                 # Model registry & candidate trainer
            └── components/         # Clean enterprise UI components
```

---

## 6. Quick Start & Execution Guide

### Prerequisites
- Node.js `v18+`
- pnpm `v8+` or npm `v9+`

### Installation
```bash
# Clone the repository
git clone https://github.com/Shivam-kumar0707/opsGaurd-rocketride.git
cd opsGaurd-rocketride

# Install dependencies in workspace
pnpm install
```

### Local Development Server
```bash
# Navigate to opsguard-ui
cd apps/opsguard-ui

# Start Rsbuild dev server
npm run dev
```
Open **`http://localhost:3645/`** in your browser.

### Typecheck & Build
```bash
# Run strict TypeScript typecheck
npm run typecheck

# Build production Module Federation remote entry bundle
npm run build
```

---

## 7. License

Distributed under the MIT License. See `LICENSE` for details.
