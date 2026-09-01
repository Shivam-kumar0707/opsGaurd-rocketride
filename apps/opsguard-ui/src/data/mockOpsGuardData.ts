// =============================================================================
// Seed Engine & Pre-Populated Operational Incidents
// =============================================================================

import { OperationalIncident, OpsGuardSettings } from '../types/opsguard';
import { defaultModelWeights } from '../risk-engine/config';

export const initialIncidents: OperationalIncident[] = [
  {
    id: 'INC-2026-0891',
    title: 'ACME Corp — Critical Customer Churn Risk',
    entityName: 'ACME Enterprise Corp',
    entityType: 'Customer',
    entityId: 'CUST-8841',
    riskDomain: 'customer_churn',
    riskScore: 78,
    probability: 0.78,
    severity: 'critical',
    confidenceScore: 92,
    primaryMetric: '₹24,00,000 ARR Exposure',
    exposureAmountRupees: 2400000,
    status: 'pending_approval',
    lastUpdated: '12 mins ago',
    owner: 'Sarah Jenkins (CSM)',
    signals: [
      { id: 'SIG-1', name: 'Product Usage Drop', value: '-46% over 90 days', impact: 'HIGH', description: 'Product event volume dropped from 1,850/wk to 990/wk across active user cohorts.', weight: 0.25, severityScore: 92, confidence: 0.95, source: 'telemetry' },
      { id: 'SIG-2', name: 'Support Ticket Spike', value: '5 negative tickets', impact: 'HIGH', description: '5 critical support tickets filed in 30 days citing dashboard loading latency.', weight: 0.20, severityScore: 85, confidence: 0.90, source: 'ticket_system' },
      { id: 'SIG-3', name: 'Contract Renewal Proximity', value: '23 days remaining', impact: 'HIGH', description: 'Annual enterprise agreement renewal window opening in less than 30 days.', weight: 0.15, severityScore: 90, confidence: 0.98, source: 'contract_db' }
    ],
    evidence: [
      {
        id: 'EVI-101',
        title: '90-Day Telemetry Event Volume',
        type: 'usage_trend',
        summary: 'Query exports and active dashboard sessions decreased by 46% across all 25 user seats.',
        significance: 'critical',
        evidenceCategory: 'verified',
        reliabilityScore: 0.96,
        usageData: [
          { period: '90 Days Ago', eventCount: 1850, activeUsers: 25 },
          { period: '60 Days Ago', eventCount: 1420, activeUsers: 20, changePct: -23 },
          { period: '30 Days Ago', eventCount: 1100, activeUsers: 15, changePct: -22.5 },
          { period: 'Current', eventCount: 990, activeUsers: 12, changePct: -10 }
        ]
      },
      {
        id: 'EVI-102',
        title: 'Support Escalation Ticket Log',
        type: 'support_sentiment',
        summary: '5 high-priority support tickets logged citing dashboard timeout errors during peak hours.',
        significance: 'high',
        evidenceCategory: 'verified',
        reliabilityScore: 0.94,
        tickets: [
          { id: 'TICK-901', subject: 'Dashboard loading latency during peak queries', sentiment: 'negative', priority: 'critical', ageDays: 4, tags: ['performance', 'latency'] },
          { id: 'TICK-894', subject: 'Query timeout on scheduled report export', sentiment: 'negative', priority: 'high', ageDays: 9, tags: ['reports', 'timeout'] },
          { id: 'TICK-872', subject: 'API rate limit exceeded during batch sync', sentiment: 'negative', priority: 'high', ageDays: 14, tags: ['api', 'rate-limit'] },
          { id: 'TICK-850', subject: 'Export format broken for CSV downloads', sentiment: 'negative', priority: 'medium', ageDays: 21, tags: ['export'] }
        ]
      },
      {
        id: 'EVI-103',
        title: 'Contract Renewal Timeline',
        type: 'contract_timeline',
        summary: 'Enterprise contract #ACME-2025 auto-renews on Sep 24, 2026. Renewal decision window active.',
        significance: 'high',
        evidenceCategory: 'verified',
        reliabilityScore: 0.98,
        milestones: [
          { title: 'Executive Sponsor Alignment Call', dueDate: 'Sep 05, 2026', daysRemaining: 4, status: 'at_risk' },
          { title: 'Contract Renewal Deadline', dueDate: 'Sep 24, 2026', daysRemaining: 23, status: 'pending' }
        ]
      }
    ],
    reasoning: {
      narrative: 'ACME Corp exhibits a 78% risk score driven primarily by a 46% decline in product usage telemetry over the past 90 days, exacerbated by 5 unresolved support tickets regarding API latency. With renewal approaching in 23 days, immediate technical resolution is required.',
      rootCauses: [
        'Unresolved platform latency in reporting module causing user frustration and reduced daily logins.',
        'Lack of proactive Senior CSM engagement during the pre-renewal evaluation window.'
      ],
      contributingFactors: [
        'Competitor evaluation initiated by procurement team.',
        'Executive sponsor transition in ACME IT department 60 days ago.'
      ],
      keyInsight: 'Resolving open critical support tickets TICK-901 and TICK-894 within 48 hours is the single highest-leverage intervention to restore account confidence prior to renewal talks.',
      confidenceScore: 0.92,
      historicalAccuracy: 0.89
    },
    recommendation: {
      id: 'REC-2026-0891',
      actionTitle: 'Executive Account Recovery & SLA Technical Escalation',
      steps: [
        { id: 1, title: 'Assign Senior CSM Lead', detail: 'Assign Senior CSM lead Sarah Jenkins to manage account recovery.', assignedRole: 'CSM Manager', priority: 'high', deadlineHours: 24 },
        { id: 2, title: 'Engineering Bug SLA Escalation', detail: 'Escalate open critical performance tickets TICK-901 and TICK-894 to Core Engineering with 48h SLA.', assignedRole: 'VP Engineering', priority: 'critical', deadlineHours: 48 },
        { id: 3, title: 'Executive Review Call', detail: 'Schedule VP-level alignment call to present technical roadmap and confirm success metrics.', assignedRole: 'VP Sales', priority: 'high', deadlineHours: 72 }
      ],
      expectedOutcome: 'Reduce churn probability from 78% to <35%.',
      expectedImpact: 'Protect ₹24,00,000 annual contract value.',
      financialImpactFormatted: 'Protect ₹24.0 Lakhs ARR',
      estimatedEffort: 'medium',
      timeline: '2-3 business days',
      requiredApprovalRoles: ['VP Sales', 'Operations Lead'],
      status: 'proposed'
    },
    critique: {
      criticName: 'OpsGuard Critic Agent v1.2',
      challenges: [
        'CRITIC WARNING: Proposed 20% renewal discount is premature. Primary churn driver is platform latency & API timeouts, not pricing sensitivity.'
      ],
      unsupportedClaims: [],
      riskOverestimations: [],
      suggestedAdjustments: [
        'Condition any financial discount upon successful 48-hour resolution of open critical support tickets TICK-901 and TICK-894.'
      ],
      overallVerdict: 'approved_with_notes',
      critiqueTimestamp: 'Just now'
    },
    agentTimeline: [
      { agentName: 'Input Normalizer', status: 'completed', timestamp: '10:14 AM', duration: '0.4s', description: 'Normalized input features & validated completeness.' },
      { agentName: 'Signal Agent', status: 'completed', timestamp: '10:14 AM', duration: '0.8s', description: 'Identified 3 measurable risk signals.' },
      { agentName: 'Evidence Agent', status: 'completed', timestamp: '10:14 AM', duration: '1.2s', description: 'Compiled 3 verified evidence items.' },
      { agentName: 'Risk Engine', status: 'completed', timestamp: '10:14 AM', duration: '0.5s', description: 'Calculated Risk Score 78% (CRITICAL).' },
      { agentName: 'Reasoning Agent', status: 'completed', timestamp: '10:14 AM', duration: '2.1s', description: 'Synthesized root causes & key insights.' },
      { agentName: 'Action Planner', status: 'completed', timestamp: '10:15 AM', duration: '1.4s', description: 'Generated proposed intervention plan.' },
      { agentName: 'Critic Agent', status: 'completed', timestamp: '10:15 AM', duration: '0.9s', description: 'Completed critique review. Verdict: APPROVED WITH NOTES.' },
      { agentName: 'Human Approval', status: 'pending', timestamp: 'Awaiting Review', description: 'Pending Operations Lead decision.' }
    ],
    auditHistory: [
      { id: 'AUD-001', timestamp: '10:14 AM', actor: 'OpsGuard Agent Chain', actorRole: 'System', eventType: 'risk_detected', summary: 'Incident created with 78% calculated churn risk.' },
      { id: 'AUD-002', timestamp: '10:15 AM', actor: 'OpsGuard Agent Chain', actorRole: 'System', eventType: 'action_proposed', summary: 'Proposed action plan generated: Executive Account Recovery.' }
    ]
  },

  {
    id: 'INC-2026-0892',
    title: 'Nexus Systems — Contract Obligation Risk',
    entityName: 'Nexus Systems Pvt Ltd',
    entityType: 'Contract',
    entityId: 'CONT-4412',
    riskDomain: 'contract_deadline',
    riskScore: 85,
    probability: 0.85,
    severity: 'critical',
    confidenceScore: 95,
    primaryMetric: '₹8,00,000 Liquid Penalty',
    exposureAmountRupees: 800000,
    status: 'pending_approval',
    lastUpdated: '28 mins ago',
    owner: 'Unassigned',
    signals: [
      { id: 'SIG-4', name: 'Contract Deadline Proximity', value: '7 days remaining', impact: 'HIGH', description: 'Contractual compliance audit deliverable due in 7 days.', weight: 0.35, severityScore: 90, confidence: 0.98, source: 'contract_db' },
      { id: 'SIG-5', name: 'Penalty Clause Exposure', value: '₹8,00,000 penalty', impact: 'HIGH', description: 'Fixed penalty clause triggers automatically upon missed deadline.', weight: 0.25, severityScore: 85, confidence: 0.95, source: 'contract_db' },
      { id: 'SIG-6', name: 'Unassigned Lead', value: 'No compliance owner', impact: 'MED', description: 'Responsible compliance officer unassigned following team restructuring.', weight: 0.20, severityScore: 80, confidence: 0.99, source: 'contract_db' }
    ],
    evidence: [
      {
        id: 'EVI-104',
        title: 'Contractual Obligation Milestone Schedule',
        type: 'contract_timeline',
        summary: 'Section 14.2 requires ISO-27001 compliance audit package submission within 7 days.',
        significance: 'critical',
        evidenceCategory: 'verified',
        reliabilityScore: 0.99,
        milestones: [
          { title: 'ISO Audit Package Submission', dueDate: 'Sep 08, 2026', daysRemaining: 7, status: 'at_risk', penaltyAmount: '₹8,00,000' }
        ]
      }
    ],
    reasoning: {
      narrative: 'Nexus Systems contract #CONT-4412 has a compliance deliverable due in 7 days with a non-negotiable ₹8,00,000 liquid damages penalty clause.',
      rootCauses: [
        'Deliverable task unassigned following compliance officer departure in August.',
        'Absence of automated escalation alerts leading up to deadline.'
      ],
      contributingFactors: [
        'Third-party audit report package compiled but lacking final executive digital signature.'
      ],
      keyInsight: 'Audit files are 90% completed in internal archives; only CISO sign-off signature and formal portal delivery are needed to eliminate penalty exposure.',
      confidenceScore: 0.95,
      historicalAccuracy: 0.92
    },
    recommendation: {
      id: 'REC-2026-0892',
      actionTitle: 'Fast-Track Emergency Legal & CISO Sign-Off',
      steps: [
        { id: 1, title: 'Assign Legal Owner', detail: 'Assign Legal Ops lead Vikram Rao for Nexus compliance submission.', assignedRole: 'Legal Ops Lead', priority: 'critical', deadlineHours: 12 },
        { id: 2, title: 'Obtain CISO Signature', detail: 'Route audit package to CISO for priority DocuSign sign-off.', assignedRole: 'CISO', priority: 'critical', deadlineHours: 24 },
        { id: 3, title: 'Formal Client Delivery', detail: 'Submit compliance package via client vendor portal.', assignedRole: 'Legal Counsel', priority: 'high', deadlineHours: 36 }
      ],
      expectedOutcome: 'Completely avoid ₹8,00,000 financial penalty.',
      expectedImpact: 'Fulfills contractual obligation ahead of deadline.',
      financialImpactFormatted: 'Save ₹8.0 Lakhs Penalty',
      estimatedEffort: 'low',
      timeline: '24-48 hours',
      requiredApprovalRoles: ['Head of Legal', 'Operations Lead'],
      status: 'proposed'
    },
    critique: {
      criticName: 'OpsGuard Critic Agent v1.2',
      challenges: [],
      unsupportedClaims: [],
      riskOverestimations: [],
      suggestedAdjustments: [
        'Compress CISO digital sign-off window from 24 hours to 6 hours max.'
      ],
      overallVerdict: 'approved',
      critiqueTimestamp: 'Just now'
    },
    agentTimeline: [
      { agentName: 'Input Normalizer', status: 'completed', timestamp: '09:45 AM', duration: '0.3s', description: 'Normalized contract parameters.' },
      { agentName: 'Signal Agent', status: 'completed', timestamp: '09:45 AM', duration: '0.6s', description: 'Identified 3 contract obligation signals.' },
      { agentName: 'Evidence Agent', status: 'completed', timestamp: '09:45 AM', duration: '0.9s', description: 'Verified milestone schedule.' },
      { agentName: 'Risk Engine', status: 'completed', timestamp: '09:45 AM', duration: '0.4s', description: 'Calculated Risk Score 85% (CRITICAL).' },
      { agentName: 'Reasoning Agent', status: 'completed', timestamp: '09:46 AM', duration: '1.8s', description: 'Identified missing CISO signature root cause.' },
      { agentName: 'Action Planner', status: 'completed', timestamp: '09:46 AM', duration: '1.2s', description: 'Generated Fast-Track Legal plan.' },
      { agentName: 'Critic Agent', status: 'completed', timestamp: '09:46 AM', duration: '0.7s', description: 'Completed critique review. Verdict: APPROVED.' },
      { agentName: 'Human Approval', status: 'pending', timestamp: 'Awaiting Review', description: 'Pending Operations Lead decision.' }
    ],
    auditHistory: [
      { id: 'AUD-003', timestamp: '09:45 AM', actor: 'OpsGuard Agent Chain', actorRole: 'System', eventType: 'risk_detected', summary: 'Incident created with 85% calculated obligation risk.' }
    ]
  },

  {
    id: 'INC-2026-0893',
    title: 'Project Alpha — Delivery Schedule Delay Risk',
    entityName: 'Project Alpha Migration',
    entityType: 'Project',
    entityId: 'PROJ-1109',
    riskDomain: 'project_delay',
    riskScore: 71,
    probability: 0.71,
    severity: 'high',
    confidenceScore: 88,
    primaryMetric: '11 Days Estimated Delay',
    exposureAmountRupees: 6500000,
    status: 'pending_approval',
    lastUpdated: '1 hour ago',
    owner: 'Rajesh Kumar (PM)',
    signals: [
      { id: 'SIG-7', name: 'Projected Delay', value: '11 days delay', impact: 'HIGH', description: 'Timeline projected to breach client target launch date.', weight: 0.50, severityScore: 80, confidence: 0.91, source: 'project_pm' },
      { id: 'SIG-8', name: 'Blocked Sprint Tasks', value: '12 tasks blocked', impact: 'HIGH', description: '12 tasks stalled due to OAuth integration API schema deadlock.', weight: 0.50, severityScore: 85, confidence: 0.93, source: 'project_pm' }
    ],
    evidence: [
      {
        id: 'EVI-105',
        title: 'Sprint Velocity & Critical Path Task Audit',
        type: 'task_blockers',
        summary: 'Sprint tracking audit indicates 12 critical path tasks stalled by OAuth integration API schema mismatch.',
        significance: 'high',
        evidenceCategory: 'verified',
        reliabilityScore: 0.92,
        blockers: [
          { taskName: 'Integration API Schema Definition', owner: 'Core Engineering', blockedDays: 6, impact: 'Blocks 5 downstream UI tasks' },
          { taskName: 'Data Pipeline Migration Verification', owner: 'Data Team', blockedDays: 9, impact: 'Delays UAT sign-off' }
        ]
      }
    ],
    reasoning: {
      narrative: 'Project Alpha is 11 days behind schedule due to 12 sprint tasks blocked by an API schema mismatch between Core Engineering and Integration teams.',
      rootCauses: [
        'API schema deadlock between Core Engineering and Integration teams.',
        'Key Data Engineer reassigned during Sprint 4.'
      ],
      contributingFactors: [
        'QA environment downtime during sprint 3.'
      ],
      keyInsight: 'Re-allocating 1 Senior Backend Engineer for 3 days to finalize the API schema will unblock 8 of the 12 stalled tasks immediately.',
      confidenceScore: 0.88,
      historicalAccuracy: 0.87
    },
    recommendation: {
      id: 'REC-2026-0893',
      actionTitle: 'Engineering Swat Team Allocation & Blocker Unblock',
      steps: [
        { id: 1, title: 'Temporary Senior Engineer Reallocation', detail: 'Reassign 1 Senior Backend Engineer for 3 days to finalize integration API schema.', assignedRole: 'Engineering Manager', priority: 'critical', deadlineHours: 24 },
        { id: 2, title: 'Daily Standup Sync', detail: 'Institute daily 15-minute blocker review standup until sprint velocity recovers.', assignedRole: 'Project Manager', priority: 'high', deadlineHours: 24 }
      ],
      expectedOutcome: 'Recover 8 days of schedule drift, placing delivery within safe buffer margin.',
      expectedImpact: 'Protects project milestone billing payment.',
      financialImpactFormatted: 'Protect ₹65.0 Lakhs Project Value',
      estimatedEffort: 'medium',
      timeline: '3-5 business days',
      requiredApprovalRoles: ['VP Engineering', 'Operations Lead'],
      status: 'proposed'
    },
    critique: {
      criticName: 'OpsGuard Critic Agent v1.2',
      challenges: [
        'CRITIC NOTE: Engineering reallocation of 1 Senior Backend Engineer may cause minor velocity drop in parallel Sprint 5 tasks.'
      ],
      unsupportedClaims: [],
      riskOverestimations: [],
      suggestedAdjustments: [
        'Ensure temporary assignment is capped strictly at 3 days with daily check-ins.'
      ],
      overallVerdict: 'approved_with_notes',
      critiqueTimestamp: 'Just now'
    },
    agentTimeline: [
      { agentName: 'Input Normalizer', status: 'completed', timestamp: '09:00 AM', duration: '0.3s', description: 'Normalized project parameters.' },
      { agentName: 'Signal Agent', status: 'completed', timestamp: '09:00 AM', duration: '0.7s', description: 'Identified 2 delivery risk signals.' },
      { agentName: 'Evidence Agent', status: 'completed', timestamp: '09:00 AM', duration: '0.8s', description: 'Audited sprint task blockers.' },
      { agentName: 'Risk Engine', status: 'completed', timestamp: '09:01 AM', duration: '0.4s', description: 'Calculated Risk Score 71% (HIGH).' },
      { agentName: 'Reasoning Agent', status: 'completed', timestamp: '09:01 AM', duration: '1.9s', description: 'Identified API schema deadlock root cause.' },
      { agentName: 'Action Planner', status: 'completed', timestamp: '09:02 AM', duration: '1.3s', description: 'Generated Engineering Swat plan.' },
      { agentName: 'Critic Agent', status: 'completed', timestamp: '09:02 AM', duration: '0.8s', description: 'Completed critique review. Verdict: APPROVED WITH NOTES.' },
      { agentName: 'Human Approval', status: 'pending', timestamp: 'Awaiting Review', description: 'Pending Operations Lead decision.' }
    ],
    auditHistory: [
      { id: 'AUD-004', timestamp: '09:00 AM', actor: 'OpsGuard Agent Chain', actorRole: 'System', eventType: 'risk_detected', summary: 'Incident created with 71% calculated delivery risk.' }
    ]
  }
];

export const defaultSettings: OpsGuardSettings = {
  churnThresholdPct: 65,
  contractAlertWindowDays: 30,
  projectDelayThresholdPct: 10,
  realtimeCriticalAlerts: true,
  dailyDigestEmail: true,
  autoEscalateUnapprovedHours: 48,
  currencySymbol: '₹',
  activeModelVersions: {
    customer_churn: 'MOD-CHURN-V1',
    contract_deadline: 'MOD-CONTRACT-V1',
    project_delay: 'MOD-DELIVERY-V1'
  },
  modelWeights: defaultModelWeights
};
