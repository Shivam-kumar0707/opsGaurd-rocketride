# OpsGuard: Build Execution Guide
## Step-by-Step Implementation Checklist

---

## Phase 0: Project Setup (Days 1-2)

### Repository & Environment
- [ ] Create GitHub repository (opsguard)
- [ ] Clone to local development environment
- [ ] Copy .env.example to .env.local
- [ ] Install Node.js 20+ LTS
- [ ] Run `npm install`

### Next.js Configuration
- [ ] Initialize Next.js 14+ project with TypeScript
- [ ] Configure TypeScript strict mode
- [ ] Set up path aliases (`@/` for src)
- [ ] Add ESLint and Prettier configuration
- [ ] Create `npm run dev` script

### Database Setup
- [ ] Create PostgreSQL database (local or Supabase)
- [ ] Install Prisma CLI
- [ ] Create `prisma/schema.prisma` with all entities
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify database connection

### Authentication
- [ ] Install NextAuth.js dependencies
- [ ] Create NextAuth configuration
- [ ] Set up test user (email/password)
- [ ] Create login page `/auth/login`
- [ ] Implement protected routes middleware
- [ ] Test authentication flow

### Seeded Data
- [ ] Create `data/` directory with JSON files:
  - `customers.json` (50 realistic records)
  - `contracts.json` (100 records)
  - `obligations.json` (200 records)
  - `projects.json` (20 records)
  - `tasks.json` (200 records)
  - `support_tickets.json` (100 records)
  - `usage.json` (500 events with decline patterns)
- [ ] Create seeding script (`scripts/seed.ts`)
- [ ] Run seeding script: `npm run db:seed`
- [ ] Verify data in database: `npx prisma studio`

### Development Tools
- [ ] Install Tailwind CSS
- [ ] Install shadcn/ui
- [ ] Set up Tailwind config with design tokens
- [ ] Create `components/ui/` directory
- [ ] Add button, card, badge components from shadcn/ui

### Quality & Monitoring
- [ ] Set up Sentry (optional for MVP)
- [ ] Create `.github/workflows/ci.yml` for linting
- [ ] Add pre-commit hooks (husky + lint-staged)
- [ ] Create `README.md` with setup instructions

### Acceptance Tests
- [ ] `npm run dev` starts without errors
- [ ] Database contains ~700 records
- [ ] Login works with test account
- [ ] `npx prisma studio` shows all tables populated
- [ ] TypeScript compilation succeeds
- [ ] No ESLint warnings

---

## Phase 1: Foundation & Dashboard (Days 3-6)

### Directory Structure
```
opsguard/
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   │   └── metrics/
│   │   │       └── route.ts
│   │   └── incidents/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── incidents/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx (from shadcn)
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── MetricsGrid.tsx
│   │   ├── RiskCard.tsx
│   │   ├── OperationsInbox.tsx
│   │   └── Header.tsx
│   ├── incident/
│   │   ├── IncidentHeader.tsx
│   │   ├── SignalsPanel.tsx
│   │   ├── EvidencePanel.tsx
│   │   └── RecommendationCard.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── TopNav.tsx
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts (NextAuth config)
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── data/
│   ├── customers.json
│   ├── contracts.json
│   ├── obligations.json
│   ├── projects.json
│   ├── tasks.json
│   ├── support_tickets.json
│   └── usage.json
├── styles/
│   ├── globals.css
│   └── variables.css (design tokens)
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Styling & Design Tokens
- [ ] Create `styles/variables.css` with CSS variables:
  ```css
  :root {
    --color-primary: #0066CC;
    --color-success: #10B981;
    --color-warning: #F59E0B;
    --color-danger: #EF4444;
    --color-neutral: #6B7280;
    
    --severity-critical: #EF4444;
    --severity-high: #F59E0B;
    --severity-medium: #FBBF24;
    --severity-low: #10B981;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
    --spacing-2xl: 32px;
    
    --font-family: 'Inter', system-ui, sans-serif;
    --font-size-h1: 32px;
    --font-size-h2: 24px;
    --font-size-body: 16px;
    --font-size-small: 14px;
  }
  ```
- [ ] Create `styles/globals.css` with baseline styles

### Component Library
- [ ] Add shadcn/ui components:
  - [ ] Button (`npx shadcn-ui@latest add button`)
  - [ ] Card
  - [ ] Badge
  - [ ] Alert
  - [ ] Dialog
  - [ ] Tabs
  - [ ] Table
  - [ ] Input
  - [ ] Select
  - [ ] Toast
  
- [ ] Create custom components:
  - [ ] `RiskBadge.tsx` - severity indicator
  - [ ] `RiskCard.tsx` - incident summary card
  - [ ] `MetricsCard.tsx` - single metric display

### Dashboard Page (`app/dashboard/page.tsx`)
- [ ] Create page layout with header
- [ ] Implement responsive grid (12 columns)
- [ ] Add "OpsGuard" title + navigation
- [ ] Search/filter functionality stub
- [ ] Notifications bell icon

**Metrics Section:**
- [ ] Create `MetricsGrid.tsx` component
- [ ] Display 4 cards:
  - Total Active Risks
  - Critical Risks
  - Pending Approvals
  - Potential Exposure (in ₹)
- [ ] API call: `GET /api/dashboard/metrics`
- [ ] Format currency with Indian Rupee symbol (₹)
- [ ] Use Skeleton loaders while loading

**Operations Inbox Section:**
- [ ] Create `OperationsInbox.tsx` component
- [ ] Filter tabs: All, Critical, High, Medium, Low, Resolved
- [ ] Create `RiskCard.tsx` component showing:
  - Risk type label (Customer/Contract/Project)
  - Entity name
  - Risk score with color-coded badge
  - Severity level
  - Key metric (ARR at risk, penalty, delay)
  - "[Investigate]" button
- [ ] API call: `GET /api/incidents?status=pending`
- [ ] Sorting: by severity, by date
- [ ] Pagination or infinite scroll
- [ ] Empty state when no risks

### API Endpoints - Dashboard
- [ ] `GET /api/dashboard/metrics`
  ```typescript
  // lib/services/dashboardService.ts
  export async function getMetrics() {
    const totalRisks = await db.incident.count({
      where: { status: 'investigating' }
    });
    const criticalRisks = await db.incident.count({
      where: { severity: 'critical' }
    });
    // ... calculate others
    return { totalRisks, criticalRisks, ... };
  }
  ```

### Incident Detail Page (`app/incidents/[id]/page.tsx`)
- [ ] Create page layout
- [ ] Header section with:
  - Entity name (e.g., "ACME Corp")
  - Risk type
  - Risk score + severity badge
  - Last updated timestamp
  - Status badge
- [ ] Tab navigation (Why | Evidence | Analysis | Action)

**Why Tab:**
- [ ] Create `SignalsPanel.tsx` component
- [ ] Table of contributing risk signals
- [ ] Show weights/impact for each signal

**Evidence Tab:**
- [ ] Create `EvidencePanel.tsx` component
- [ ] Display evidence items (charts, tables, text)
- [ ] Use Recharts for simple line/bar charts
- [ ] Format numbers with appropriate units

**Analysis Tab:**
- [ ] Display reasoning text from AI (placeholder for now)
- [ ] Show confidence score

**Action Tab:**
- [ ] Create `RecommendationCard.tsx` component
- [ ] Show recommended action
- [ ] Action steps as numbered list
- [ ] Expected impact
- [ ] Three buttons: [Approve] [Reject] [Modify]

### API Endpoints - Incidents
- [ ] `GET /api/incidents` - list with filters
  ```typescript
  export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    
    const incidents = await db.incident.findMany({
      where: { status, severity },
      include: { recommendations: true }
    });
    return Response.json(incidents);
  }
  ```

- [ ] `GET /api/incidents/:id` - detail view
  ```typescript
  export async function GET(req: Request, { params }: { params: { id: string } }) {
    const incident = await db.incident.findUnique({
      where: { id: params.id },
      include: {
        recommendations: true,
        auditEvents: { orderBy: { timestamp: 'desc' } }
      }
    });
    return Response.json(incident);
  }
  ```

### Responsive Design
- [ ] Mobile (320px): Stack layout, compact cards
- [ ] Tablet (768px): 2-column layout
- [ ] Desktop (1200px): Full layout with sidebar
- [ ] Test on real devices or DevTools

### Dark Mode Support
- [ ] Use `next-themes` package
- [ ] Add theme switcher in header
- [ ] Apply to all components
- [ ] Test light/dark contrast ratios

### Navigation & Routing
- [ ] Create layout with sidebar (desktop) / hamburger (mobile)
- [ ] Dashboard link
- [ ] Incidents link
- [ ] Settings link
- [ ] User profile dropdown
- [ ] Active route highlighting

### Acceptance Tests (Phase 1)
- [ ] Dashboard loads in < 2 seconds
- [ ] Metrics cards show correct calculated values
- [ ] Risk cards populate from database
- [ ] Clicking risk card navigates to detail page
- [ ] Detail page shows hardcoded evidence/reasoning
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Dark/light mode toggle works
- [ ] No TypeScript errors
- [ ] Console has no errors

---

## Phase 2: Deterministic Risk Detection (Days 7-9)

### Risk Engine (`lib/riskEngine.ts`)
- [ ] Create RiskEngine class
- [ ] Implement risk scoring algorithm
  ```typescript
  export class RiskEngine {
    scoreCustomerChurn(customer: Customer, signals: ChurnSignals): RiskScore {
      let score = 0;
      
      // Usage decline (weight: 40%)
      if (signals.usageDecline > 30) score += 0.4;
      
      // Support complaints (weight: 30%)
      if (signals.supportComplaints > 3) score += 0.3;
      
      // Renewal proximity (weight: 20%)
      if (signals.daysUntilRenewal < 30) score += 0.2;
      
      // Payment delays (weight: 10%)
      if (signals.paymentDelays > 0) score += 0.1;
      
      return { score, confidence: 0.85 };
    }
  }
  ```

### Monitor Agent (`lib/agents/monitorAgent.ts`)
- [ ] Create MonitorAgent class
- [ ] Implement deterministic detection logic

**Customer Churn Detection:**
- [ ] Query customers with renewal_date within 90 days
- [ ] Calculate usage decline:
  ```typescript
  const usageThisMonth = await getUsageEvents(customerId, 'current_month');
  const usageLastMonth = await getUsageEvents(customerId, 'last_month');
  const decline = (usageLastMonth - usageThisMonth) / usageLastMonth;
  
  if (decline > 0.3) {
    // High risk signal
  }
  ```
- [ ] Count support complaints (sentiment: negative)
- [ ] Check for unresolved critical support tickets
- [ ] Evaluate churn probability
- [ ] Create incident if score > 0.65

**Contract Deadline Detection:**
- [ ] Query all obligations
- [ ] Filter by due_date within 14 days
- [ ] Check if status != 'completed'
- [ ] Create incident if deadline approaching

**Project Delay Detection:**
- [ ] Query all projects with deadline within 30 days
- [ ] Calculate task completion rate
- [ ] Identify blocked tasks
- [ ] Compare actual progress vs. expected progress
- [ ] Create incident if delay likely

### Evidence Gathering (`lib/services/investigatorService.ts`)
- [ ] Create InvestigatorService
- [ ] Implement evidence compilation for each risk type

```typescript
export class InvestigatorService {
  async investigateChurnRisk(customerId: string): Promise<Evidence[]> {
    const customer = await db.customer.findUnique({ where: { id: customerId } });
    const usage = await db.usage.findMany({
      where: { customer_id: customerId },
      orderBy: { date: 'desc' },
      take: 3
    });
    const tickets = await db.supportTicket.findMany({
      where: { customer_id: customerId },
      orderBy: { created_at: 'desc' }
    });
    
    return [
      {
        type: 'usage_trend',
        data: usage,
        significance: 'high'
      },
      {
        type: 'support_sentiment',
        data: tickets,
        significance: 'high'
      }
      // ... more evidence
    ];
  }
}
```

### Scheduled Job (`lib/jobs/monitoringJob.ts`)
- [ ] Create scheduling function using node-cron
- [ ] Run daily at 00:00 UTC
- [ ] Track execution logs
- [ ] Implement idempotency (check for existing incidents)

```typescript
import cron from 'node-cron';

export function setupMonitoringJob() {
  // Run at 00:00 UTC daily
  cron.schedule('0 0 * * *', async () => {
    console.log('[Monitor Job] Starting daily monitoring');
    
    try {
      const customerIncidents = await monitorAgent.detectCustomerChurn();
      const contractIncidents = await monitorAgent.detectContractDeadlines();
      const projectIncidents = await monitorAgent.detectProjectDelays();
      
      const total = customerIncidents.length + contractIncidents.length + projectIncidents.length;
      console.log(`[Monitor Job] Created ${total} new incidents`);
    } catch (error) {
      console.error('[Monitor Job] Failed:', error);
    }
  });
}
```

- [ ] Call `setupMonitoringJob()` in Next.js server initialization

### Database Migrations
- [ ] Create migration: `npx prisma migrate dev --name add_incidents`
- [ ] Add Incident, Recommendation, AuditEvent tables if not already present
- [ ] Create indexes for performance:
  ```sql
  CREATE INDEX idx_incidents_status ON incidents(status);
  CREATE INDEX idx_incidents_severity ON incidents(severity);
  CREATE INDEX idx_incidents_entity ON incidents(entity_type, entity_id);
  CREATE INDEX idx_usage_customer_date ON usage(customer_id, date);
  ```

### Acceptance Tests (Phase 2)
- [ ] Dashboard automatically populated with incidents
- [ ] 3+ customer churn incidents detected
- [ ] 2+ contract deadline incidents detected
- [ ] 1+ project delay incidents detected
- [ ] Risk scores calculated correctly
- [ ] Evidence compiled and displayed on detail page
- [ ] No duplicate incidents created
- [ ] Scheduled job runs without errors

---

## Phase 3: AI Agents - Reasoning & Action (Days 10-13)

### Ollama Setup
- [ ] Download and install Ollama (https://ollama.ai)
- [ ] Pull Mistral model: `ollama pull mistral`
- [ ] Verify server runs: `ollama serve` (listens on localhost:11434)
- [ ] Test API endpoint: `curl http://localhost:11434/api/tags`

### LangChain Integration (`lib/llm/ollamaClient.ts`)
- [ ] Install dependencies:
  ```bash
  npm install @langchain/community @langchain/core langchain
  ```

- [ ] Create Ollama client:
  ```typescript
  import { Ollama } from "@langchain/community/llms/ollama";

  export const ollama = new Ollama({
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "mistral",
    temperature: 0.3, // Low for consistency
    topP: 0.9,
    numPredict: 1000,
    timeout: 60000,
  });
  ```

### Reasoning Agent (`lib/agents/reasoningAgent.ts`)
- [ ] Create ReasoningAgent class
- [ ] Implement structured prompt template
- [ ] Parse JSON output with validation

```typescript
export class ReasoningAgent {
  async generateReasoning(
    incident: Incident,
    evidence: Evidence[]
  ): Promise<ReasoningOutput> {
    const evidenceSummary = this.formatEvidence(evidence);
    
    const prompt = `
      You are an expert business analyst. Analyze this operational risk and provide structured reasoning.
      
      Incident: ${incident.title}
      Risk Score: ${incident.risk_score}
      
      Supporting Evidence:
      ${evidenceSummary}
      
      Respond with ONLY valid JSON (no markdown backticks, no preamble):
      {
        "explanation": "2-3 sentence narrative explaining why this risk exists",
        "rootCauses": ["Cause 1", "Cause 2", "Cause 3"],
        "contributingFactors": ["Factor 1", "Factor 2"],
        "keyInsight": "Most important insight for decision makers",
        "confidence": 0.85
      }
    `;

    try {
      const response = await ollama.invoke(prompt);
      const cleaned = response.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("LLM reasoning failed:", error);
      return this.fallbackReasoning(incident);
    }
  }

  private fallbackReasoning(incident: Incident): ReasoningOutput {
    return {
      explanation: "Multiple risk signals detected for this entity.",
      rootCauses: ["Unclear - requires manual investigation"],
      contributingFactors: [],
      keyInsight: "Immediate human review recommended",
      confidence: 0.5
    };
  }
}
```

### Action Planner Agent (`lib/agents/actionPlannerAgent.ts`)
- [ ] Create ActionPlannerAgent class
- [ ] Implement action generation prompt
- [ ] Parse and rank action recommendations

```typescript
export class ActionPlannerAgent {
  async planActions(
    incident: Incident,
    reasoning: ReasoningOutput
  ): Promise<RecommendedAction> {
    const prompt = `
      You are an expert operational consultant. Based on this business risk analysis, recommend specific interventions.
      
      Problem: ${incident.title}
      Root Causes: ${reasoning.rootCauses.join(', ')}
      
      Generate ONE primary recommended action with concrete steps. Format as JSON:
      {
        "action": "Clear action title",
        "steps": [
          "Specific step 1 with details",
          "Specific step 2 with details"
        ],
        "expectedOutcome": "Specific, measurable outcome",
        "expectedImpact": "How this reduces risk",
        "estimatedEffort": "low|medium|high",
        "timeline": "Implementation timeline"
      }
      
      Respond with ONLY valid JSON.
    `;

    try {
      const response = await ollama.invoke(prompt);
      const cleaned = response.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Action planning failed:", error);
      return this.fallbackAction(incident);
    }
  }

  private fallbackAction(incident: Incident): RecommendedAction {
    return {
      action: "Schedule review meeting",
      steps: ["Gather relevant stakeholders", "Review incident details", "Develop action plan"],
      expectedOutcome: "Clear path forward",
      expectedImpact: "Enable manual intervention",
      estimatedEffort: "medium",
      timeline: "1-2 days"
    };
  }
}
```

### Incident Update Service (`lib/services/incidentService.ts`)
- [ ] Create method to run all agents on an incident
- [ ] Update incident with results
- [ ] Record agent execution in audit trail

```typescript
export class IncidentService {
  async processIncident(incidentId: string): Promise<void> {
    const incident = await db.incident.findUnique({
      where: { id: incidentId }
    });

    // Run investigator
    const evidence = await investigator.investigate(incident);
    
    // Run reasoning
    const reasoning = await reasoningAgent.generateReasoning(incident, evidence);
    
    // Run action planner
    const recommendation = await actionPlanner.planActions(incident, reasoning);
    
    // Save results
    await db.incident.update({
      where: { id: incidentId },
      data: {
        reasoning: reasoning.explanation,
        evidence: evidence,
        status: 'pending_approval'
      }
    });
    
    await db.recommendation.create({
      data: {
        incident_id: incidentId,
        action: recommendation.action,
        reasoning: recommendation.expectedOutcome,
        confidence: reasoning.confidence
      }
    });
    
    // Audit log
    await db.auditEvent.create({
      data: {
        incident_id: incidentId,
        event_type: 'investigation_complete',
        actor: 'system',
        details: { reasoning, recommendation }
      }
    });
  }
}
```

### Agent Timeline Component (`components/incident/AgentTimeline.tsx`)
- [ ] Display execution timeline
- [ ] Show each agent with checkmark/pending
- [ ] Show timestamp for completion
- [ ] Show brief description of what each agent did

```typescript
export function AgentTimeline({ incident }: { incident: Incident }) {
  const agents = [
    { name: 'Monitor Agent', status: 'completed', time: '09:42' },
    { name: 'Investigator', status: 'completed', time: '09:42' },
    { name: 'Risk Agent', status: 'completed', time: '09:43' },
    { name: 'Reasoning Agent', status: 'completed', time: '09:43' },
    { name: 'Action Planner', status: 'completed', time: '09:44' },
    { name: 'Human Approval', status: 'pending', time: null }
  ];

  return (
    <div className="space-y-4">
      {agents.map(agent => (
        <div key={agent.name} className="flex items-start gap-4">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${agent.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}
          `}>
            {agent.status === 'completed' ? '✓' : '⏳'}
          </div>
          <div>
            <p className="font-medium">{agent.name}</p>
            {agent.time && <p className="text-sm text-gray-500">{agent.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### API Endpoints - Process Incidents
- [ ] `POST /api/incidents/:id/process` - manually trigger processing
  ```typescript
  export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      await incidentService.processIncident(params.id);
      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
  ```

### LLM Caching (Optimization)
- [ ] Implement simple cache for LLM responses
  ```typescript
  const reasoningCache = new Map<string, ReasoningOutput>();
  
  export async function getCachedReasoning(
    incidentId: string,
    generator: () => Promise<ReasoningOutput>
  ): Promise<ReasoningOutput> {
    if (reasoningCache.has(incidentId)) {
      return reasoningCache.get(incidentId)!;
    }
    const result = await generator();
    reasoningCache.set(incidentId, result);
    return result;
  }
  ```

### Error Handling
- [ ] Wrap LLM calls in try-catch
- [ ] Provide fallback responses when LLM fails
- [ ] Log LLM errors to Sentry
- [ ] Display graceful error messages to user

### Testing Prompts
- [ ] Test reasoning prompt with manual incident
- [ ] Test action planning prompt with sample data
- [ ] Verify JSON parsing works correctly
- [ ] Test fallback logic when LLM times out

### Acceptance Tests (Phase 3)
- [ ] Ollama server runs on localhost:11434
- [ ] LLM generates valid JSON responses
- [ ] Reasoning stored in database
- [ ] Recommendation created for each incident
- [ ] Agent timeline component displays correctly
- [ ] Performance acceptable (< 30 seconds total per incident)
- [ ] Fallback reasoning works when LLM fails
- [ ] No errors in console

---

## Phase 4: Human Approval & Action Execution (Days 14-16)

### Approval Workflow (`lib/services/approvalService.ts`)
- [ ] Create ApprovalService class
- [ ] Implement approval logic with status tracking

```typescript
export class ApprovalService {
  async approveRecommendation(
    recommendationId: string,
    userId: string,
    modifiedAction?: string
  ): Promise<void> {
    const rec = await db.recommendation.update({
      where: { id: recommendationId },
      data: {
        status: 'approved',
        approved_at: new Date(),
        approved_by: userId
      }
    });

    // Update incident
    await db.incident.update({
      where: { id: rec.incident_id },
      data: { status: 'approved' }
    });

    // Audit log
    await db.auditEvent.create({
      data: {
        recommendation_id: recommendationId,
        event_type: 'action_approved',
        actor: userId,
        actor_role: 'manager'
      }
    });

    // Execute action
    await this.executeAction(rec, modifiedAction);
  }

  async rejectRecommendation(
    recommendationId: string,
    userId: string,
    reason: string
  ): Promise<void> {
    const rec = await db.recommendation.update({
      where: { id: recommendationId },
      data: { status: 'rejected' }
    });

    await db.incident.update({
      where: { id: rec.incident_id },
      data: { status: 'rejected' }
    });

    await db.auditEvent.create({
      data: {
        recommendation_id: recommendationId,
        event_type: 'action_rejected',
        actor: userId,
        details: { reason }
      }
    });
  }

  private async executeAction(rec: Recommendation, modifiedAction?: string) {
    const action = modifiedAction || rec.action;
    
    // Create task
    await db.task.create({
      data: {
        name: action,
        status: 'not-started',
        project_id: 'system' // or appropriate project
      }
    });

    // Send notification
    // (implement email/slack later)
    
    // Mark as executed
    await db.recommendation.update({
      where: { id: rec.id },
      data: {
        status: 'executed',
        executed_at: new Date()
      }
    });
  }
}
```

### Approval UI Component (`components/incident/ApprovalPanel.tsx`)
- [ ] Create component with approve/reject/modify buttons
- [ ] Show recommendation summary
- [ ] Provide reason input for rejection
- [ ] Modal for modification

```typescript
export function ApprovalPanel({ incident, recommendation }: Props) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [modifyMode, setModifyMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await fetch(`/api/recommendations/${recommendation.id}/approve`, {
      method: 'POST'
    });
    // Refresh incident
  };

  const handleReject = async () => {
    setLoading(true);
    await fetch(`/api/recommendations/${recommendation.id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: rejectionReason })
    });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Decision Required</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm">{recommendation.action}</p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleApprove}
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          ✓ Approve & Execute
        </Button>
        
        <Button
          onClick={() => setModifyMode(true)}
          variant="outline"
        >
          ✏ Modify
        </Button>

        <Button
          onClick={() => setRejectionReason('ready to submit') || handleReject()}
          variant="ghost"
          className="text-red-600"
        >
          ✗ Reject
        </Button>
      </div>

      {modifyMode && (
        <textarea
          defaultValue={recommendation.action}
          className="w-full p-2 border rounded"
          rows={4}
        />
      )}
    </div>
  );
}
```

### Audit Trail Service (`lib/services/auditService.ts`)
- [ ] Create AuditService to log all events
- [ ] Implement audit event creation
- [ ] Add method to retrieve audit history

```typescript
export class AuditService {
  async logEvent(data: {
    incidentId?: string;
    recommendationId?: string;
    eventType: string;
    actor: string;
    actorRole: string;
    details?: object;
  }): Promise<void> {
    await db.auditEvent.create({
      data: {
        incident_id: data.incidentId,
        recommendation_id: data.recommendationId,
        event_type: data.eventType,
        actor: data.actor,
        actor_role: data.actorRole,
        details: data.details || {},
        timestamp: new Date()
      }
    });
  }

  async getAuditTrail(incidentId: string): Promise<AuditEvent[]> {
    return await db.auditEvent.findMany({
      where: { incident_id: incidentId },
      orderBy: { timestamp: 'desc' }
    });
  }
}
```

### Audit Trail UI Component (`components/incident/AuditTrail.tsx`)
- [ ] Display chronological event list
- [ ] Show actor, action, and timestamp
- [ ] Format times in user's local timezone

```typescript
export function AuditTrail({ incidentId }: { incidentId: string }) {
  const { data: events } = useQuery(
    ['audit', incidentId],
    () => fetch(`/api/incidents/${incidentId}/audit`).then(r => r.json())
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Audit History</h3>
      {events?.map(event => (
        <div key={event.id} className="flex gap-4 text-sm">
          <div className="text-gray-500 w-20">
            {new Date(event.timestamp).toLocaleTimeString()}
          </div>
          <div className="flex-1">
            <p className="font-medium">{event.actor}</p>
            <p className="text-gray-600">{event.event_type}</p>
            {event.details && (
              <p className="text-xs mt-1 text-gray-500">
                {JSON.stringify(event.details)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### API Endpoints - Approval
- [ ] `POST /api/recommendations/:id/approve`
  ```typescript
  export async function POST(req: Request) {
    const { modifiedAction } = await req.json();
    const userId = session.user.email;
    await approvalService.approveRecommendation(params.id, userId, modifiedAction);
    return Response.json({ success: true });
  }
  ```

- [ ] `POST /api/recommendations/:id/reject`
  ```typescript
  export async function POST(req: Request) {
    const { reason } = await req.json();
    const userId = session.user.email;
    await approvalService.rejectRecommendation(params.id, userId, reason);
    return Response.json({ success: true });
  }
  ```

- [ ] `GET /api/incidents/:id/audit`

### Notifications (Basic)
- [ ] Toast notification on approval
- [ ] Toast notification on rejection
- [ ] (Email/Slack can be added later)

### Acceptance Tests (Phase 4)
- [ ] Approve button creates action
- [ ] Rejection captures reason
- [ ] Modify updates recommendation before approval
- [ ] Audit trail records all events
- [ ] Incident status changes appropriately
- [ ] Toast notifications appear
- [ ] Tasks created in system
- [ ] No errors during full approval flow

---

## Phase 5: Polish & Optimization (Days 17-18)

### Loading States & Skeletons
- [ ] Add Skeleton components for:
  - Metrics cards
  - Risk card list
  - Incident detail sections
- [ ] Use React Query loading states
- [ ] Implement loading animations

### Error Handling & Boundaries
- [ ] Create ErrorBoundary component
- [ ] Handle API failures gracefully
- [ ] Show user-friendly error messages
- [ ] Log errors to Sentry
- [ ] Retry failed requests with exponential backoff

### Empty States
- [ ] "No risks detected" message on dashboard
- [ ] "No evidence found" message in detail view
- [ ] "No approval required" message when N/A
- [ ] Helpful suggestions in empty states

### Performance Optimization
- [ ] Analyze bundle size: `npm run build`
- [ ] Implement code splitting for routes
- [ ] Optimize database queries (add indexes)
- [ ] Implement query result caching
- [ ] Lazy load charts and heavy components
- [ ] Image optimization if needed
- [ ] Remove unused dependencies

### Testing
- [ ] Write unit tests for risk calculation
- [ ] Write integration tests for API endpoints
- [ ] Write E2E test for approval workflow
  ```bash
  npm install -D cypress
  npx cypress open
  ```

### Demo Preparation
- [ ] Prepare demo data set with clear scenarios
- [ ] Script the 10-minute demo walkthrough
- [ ] Test demo flow 5+ times
- [ ] Create backup demo data in case data corrupts
- [ ] Document demo talking points

### Documentation
- [ ] Update README.md with:
  - Installation steps
  - Ollama setup
  - Running locally
  - Environment variables
  - Database setup
  - Seeding data
  - API endpoints
  - Architecture overview
  - Deployment instructions

- [ ] Create `docs/API.md` with endpoint specifications
- [ ] Create `docs/ARCHITECTURE.md` with system design
- [ ] Create `docs/DEMO.md` with walkthrough script

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Fix all warnings
- [ ] Run type checking: `npm run type-check`
- [ ] Format code: `npm run format`
- [ ] Ensure no hardcoded secrets
- [ ] Remove console.logs (except intentional logging)

### Deployment Checklist
- [ ] Set up Vercel for frontend deployment
- [ ] Configure environment variables on Vercel
- [ ] Set up railway.app for backend (or alternative)
- [ ] Configure database connection strings
- [ ] Set up Ollama endpoint (local or cloud)
- [ ] Run production build locally: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Set up monitoring/alerts
- [ ] Create deployment runbook

### Acceptance Tests (Phase 5)
- [ ] Dashboard loads and looks polished
- [ ] All error cases handled gracefully
- [ ] Empty states display helpful messages
- [ ] Demo scenario runs without issues
- [ ] Build succeeds with no warnings
- [ ] Tests pass
- [ ] Performance meets targets (< 2 sec dashboard load)
- [ ] Documentation complete

---

## Quick Reference: Daily Checklist

### Morning (Check-in)
- [ ] Review Phase deliverables
- [ ] Check for blocking issues
- [ ] Verify database/services running
- [ ] Pull latest code

### During Development
- [ ] Commit frequently with clear messages
- [ ] Test locally before pushing
- [ ] Keep TypeScript errors at zero
- [ ] Monitor LLM response quality
- [ ] Track time against estimates

### End of Day (Wrap-up)
- [ ] Push code to main branch
- [ ] Verify CI/CD passes
- [ ] Update status on any blockers
- [ ] Document decisions made
- [ ] Prepare for next day

---

## Emergency Recovery Procedures

### Database Corruption
```bash
# Backup first
pg_dump $DATABASE_URL > backup.sql

# Reset
npx prisma migrate reset

# Reseed
npm run db:seed
```

### LLM/Ollama Issues
```bash
# Restart ollama
killall ollama
ollama serve

# Pull model again if needed
ollama pull mistral

# Check endpoint
curl http://localhost:11434/api/tags
```

### Authentication Broken
```bash
# Reset NextAuth
# Delete sessions in database
DELETE FROM sessions;

# Re-login with test account
```

### Build Failing
```bash
# Clean build
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

End of Build Guide
