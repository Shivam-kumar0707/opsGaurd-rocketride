// =============================================================================
// RiskTimeline Component — Unified Story & Decision Timeline
// =============================================================================

import React from 'react';
import { OperationalIncident } from '../../types/opsguard';

interface RiskTimelineProps {
  incident: OperationalIncident;
}

export const RiskTimeline: React.FC<RiskTimelineProps> = ({ incident }) => {
  const events = [
    { date: 'Jul 20', title: 'Risk Detected', detail: 'Initial baseline risk score calculated at 48%. Monitoring active.', status: 'low' },
    { date: 'Aug 02', title: 'Usage Drop Signal Detected', detail: 'Telemetry reported -27% usage change across active user seats.', status: 'medium' },
    { date: 'Aug 14', title: 'Support Ticket Escalation', detail: 'Support ticket count increased from 4 to 7 with negative sentiment spikes.', status: 'high' },
    { date: 'Aug 23', title: 'Renewal Window Approaching', detail: 'Contract renewal window entered 38-day proximity window.', status: 'high' },
    { date: 'Sep 01', title: 'Critical Risk Threshold Exceeded', detail: `Deterministic Risk Engine evaluated score at ${incident.riskScore}% (${incident.severity.toUpperCase()}).`, status: 'critical' },
    { date: 'Sep 01', title: 'Multi-Agent Action Proposed', detail: `Action Planner proposed "${incident.recommendation.actionTitle}". Critic review complete.`, status: 'action' },
    ...(incident.recommendation.status === 'approved' || incident.recommendation.status === 'modified' ? [
      { date: 'Sep 01', title: `Human Decision: ${incident.recommendation.status.toUpperCase()}`, detail: incident.recommendation.modifiedActionText ? `Modified plan to: "${incident.recommendation.modifiedActionText}"` : 'Approved recommendation as proposed.', status: 'approved' }
    ] : []),
    ...(incident.outcome ? [
      { date: incident.outcome.timestamp || 'Sep 05', title: 'Verified Operational Outcome', detail: `Outcome recorded: ${incident.outcome.actualOutcome.toUpperCase()}. Financial saved: ₹${(incident.outcome.financialSavedRupees / 100000).toFixed(1)} Lakhs.`, status: 'outcome' }
    ] : [])
  ];

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
        {/* Vertical connecting line */}
        <div style={{ position: 'absolute', top: 8, bottom: 8, left: 15, width: 2, backgroundColor: '#334155', zIndex: 0 }} />

        {events.map((evt, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: evt.status === 'critical' ? '#2C1C1D' : evt.status === 'approved' || evt.status === 'outcome' ? '#1C2B20' : '#1E293B',
              border: `2px solid ${evt.status === 'critical' ? '#E57373' : evt.status === 'approved' || evt.status === 'outcome' ? '#81C784' : '#3B82F6'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#FFF',
              flexShrink: 0
            }}>
              {idx + 1}
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 6, border: '1px solid #334155', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>{evt.title}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{evt.date}</span>
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1' }}>{evt.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
