# OpsGuard: AI Operations Control System
## Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** MVP  
**Last Updated:** September 2026  
**Target Launch:** RocketRide Buildathon 2026

---

## 1. Executive Summary

OpsGuard is an AI-powered operations control system that watches business operations, detects problems, investigates their causes, and prepares actions for human approval.

**Vision:** Enable business leaders to proactively manage operational risks through AI-assisted detection, investigation, and reasoning—while maintaining human control over critical decisions.

**Core Promise:** Transform reactive incident management into proactive risk management through intelligent monitoring and human-in-the-loop workflow automation.

**Target Users:** Operations managers, finance teams, account managers, project leads, and business operations directors at mid-market B2B SaaS companies.

---

## 2. Product Scope & Core Workflows

### 2.1 Three Operational Risk Domains (MVP)

OpsGuard monitors three critical business areas:

#### A. **Customer Risk** (Churn Prevention)
- Monitors customer health signals
- Detects churn probability
- Identifies intervention opportunities
- Protects ARR exposure

**Key Signals:**
- Usage trends (decline detection)
- Support ticket volume and sentiment
- Payment patterns
- Contract renewal proximity
- Feature adoption rates

**Example Alert:**
```
ACME Corp - Churn Risk: 78%
₹24L ARR Exposure
Usage declined 46% in 90 days
5 support complaints in 14 days
Renewal in 23 days
```

---

#### B. **Contract Risk** (Obligation Management)
- Monitors contractual obligations
- Detects approaching deadlines
- Identifies financial penalties at risk
- Ensures compliance

**Key Signals:**
- Obligation due dates
- Penalty amounts
- Owner assignment
- Historical compliance

**Example Alert:**
```
NDA Obligation - Contract Risk: HIGH
Potential Penalty: ₹8L
Due Date: 7 days
Owner: Unassigned
```

---

#### C. **Project Risk** (Delivery Management)
- Monitors project health
- Detects delivery delays early
- Identifies root causes
- Recommends mitigation

**Key Signals:**
- Task completion rates
- Milestone progress
- Deadline proximity
- Blocker identification
- Resource allocation

**Example Alert:**
```
Project Alpha - Delivery Risk: HIGH
Estimated Delay: 11 days
12 blocked tasks
2 critical dependencies unmet
```

---

### 2.2 Core Workflow: The Intelligence Chain

```
┌─────────────┐
│ Operations  │
│ Data        │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Monitor Agent               │
│ • Identifies abnormalities  │
│ • Creates incidents         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Investigator Agent          │
│ • Gathers supporting data   │
│ • Creates evidence bundle   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Risk Agent                  │
│ • Calculates severity       │
│ • Assigns risk score        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Reasoning Agent             │
│ • Explains the problem      │
│ • Identifies root causes    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Action Planner Agent        │
│ • Proposes interventions    │
│ • Estimates impact          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Human Approval              │
│ • Review evidence           │
│ • Approve/Reject/Modify     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Audit Trail & Execution     │
│ • Record decisions          │
│ • Create tasks/actions      │
└─────────────────────────────┘
```

---

## 3. Feature Set

### 3.1 Dashboard (Main Hub)

**Primary Screen:** Overview of all operational risks and system status

**Key Components:**

1. **Header Section**
   - Product logo and title
   - Global search functionality
   - Notifications bell (alerts for critical risks)
   - User profile/settings dropdown

2. **Metrics Cards (KPI Panel)**
   ```
   ┌──────────────┬──────────────┬──────────────┬──────────────┐
   │     47       │      8       │      13      │   ₹42.8L    │
   │   Active     │   Critical   │   Pending    │  Potential  │
   │    Risks     │    Risks     │  Approvals   │  Exposure   │
   └──────────────┴──────────────┴──────────────┴──────────────┘
   ```

3. **Risk Severity Filter Tabs**
   - Critical (red)
   - High (orange)
   - Medium (yellow)
   - Low (gray)
   - Resolved (checkmark)

4. **Operations Inbox** (Primary Content Area)
   - Sortable list of active risks
   - Each card shows:
     - Risk type and entity (Customer/Contract/Project)
     - Risk score and severity indicator
     - Key metrics (ARR at risk, penalty, delay)
     - Quick action button ([Investigate])
   - Infinite scroll or pagination
   - Search/filter capabilities

5. **Quick Stats Section**
   - This week's new risks
   - Risks approved and actioned
   - Risks resolved
   - Average resolution time

---

### 3.2 Risk Detail Page

**Accessed by:** Clicking "Investigate" on a risk card

**Structure:**

#### Header
```
┌─────────────────────────────────────────────┐
│ Entity Name (e.g., "ACME Corp")            │
│ Risk Type: CHURN RISK                       │
│ Score: 78% | Severity: HIGH | Confidence: 91% │
│ Last Updated: 2 hours ago                   │
│ Status: [Pending Approval] [Investigating]  │
└─────────────────────────────────────────────┘
```

#### 1. **Why Section** (Risk Signals)
A summary table of the top contributing signals with weights:

```
┌─────────────────────────────────────────┐
│ Risk Signal Analysis                    │
├─────────────────────────┬────────────────┤
│ Usage Declined          │ -46%   (HIGH)  │
│ Support Complaints      │ 5      (HIGH)  │
│ Open Critical Issues    │ 2      (HIGH)  │
│ Renewal Proximity       │ 23 days (MED)  │
│ Payment Delays          │ 1      (LOW)   │
└─────────────────────────┴────────────────┘
```

#### 2. **Evidence Section** (Data-Driven Proof)
Multiple evidence cards, each with data visualization:

**Example 1: Usage Trends Chart**
```
Customer Usage
────────────────────────────
June       1,842 events
July       1,201 events  ↓ 35%
August       991 events  ↓ 17%

Trend: -46% over 90 days
Impact: Revenue risk
```

**Example 2: Support Sentiment Analysis**
```
Support Tickets
────────────────────────────
Last 14 days: 5 tickets

Sentiment Breakdown:
- Negative: 3 ("performance", "slow")
- Neutral: 2

Topics: Performance issues (60%)
```

**Example 3: Contract Milestones**
```
Contract Timeline
────────────────────────────
Renewal Date: Sept 15, 2026
Days Until: 23
Typical Renewal Rate: 85%
This Customer: 78% (at risk)
```

#### 3. **AI Analysis Section** (Reasoning)

A readable explanation from the Reasoning Agent:

```
┌─────────────────────────────────────────┐
│ AI ANALYSIS & INTERPRETATION            │
├─────────────────────────────────────────┤
│                                         │
│ ACME Corp shows multiple churn signals │
│ consistent with at-risk patterns.       │
│                                         │
│ Primary Risk Factors:                   │
│                                         │
│ 1. Usage Decline (46%)                  │
│    Indicates decreasing value realization│
│                                         │
│ 2. Support Escalation (5 tickets)       │
│    Product reliability concerns         │
│                                         │
│ 3. Renewal Timing (23 days)             │
│    Decision point approaching           │
│                                         │
│ 4. Unresolved Critical Issues (2)       │
│    Blocking value delivery              │
│                                         │
│ Combined Effect:                        │
│ High probability of churn or            │
│ significantly reduced contract value    │
│                                         │
│ Confidence: 91%                         │
│ Historical Accuracy: 89%                │
└─────────────────────────────────────────┘
```

#### 4. **Recommended Action Section**

The Action Planner's proposed intervention:

```
┌─────────────────────────────────────────┐
│ RECOMMENDED INTERVENTION                │
├─────────────────────────────────────────┤
│                                         │
│ Action Plan: Account Recovery          │
│                                         │
│ Steps:                                  │
│                                         │
│ 1. Assign Senior Customer Success       │
│    Manager (CSM)                        │
│    → Establishes executive relationship │
│                                         │
│ 2. Escalate 2 Critical Support Tickets  │
│    → Priority engineering review        │
│    → 48-hour resolution target          │
│                                         │
│ 3. Schedule Executive Account Review    │
│    → Understand success gaps            │
│    → Revisit use cases and ROI          │
│                                         │
│ 4. Offer Approved Recovery Package      │
│    → 20% discount for 90 days           │
│    → Complimentary strategic review     │
│    → Priority support tier              │
│                                         │
│ Expected Impact:                        │
│ • Reduce churn risk from 78% → 45%      │
│ • Protect ₹24L ARR                      │
│ • 60% recovery probability              │
│                                         │
│ Implementation Timeline: 2-3 days       │
│ Required Approval: Finance + Leadership │
└─────────────────────────────────────────┘
```

#### 5. **Agent Timeline** (Process Transparency)

Shows the investigation workflow:

```
┌─────────────────────────────────────────┐
│ AI INVESTIGATION TIMELINE               │
├─────────────────────────────────────────┤
│                                         │
│ ✓ Monitor Agent        09:42           │
│   Detected abnormal customer activity   │
│                                         │
│ ✓ Investigator Agent   09:42           │
│   Retrieved 17 relevant records         │
│   • 3 months usage data                 │
│   • 5 support tickets                   │
│   • Contract information                │
│   • Payment history                     │
│                                         │
│ ✓ Risk Agent           09:43           │
│   Calculated risk score: 78%            │
│   Confidence interval: 91%              │
│                                         │
│ ✓ Reasoning Agent      09:43           │
│   Identified 4 major risk signals       │
│   Generated explanation                 │
│                                         │
│ ✓ Action Planner       09:44           │
│   Created recovery plan                 │
│   Evaluated 6 potential interventions   │
│                                         │
│ ⏳ Human Approval      Pending         │
│   Waiting for manager decision          │
│                                         │
│ Total Investigation Time: 2 minutes     │
│ Ready for Review: Yes                   │
└─────────────────────────────────────────┘
```

#### 6. **Action Buttons (Human Control)**

```
┌─────────────────────────────────────────┐
│                                         │
│  [✓ Approve & Execute]  [✗ Reject]    │
│                         [✏ Modify]     │
│                                         │
│  [Add Notes]  [Share]  [Watch]          │
│                                         │
└─────────────────────────────────────────┘
```

**Action Behaviors:**
- **Approve & Execute:** Creates tasks, sends notifications, records in audit log
- **Reject:** Marks incident as reviewed but rejected; requires reason
- **Modify:** Opens recommendation editor; changes action details before approving

#### 7. **Audit History Section**

Shows all actions and decisions on this incident:

```
┌─────────────────────────────────────────┐
│ AUDIT TRAIL                             │
├─────────────────────────────────────────┤
│                                         │
│ 09:44  System                           │
│        Risk score calculated: 78%       │
│                                         │
│ 09:45  System                           │
│        Recommendation generated         │
│                                         │
│ 10:12  Sarah (Manager)                  │
│        Reviewed incident                │
│        Added note: "Urgent - ACME is    │
│        important account"               │
│                                         │
│ 10:15  Sarah (Manager)                  │
│        Modified discount: 20% → 25%     │
│                                         │
│ 10:16  Sarah (Manager)                  │
│        Approved and executed plan       │
│                                         │
│ 10:16  System                           │
│        Created 3 escalation tasks       │
│        Sent notification to CSM team    │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.3 Approval/Action Workflow UI

**When user clicks an action that requires approval (e.g., send email):**

```
┌──────────────────────────────────────────┐
│ REVIEW BEFORE SENDING                    │
├──────────────────────────────────────────┤
│                                          │
│ TO: customer@acme.com                    │
│                                          │
│ SUBJECT:                                 │
│ Account Review - ACME Corp               │
│                                          │
│ BODY:                                    │
│ ─────────────────────────────────────── │
│                                          │
│ Dear ACME leadership team,                │
│                                          │
│ We've noticed some recent changes in     │
│ your usage patterns and want to ensure   │
│ you're getting maximum value...          │
│                                          │
│ ─────────────────────────────────────── │
│                                          │
│ [✏ Edit]                                 │
│ [✗ Reject]                               │
│ [✓ Approve & Send]                       │
│                                          │
└──────────────────────────────────────────┘
```

---

### 3.4 Settings & Configuration Panel

**Accessible from profile dropdown:**

1. **Risk Thresholds**
   - Churn risk threshold (default: 65%)
   - Contract deadline alert window (default: 14 days)
   - Project delay threshold (default: 5% of timeline)

2. **Notification Preferences**
   - Critical risk alerts (real-time)
   - High risk alerts (daily digest)
   - Approval required notifications
   - Email vs in-app notifications

3. **Data Sources**
   - Connected systems (future)
   - Data refresh frequency
   - Historical data retention

4. **Team & Permissions**
   - Role assignments (Admin, Manager, Viewer)
   - Approval authority levels
   - Action execution permissions

---

## 4. Technical Architecture

### 4.1 Technology Stack

#### **Frontend**
- **Framework:** Next.js 14+ (TypeScript)
- **UI Framework:** React 18+
- **Styling:** Tailwind CSS 3.4+
- **Component Library:** shadcn/ui
- **State Management:** TanStack Query (React Query) for server state
- **Charts & Visualization:** Recharts, Chart.js
- **Form Management:** React Hook Form + Zod
- **HTTP Client:** Axios with interceptors
- **Development:** Vite for dev server (via Next.js)

#### **Backend**
- **Runtime:** Node.js 20+ LTS
- **Framework:** Next.js API Routes + Server Actions
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Background Jobs:** node-cron (simple MVP) → Bull/BullMQ (production)
- **Authentication:** NextAuth.js with JWT
- **API Documentation:** OpenAPI/Swagger

#### **AI/LLM Layer**
- **Local LLM Engine:** Ollama
- **Model:** Mistral 7B (recommended) or Llama 2 7B
- **Orchestration:** LangChain (Node.js) or custom agent framework
- **Vector Store:** Not required for MVP (can add later)
- **Prompt Management:** Custom template system
- **Agent Framework:** Custom TypeScript implementation (structured outputs)

#### **Infrastructure (MVP)**
- **Hosting:** Vercel (frontend) or Railway (full stack)
- **Database Hosting:** Supabase (managed PostgreSQL)
- **Ollama Deployment:** Local server or Railway container
- **File Storage:** S3-compatible or local filesystem
- **Monitoring:** Sentry (error tracking), custom logging
- **CI/CD:** GitHub Actions

---

### 4.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│         Next.js + React + TypeScript + Tailwind         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Dashboard   │  │ Risk Detail  │  │  Settings    │  │
│  │  Screen      │  │  Page        │  │  Panel       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP/HTTPS
┌────────────────────▼─────────────────────────────────────┐
│                 API LAYER (Next.js)                      │
│              TypeScript + Prisma ORM                     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ REST API Endpoints                               │  │
│  │ • GET /api/incidents                             │  │
│  │ • GET /api/incidents/:id                         │  │
│  │ • POST /api/incidents/:id/approve                │  │
│  │ • POST /api/incidents/:id/reject                 │  │
│  │ • GET /api/dashboard/metrics                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Agent Controllers                                │  │
│  │ • MonitorController                              │  │
│  │ • InvestigatorController                         │  │
│  │ • RiskController                                 │  │
│  │ • ReasoningController                            │  │
│  │ • ActionPlannerController                        │  │
│  │ • ApprovalController                             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Business Logic Layer                             │  │
│  │ • IncidentService                                │  │
│  │ • RiskEngine (deterministic calculations)        │  │
│  │ • AuditService                                   │  │
│  │ • NotificationService                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────────┐ │
│   DATABASE   │ │   OLLAMA    │ │
│  PostgreSQL  │ │   LLM API   │ │
│  (Supabase)  │ │ (Local/Cloud)
└──────────────┘ └─────────────┘
        │
┌───────▼─────────────────────────┐
│     DATA LAYER                  │
│                                 │
│ • Customers                     │
│ • Usage Events                  │
│ • Contracts                     │
│ • Obligations                   │
│ • Projects & Tasks              │
│ • Support Tickets               │
│ • Incidents                     │
│ • Recommendations               │
│ • Audit Events                  │
└─────────────────────────────────┘
```

---

### 4.3 Database Schema

```sql
-- Core Business Entities

CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  arr DECIMAL(12, 2),
  status VARCHAR(50), -- active, at-risk, churn
  renewal_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  date DATE,
  event_count INT,
  active_users INT,
  feature_usage JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  priority VARCHAR(50), -- critical, high, medium, low
  sentiment VARCHAR(50), -- positive, neutral, negative
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  description TEXT,
  tags JSONB
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  name VARCHAR(255),
  start_date DATE,
  end_date DATE,
  value DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE obligations (
  id UUID PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id),
  description TEXT,
  due_date DATE,
  owner VARCHAR(255),
  penalty DECIMAL(12, 2),
  status VARCHAR(50), -- pending, completed, missed
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  deadline DATE,
  budget DECIMAL(12, 2),
  status VARCHAR(50), -- planning, in-progress, at-risk, complete
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  name VARCHAR(255),
  status VARCHAR(50), -- not-started, in-progress, blocked, complete
  due_date DATE,
  assignee VARCHAR(255),
  dependencies JSONB, -- array of task IDs
  created_at TIMESTAMP DEFAULT NOW()
);

-- Risk Management Entities

CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  type VARCHAR(50), -- customer_churn, contract_deadline, project_delay
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50), -- customer, contract, project
  severity VARCHAR(50), -- critical, high, medium, low
  risk_score DECIMAL(3, 2), -- 0.0 to 1.0
  confidence DECIMAL(3, 2),
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50), -- detecting, investigating, pending_approval, approved, rejected, actioned, resolved
  evidence JSONB, -- array of evidence objects
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE TABLE recommendations (
  id UUID PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES incidents(id),
  action TEXT,
  reasoning TEXT,
  confidence DECIMAL(3, 2),
  expected_impact TEXT,
  estimated_effort VARCHAR(50), -- low, medium, high
  status VARCHAR(50), -- proposed, approved, rejected, executed
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by VARCHAR(255),
  executed_at TIMESTAMP
);

-- Audit Trail

CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  incident_id UUID REFERENCES incidents(id),
  recommendation_id UUID REFERENCES recommendations(id),
  event_type VARCHAR(50), -- risk_detected, evidence_added, risk_calculated, reasoning_generated, action_approved, action_executed
  actor VARCHAR(255), -- 'system' or user email
  actor_role VARCHAR(50),
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- User Management

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50), -- admin, manager, viewer
  status VARCHAR(50), -- active, inactive
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  churn_risk_threshold DECIMAL(3, 2) DEFAULT 0.65,
  contract_alert_window INT DEFAULT 14,
  project_delay_threshold DECIMAL(3, 2) DEFAULT 0.05,
  notification_preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance

CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_entity ON incidents(entity_type, entity_id);
CREATE INDEX idx_recommendations_incident ON recommendations(incident_id);
CREATE INDEX idx_audit_incident ON audit_events(incident_id);
CREATE INDEX idx_usage_customer_date ON usage(customer_id, date);
```

---

### 4.4 Agent Architecture

#### **Monitor Agent**
- **Input:** Daily data snapshots (customers, contracts, projects)
- **Logic:** Deterministic rules + ML scoring
- **Output:** Incident creation
- **Implementation:**
  ```typescript
  interface MonitorAgent {
    detectCustomerChurn(): Promise<Incident[]>;
    detectContractDeadlines(): Promise<Incident[]>;
    detectProjectDelays(): Promise<Incident[]>;
  }
  ```

#### **Investigator Agent**
- **Input:** Incident + Entity ID
- **Logic:** Queries related data, compiles evidence
- **Output:** Evidence bundle with citations
- **Uses Ollama:** No (deterministic data gathering)
- **Implementation:**
  ```typescript
  interface InvestigatorAgent {
    investigateCustomerChurn(customerId: string): Promise<EvidenceBundle>;
    investigateContractRisk(contractId: string): Promise<EvidenceBundle>;
    investigateProjectRisk(projectId: string): Promise<EvidenceBundle>;
  }
  ```

#### **Risk Agent**
- **Input:** Incident + Evidence bundle
- **Logic:** Weighted scoring of risk signals
- **Output:** risk_score, confidence, severity
- **Uses Ollama:** No (structured calculation)
- **Implementation:**
  ```typescript
  interface RiskAgent {
    calculateRiskScore(incident: Incident, evidence: EvidenceBundle): {
      score: number;
      confidence: number;
      severity: 'critical' | 'high' | 'medium' | 'low';
      weights: Record<string, number>;
    };
  }
  ```

#### **Reasoning Agent**
- **Input:** Incident + Evidence + Risk Score
- **Logic:** LLM-powered synthesis and explanation
- **Output:** Human-readable reasoning, root causes
- **Uses Ollama:** Yes
- **Implementation:**
  ```typescript
  interface ReasoningAgent {
    generateReasoning(
      incident: Incident,
      evidence: EvidenceBundle,
      riskScore: number
    ): Promise<{
      explanation: string;
      rootCauses: string[];
      contributingFactors: string[];
      confidence: number;
    }>;
  }
  ```

#### **Action Planner Agent**
- **Input:** Incident + Reasoning + Business rules
- **Logic:** LLM-powered action generation
- **Output:** Recommended actions with impact estimates
- **Uses Ollama:** Yes
- **Implementation:**
  ```typescript
  interface ActionPlannerAgent {
    planAction(
      incident: Incident,
      reasoning: ReasoningOutput
    ): Promise<{
      actions: Action[];
      primaryAction: Action;
      expectedImpact: string;
      estimatedEffort: 'low' | 'medium' | 'high';
      timeline: string;
    }>;
  }
  ```

#### **Approval Agent**
- **Input:** Recommendation
- **Logic:** Routes to appropriate approver, waits for decision
- **Output:** Approval/rejection with audit trail
- **Uses Ollama:** No (workflow management)
- **Implementation:**
  ```typescript
  interface ApprovalAgent {
    routeForApproval(recommendation: Recommendation): Promise<void>;
    recordApproval(
      recommendationId: string,
      decision: 'approved' | 'rejected' | 'modified',
      userId: string,
      reason?: string
    ): Promise<void>;
  }
  ```

---

### 4.5 Ollama LLM Integration

#### **Local Ollama Setup**

```bash
# Pull model
ollama pull mistral

# Run server
ollama serve

# Server listens on http://localhost:11434
```

#### **LangChain Integration**

```typescript
import { Ollama } from "@langchain/community/llms/ollama";

const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "mistral",
  temperature: 0.3, // Low temperature for consistency
  topP: 0.9,
  numPredict: 1000, // Max tokens
});

// Usage in agent
const reasoning = await ollama.invoke(
  `Analyze this business risk and explain why it matters...`
);
```

#### **Structured Output Strategy**

Since Ollama models may not support function calling like GPT, use prompt engineering + JSON parsing:

```typescript
async function generateReasoningWithStructure(
  incident: Incident,
  evidence: EvidenceBundle
): Promise<ReasoningOutput> {
  const prompt = `
    Analyze the following business incident and provide structured reasoning.
    
    Incident: ${incident.title}
    Risk Score: ${incident.risk_score}
    
    Evidence:
    ${formatEvidence(evidence)}
    
    Respond ONLY with valid JSON (no markdown, no preamble):
    {
      "explanation": "Clear explanation of why this is a risk",
      "rootCauses": ["cause1", "cause2", "cause3"],
      "contributingFactors": ["factor1", "factor2"],
      "keyInsight": "Most important insight",
      "confidence": 0.85
    }
  `;

  const response = await ollama.invoke(prompt);
  const cleaned = response.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
```

#### **Model Selection**

**Recommended:** Mistral 7B
- **Strengths:**
  - Good instruction following
  - Fast inference (4-8 tokens/sec on CPU, 20+ on GPU)
  - Better reasoning than Llama 2
  - Smaller context window manageable
  - Active community support

**Alternative:** Llama 2 7B
- Good general performance
- Lower resource requirements
- Slightly slower reasoning

**Not Recommended for MVP:** 13B+ models (too slow on consumer hardware)

#### **Performance Optimization**

```typescript
// Use GPU if available
export const OLLAMA_CONFIG = {
  baseUrl: process.env.OLLAMA_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "mistral",
  temperature: 0.3,
  timeout: 60000, // 60 second timeout
  maxRetries: 3,
};

// Cache prompts to reduce latency
const reasoningCache = new Map<string, ReasoningOutput>();

async function cachedReasoning(key: string, generator: () => Promise<ReasoningOutput>) {
  if (reasoningCache.has(key)) {
    return reasoningCache.get(key)!;
  }
  const result = await generator();
  reasoningCache.set(key, result);
  return result;
}
```

---

## 5. Frontend Design System

### 5.1 Design Principles

1. **Operational Focus:** Information-dense but scannable
2. **Human-in-the-Loop:** Clear decision points and approval flows
3. **Trust Through Transparency:** Show evidence, reasoning, and audit trails
4. **Dark/Light Mode Support:** Professional B2B interface
5. **Mobile-Friendly:** Responsive design for managers on-the-go

### 5.2 Color Palette

```
Primary:      #0066CC (Brand blue)
Success:      #10B981 (Green - approved)
Warning:      #F59E0B (Amber - caution)
Danger:       #EF4444 (Red - critical)
Neutral:      #6B7280 (Gray - secondary)

Severity Mapping:
Critical → #EF4444
High     → #F59E0B
Medium   → #FBBF24
Low      → #10B981
Resolved → #6B7280

Risk Score Colors (0.0 → 1.0):
0.0-0.3   → Green (#10B981)
0.3-0.6   → Amber (#F59E0B)
0.6-0.8   → Orange (#FF8C00)
0.8-1.0   → Red (#EF4444)
```

### 5.3 Typography

```
Font Family: Inter (sans-serif)
Weight: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

Headings:
H1: 32px / 40px (bold) - Page titles
H2: 24px / 32px (semibold) - Section headers
H3: 18px / 28px (semibold) - Subsection headers
H4: 16px / 24px (medium) - Card titles

Body:
Large: 16px / 24px - Body text, action items
Regular: 14px / 20px - Default body text
Small: 12px / 18px - Secondary text, labels
Tiny: 11px / 16px - Captions, timestamps
```

### 5.4 Component Library (shadcn/ui + Custom)

**Core Components:**
- Button (primary, secondary, ghost, destructive)
- Card with header/body/footer sections
- Badge for severity/status
- Alert for notifications
- Dialog/Modal for confirmations
- Tabs for filtering
- Table with sorting
- Chart components (Recharts)
- Input fields with validation
- Dropdown/Select
- Toast notifications
- Skeleton loaders

**Custom Components:**
- RiskCard (incident summary card)
- RiskBadge (severity indicator)
- EvidencePanel (data visualization)
- RecommendationCard (action proposal)
- ApprovalPanel (decision interface)
- AgentTimeline (process visualization)
- MetricsGrid (KPI display)

### 5.5 Layout Specifications

**Dashboard Grid:**
- 12-column responsive grid
- Desktop (1200px+): 12 columns
- Tablet (768px-1199px): 8 columns
- Mobile (320px-767px): 4 columns

**Cards:**
- Padding: 1.5rem (24px)
- Border radius: 0.5rem (8px)
- Border: 1px solid #E5E7EB
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

**Spacing:**
- 4px, 8px, 12px, 16px, 24px, 32px, 48px (8px scale)

---

### 5.6 Key Screens Wireframes

#### Dashboard Mobile (320px)
```
┌─────────────────┐
│ OpsGuard        │
│ [Menu] [⚙]      │
├─────────────────┤
│ 47 Risks        │
│ 8 Critical      │
│ ₹42.8L Exposure │
├─────────────────┤
│ CRITICAL        │
│ ACME Corp       │
│ Churn: 78%      │
│ ₹24L at risk    │
│ [Investigate]   │
├─────────────────┤
│ HIGH            │
│ NDA Obligation  │
│ Due: 7 days     │
│ ₹8L penalty     │
│ [Review]        │
└─────────────────┘
```

#### Risk Detail Tablet (768px)
```
┌──────────────────────────────┐
│ ACME Corp | Risk: 78%        │
├──────────────────────────────┤
│ Why        │ Evidence        │
├──────────────────────────────┤
│ Usage: ↓46%│ Usage Chart     │
│ Support: ↑5│ Tickets        │
│ Renewal: 23│ Timeline       │
├──────────────────────────────┤
│ AI ANALYSIS                  │
│ ...reasoning...              │
├──────────────────────────────┤
│ RECOMMENDED ACTION           │
│ 1. Assign CSM                │
│ 2. Escalate tickets          │
│ 3. Schedule review           │
│ 4. Offer discount            │
├──────────────────────────────┤
│ [Approve] [Reject] [Modify]  │
└──────────────────────────────┘
```

---

## 6. Development Phases

### **Phase 0: Project Setup (1-2 days)**

**Deliverables:**
- Repository initialized
- Development environment configured
- Database schema created and migrated
- Seeded data populated (50 customers, 100 contracts, etc.)
- Basic authentication implemented

**Tasks:**
- Initialize Next.js project with TypeScript
- Set up Prisma with PostgreSQL/Supabase
- Create database schema
- Generate seeded data JSON files
- Implement NextAuth.js basic setup
- Set up development environment docs

**Acceptance Criteria:**
- `npm run dev` starts app successfully
- Database has ~100K records seeded
- Login works with test account
- API health check endpoint responds

---

### **Phase 1: Foundation & Dashboard (3-4 days)**

**Deliverables:**
- Dashboard MVP with KPI metrics
- Risk card components
- Incident detail page basic structure
- Navigation and routing

**Tasks:**

1. **Frontend Components**
   - Create dashboard layout
   - Build MetricsGrid (4 KPI cards)
   - Build RiskCard component (reusable)
   - Implement risk filtering by severity
   - Create incident detail page shell

2. **API Endpoints**
   - `GET /api/dashboard/metrics` (total risks, critical, pending, exposure)
   - `GET /api/incidents?status=pending&severity=critical` (list)
   - `GET /api/incidents/:id` (detail)

3. **Styling & UX**
   - Set up Tailwind CSS
   - Create color system tokens
   - Implement responsive layouts
   - Dark/light mode support

**Acceptance Criteria:**
- Dashboard loads with hardcoded metrics
- Risk cards display in a grid
- Clicking risk card opens detail page
- Responsive on mobile, tablet, desktop
- All colors match design system

---

### **Phase 2: Deterministic Risk Detection (2-3 days)**

**Deliverables:**
- Automated incident creation
- Risk signal calculation
- Daily monitoring job

**Tasks:**

1. **Monitor Agent (Deterministic)**
   ```typescript
   // Customer churn detection
   if (usageDecline > 30% && daysUntilRenewal < 30) {
     createIncident('customer_churn', customerId);
   }

   // Contract deadline detection
   if (daysUntilObligation < 14 && status !== 'completed') {
     createIncident('contract_deadline', obligationId);
   }

   // Project delay detection
   if (completionRate < expectedRate && daysUntilDeadline < 14) {
     createIncident('project_delay', projectId);
   }
   ```

2. **Risk Scoring Engine**
   - Weighted signal calculation
   - Severity classification
   - Deterministic confidence scoring

3. **Scheduled Job**
   - Set up node-cron for daily runs
   - Implement idempotency (no duplicate incidents)
   - Log execution and results

4. **Evidence Gathering**
   - Query related data
   - Compile into evidence objects
   - Store with incident

**Acceptance Criteria:**
- Dashboard populated with real incidents
- Incidents created from seeded data
- Evidence visible on incident detail page
- No duplicate incidents created
- Daily job runs successfully

---

### **Phase 3: AI Agents - Reasoning & Action (3-4 days)**

**Deliverables:**
- Ollama integration
- Reasoning Agent implementation
- Action Planner Agent implementation
- Agent timeline UI component

**Tasks:**

1. **Ollama Integration**
   - Set up local Ollama server
   - Pull Mistral 7B model
   - Create LangChain adapter
   - Implement retry logic and caching
   - Error handling for LLM timeouts

2. **Reasoning Agent**
   - Implement LLM prompt template
   - Structured output parsing (JSON)
   - Evidence synthesis
   - Root cause identification
   - Store reasoning with incident

3. **Action Planner Agent**
   - Implement action generation prompt
   - Generate 2-3 action alternatives
   - Rank by feasibility
   - Estimate impact and effort
   - Create Recommendation entity

4. **UI Components**
   - Build AgentTimeline component
   - Show investigation progress
   - Display reasoning panel
   - Build recommendation card
   - Add loading states

5. **Integration**
   - Wire agents to incident detail page
   - Update incident status as agents run
   - Cache results to avoid re-running

**Acceptance Criteria:**
- Ollama server runs locally
- LLM generates reasoning for incidents
- Structured outputs parse correctly
- Agent timeline shows all steps
- Reasoning and actions display on detail page
- Performance acceptable (< 30 sec total)

---

### **Phase 4: Human Approval & Action Execution (2-3 days)**

**Deliverables:**
- Approval workflow UI
- Action execution system
- Audit trail logging
- Notifications

**Tasks:**

1. **Approval Flow**
   - Implement "Approve & Execute" button
   - Implement "Reject" with reason dialog
   - Implement "Modify" to edit action
   - Route to approver queue

2. **Action Execution**
   - Create action executor service
   - Implement action types (create task, send email, etc.)
   - Email preview before sending
   - Task creation with assignee
   - Notification distribution

3. **Audit Trail**
   - Create AuditEvent model
   - Log all state changes
   - Log all approvals/rejections
   - Log action execution
   - Display timeline on incident page

4. **Notifications**
   - In-app toast notifications
   - Email notifications for critical risks
   - Notification preferences
   - Digest summaries

**Acceptance Criteria:**
- Approve button creates actions
- Reject reason captured in audit trail
- Email preview shows before sending
- Audit timeline accurate and complete
- Notifications delivered correctly
- Incident status updates appropriately

---

### **Phase 5: Polish & Optimization (2 days)**

**Deliverables:**
- Performance optimization
- Error handling & loading states
- Demo data scenarios
- Testing & documentation
- Production deployment setup

**Tasks:**

1. **UX Polish**
   - Add loading skeletons
   - Implement error boundaries
   - Graceful error messages
   - Empty states for no data
   - Smooth transitions

2. **Performance**
   - Implement query caching
   - Optimize database indexes
   - Image optimization
   - Code splitting
   - Bundle size analysis

3. **Demo Scenarios**
   - Prepare 3-4 scripted demo cases
   - Create demo user with curated data
   - Write demo flow documentation
   - Test end-to-end flow multiple times

4. **Testing**
   - Write tests for critical flows
   - Test risk detection logic
   - Test approval workflow
   - Test agent outputs
   - Performance testing

5. **Documentation**
   - API documentation
   - Architecture diagrams
   - Setup instructions
   - Deployment guide
   - User guide

**Acceptance Criteria:**
- App responds in < 2 seconds on dashboard
- No JavaScript errors in console
- All edge cases handled gracefully
- Demo scenario runs smoothly
- Code passes linting
- README complete and accurate

---

## 7. Data Models & Seeded Data Strategy

### 7.1 Seeded Data Specification

**File Structure:**
```
data/
├── customers.json (50 records)
├── usage.json (500 events)
├── contracts.json (100 records)
├── obligations.json (200 records)
├── projects.json (20 records)
├── tasks.json (200 records)
└── support_tickets.json (100 records)
```

**Seeding Script:**
```typescript
// scripts/seed.ts
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function seed() {
  const customersData = JSON.parse(
    fs.readFileSync("./data/customers.json", "utf-8")
  );
  const usageData = JSON.parse(
    fs.readFileSync("./data/usage.json", "utf-8")
  );
  // ... seed all tables
  console.log("✓ Database seeded successfully");
}

seed();
```

**Example Customer Record:**
```json
{
  "id": "cust_acme_001",
  "name": "ACME Corp",
  "industry": "Technology",
  "arr": 2400000,
  "status": "active",
  "renewal_date": "2026-09-15",
  "created_at": "2024-01-15"
}
```

**Example Usage Record with Decline Pattern:**
```json
{
  "id": "usage_acme_001",
  "customer_id": "cust_acme_001",
  "date": "2026-06-01",
  "event_count": 1842,
  "active_users": 45
},
{
  "id": "usage_acme_002",
  "customer_id": "cust_acme_001",
  "date": "2026-07-01",
  "event_count": 1201,
  "active_users": 28
},
{
  "id": "usage_acme_003",
  "customer_id": "cust_acme_001",
  "date": "2026-08-01",
  "event_count": 991,
  "active_users": 18
}
```

### 7.2 Risk Scenarios in Seed Data

**Customer Churn Scenario (ACME Corp):**
- Usage declining 46% over 90 days
- 5 support tickets, 3 negative
- Renewal in 23 days
- Expected risk score: 78%

**Contract Deadline Scenario (XYZ Inc):**
- Contract obligation due in 7 days
- Penalty: ₹8L
- Owner: Unassigned
- Expected risk score: 85%

**Project Delay Scenario (Project Alpha):**
- 40% tasks incomplete
- 12 blocked tasks
- Deadline in 14 days
- Expected risk score: 72%

---

## 8. MVP Success Criteria

### Functional Requirements
- [ ] Dashboard displays 4+ KPI metrics from database
- [ ] Risk cards show for all 3 risk types
- [ ] Incident detail page loads with evidence
- [ ] Monitor agent creates incidents automatically
- [ ] Reasoning agent generates explanations for all incidents
- [ ] Action planner generates recommendations
- [ ] User can approve/reject recommendations
- [ ] Audit trail records all decisions
- [ ] Agent timeline shows execution steps

### Performance Requirements
- [ ] Dashboard loads in < 2 seconds
- [ ] Incident detail page loads in < 1.5 seconds
- [ ] LLM reasoning completes in < 30 seconds
- [ ] Database queries use indexes
- [ ] No N+1 queries

### UX Requirements
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Dark/light mode support
- [ ] Clear severity indicators
- [ ] Evidence properly cited
- [ ] Reasoning easy to understand
- [ ] Approval process clear and intuitive

### Data Requirements
- [ ] 50+ customers seeded
- [ ] 100+ contracts seeded
- [ ] 200+ obligations seeded
- [ ] 500+ usage events seeded
- [ ] 20+ projects with tasks
- [ ] Deterministic incidents created daily

### Demo Requirements
- [ ] 1 polished demo scenario ready
- [ ] Clear "happy path" walkthrough
- [ ] All features demonstrated
- [ ] No errors during demo
- [ ] Demo completes in < 10 minutes

---

## 9. Risk Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Ollama inference too slow | Medium | High | Use Mistral 7B, GPU optimization, caching |
| LLM outputs invalid JSON | Medium | High | Prompt engineering, fallback parsing, validation |
| Database performance issues | Low | High | Proper indexing, query optimization, caching |
| Authentication/security gaps | Low | High | Use NextAuth.js, regular security review |

### Schedule Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Phase overruns | Medium | High | Clear acceptance criteria, daily check-ins |
| Ollama setup issues | Low | Medium | Pre-test setup, docker config ready |
| Scope creep | Medium | High | Enforce MVP constraints, say no to extras |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Demo data unrealistic | Low | Medium | Validate seeded data looks believable |
| Reasoning not convincing | Medium | Medium | Test prompts, iterate on quality |
| Users find approval flow confusing | Medium | Medium | User testing, clear UI, help text |

---

## 10. Deployment & Operations

### Deployment Strategy (MVP)

**Frontend:**
- Deploy to Vercel (automatic from main branch)
- Environment variables for API endpoint
- Zero-downtime deployments

**Backend/API:**
- Deploy to Railway or Render
- PostgreSQL database on Supabase (managed)
- Environment variables for secrets

**Ollama LLM:**
- Deploy to Railway container (or local)
- API endpoint configured in backend
- Health check endpoint

**CI/CD:**
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run db:migrate
      - run: npm run build
      - run: vercel deploy --prod
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/opsguard

# Authentication
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://opsguard.app

# Ollama
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=mistral

# Monitoring
SENTRY_DSN=<sentry-url>

# Features
ENABLE_EMAIL_ACTIONS=true
ENABLE_NOTIFICATIONS=true
```

---

## 11. Future Roadmap (Post-MVP)

### Phase 6: Real Integrations (Weeks 5-8)
- Salesforce integration for customer data
- Slack integration for notifications
- Email notifications with templates
- Webhook support for custom actions

### Phase 7: Advanced Monitoring (Weeks 9-12)
- More risk types (compliance, security, operational)
- Custom risk rules builder
- Multi-language support
- Bulk action capabilities

### Phase 8: Intelligence Enhancements (Weeks 13+)
- Fine-tuned models for specific domains
- Predictive analytics (predict failures)
- Anomaly detection improvements
- Cross-risk correlation analysis

### Phase 9: Enterprise Features
- Multi-tenant support
- Role-based access control (RBAC)
- Audit report generation
- SLA compliance tracking
- Integration marketplace

---

## 12. Appendices

### A. Prompt Templates (Ollama)

**Reasoning Prompt:**
```
You are an expert business analyst evaluating operational risks.

Incident: {incident.title}
Risk Score: {riskScore}

Evidence:
{evidence.summary}

Provide structured analysis in JSON format:
{
  "explanation": "Clear narrative explaining the risk",
  "rootCauses": ["Cause 1", "Cause 2"],
  "contributingFactors": ["Factor 1", "Factor 2"],
  "keyInsight": "Most important insight",
  "confidence": 0.85
}

Respond with ONLY valid JSON.
```

**Action Planning Prompt:**
```
Based on this business risk analysis, propose specific interventions.

Problem: {incident.title}
Root Causes: {reasoning.rootCauses.join(', ')}

Generate 3 specific, actionable interventions with expected outcomes.
Format as JSON:
{
  "actions": [
    {
      "title": "Action title",
      "steps": ["Step 1", "Step 2"],
      "expectedOutcome": "Clear outcome",
      "effort": "low|medium|high"
    }
  ]
}

Respond with ONLY valid JSON.
```

---

### B. API Endpoint Specifications

**Get Dashboard Metrics**
```
GET /api/dashboard/metrics

Response:
{
  "totalRisks": 47,
  "criticalRisks": 8,
  "pendingApprovals": 13,
  "potentialExposure": 4280000,
  "risksThisWeek": 12,
  "resolvedThisWeek": 5
}
```

**Get Incidents List**
```
GET /api/incidents?status=pending&severity=critical&limit=20&offset=0

Response:
{
  "incidents": [
    {
      "id": "inc_001",
      "title": "ACME Corp - Churn Risk",
      "type": "customer_churn",
      "severity": "high",
      "riskScore": 0.78,
      "entityId": "cust_acme_001",
      "createdAt": "2026-08-15T10:30:00Z",
      "status": "pending_approval"
    }
  ],
  "total": 47,
  "hasMore": true
}
```

**Approve Incident**
```
POST /api/incidents/:id/approve

Body:
{
  "recommendationId": "rec_001",
  "modifiedAction": null,  // If user modified action
  "notes": "Approved for execution"
}

Response:
{
  "id": "inc_001",
  "status": "approved",
  "approvedAt": "2026-08-15T11:00:00Z",
  "approvedBy": "user@company.com"
}
```

---

### C. Testing Strategy

**Unit Tests:**
- Risk score calculation logic
- Evidence compilation
- Severity classification
- Action planning logic

**Integration Tests:**
- End-to-end incident creation workflow
- API endpoint responses
- Database transactions
- LLM integration

**E2E Tests:**
- Dashboard load and interactions
- Incident detail page full flow
- Approval workflow
- Audit trail creation

---

### D. Glossary

| Term | Definition |
|------|-----------|
| **Risk Score** | 0.0-1.0 probability of risk materializing |
| **Severity** | Critical/High/Medium/Low classification |
| **Confidence** | 0.0-1.0 confidence in risk assessment |
| **Evidence** | Supporting data used to evaluate risk |
| **Reasoning** | LLM-generated explanation of risk causes |
| **Recommendation** | Proposed action to mitigate risk |
| **Approval** | Human decision on recommendation |
| **Audit Trail** | Record of all system and user actions |
| **Incident** | Detected operational risk event |
| **Entity** | Object being monitored (customer/contract/project) |

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Next Review:** Post-MVP (Week 5)
