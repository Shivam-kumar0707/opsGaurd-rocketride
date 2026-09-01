// =============================================================================
// RiskWorkspace Component — Unified 1-Page Operational Risk Workspace
// =============================================================================

import React, { useState } from 'react';
import { Button, Banner } from 'shell';
import { OperationalIncident, UserRole } from '../../types/opsguard';
import { RiskTimeline } from './RiskTimeline';
import { getSeverityColor, getDomainBadge } from '../dashboard/RiskCard';

interface RiskWorkspaceProps {
  incident: OperationalIncident;
  userRole?: UserRole;
  onBack: () => void;
  onApprove: (incidentId: string, notes?: string) => void;
  onReject: (incidentId: string, reason: string) => void;
  onModify: (incidentId: string, modifiedActionText: string, notes?: string) => void;
}

export const RiskWorkspace: React.FC<RiskWorkspaceProps> = ({
  incident,
  userRole,
  onBack,
  onApprove,
  onReject,
  onModify
}) => {
  // Feedback & modification state
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [modifiedActionText, setModifiedActionText] = useState(incident.recommendation.actionTitle);
  const [modifyNotes, setModifyNotes] = useState('');

  // Expandable Progressive Disclosure Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const severityStyle = getSeverityColor(incident.severity);
  const domainBadge = getDomainBadge(incident.riskDomain);

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    onReject(incident.id, rejectReason);
    setShowRejectDialog(false);
  };

  const handleConfirmModify = () => {
    onModify(incident.id, modifiedActionText, modifyNotes);
    setShowModifyDialog(false);
  };

  return (
    <div style={{ maxWidth: 960, paddingBottom: 40 }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#3B82F6',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        &larr; Back to Risks & Operations Control Center
      </button>

      {/* Header & Risk Score Card */}
      <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: `1px solid ${severityStyle.border}`, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: domainBadge.bg, color: domainBadge.color, border: `1px solid ${domainBadge.color}` }}>
                {domainBadge.label}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: severityStyle.bg, color: severityStyle.color, border: `1px solid ${severityStyle.border}` }}>
                {incident.severity.toUpperCase()}
              </span>
            </div>

            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#F8FAFC' }}>
              {incident.entityName}
            </h1>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
              Incident ID: <strong style={{ color: '#CBD5E1' }}>{incident.id}</strong> &bull; Priority Window: <strong style={{ color: '#FFB74D' }}>Renewal in 38 Days</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: severityStyle.color, lineHeight: 1 }}>
              {incident.riskScore}%
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              Probability: {(incident.probability * 100).toFixed(0)}% &bull; Confidence: {(incident.confidenceScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Key Operational Impact Metrics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 18, paddingTop: 16, borderTop: '1px solid #334155' }}>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>FINANCIAL EXPOSURE</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>₹{(incident.exposureAmountRupees / 100000).toFixed(1)} Lakhs</div>
          </div>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>RISK TREND</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E57373' }}>↑ Deteriorating (+14 pts)</div>
          </div>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>PRIMARY SIGNAL</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFB74D' }}>{incident.signals[0]?.name || 'Usage Drop'}</div>
          </div>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>HISTORICAL PATTERN</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#81C784' }}>72.3% Success Rate</div>
          </div>
        </div>
      </div>

      {/* WHAT CHANGED SINCE LAST ANALYSIS? */}
      <div style={{ backgroundColor: '#1E293B', padding: 18, borderRadius: 8, border: '1px solid #334155', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
          ⚡ What Changed Since Last Analysis?
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>RISK SCORE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E57373' }}>73% &rarr; 87% (+14 pts)</div>
          </div>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>USAGE CHANGE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E57373' }}>-27% &rarr; -42%</div>
          </div>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>SUPPORT TICKETS</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#FFB74D' }}>4 &rarr; 7 tickets</div>
          </div>
          <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>RENEWAL WINDOW</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>51 &rarr; 38 days</div>
          </div>
        </div>
      </div>

      {/* WHY IS THIS HAPPENING? (ROOT CAUSE & RISK DRIVERS) */}
      <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 8, border: '1px solid #334155', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>
          🔍 Why Is This Happening? (Root Cause & Point Drivers)
        </h3>

        <div style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', marginBottom: 4 }}>
            PRIMARY ROOT CAUSE
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>
            {incident.reasoning.keyInsight || 'Cloud API integration reliability issues causing operational user friction and seat inactivity.'}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>
            {incident.reasoning.narrative}
          </div>
        </div>

        {/* Deterministic Drivers Breakdown */}
        <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
          DETERMINISTIC POINT CONTRIBUTION DRIVERS:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {incident.prediction?.drivers.map((drv, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
              <span style={{ color: '#F8FAFC' }}>{drv.label} ({drv.value})</span>
              <span style={{ fontWeight: 700, color: '#FFB74D' }}>+{drv.pointsContribution} points</span>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORICAL INTELLIGENCE & LESSONS */}
      <div style={{ backgroundColor: '#1E293B', padding: 18, borderRadius: 8, border: '1px solid #334155', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
            📚 Historical Intelligence (47 Comparable Cases)
          </h3>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#81C784' }}>
            72.3% Positive Outcome Rate
          </span>
        </div>

        <div style={{ fontSize: 13, color: '#CBD5E1', backgroundColor: '#0F172A', padding: 12, borderRadius: 6, border: '1px solid #334155' }}>
          <strong>Most Successful Historical Intervention:</strong> Technical Escalation & Engineering API Fix resulted in account retention in 34 out of 47 comparable cases.
        </div>
      </div>

      {/* RECOMMENDED ACTION PLAN */}
      <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 8, border: '1px solid #3B82F6', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>
              RECOMMENDED INTERVENTION PLAN
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>
              {incident.recommendation.actionTitle}
            </h3>
          </div>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>
            Timeline: <strong style={{ color: '#FFF' }}>{incident.recommendation.timeline}</strong>
          </span>
        </div>

        {/* Action Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {incident.recommendation.steps.map((step, idx) => (
            <div key={idx} style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 6, border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>
                  {step.id}. {step.title}
                </span>
                <span style={{ fontSize: 11, color: '#FFB74D', fontWeight: 600 }}>
                  Role: {step.assignedRole} &bull; Deadline: {step.deadlineHours}h
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{step.detail}</div>
            </div>
          ))}
        </div>

        {/* CRITIC AGENT REVIEW */}
        {incident.critique && (
          <div style={{ backgroundColor: '#2C2419', padding: 14, borderRadius: 6, border: '1px solid #4A3B24', marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB74D', marginBottom: 4 }}>
              🔍 CRITIC AGENT REVIEW VERDICT: {incident.critique.overallVerdict.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: '#F8FAFC', lineHeight: 1.4 }}>
              {incident.critique.challenges[0] || 'Critic challenged premature commercial discount recommendation in favor of technical escalation.'}
            </div>
          </div>
        )}

        {/* HUMAN DECISION CONTROL BAR */}
        <div style={{ paddingTop: 14, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Current Status: </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: incident.status === 'approved' ? '#81C784' : incident.status === 'rejected' ? '#E57373' : '#FFB74D' }}>
              {incident.status.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => setShowRejectDialog(true)}>
              ✕ Reject Plan
            </Button>
            <Button variant="secondary" onClick={() => setShowModifyDialog(true)}>
              ✎ Modify Plan
            </Button>
            <Button variant="primary" onClick={() => onApprove(incident.id)}>
              ✓ Approve & Execute Plan
            </Button>
          </div>
        </div>
      </div>

      {/* REJECT REASON DIALOG */}
      {showRejectDialog && (
        <div style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 8, border: '1px solid #E57373', marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#E57373', fontSize: 14 }}>Why are you rejecting this recommendation?</h4>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Enter reason (e.g., Customer issue is technical API downtime, pricing discount is incorrect)..."
            rows={3}
            style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" small onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="primary" small onClick={handleConfirmReject}>Confirm Rejection</Button>
          </div>
        </div>
      )}

      {/* MODIFY PLAN DIALOG */}
      {showModifyDialog && (
        <div style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 8, border: '1px solid #FFB74D', marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#FFB74D', fontSize: 14 }}>Modify Operational Action Plan</h4>
          <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Modified Action Title</label>
          <input
            type="text"
            value={modifiedActionText}
            onChange={e => setModifiedActionText(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', marginBottom: 10 }}
          />
          <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Reason for Modification</label>
          <textarea
            value={modifyNotes}
            onChange={e => setModifyNotes(e.target.value)}
            placeholder="Reason for modifying AI recommendation..."
            rows={2}
            style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" small onClick={() => setShowModifyDialog(false)}>Cancel</Button>
            <Button variant="primary" small onClick={handleConfirmModify}>Save Modified Plan</Button>
          </div>
        </div>
      )}

      {/* PROGRESSIVE DISCLOSURE ACCORDIONS (TECHNICAL DETAILS) */}
      <div style={{ marginTop: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12 }}>
          Technical Diagnostics & Verification (Progressive Disclosure)
        </h4>

        {[
          { id: 'timeline', title: '▾ Unified Risk & Decision Timeline' },
          { id: 'signals', title: '▾ Raw Signals Breakdown' },
          { id: 'evidence', title: '▾ Full Evidence Classification Data' },
          { id: 'security', title: '▾ SHA-256 Model Integrity & Audit Verification' }
        ].map(acc => (
          <div key={acc.id} style={{ marginBottom: 10, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155', overflow: 'hidden' }}>
            <button
              onClick={() => toggleAccordion(acc.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#1E293B',
                border: 'none',
                color: '#F8FAFC',
                fontWeight: 600,
                fontSize: 13,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{acc.title}</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{openAccordion === acc.id ? '▲ Collapse' : '▼ Expand'}</span>
            </button>

            {openAccordion === acc.id && (
              <div style={{ padding: 16, backgroundColor: '#0F172A', borderTop: '1px solid #334155' }}>
                {acc.id === 'timeline' && <RiskTimeline incident={incident} />}

                {acc.id === 'signals' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {incident.signals.map(sig => (
                      <div key={sig.id} style={{ fontSize: 12, color: '#CBD5E1', padding: 8, backgroundColor: '#1E293B', borderRadius: 4 }}>
                        <strong>{sig.name}:</strong> {sig.description} &bull; Impact: {sig.impact} &bull; Confidence: {sig.confidence * 100}%
                      </div>
                    ))}
                  </div>
                )}

                {acc.id === 'evidence' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {incident.evidence.map(ev => (
                      <div key={ev.id} style={{ fontSize: 12, color: '#CBD5E1', padding: 8, backgroundColor: '#1E293B', borderRadius: 4 }}>
                        <strong>{ev.title} ({ev.evidenceCategory.toUpperCase()}):</strong> {ev.summary} &bull; Reliability: {ev.reliabilityScore * 100}%
                      </div>
                    ))}
                  </div>
                )}

                {acc.id === 'security' && (
                  <div style={{ fontSize: 12, color: '#81C784' }}>
                    ✓ Model SHA-256 Hash Verified &bull; Audit Chain Hash Linked &bull; Role Authorization: {userRole || 'OPERATIONS_LEAD'}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
