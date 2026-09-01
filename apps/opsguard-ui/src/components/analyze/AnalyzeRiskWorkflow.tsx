// =============================================================================
// AnalyzeRiskWorkflow Component
// =============================================================================

import React, { useState } from 'react';
import { Button, Banner } from 'shell';
import { RiskDomain, OperationalIncident, NormalizedOperationalCase } from '../../types/opsguard';
import { InputNormalizer, RawInputPayload } from '../../normalizer/inputNormalizer';
import { AssistantTools } from '../../agents/assistantTools';

import { PromptSanitizer } from '../../security/promptSanitizer';
import { RocketRidePipelineOrchestrator } from '../../pipelines/rocketridePipelineOrchestrator';

interface AnalyzeRiskWorkflowProps {
  onIncidentCreated: (incident: OperationalIncident) => void;
  onViewIncidentDetails: (incident: OperationalIncident) => void;
}

export const AnalyzeRiskWorkflow: React.FC<AnalyzeRiskWorkflowProps> = ({
  onIncidentCreated,
  onViewIncidentDetails
}) => {
  const [selectedDomain, setSelectedDomain] = useState<RiskDomain>('customer_churn');
  const [inputMode, setInputMode] = useState<'structured' | 'text' | 'json' | 'csv'>('structured');

  // Customer Churn Form Fields
  const [customerName, setCustomerName] = useState('Acme Enterprise Corp');
  const [arrValue, setArrValue] = useState<number>(2400000);
  const [usageChange, setUsageChange] = useState<number>(-42);
  const [activeUsers, setActiveUsers] = useState<number>(25);
  const [ticketCount, setTicketCount] = useState<number>(5);
  const [negativeTickets, setNegativeTickets] = useState<number>(4);
  const [renewalDays, setRenewalDays] = useState<number>(23);
  const [npsScore, setNpsScore] = useState<number>(3);
  const [paymentDelay, setPaymentDelay] = useState<number>(15);

  // Contract Obligation Form Fields
  const [contractName, setContractName] = useState('Nexus Security Compliance Contract');
  const [contractValue, setContractValue] = useState<number>(4000000);
  const [penaltyAmount, setPenaltyAmount] = useState<number>(800000);
  const [daysRemaining, setDaysRemaining] = useState<number>(7);
  const [completionPct, setCompletionPct] = useState<number>(45);
  const [contractOwner, setContractOwner] = useState('Unassigned');

  // Project Delivery Form Fields
  const [projectName, setProjectName] = useState('Project Alpha Cloud Migration');
  const [projectValue, setProjectValue] = useState<number>(6500000);
  const [delayDays, setDelayDays] = useState<number>(11);
  const [blockedTasks, setBlockedTasks] = useState<number>(12);

  // Free-text & Raw JSON state
  const [freeText, setFreeText] = useState('');
  const [rawJsonText, setRawJsonText] = useState('{\n  "customer_name": "TechCorp",\n  "arr": 1800000,\n  "usageChangePct": -35,\n  "tickets": 4\n}');

  // Normalization preview state
  const [normalizedCase, setNormalizedCase] = useState<NormalizedOperationalCase | null>(null);
  const [createdIncident, setCreatedIncident] = useState<OperationalIncident | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Live Normalization preview calculation
  const getPayload = (): RawInputPayload => {
    if (inputMode === 'text') {
      const sanitized = PromptSanitizer.sanitizeDataInput(freeText);
      return { domain: selectedDomain, entityName: 'Text Operational Case', rawText: sanitized };
    }
    if (inputMode === 'json') {
      try {
        const parsed = JSON.parse(rawJsonText);
        return { domain: selectedDomain, entityName: parsed.customer_name || 'JSON Case', jsonPayload: parsed };
      } catch {
        return { domain: selectedDomain, entityName: 'Invalid JSON Case' };
      }
    }
    if (selectedDomain === 'customer_churn') {
      return {
        domain: 'customer_churn',
        entityName: customerName,
        formFields: {
          entityName: customerName,
          arrRupees: arrValue,
          usageChangePct: usageChange,
          activeUsers,
          supportTicketCount: ticketCount,
          negativeSentimentTickets: negativeTickets,
          daysUntilRenewal: renewalDays,
          nps: npsScore,
          paymentDelayDays: paymentDelay
        }
      };
    } else if (selectedDomain === 'contract_deadline') {
      return {
        domain: 'contract_deadline',
        entityName: contractName,
        formFields: {
          entityName: contractName,
          contractValue,
          penaltyAmountRupees: penaltyAmount,
          daysRemaining,
          completionPct,
          owner: contractOwner
        }
      };
    } else {
      return {
        domain: 'project_delay',
        entityName: projectName,
        formFields: {
          entityName: projectName,
          projectValue,
          delayDays,
          blockedTaskCount: blockedTasks
        }
      };
    }
  };

  const [pipelineLogs, setPipelineLogs] = useState<any[]>([]);

  const handleValidate = () => {
    const payload = getPayload();
    const normalized = InputNormalizer.normalize(payload);
    setNormalizedCase(normalized);
  };

  const handleRunAnalysis = (autoRedirect: boolean = false) => {
    setIsAnalyzing(true);
    setPipelineLogs([]);
    const payload = getPayload();

    setTimeout(() => {
      const result = RocketRidePipelineOrchestrator.executeAnalyzeRiskPipeline(payload);
      setNormalizedCase(result.output.normalizedCase);
      setCreatedIncident(result.output.incident);
      setPipelineLogs(result.stepLogs);
      onIncidentCreated(result.output.incident);
      setIsAnalyzing(false);

      if (autoRedirect) {
        onViewIncidentDetails(result.output.incident);
      } else {
        setTimeout(() => {
          const resultsEl = document.getElementById('risk-analysis-results-section');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }, 800);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          ⚡ Analyze New Operational Risk
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Provide operational metrics to normalize features, run the deterministic Risk Engine, and trigger multi-agent investigation.
        </div>
      </div>

      {/* Domain Selection Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { id: 'customer_churn', label: '1. Customer Churn Risk' },
          { id: 'contract_deadline', label: '2. Contract Obligation Risk' },
          { id: 'project_delay', label: '3. Project Delivery Risk' }
        ].map(dom => (
          <button
            key={dom.id}
            onClick={() => {
              setSelectedDomain(dom.id as RiskDomain);
              setNormalizedCase(null);
              setCreatedIncident(null);
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 6,
              border: selectedDomain === dom.id ? '1px solid #3B82F6' : '1px solid #334155',
              backgroundColor: selectedDomain === dom.id ? '#1E3A8A' : '#1E293B',
              color: selectedDomain === dom.id ? '#F8FAFC' : '#94A3B8',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {dom.label}
          </button>
        ))}
      </div>

      {/* Input Mode Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'structured', label: 'Structured Form' },
          { id: 'text', label: 'Free-Text Description' },
          { id: 'json', label: 'Raw JSON Payload' }
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => setInputMode(mode.id as any)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              backgroundColor: inputMode === mode.id ? '#334155' : 'transparent',
              color: inputMode === mode.id ? '#FFF' : '#94A3B8',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Dynamic Form Content */}
      <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155', marginBottom: 20 }}>
        {inputMode === 'structured' && selectedDomain === 'customer_churn' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Contract Value / ARR (₹)</label>
              <input type="number" value={arrValue} onChange={e => setArrValue(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Usage Change % (-50 to +50)</label>
              <input type="number" value={usageChange} onChange={e => setUsageChange(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Active User Seats</label>
              <input type="number" value={activeUsers} onChange={e => setActiveUsers(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Support Ticket Count (30 Days)</label>
              <input type="number" value={ticketCount} onChange={e => setTicketCount(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Negative Sentiment Tickets</label>
              <input type="number" value={negativeTickets} onChange={e => setNegativeTickets(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Days Until Renewal</label>
              <input type="number" value={renewalDays} onChange={e => setRenewalDays(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>NPS Score (0 to 10)</label>
              <input type="number" value={npsScore} onChange={e => setNpsScore(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
          </div>
        )}

        {inputMode === 'structured' && selectedDomain === 'contract_deadline' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Contract Name</label>
              <input type="text" value={contractName} onChange={e => setContractName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Contract Value (₹)</label>
              <input type="number" value={contractValue} onChange={e => setContractValue(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Penalty Amount Clause (₹)</label>
              <input type="number" value={penaltyAmount} onChange={e => setPenaltyAmount(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Days Remaining</label>
              <input type="number" value={daysRemaining} onChange={e => setDaysRemaining(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Completion %</label>
              <input type="number" value={completionPct} onChange={e => setCompletionPct(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Responsible Owner</label>
              <input type="text" value={contractOwner} onChange={e => setContractOwner(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
          </div>
        )}

        {inputMode === 'structured' && selectedDomain === 'project_delay' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Project Name</label>
              <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Project Value (₹)</label>
              <input type="number" value={projectValue} onChange={e => setProjectValue(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Estimated Delay (Days)</label>
              <input type="number" value={delayDays} onChange={e => setDelayDays(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Blocked Task Count</label>
              <input type="number" value={blockedTasks} onChange={e => setBlockedTasks(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }} />
            </div>
          </div>
        )}

        {inputMode === 'text' && (
          <div>
            <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Free-Text Operational Notes</label>
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              placeholder="Paste operational email, meeting transcript, or account status notes..."
              rows={5}
              style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
            />
          </div>
        )}

        {inputMode === 'json' && (
          <div>
            <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Raw JSON Object Payload</label>
            <textarea
              value={rawJsonText}
              onChange={e => setRawJsonText(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: 8, borderRadius: 4, backgroundColor: '#0F172A', color: '#60A5FA', fontFamily: 'monospace', border: '1px solid #334155' }}
            />
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleValidate}>
            Normalize & Validate Input
          </Button>
          <Button variant="secondary" onClick={() => handleRunAnalysis(false)} disabled={isAnalyzing}>
            {isAnalyzing ? 'Executing Pipeline...' : '⚡ Run Risk Analysis'}
          </Button>
          <Button variant="primary" onClick={() => handleRunAnalysis(true)} disabled={isAnalyzing}>
            {isAnalyzing ? 'Executing Pipeline...' : '🚀 Run & Open Risk Workspace →'}
          </Button>
        </div>
      </div>

      {/* Normalization & Insufficient Evidence Banner */}
      {normalizedCase && normalizedCase.insufficientEvidence && (
        <div style={{ marginBottom: 20 }}>
          <Banner variant="warning">
            ⚠️ {normalizedCase.guidance}
          </Banner>
        </div>
      )}

      {/* Results View */}
      {createdIncident && (
        <div id="risk-analysis-results-section" style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #3B82F6', marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#81C784', textTransform: 'uppercase' }}>
                Analysis Execution Complete
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>
                {createdIncident.title}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: createdIncident.severity === 'critical' ? '#E57373' : '#FFB74D' }}>
                {createdIncident.riskScore}% Risk Score
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                Probability: {(createdIncident.probability * 100).toFixed(0)}% &bull; Severity: {createdIncident.severity.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Feature Contribution Drivers */}
          <div style={{ marginBottom: 18, backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
              DETERMINISTIC RISK DRIVERS BREAKDOWN:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {createdIncident.prediction?.drivers.map((drv, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#F8FAFC' }}>{drv.label} ({drv.value})</span>
                  <span style={{ fontWeight: 700, color: '#FFB74D' }}>+{drv.pointsContribution} points</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critic Review */}
          {createdIncident.critique && createdIncident.critique.challenges.length > 0 && (
            <div style={{ marginBottom: 18, backgroundColor: '#2C2419', padding: 12, borderRadius: 6, border: '1px solid #4A3B24' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FFB74D', marginBottom: 4 }}>
                🔍 CRITIC AGENT REVIEW
              </div>
              <div style={{ fontSize: 12, color: '#F8FAFC' }}>
                {createdIncident.critique.challenges[0]}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button
              variant="primary"
              onClick={() => onViewIncidentDetails(createdIncident)}
            >
              Open Full Investigation View &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
