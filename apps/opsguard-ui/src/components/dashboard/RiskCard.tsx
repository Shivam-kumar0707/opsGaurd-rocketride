// =============================================================================
// RiskCard Component (Generic, Subtle Enterprise Theme)
// =============================================================================

import React from 'react';
import { Button } from 'shell';
import { OperationalIncident, SeverityLevel } from '../../types/opsguard';

interface RiskCardProps {
  incident: OperationalIncident;
  onInvestigate: (incident: OperationalIncident) => void;
}

export const getSeverityColor = (severity: SeverityLevel): { bg: string; color: string; border: string } => {
  switch (severity) {
    case 'critical':
      return { bg: '#2C1C1D', color: '#E57373', border: '#4A282A' };
    case 'high':
      return { bg: '#2C2419', color: '#FFB74D', border: '#4A3B24' };
    case 'medium':
      return { bg: '#2B281B', color: '#FFD54F', border: '#474125' };
    case 'low':
      return { bg: '#1C2B20', color: '#81C784', border: '#2A4431' };
    case 'resolved':
      return { bg: '#22272E', color: '#94A3B8', border: '#334155' };
  }
};

export const getDomainBadge = (domain: string): { label: string; color: string; bg: string } => {
  switch (domain) {
    case 'customer_churn':
      return { label: 'Customer', color: '#CBD5E1', bg: '#1E293B' };
    case 'contract_deadline':
      return { label: 'Contract', color: '#CBD5E1', bg: '#1E293B' };
    case 'project_delay':
      return { label: 'Project', color: '#CBD5E1', bg: '#1E293B' };
    default:
      return { label: 'Operations', color: '#CBD5E1', bg: '#1E293B' };
  }
};

export const RiskCard: React.FC<RiskCardProps> = ({ incident, onInvestigate }) => {
  const severityStyle = getSeverityColor(incident.severity);
  const domainBadge = getDomainBadge(incident.riskDomain);

  return (
    <div
      style={{
        marginBottom: 12,
        padding: '16px 20px',
        borderRadius: 6,
        backgroundColor: 'var(--rr-surface-card, #1E293B)',
        border: '1px solid var(--rr-border, #334155)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        {/* Left Side: Header info & domain */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: domainBadge.bg,
                color: domainBadge.color,
                border: '1px solid #334155',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}
            >
              {domainBadge.label}
            </span>

            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: severityStyle.bg,
                color: severityStyle.color,
                border: `1px solid ${severityStyle.border}`,
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}
            >
              {incident.severity}
            </span>

            <span style={{ fontSize: 12, color: '#94A3B8' }}>
              Score: {incident.riskScore}%
            </span>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '2px 0 6px 0', color: '#F8FAFC' }}>
            {incident.title}
          </h3>

          <div style={{ fontSize: 13, color: '#94A3B8' }}>
            Entity: <strong style={{ color: '#E2E8F0' }}>{incident.entityName}</strong> ({incident.entityId}) &bull; Updated {incident.lastUpdated}
          </div>
        </div>

        {/* Right Side: Risk Score & Metric */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>
            {incident.primaryMetric}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Status: <span style={{ color: incident.status === 'pending_approval' ? '#FFB74D' : '#81C784', fontWeight: 500 }}>{incident.status.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Signal summary bar & action footer */}
      <div style={{
        marginTop: 14,
        paddingTop: 12,
        borderTop: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>
          Signals: <strong style={{ color: '#CBD5E1' }}>{incident.signals.length} flagged</strong> &bull; Confidence: <strong style={{ color: '#CBD5E1' }}>{incident.confidenceScore}%</strong>
        </div>

        <Button
          variant="secondary"
          small
          onClick={() => onInvestigate(incident)}
        >
          View Details &rarr;
        </Button>
      </div>
    </div>
  );
};
