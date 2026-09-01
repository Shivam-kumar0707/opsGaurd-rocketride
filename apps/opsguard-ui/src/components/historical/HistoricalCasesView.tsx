// =============================================================================
// HistoricalCasesView Component
// =============================================================================

import React, { useState } from 'react';
import { HistoricalCaseStore } from '../../historical/historicalCaseStore';
import { HistoricalCase, RiskDomain } from '../../types/opsguard';

export const HistoricalCasesView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<RiskDomain | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cases: HistoricalCase[] = HistoricalCaseStore.findSimilarCases(selectedDomain || 'customer_churn', searchQuery);

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          Historical Operational Case Repository
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Search historical operational cases, attribute similarity ratings, and verified intervention outcomes.
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <input
            type="text"
            placeholder="Search historical cases by account, driver, or outcome..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 4, backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155', outline: 'none' }}
          />
        </div>

        <select
          value={selectedDomain || ''}
          onChange={e => setSelectedDomain((e.target.value as RiskDomain) || null)}
          style={{ padding: '8px 12px', borderRadius: 4, backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155', outline: 'none' }}
        >
          <option value="customer_churn">Customer Churn Domain</option>
          <option value="contract_deadline">Contract Obligation Domain</option>
          <option value="project_delay">Project Delivery Domain</option>
        </select>
      </div>

      {/* Case List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cases.map(item => (
          <div key={item.id} style={{ padding: 18, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: '#334155', color: '#CBD5E1' }}>
                    {item.id}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: '#1C2B20', color: '#81C784', border: '1px solid #2A4431' }}>
                    {item.similarityPct}% Similarity
                  </span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>
                    Recorded {item.dateRecorded}
                  </span>
                </div>
                <h3 style={{ margin: '2px 0 4px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
                  {item.title}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#81C784' }}>
                  {item.primaryMetric}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  Risk Score: {item.riskScore}%
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#CBD5E1', marginBottom: 10 }}>
              <strong>Key Drivers:</strong> {item.keyDrivers.join(' • ')}
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 4, border: '1px solid #334155', fontSize: 12 }}>
              <div style={{ color: '#94A3B8', marginBottom: 2 }}>RECOMMENDATION & HUMAN ACTION:</div>
              <div style={{ color: '#F8FAFC', marginBottom: 4 }}>{item.recommendationGiven} (Human Decision: <strong style={{ color: '#81C784' }}>{item.humanActionTaken.toUpperCase()}</strong>)</div>
              <div style={{ color: '#81C784', fontWeight: 500 }}>{item.actualOutcome}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
