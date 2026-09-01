// =============================================================================
// IncidentDetailModal Component (Extended with Critic Review & Outcomes)
// =============================================================================

import React, { useState } from 'react';
import { Button, ConfirmDialog } from 'shell';
import { OperationalIncident, OperationalOutcome, UserRole } from '../../types/opsguard';
import { getSeverityColor, getDomainBadge } from '../dashboard/RiskCard';
import { OutcomeTracker } from '../../outcomes/outcomeTracker';
import { ApprovalStateMachine } from '../../security/approvalStateMachine';
import { PolicyEngine } from '../../security/policyEngine';
import { FeedbackStore } from '../../learning/feedbackStore';

interface IncidentDetailModalProps {
  incident: OperationalIncident | null;
  userRole?: UserRole;
  onClose: () => void;
  onApprove: (incidentId: string, notes?: string) => void;
  onReject: (incidentId: string, reason: string) => void;
  onModify: (incidentId: string, modifiedActionText: string, notes?: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  userRole,
  onClose,
  onApprove,
  onReject,
  onModify
}) => {
  if (!incident) return null;

  const [activeTab, setActiveTab] = useState<'why' | 'evidence' | 'reasoning' | 'action' | 'timeline' | 'audit'>('action');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [showOutcomeDialog, setShowOutcomeDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [modifiedAction, setModifiedAction] = useState(incident.recommendation.actionTitle);
  const [selectedOutcomeCategory, setSelectedOutcomeCategory] = useState<OperationalOutcome['actualOutcome']>('retained');
  const [outcomeSavedRupees, setOutcomeSavedRupees] = useState<number>(incident.exposureAmountRupees);
  const [outcomeNotes, setOutcomeNotes] = useState('');

  const severityStyle = getSeverityColor(incident.severity);
  const domainBadge = getDomainBadge(incident.riskDomain);

  const tabs: { id: 'why' | 'evidence' | 'reasoning' | 'action' | 'timeline' | 'audit'; label: string; badge?: string }[] = [
    { id: 'why', label: 'Signals', badge: `${incident.signals.length}` },
    { id: 'evidence', label: 'Evidence Data', badge: `${incident.evidence.length}` },
    { id: 'reasoning', label: 'System Analysis' },
    { id: 'action', label: 'Action Plan', badge: incident.status === 'pending_approval' ? 'Pending' : undefined },
    { id: 'timeline', label: 'Execution Timeline' },
    { id: 'audit', label: 'Audit Trail', badge: `${incident.auditHistory.length}` }
  ];

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    onReject(incident.id, rejectReason);
    FeedbackStore.addRecord(incident, 'REJECTED', 'Sarah (Operations Lead)', rejectReason);
    setShowRejectDialog(false);
    onClose();
  };

  const handleConfirmModify = () => {
    onModify(incident.id, modifiedAction, userNotes);
    FeedbackStore.addRecord(incident, 'MODIFIED', 'Sarah (Operations Lead)', userNotes, modifiedAction);
    setShowModifyDialog(false);
    onClose();
  };

  const handleRecordOutcome = () => {
    OutcomeTracker.recordOutcome(incident, selectedOutcomeCategory, outcomeSavedRupees, outcomeNotes);
    setShowOutcomeDialog(false);
    alert('Actual outcome successfully logged to Historical Case Repository and Outcome Feedback Loop!');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        backgroundColor: '#0F172A',
        width: '100%',
        maxWidth: 960,
        maxHeight: '90vh',
        borderRadius: 8,
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #334155',
          backgroundColor: '#1E293B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: domainBadge.bg,
                color: domainBadge.color,
                border: '1px solid #334155',
                textTransform: 'uppercase'
              }}>
                {domainBadge.label}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: severityStyle.bg,
                color: severityStyle.color,
                border: `1px solid ${severityStyle.border}`,
                textTransform: 'uppercase'
              }}>
                {incident.severity}
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                Confidence: {incident.confidenceScore}%
              </span>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#F8FAFC' }}>
              {incident.title}
            </h2>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              Entity: <strong style={{ color: '#E2E8F0' }}>{incident.entityName}</strong> ({incident.entityId}) &bull; Primary Impact: <strong style={{ color: '#CBD5E1' }}>{incident.primaryMetric}</strong>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          >
            &times;
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0F172A',
          borderBottom: '1px solid #334155',
          padding: '0 16px',
          overflowX: 'auto'
        }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  borderBottom: isActive ? '2px solid #388E3C' : '2px solid transparent',
                  color: isActive ? '#F8FAFC' : '#94A3B8',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 8,
                    backgroundColor: isActive ? '#334155' : '#1E293B',
                    color: isActive ? '#F8FAFC' : '#64748B'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Tab Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, backgroundColor: '#0F172A' }}>
          
          {/* TAB 1: SIGNALS */}
          {activeTab === 'why' && (
            <div>
              <div style={{ padding: 12, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155', marginBottom: 16, fontSize: 13, color: '#CBD5E1' }}>
                System identified {incident.signals.length} operational risk signals for {incident.entityName}.
              </div>
              <div style={{ marginTop: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94A3B8' }}>
                      <th style={{ padding: '8px 10px' }}>Risk Signal</th>
                      <th style={{ padding: '8px 10px' }}>Observed Value</th>
                      <th style={{ padding: '8px 10px' }}>Impact</th>
                      <th style={{ padding: '8px 10px' }}>Weight</th>
                      <th style={{ padding: '8px 10px' }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incident.signals.map(sig => (
                      <tr key={sig.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '10px', fontWeight: 600, color: '#F8FAFC' }}>
                          {sig.name}
                        </td>
                        <td style={{ padding: '10px', fontWeight: 500, color: '#FFB74D' }}>
                          {sig.value}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor: sig.impact === 'HIGH' ? '#2C1C1D' : '#2C2419',
                            color: sig.impact === 'HIGH' ? '#E57373' : '#FFB74D',
                            border: `1px solid ${sig.impact === 'HIGH' ? '#4A282A' : '#4A3B24'}`
                          }}>
                            {sig.impact}
                          </span>
                        </td>
                        <td style={{ padding: '10px', color: '#94A3B8' }}>
                          {(sig.weight * 100).toFixed(0)}%
                        </td>
                        <td style={{ padding: '10px', color: '#CBD5E1' }}>
                          {sig.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE DATA */}
          {activeTab === 'evidence' && (
            <div>
              {incident.evidence.map(item => (
                <div key={item.id} style={{ marginBottom: 14, padding: 16, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>
                        {item.title}
                      </h4>
                      {/* Clear Distinction: Verified Evidence vs User Provided vs Inferred */}
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        backgroundColor: item.evidenceCategory === 'verified' ? '#1C2B20' : item.evidenceCategory === 'user_provided' ? '#2C2419' : '#22272E',
                        color: item.evidenceCategory === 'verified' ? '#81C784' : item.evidenceCategory === 'user_provided' ? '#FFB74D' : '#94A3B8',
                        border: `1px solid ${item.evidenceCategory === 'verified' ? '#2A4431' : '#4A3B24'}`
                      }}>
                        {item.evidenceCategory === 'verified' ? '✓ Verified Evidence' : item.evidenceCategory === 'user_provided' ? 'User Provided Info' : 'Model Inference'}
                      </span>
                    </div>

                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: '#334155', color: '#CBD5E1' }}>
                      Reliability: {Math.round(item.reliabilityScore * 100)}%
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#CBD5E1', marginBottom: 12 }}>
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SYSTEM ANALYSIS */}
          {activeTab === 'reasoning' && (
            <div>
              <div style={{ padding: 18, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155', marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
                  Operational Analysis & Root Causes
                </h4>
                <p style={{ fontSize: 13, lineHeight: '1.6', color: '#CBD5E1', marginBottom: 14 }}>
                  {incident.reasoning.narrative}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#E57373', marginBottom: 6 }}>PRIMARY ROOT CAUSES</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#CBD5E1' }}>
                      {incident.reasoning.rootCauses.map((rc, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>{rc}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#FFB74D', marginBottom: 6 }}>CONTRIBUTING FACTORS</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#CBD5E1' }}>
                      {incident.reasoning.contributingFactors.map((cf, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>{cf}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: 14, padding: 10, backgroundColor: '#0F172A', borderRadius: 4, border: '1px solid #334155' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#81C784' }}>OPERATIONAL INSIGHT</div>
                  <div style={{ fontSize: 12, color: '#F8FAFC', marginTop: 2 }}>
                    {incident.reasoning.keyInsight}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECOMMENDED ACTION & APPROVAL */}
          {activeTab === 'action' && (
            <div>
              {/* CRITIC AGENT REVIEW PANEL */}
              {incident.critique && (
                <div style={{ marginBottom: 16, padding: 14, backgroundColor: '#2C2419', borderRadius: 6, border: '1px solid #4A3B24' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FFB74D' }}>
                      🔍 CRITIC AGENT REVIEW & VERDICT ({incident.critique.overallVerdict.toUpperCase()})
                    </div>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>
                      {incident.critique.criticName}
                    </span>
                  </div>

                  {incident.critique.challenges.map((chal, idx) => (
                    <div key={idx} style={{ fontSize: 12, color: '#F8FAFC', marginBottom: 4 }}>
                      • {chal}
                    </div>
                  ))}

                  {incident.critique.suggestedAdjustments.map((adj, idx) => (
                    <div key={idx} style={{ fontSize: 12, color: '#81C784', marginTop: 4 }}>
                      💡 Suggested Adjustment: {adj}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ padding: 20, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#81C784', textTransform: 'uppercase' }}>
                      Proposed Action Plan
                    </span>
                    <h3 style={{ margin: '2px 0 0 0', fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>
                      {incident.recommendation.actionTitle}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#81C784' }}>
                      {incident.recommendation.financialImpactFormatted}
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                      Timeline: {incident.recommendation.timeline}
                    </div>
                  </div>
                </div>

                {/* Action Steps */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
                    INTERVENTION STEPS ({incident.recommendation.steps.length}):
                  </div>
                  {incident.recommendation.steps.map(step => (
                    <div key={step.id} style={{ display: 'flex', gap: 10, padding: 10, backgroundColor: '#0F172A', borderRadius: 4, marginBottom: 6, border: '1px solid #334155' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#334155', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 11 }}>
                        {step.id}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>
                          {step.title} {step.assignedRole && <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>({step.assignedRole})</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 2 }}>
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div style={{ paddingTop: 14, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    Status: <strong style={{ color: incident.status === 'approved' ? '#81C784' : incident.status === 'rejected' ? '#E57373' : '#FFB74D' }}>
                      {incident.status.replace('_', ' ').toUpperCase()}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {incident.status === 'approved' && (
                      <Button variant="secondary" onClick={() => setShowOutcomeDialog(true)}>
                        Record Actual Outcome
                      </Button>
                    )}

                    {incident.status === 'pending_approval' ? (
                      <>
                        <Button variant="ghost" onClick={() => setShowRejectDialog(true)}>
                          Reject Action
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModifyDialog(true)}>
                          Modify Plan
                        </Button>
                        <Button variant="primary" onClick={() => { onApprove(incident.id); onClose(); }}>
                          Approve & Execute Plan
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" onClick={onClose}>
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXECUTION TIMELINE */}
          {activeTab === 'timeline' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {incident.agentTimeline.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: step.status === 'completed' ? '#2A4431' : '#1E293B',
                      color: step.status === 'completed' ? '#81C784' : '#94A3B8',
                      border: `1px solid ${step.status === 'completed' ? '#81C784' : '#334155'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 12,
                      flexShrink: 0
                    }}>
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#1E293B', padding: 12, borderRadius: 6, border: '1px solid #334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 13, color: '#F8FAFC' }}>{step.agentName}</strong>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{step.timestamp}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 4 }}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {incident.auditHistory.map(evt => (
                  <div key={evt.id} style={{ padding: 10, backgroundColor: '#1E293B', borderRadius: 4, border: '1px solid #334155', fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: 2 }}>
                      <span><strong>{evt.actor}</strong> ({evt.actorRole})</span>
                      <span>{evt.timestamp}</span>
                    </div>
                    <div style={{ color: '#F8FAFC' }}>
                      {evt.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Outcome Modal */}
      {showOutcomeDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, maxWidth: 500, width: '100%', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, color: '#FFF' }}>Record Operational Outcome Feedback</h3>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Actual Operational Outcome</label>
              <select
                value={selectedOutcomeCategory}
                onChange={e => setSelectedOutcomeCategory(e.target.value as any)}
                style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
              >
                <option value="retained">Retained — Customer Account Recovered</option>
                <option value="penalty_avoided">Penalty Avoided — Obligation Met</option>
                <option value="resolved">Resolved — Project Schedule Drift Recovered</option>
                <option value="churned">Churned — Customer Account Lost</option>
                <option value="penalty_incurred">Penalty Incurred — Deadline Breached</option>
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Financial Value Saved / Impact (₹)</label>
              <input
                type="number"
                value={outcomeSavedRupees}
                onChange={e => setOutcomeSavedRupees(Number(e.target.value))}
                style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Outcome Retrospective Notes</label>
              <textarea
                value={outcomeNotes}
                onChange={e => setOutcomeNotes(e.target.value)}
                placeholder="Log actual result for feedback training dataset..."
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="ghost" onClick={() => setShowOutcomeDialog(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleRecordOutcome}>Log Outcome Feedback</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <ConfirmDialog
          title="Reject Recommended Action"
          message={
            <div>
              <p style={{ marginBottom: 12 }}>Specify the reason for rejecting this action plan:</p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
              />
            </div>
          }
          confirmLabel="Confirm Rejection"
          destructive
          onConfirm={handleConfirmReject}
          onCancel={() => setShowRejectDialog(false)}
        />
      )}

      {/* Modify Action Dialog */}
      {showModifyDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 8, width: '100%', maxWidth: 500, border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, color: '#FFF' }}>Modify Action Plan</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Action Title</label>
              <input type="text" value={modifiedAction} onChange={e => setModifiedAction(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>User Notes / Instructions</label>
              <textarea value={userNotes} onChange={e => setUserNotes(e.target.value)} placeholder="Add custom notes..." rows={3} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="ghost" onClick={() => setShowModifyDialog(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmModify}>Save & Approve Modified Plan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
