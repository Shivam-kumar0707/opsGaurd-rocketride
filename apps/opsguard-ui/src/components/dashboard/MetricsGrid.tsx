// =============================================================================
// MetricsGrid Component (Generic, Subtle Enterprise Theme)
// =============================================================================

import React from 'react';
import { OperationalIncident } from '../../types/opsguard';

interface MetricsGridProps {
  incidents: OperationalIncident[];
  onFilterSeverity?: (severity: string | null) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ incidents, onFilterSeverity }) => {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  const pendingApprovalsCount = activeIncidents.filter(i => i.status === 'pending_approval').length;
  
  const totalExposureRupees = activeIncidents.reduce((sum, item) => sum + item.exposureAmountRupees, 0);
  
  const formatExposure = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const metricCards = [
    {
      title: 'Active Operational Risks',
      value: activeIncidents.length,
      subtitle: `${incidents.filter(i => i.status === 'resolved').length} resolved this period`,
      accentColor: '#94A3B8',
      onClick: () => onFilterSeverity && onFilterSeverity(null)
    },
    {
      title: 'Critical Severity Risks',
      value: criticalCount,
      subtitle: 'Requires operational review',
      accentColor: '#E57373',
      onClick: () => onFilterSeverity && onFilterSeverity('critical')
    },
    {
      title: 'Pending Action Reviews',
      value: pendingApprovalsCount,
      subtitle: 'Intervention plans pending',
      accentColor: '#FFB74D',
      onClick: () => onFilterSeverity && onFilterSeverity(null)
    },
    {
      title: 'Total Potential Exposure',
      value: formatExposure(totalExposureRupees),
      subtitle: 'Aggregated exposure value',
      accentColor: '#81C784',
      onClick: undefined
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14,
      marginBottom: 24
    }}>
      {metricCards.map((card, idx) => (
        <div
          key={idx}
          onClick={card.onClick}
          style={{
            cursor: card.onClick ? 'pointer' : 'default',
            padding: '16px 18px',
            backgroundColor: 'var(--rr-surface-card, #1E293B)',
            borderRadius: 6,
            border: '1px solid var(--rr-border, #334155)',
            transition: 'border-color 0.15s ease'
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            {card.title}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, margin: '6px 0 2px 0', color: card.accentColor }}>
            {card.value}
          </div>
          <div style={{ fontSize: 12, color: '#64748B' }}>
            {card.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};
