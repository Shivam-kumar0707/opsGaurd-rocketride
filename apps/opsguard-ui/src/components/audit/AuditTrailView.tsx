// =============================================================================
// AuditTrailView Component
// =============================================================================

import React, { useState } from 'react';
import { OperationalIncident, AuditEvent } from '../../types/opsguard';

interface AuditTrailViewProps {
  incidents: OperationalIncident[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ incidents }) => {
  const [filterEventType, setFilterEventType] = useState<string | null>(null);

  // Combine all audit logs from incidents
  const allEvents: (AuditEvent & { incidentTitle: string })[] = [];
  incidents.forEach(inc => {
    inc.auditHistory.forEach(evt => {
      allEvents.push({
        ...evt,
        incidentTitle: inc.entityName
      });
    });
  });

  const filteredEvents = filterEventType
    ? allEvents.filter(e => e.eventType === filterEventType)
    : allEvents;

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          System Audit Trail & Inference Auditability
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Complete time-stamped history of model inferences, signal detections, critic reviews, and human approval decisions.
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 6 }}>
        {[
          { id: null, label: 'All Audit Events' },
          { id: 'risk_scored', label: 'Model Predictions' },
          { id: 'critique_performed', label: 'Critic Reviews' },
          { id: 'action_approved', label: 'Human Approvals' },
          { id: 'action_modified', label: 'Human Modifications' }
        ].map(tab => (
          <button
            key={tab.id || 'all'}
            onClick={() => setFilterEventType(tab.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              backgroundColor: filterEventType === tab.id ? '#334155' : '#1E293B',
              color: filterEventType === tab.id ? '#FFF' : '#94A3B8',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event Audit List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredEvents.map(evt => (
          <div key={evt.id} style={{ padding: 14, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: '#334155', color: '#94A3B8' }}>
                  {evt.eventType.toUpperCase().replace('_', ' ')}
                </span>
                <strong style={{ fontSize: 13, color: '#F8FAFC' }}>{evt.incidentTitle}</strong>
              </div>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>
                {evt.timestamp} &bull; Actor: {evt.actor} ({evt.actorRole})
              </span>
            </div>

            <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4 }}>
              {evt.summary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
