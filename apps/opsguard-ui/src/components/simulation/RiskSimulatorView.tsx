// =============================================================================
// RiskSimulatorView Component
// =============================================================================

import React, { useState } from 'react';
import { Button } from 'shell';
import { OperationalIncident, NormalizedOperationalCase } from '../../types/opsguard';
import { InputNormalizer } from '../../normalizer/inputNormalizer';
import { RiskSimulator, SimulationResult } from '../../risk-engine/simulator';

interface RiskSimulatorViewProps {
  incidents: OperationalIncident[];
}

export const RiskSimulatorView: React.FC<RiskSimulatorViewProps> = ({ incidents }) => {
  const selectedInc = incidents[0];
  const [selectedIncidentId, setSelectedIncidentId] = useState(selectedInc?.id || '');

  const targetIncident = incidents.find(i => i.id === selectedIncidentId) || selectedInc;

  // Simulation Controls State
  const [usageChangePct, setUsageChangePct] = useState<number>(-42);
  const [ticketCount, setTicketCount] = useState<number>(5);
  const [renewalDays, setRenewalDays] = useState<number>(23);
  const [penaltyAmount, setPenaltyAmount] = useState<number>(800000);
  const [delayDays, setDelayDays] = useState<number>(11);

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleRunSimulation = () => {
    if (!targetIncident) return;

    const opCase: NormalizedOperationalCase = InputNormalizer.normalize({
      domain: targetIncident.riskDomain,
      entityName: targetIncident.entityName,
      formFields: {
        entityName: targetIncident.entityName,
        arrRupees: targetIncident.exposureAmountRupees,
        usageChangePct: -42,
        supportTicketCount: 5,
        daysUntilRenewal: 23,
        penaltyAmountRupees: 800000,
        delayDays: 11
      }
    });

    const result = RiskSimulator.simulate(opCase, {
      usageChangePct,
      supportTicketCount: ticketCount,
      daysUntilRenewal: renewalDays,
      penaltyAmountRupees: penaltyAmount,
      delayDays
    });

    setSimulationResult(result);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          What-If Risk Simulation Sandbox
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Modify operational parameters dynamically to re-run the deterministic Risk Engine and evaluate score deltas.
        </div>
      </div>

      {/* Target Incident Selection */}
      <div style={{ padding: 16, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155', marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#F8FAFC', display: 'block', marginBottom: 6 }}>
          Select Active Operational Record to Simulate:
        </label>
        <select
          value={selectedIncidentId}
          onChange={e => {
            setSelectedIncidentId(e.target.value);
            setSimulationResult(null);
          }}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
        >
          {incidents.map(inc => (
            <option key={inc.id} value={inc.id}>
              {inc.entityName} — {inc.title} ({inc.riskScore}% Current Risk Score)
            </option>
          ))}
        </select>
      </div>

      {/* Simulation Controls */}
      <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 6, border: '1px solid #334155', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
          Simulated Operational Parameter Adjustments
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {targetIncident?.riskDomain === 'customer_churn' && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                  <span>Simulated Usage Change %</span>
                  <span style={{ fontWeight: 700, color: usageChangePct >= 0 ? '#81C784' : '#E57373' }}>{usageChangePct}%</span>
                </div>
                <input
                  type="range"
                  min={-60}
                  max={40}
                  value={usageChangePct}
                  onChange={e => setUsageChangePct(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                  <span>Simulated Support Ticket Volume</span>
                  <span style={{ fontWeight: 700, color: '#60A5FA' }}>{ticketCount} tickets</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={ticketCount}
                  onChange={e => setTicketCount(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                  <span>Simulated Days Until Renewal</span>
                  <span style={{ fontWeight: 700, color: '#60A5FA' }}>{renewalDays} days</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={180}
                  value={renewalDays}
                  onChange={e => setRenewalDays(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </>
          )}

          {targetIncident?.riskDomain === 'contract_deadline' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                <span>Simulated Penalty Amount (₹)</span>
                <span style={{ fontWeight: 700, color: '#FFB74D' }}>₹{(penaltyAmount / 100000).toFixed(1)}L</span>
              </div>
              <input
                type="range"
                min={0}
                max={2500000}
                step={100000}
                value={penaltyAmount}
                onChange={e => setPenaltyAmount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          {targetIncident?.riskDomain === 'project_delay' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                <span>Simulated Delay Days</span>
                <span style={{ fontWeight: 700, color: '#FFB74D' }}>{delayDays} days</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={delayDays}
                onChange={e => setDelayDays(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={handleRunSimulation}>
            ⚡ Re-Run Risk Engine Simulation
          </Button>
        </div>
      </div>

      {/* Simulation Result Comparison */}
      {simulationResult && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #3B82F6' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>
            Simulation Comparison Result
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>CURRENT RISK SCORE</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#E57373' }}>
                {simulationResult.baselinePrediction.riskScore}%
              </div>
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>SIMULATED RISK SCORE</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: simulationResult.simulatedPrediction.riskScore < simulationResult.baselinePrediction.riskScore ? '#81C784' : '#E57373' }}>
                {simulationResult.simulatedPrediction.riskScore}%
              </div>
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>SCORE DELTA</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: simulationResult.scoreDelta <= 0 ? '#81C784' : '#E57373' }}>
                {simulationResult.scoreDelta > 0 ? `+${simulationResult.scoreDelta}` : simulationResult.scoreDelta} points
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#CBD5E1' }}>
            <strong>Modified Scenario Parameters:</strong> {simulationResult.modifiedFields.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
