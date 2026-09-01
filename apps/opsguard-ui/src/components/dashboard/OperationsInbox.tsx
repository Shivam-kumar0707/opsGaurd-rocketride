// =============================================================================
// OperationsInbox Component (Generic, Subtle Enterprise Theme)
// =============================================================================

import React, { useState } from 'react';
import { Button } from 'shell';
import { OperationalIncident } from '../../types/opsguard';
import { RiskCard } from './RiskCard';

interface OperationsInboxProps {
  incidents: OperationalIncident[];
  onInvestigate: (incident: OperationalIncident) => void;
  selectedSeverityFilter?: string | null;
}

export const OperationsInbox: React.FC<OperationsInboxProps> = ({
  incidents,
  onInvestigate,
  selectedSeverityFilter = null
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSeverity, setActiveSeverity] = useState<string | null>(selectedSeverityFilter);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveSeverity(selectedSeverityFilter);
  }, [selectedSeverityFilter]);

  const severities: { id: string | null; label: string; count: number }[] = [
    { id: null, label: 'All Risks', count: incidents.length },
    { id: 'critical', label: 'Critical', count: incidents.filter(i => i.severity === 'critical').length },
    { id: 'high', label: 'High', count: incidents.filter(i => i.severity === 'high').length },
    { id: 'medium', label: 'Medium', count: incidents.filter(i => i.severity === 'medium').length },
    { id: 'low', label: 'Low', count: incidents.filter(i => i.severity === 'low').length },
    { id: 'resolved', label: 'Resolved', count: incidents.filter(i => i.status === 'resolved').length }
  ];

  const domains: { id: string | null; label: string }[] = [
    { id: null, label: 'All Domains' },
    { id: 'customer_churn', label: 'Customer Churn' },
    { id: 'contract_deadline', label: 'Contract Obligation' },
    { id: 'project_delay', label: 'Project Delivery' }
  ];

  const filteredIncidents = incidents.filter(inc => {
    if (activeSeverity === 'resolved' && inc.status !== 'resolved') return false;
    if (activeSeverity && activeSeverity !== 'resolved' && inc.severity !== activeSeverity) return false;
    if (!activeSeverity && inc.status === 'resolved') return false;

    if (activeDomain && inc.riskDomain !== activeDomain) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchEntity = inc.entityName.toLowerCase().includes(q);
      const matchId = inc.id.toLowerCase().includes(q);
      return matchTitle || matchEntity || matchId;
    }

    return true;
  });

  return (
    <div>
      {/* Search & Domain Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16
      }}>
        {/* Search input */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <input
            type="text"
            placeholder="Filter records by name, ID, or title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 4,
              border: '1px solid #334155',
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>

        {/* Domain dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>Domain:</span>
          <select
            value={activeDomain || ''}
            onChange={e => setActiveDomain(e.target.value || null)}
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              border: '1px solid #334155',
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              fontSize: 13,
              outline: 'none'
            }}
          >
            {domains.map(d => (
              <option key={d.id || 'all'} value={d.id || ''}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Severity Tabs Strip */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 16,
        borderBottom: '1px solid #334155',
        paddingBottom: 8,
        overflowX: 'auto'
      }}>
        {severities.map(sev => {
          const isActive = activeSeverity === sev.id;
          return (
            <button
              key={sev.id || 'all'}
              onClick={() => setActiveSeverity(sev.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: 'none',
                backgroundColor: isActive ? '#334155' : 'transparent',
                color: isActive ? '#F8FAFC' : '#94A3B8',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>{sev.label}</span>
              <span style={{
                fontSize: 11,
                padding: '1px 6px',
                borderRadius: 8,
                backgroundColor: isActive ? '#475569' : '#1E293B',
                color: isActive ? '#FFF' : '#64748B'
              }}>
                {sev.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Risk Cards List */}
      {filteredIncidents.length > 0 ? (
        <div>
          {filteredIncidents.map(incident => (
            <RiskCard
              key={incident.id}
              incident={incident}
              onInvestigate={onInvestigate}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC', marginBottom: 6 }}>
            No operational records found.
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14 }}>
            Adjust your search query or reset active filters.
          </div>
          <Button
            variant="secondary"
            small
            onClick={() => {
              setSearchQuery('');
              setActiveSeverity(null);
              setActiveDomain(null);
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
