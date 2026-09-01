# OpsGuard Workspace — Comprehensive Project Documentation

## 1. Project Overview

**OpsGuard** is an enterprise Operations Control System built as a **RocketRide App micro-frontend** in `apps/opsguard-ui/`.

### Positioning Statement
> **OpsGuard — Prevent expensive operational failures before they happen.**
> *Detect risk. Understand why. Decide what to do. Learn from what happens next.*

OpsGuard manages three core operational risk domains:
1. **Customer Churn Risk** (Protecting ARR, detecting usage drops, support ticket spikes, and renewal deadlines)
2. **Contract Obligation Risk** (Managing compliance milestones and preventing financial penalties)
3. **Project Delivery Risk** (Detecting schedule drift, blocked tasks, and resource bottlenecks)

OpsGuard is **RocketRide-native and pipeline-driven**. It executes operational analysis, deterministic risk scoring, multi-agent reasoning, critic review, human approval workflows, and continuous learning datasets through native **RocketRide `.pipe` Pipelines**.

---

## 2. Directory & Workspace Structure

```
c:/Users/hp/OneDrive/Desktop/rocketride hackathon/
├── ROCKETRIDE_MIGRATION_PLAN.md    # Capability migration matrix
├── ROCKETRIDE_MIGRATION_REPORT.md  # Migration report & manual task summary
├── OpsGuard_PRD.md                 # Product Requirements Document
├── OpsGuard_BUILD_GUIDE.md           # 4-Phase Build Execution Guide
├── PROJECT_DOCUMENTATION.md        # Comprehensive Project Documentation
├── pnpm-workspace.yaml             # Monorepo workspace configuration
├── .env                            # RocketRide server connection credentials
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
│       └── MANUAL_SETUP.md         # Manual graphical builder setup guide
│
├── apps/                           # Applications Monorepo Folder
│   └── opsguard-ui/                # Primary OpsGuard RocketRide App
│       ├── package.json            # App Manifest & Module Federation config
│       ├── rsbuild.config.mts      # Rsbuild bundler config with .pipe loader
│       ├── tsconfig.json           # Strict TypeScript configuration
│       ├── opsguard.rrapp          # RocketRide App trigger file
│       ├── icon.svg & README.md    # App assets
│       └── src/
│           ├── index.ts            # Module Federation async boundary
│           ├── AppDescriptor.ts    # Shell entry descriptor (`teamnext.opsguard`)
│           ├── global.d.ts         # *.pipe module declarations
│           ├── App.tsx             # Root Layout with 12 operational views
│           ├── types/
│           │   └── opsguard.ts     # Strict TypeScript & Security interfaces
│           ├── pipelines/
│           │   └── rocketridePipelineOrchestrator.ts # RocketRide pipeline execution bridge
│           ├── workspace/
│           │   ├── RiskWorkspace.tsx          # Unified 1-page Risk Workspace
│           │   └── RiskTimeline.tsx           # Visual chronological risk timeline
│           ├── admin/
│           │   └── SystemDocumentationView.tsx# Admin technical documentation
│           ├── learning/
│           │   ├── feedbackStore.ts            # Learning record store & human decision capture
│           │   ├── feedbackAnalyzer.ts         # Dynamic AI/Human agreement analytics
│           │   ├── recommendationLearning.ts   # Discovered human intervention patterns
│           │   ├── outcomeLearning.ts          # Outcome-to-prediction accuracy correlation
│           │   ├── trainingDatasetBuilder.ts   # Data-leakage-free feedback dataset generator
│           │   ├── modelImprovement.ts         # Candidate vs Active model evaluation engine
│           │   ├── ragOperationalMemory.ts     # RAG context retrieval engine for agents
│           │   └── llmTrainingAdapter.ts       # Fine-tuning adapter abstraction interface
│           ├── security/
│           │   ├── rbac.ts                    # RBAC roles & permissions matrix
│           │   ├── policyEngine.ts            # Centralized Security Policy Engine
│           │   ├── protectedRiskEngine.ts     # Risk Engine protection & score sanitization
│           │   ├── weightGovernance.ts       # Model weight governance & audit logs
│           │   ├── modelIntegrity.ts          # Cryptographic SHA-256 model hash verifier
│           │   ├── datasetSecurity.ts         # Dataset validation & immutable versioning
│           │   ├── toolSecurity.ts            # Assistant tool permission validator
│           │   ├── promptSanitizer.ts         # Prompt injection defense & data boundaries
│           │   ├── approvalStateMachine.ts    # Human approval state machine & idempotency
│           │   ├── tamperEvidentAudit.ts      # SHA-256 hash-chained audit trail
│           │   └── systemProtection.ts        # Protected Mode state manager
│           ├── normalizer/
│           │   └── inputNormalizer.ts # Raw input normalization & validation
│           ├── router/
│           │   └── domainRouter.ts    # Domain-specific pipeline routing
│           ├── risk-engine/
│           │   ├── config.ts          # Configurable model feature weights
│           │   ├── baselineModels.ts  # Deterministic Risk Models & driver scoring
│           │   ├── riskEngine.ts      # Core Risk Engine facade
│           │   └── simulator.ts       # What-If risk simulation engine
│           ├── agents/
│           │   ├── signalAgent.ts     # Signal Detection Agent
│           │   ├── evidenceAgent.ts   # Evidence Compilation & Classification Agent
│           │   ├── rootCauseAgent.ts  # Root Cause & Reasoning Agent
│           │   ├── actionPlannerAgent.ts # Action Planner Agent (RAG memory integrated)
│           │   ├── criticAgent.ts     # Critic Agent (Challenges action plans)
│           │   └── assistantTools.ts  # Executable tool registry for Operations Assistant
│           ├── historical/
│           │   └── historicalCaseStore.ts # Historical case store & similarity search
│           ├── outcomes/
│           │   └── outcomeTracker.ts  # Outcome Feedback Loop logging
│           ├── ml/
│           │   ├── datasetValidator.ts# CSV dataset validator & synthetic demo datasets
│           │   ├── mlBackendAdapter.ts# ML training engine & metrics calculator
│           │   └── modelRegistry.ts   # Model Registry & candidate model activation
│           ├── data/
│           │   └── mockOpsGuardData.ts # Pre-populated active incidents & settings
│           └── components/
│               ├── dashboard/
│               │   ├── MetricsGrid.tsx     # KPI Summary Cards (₹ Exposure)
│               │   ├── RiskCard.tsx        # Muted Enterprise Risk Cards
│               │   └── OperationsInbox.tsx # Severity tabs & search toolbar
│               ├── analyze/
│               │   └── AnalyzeRiskWorkflow.tsx # 3-Domain Risk Analysis Workflow
│               ├── incident/
│               │   └── IncidentDetailModal.tsx # Incident inspector delegating to RiskWorkspace
│               ├── ai/
│               │   └── OpsGuardAgentChat.tsx  # Tool-using Operations Assistant
│               ├── training/
│               │   ├── ModelTrainingView.tsx  # Dataset preview, validation & ML training
│               │   └── ModelRegistryView.tsx  # Model Registry & activation controls
│               ├── historical/
│               │   └── HistoricalCasesView.tsx# Searchable historical case store
│               ├── simulation/
│               │   └── RiskSimulatorView.tsx  # What-If risk simulation sandbox
│               ├── security/
│               │   └── SecurityStatusView.tsx # Security & Integrity view & RBAC tester
│               ├── learning/
│               │   └── LearningCenterView.tsx # 🧠 Learning Center & candidate comparison
│               ├── audit/
│               │   └── AuditTrailView.tsx     # Full system auditability log
│               └── settings/
│                   └── SettingsPanel.tsx     # System settings & model weights
│
└── .vscode/
    └── launch.json                 # VS Code debugging configurations
```

---

## 3. Active RocketRide Pipelines

- `opsguard.analyzeRisk`: Primary operational risk pipeline (`docs/rocketride/analyzeRisk.pipe`).
- `opsguard.customerChurnRisk`: Customer Churn Risk domain pipeline (`docs/rocketride/customerChurn.pipe`).
- `opsguard.simulateRisk`: What-If Risk Simulation pipeline (`docs/rocketride/simulateRisk.pipe`).
- `opsguard.approveAction`: Human Approval state machine pipeline (`docs/rocketride/approval.pipe`).

---

## 4. Verification & Build Status

- **TypeScript Typecheck**: `npm run typecheck` in `apps/opsguard-ui/` compiles cleanly with **0 errors**.
- **Production Bundle**: `npm run build` in `apps/opsguard-ui/` compiles in **0.41s**, producing Module Federation remote entry bundles in `dist/`.
