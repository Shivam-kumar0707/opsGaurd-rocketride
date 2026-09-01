// =============================================================================
// OpsGuard — Root Component rendered by the RocketRide Shell
// =============================================================================

import React, { useState, useMemo } from 'react';
import type { ShellAppProps } from 'shell';
import { AppLayout, SidebarMenu, ContentHeader, Button, Banner } from 'shell';

import { OperationalIncident, UserRole } from './types/opsguard';
import { initialIncidents } from './data/mockOpsGuardData';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { OperationsInbox } from './components/dashboard/OperationsInbox';
import { OpsGuardAgentChat } from './components/ai/OpsGuardAgentChat';
import { SettingsPanel } from './components/settings/SettingsPanel';

// Core Architecture Views
import { AnalyzeRiskWorkflow } from './components/analyze/AnalyzeRiskWorkflow';
import { ModelTrainingView } from './components/training/ModelTrainingView';
import { ModelRegistryView } from './components/training/ModelRegistryView';
import { HistoricalCasesView } from './components/historical/HistoricalCasesView';
import { RiskSimulatorView } from './components/simulation/RiskSimulatorView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { SecurityStatusView } from './components/security/SecurityStatusView';
import { LearningCenterView } from './components/learning/LearningCenterView';
import { SystemDocumentationView } from './components/admin/SystemDocumentationView';

// Unified Risk Workspace
import { RiskWorkspace } from './components/workspace/RiskWorkspace';

// Security & Learning Services
import { ApprovalStateMachine } from './security/approvalStateMachine';
import { SystemProtection } from './security/systemProtection';
import { PolicyEngine } from './security/policyEngine';
import { FeedbackStore } from './learning/feedbackStore';

// Simplified Sidebar Navigation Definition (Primary vs ADMIN grouping)
const MENU_DEFINITION = {
  entries: [
    { id: 'overview', label: 'Overview' },
    { id: 'inbox', label: 'Risks' },
    { id: 'ai_agent', label: 'Assistant' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'training', label: 'AI: Model Training' },
    { id: 'registry', label: 'AI: Model Registry' },
    { id: 'learning', label: 'AI: Learning Center' },
    { id: 'security', label: 'Admin: Security & Integrity' },
    { id: 'audit', label: 'Admin: Audit Trail' },
    { id: 'settings', label: 'Admin: System Settings' },
    { id: 'documentation', label: 'Admin: System Documentation' }
  ]
};

const App: React.FC<ShellAppProps> = ({ identity }) => {
  const [activeNav, setActiveNav] = useState<string>('overview');
  const [incidents, setIncidents] = useState<OperationalIncident[]>(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState<OperationalIncident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  // RBAC User Role Context (Default: OPERATIONS_LEAD, inherited from RocketRide shell identity if present)
  const [userRole, setUserRole] = useState<UserRole>((identity as any)?.role || 'OPERATIONS_LEAD');
  const [actionErrorBanner, setActionErrorBanner] = useState<string | null>(null);

  const sidebar = useMemo(() => (
    <SidebarMenu
      menu={MENU_DEFINITION}
      activeId={activeNav}
      onSelect={(id) => {
        setSelectedIncident(null);
        setActiveNav(id);
        if (id === 'overview' || id === 'inbox') {
          setSeverityFilter(null);
        }
      }}
      sectionLabel="OpsGuard Control"
    />
  ), [activeNav]);

  const handleIncidentCreated = (newIncident: OperationalIncident) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleApproveAction = (incidentId: string, notes?: string) => {
    const actorName = identity?.displayName || 'Sarah (Operations Lead)';
    const targetInc = incidents.find(i => i.id === incidentId);
    if (!targetInc) return;

    try {
      const idempotencyKey = `IDEM-APP-${incidentId}-${Date.now().toString().slice(-4)}`;
      const updated = ApprovalStateMachine.transition(targetInc, 'APPROVED', userRole, actorName, idempotencyKey, notes);
      setIncidents(prev => prev.map(inc => inc.id === incidentId ? updated : inc));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updated);
      }
      FeedbackStore.addRecord(targetInc, 'APPROVED', actorName, notes);
    } catch (err: any) {
      setActionErrorBanner(`⚠ Action Blocked: ${err.message}`);
      setTimeout(() => setActionErrorBanner(null), 5000);
    }
  };

  const handleRejectAction = (incidentId: string, reason: string) => {
    const actorName = identity?.displayName || 'Sarah (Operations Lead)';
    const targetInc = incidents.find(i => i.id === incidentId);
    if (!targetInc) return;

    try {
      const idempotencyKey = `IDEM-REJ-${incidentId}-${Date.now().toString().slice(-4)}`;
      const updated = ApprovalStateMachine.transition(targetInc, 'REJECTED', userRole, actorName, idempotencyKey, reason);
      setIncidents(prev => prev.map(inc => inc.id === incidentId ? updated : inc));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updated);
      }
      FeedbackStore.addRecord(targetInc, 'REJECTED', actorName, reason);
    } catch (err: any) {
      setActionErrorBanner(`⚠ Action Blocked: ${err.message}`);
      setTimeout(() => setActionErrorBanner(null), 5000);
    }
  };

  const handleModifyAction = (incidentId: string, modifiedActionText: string, notes?: string) => {
    const actorName = identity?.displayName || 'Sarah (Operations Lead)';
    const targetInc = incidents.find(i => i.id === incidentId);
    if (!targetInc) return;

    try {
      const idempotencyKey = `IDEM-MOD-${incidentId}-${Date.now().toString().slice(-4)}`;
      const updated = ApprovalStateMachine.transition(targetInc, 'MODIFIED', userRole, actorName, idempotencyKey, notes);
      updated.recommendation.actionTitle = modifiedActionText;
      setIncidents(prev => prev.map(inc => inc.id === incidentId ? updated : inc));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updated);
      }
      FeedbackStore.addRecord(targetInc, 'MODIFIED', actorName, notes, modifiedActionText);
    } catch (err: any) {
      setActionErrorBanner(`⚠ Action Blocked: ${err.message}`);
      setTimeout(() => setActionErrorBanner(null), 5000);
    }
  };

  return (
    <AppLayout sidebar={sidebar} showStatus>
      <div style={{
        padding: '24px 32px 80px 32px',
        fontFamily: 'var(--rr-font-family, system-ui, sans-serif)',
        height: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: 'var(--rr-surface-canvas, #0F172A)'
      }}>
        
        {/* Action Rejection / Security Error Banner */}
        {actionErrorBanner && (
          <div style={{ marginBottom: 16 }}>
            <Banner variant="error">
              {actionErrorBanner}
            </Banner>
          </div>
        )}

        {/* Protected Mode Security Alert */}
        {SystemProtection.isProtected() && (
          <div style={{ marginBottom: 16 }}>
            <Banner variant="error">
              ⚠ OpsGuard Protected Mode Active: {SystemProtection.getReason()}. Privileged operations restricted.
            </Banner>
          </div>
        )}

        {/* UNIFIED RISK WORKSPACE VIEW (When an incident is selected) */}
        {selectedIncident ? (
          <RiskWorkspace
            incident={selectedIncident}
            userRole={userRole}
            onBack={() => setSelectedIncident(null)}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
            onModify={handleModifyAction}
          />
        ) : (
          <>
            {/* VIEW 1: OVERVIEW (Risk Command Center) */}
            {activeNav === 'overview' && (
              <div>
                <ContentHeader
                  title="OpsGuard — Operational Risk Command Center"
                  subtitle="Prevent expensive operational failures before they happen"
                  actions={
                    <Button
                      variant="primary"
                      onClick={() => setActiveNav('analyze')}
                    >
                      ⚡ Analyze New Operational Risk
                    </Button>
                  }
                />

                <MetricsGrid
                  incidents={incidents}
                  onFilterSeverity={(sev) => {
                    setSeverityFilter(sev);
                    setActiveNav('inbox');
                  }}
                />

                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#F8FAFC', marginBottom: 12 }}>
                  Priority Risk Feed
                </h3>

                <OperationsInbox
                  incidents={incidents}
                  onInvestigate={(inc) => setSelectedIncident(inc)}
                  selectedSeverityFilter={severityFilter}
                />
              </div>
            )}

            {/* VIEW 2: ANALYZE RISK WORKFLOW */}
            {activeNav === 'analyze' && (
              <div>
                <AnalyzeRiskWorkflow
                  onIncidentCreated={handleIncidentCreated}
                  onViewIncidentDetails={(inc) => setSelectedIncident(inc)}
                />
              </div>
            )}

            {/* VIEW 3: RISKS (Operations Inbox) */}
            {activeNav === 'inbox' && (
              <div>
                <ContentHeader
                  title="Operational Risks Feed"
                  subtitle="Filter and inspect active operational risks across Customer Churn, Contract Obligations & Delivery"
                />

                <OperationsInbox
                  incidents={incidents}
                  onInvestigate={(inc) => setSelectedIncident(inc)}
                  selectedSeverityFilter={severityFilter}
                />
              </div>
            )}

            {/* VIEW 4: ASSISTANT */}
            {activeNav === 'ai_agent' && (
              <div>
                <OpsGuardAgentChat
                  incidents={incidents}
                  onInvestigateIncident={(inc) => setSelectedIncident(inc)}
                />
              </div>
            )}

            {/* VIEW 5: HISTORICAL CASES */}
            {activeNav === 'historical' && (
              <div>
                <HistoricalCasesView />
              </div>
            )}

            {/* VIEW 6: SIMULATION */}
            {activeNav === 'simulation' && (
              <div>
                <RiskSimulatorView incidents={incidents} />
              </div>
            )}

            {/* ADMIN VIEW 1: MODEL TRAINING */}
            {activeNav === 'training' && (
              <div>
                <ModelTrainingView />
              </div>
            )}

            {/* ADMIN VIEW 2: MODEL REGISTRY */}
            {activeNav === 'registry' && (
              <div>
                <ModelRegistryView userRole={userRole} />
              </div>
            )}

            {/* ADMIN VIEW 3: LEARNING CENTER */}
            {activeNav === 'learning' && (
              <div>
                <LearningCenterView userRole={userRole} />
              </div>
            )}

            {/* ADMIN VIEW 4: SECURITY & INTEGRITY */}
            {activeNav === 'security' && (
              <div>
                <SecurityStatusView
                  currentRole={userRole}
                  onRoleChange={(newRole) => {
                    setUserRole(newRole);
                    PolicyEngine.logSecurityEvent({
                      id: `SEC-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      eventType: 'AUTHENTICATION_SUCCESS',
                      severity: 'LOW',
                      actor: identity?.displayName || 'User',
                      actorRole: newRole,
                      details: `User switched RBAC role context to "${newRole}".`
                    });
                  }}
                />
              </div>
            )}

            {/* ADMIN VIEW 5: AUDIT TRAIL */}
            {activeNav === 'audit' && (
              <div>
                <AuditTrailView incidents={incidents} />
              </div>
            )}

            {/* ADMIN VIEW 6: SYSTEM SETTINGS */}
            {activeNav === 'settings' && (
              <div>
                <SettingsPanel />
              </div>
            )}

            {/* ADMIN VIEW 7: SYSTEM DOCUMENTATION */}
            {activeNav === 'documentation' && (
              <div>
                <SystemDocumentationView />
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default App;
