// =============================================================================
// OpsGuardAgentChat Component (Generic Enterprise Theme)
// =============================================================================

import React, { useState, useCallback } from 'react';
import { ChatView, Button } from 'shell';
import { OperationalIncident } from '../../types/opsguard';

interface OpsGuardAgentChatProps {
  incidents: OperationalIncident[];
  onInvestigateIncident: (incident: OperationalIncident) => void;
}

interface InternalMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: string;
}

export const OpsGuardAgentChat: React.FC<OpsGuardAgentChatProps> = ({
  incidents,
  onInvestigateIncident
}) => {
  const [messages, setMessages] = useState<InternalMessage[]>([
    {
      id: 1,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello. OpsGuard Operations Assistant active.

Currently tracking **${incidents.length} active operational records** across Churn, Contract Obligations, and Delivery Timelines.

How can I assist your operational review?
- *"Which accounts are at critical churn risk?"*
- *"Show contract penalties due this week"*
- *"Summarize recommended actions for ACME Corp"*`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback((userText: string) => {
    const userMsg: InternalMessage = {
      id: Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = '';
      const textLower = userText.toLowerCase();

      if (textLower.includes('churn') || textLower.includes('customer')) {
        const churnIncidents = incidents.filter(i => i.riskDomain === 'customer_churn');
        botResponseText = `### Customer Churn Risk Summary (${churnIncidents.length} accounts)
` + churnIncidents.map(i => `- **${i.entityName}** (Score: **${i.riskScore}%**, Severity: **${i.severity.toUpperCase()}**): ${i.primaryMetric}. *Insight:* ${i.reasoning.keyInsight}`).join('\n') + `\n\n*Action:* Select **[View Details]** on ACME Corp to review the recovery plan.`;
      } else if (textLower.includes('contract') || textLower.includes('penalty') || textLower.includes('obligation')) {
        const contractIncidents = incidents.filter(i => i.riskDomain === 'contract_deadline');
        botResponseText = `### Contract Obligation Summary
` + contractIncidents.map(i => `- **${i.entityName}**: ${i.primaryMetric} (Due in 7 days). *Status:* ${i.status.toUpperCase()}`).join('\n') + `\n\n*Action Needed:* Legal & CISO sign-off requested.`;
      } else if (textLower.includes('project') || textLower.includes('delay')) {
        const projIncidents = incidents.filter(i => i.riskDomain === 'project_delay');
        botResponseText = `### Project Delivery Status
` + projIncidents.map(i => `- **${i.entityName}**: ${i.primaryMetric}. 12 tasks currently blocked by OAuth API schema deadlock.`).join('\n') + `\n\n*Action:* Senior Backend Engineer allocation proposed to unblock delivery.`;
      } else if (textLower.includes('acme')) {
        const acme = incidents.find(i => i.entityName.includes('ACME'));
        if (acme) {
          botResponseText = `### ACME Corp Operational Record
- **Risk Score:** ${acme.riskScore}% (${acme.severity.toUpperCase()})
- **ARR Exposure:** ${acme.primaryMetric}
- **Usage Trend:** -46% over 90 days
- **Support Tickets:** 5 negative tickets logged
- **Proposed Action:** ${acme.recommendation.actionTitle} (${acme.recommendation.financialImpactFormatted})
- **Status:** ${acme.status.toUpperCase()}`;
        }
      } else {
        botResponseText = `I have cross-referenced your query across **${incidents.length} operational records**.

**Summary Overview:**
- **Critical Severity:** ${incidents.filter(i => i.severity === 'critical').length} accounts.
- **Financial Exposure:** ₹77.5 Lakhs combined ARR & Penalty value.
- **Pending Actions:** ${incidents.filter(i => i.status === 'pending_approval').length} intervention plans awaiting review.

You can query specific accounts, contracts, or milestone deadlines for deeper analysis.`;
      }

      const botMsg: InternalMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: botResponseText
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  }, [incidents]);

  return (
    <div style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#F8FAFC' }}>
            OpsGuard Operations Assistant
          </h2>
          <div style={{ fontSize: 13, color: '#94A3B8' }}>
            Query operational risk records, contract obligations, and project status
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {incidents.slice(0, 3).map(inc => (
            <Button
              key={inc.id}
              variant="secondary"
              small
              onClick={() => onInvestigateIncident(inc)}
            >
              View {inc.entityName}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: 0, overflow: 'hidden', backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
        <ChatView
          messages={messages as any}
          isTyping={isTyping}
          isConnected={true}
          onSend={handleSend}
          placeholder="Type an operational query..."
        />
      </div>
    </div>
  );
};
