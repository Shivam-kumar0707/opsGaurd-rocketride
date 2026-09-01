// =============================================================================
// SystemDocumentationView Component — Admin Technical Documentation
// =============================================================================

import React, { useState } from 'react';

export const SystemDocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'risk_engine' | 'agents' | 'learning' | 'security' | 'architecture'>('overview');

  const sections = [
    { id: 'overview', title: '1. Executive Overview & Position' },
    { id: 'risk_engine', title: '2. Deterministic Risk Engine' },
    { id: 'agents', title: '3. Multi-Agent & Critic Architecture' },
    { id: 'learning', title: '4. Continuous Learning Layer' },
    { id: 'security', title: '5. Security, RBAC & Audit Chain' },
    { id: 'architecture', title: '6. RocketRide Platform Integration' }
  ];

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          📖 System Documentation & Architecture Reference
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Comprehensive technical documentation covering OpsGuard's Risk Engine formulas, multi-agent pipeline, security layer, and continuous learning architecture.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #334155', paddingBottom: 10, flexWrap: 'wrap' }}>
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: activeSection === sec.id ? '#1E3A8A' : 'transparent',
              color: activeSection === sec.id ? '#60A5FA' : '#94A3B8',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* SECTION 1: EXECUTIVE OVERVIEW */}
      {activeSection === 'overview' && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#F8FAFC' }}>
            OpsGuard — Prevent Expensive Operational Failures Before They Happen
          </h3>
          <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
            OpsGuard is an enterprise Operations Control System built as a RocketRide App micro-frontend. It continuously monitors, analyzes, and manages operational risk across three core business domains: <strong>Customer Churn Risk</strong>, <strong>Contract Obligation Risk</strong>, and <strong>Project Delivery Risk</strong>.
          </p>

          <div style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155', marginTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA', marginBottom: 4 }}>THE FOUR OPERATIONAL QUESTIONS</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
              <li><strong>What is at risk?</strong> Identifies active accounts, contracts, or project milestones facing operational failure.</li>
              <li><strong>How serious is it?</strong> Deterministic 0-100 risk score and financial exposure formatted in ₹ Lakhs / ₹ Cr.</li>
              <li><strong>Why is it happening?</strong> Root cause analysis and point driver breakdown (e.g. Usage drop: +24, Support tickets: +19).</li>
              <li><strong>What should I do?</strong> Recommended 4-step action plan, Critic Agent challenge, and Human-in-the-Loop decision controls.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 2: DETERMINISTIC RISK ENGINE */}
      {activeSection === 'risk_engine' && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#F8FAFC' }}>
            Deterministic Risk Engine Scoring & Weighted Formulas
          </h3>
          <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
            LLMs <strong>never</strong> invent numerical risk scores. Risk scoring is performed deterministically using configurable feature contribution weights:
          </p>

          <pre style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, color: '#60A5FA', fontSize: 12, overflowX: 'auto', border: '1px solid #334155' }}>
{`Risk Score = Math.min(100, Math.round(
  UsageDeclineContribution (+24) +
  SupportEscalationContribution (+19) +
  NegativeSentimentContribution (+17) +
  RenewalProximityContribution (+12) +
  NPSContribution (+8) +
  PaymentDelayContribution (+3)
))`}
          </pre>
        </div>
      )}

      {/* SECTION 3: MULTI-AGENT & CRITIC ARCHITECTURE */}
      {activeSection === 'agents' && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#F8FAFC' }}>
            Multi-Agent Pipeline & Critic Agent Governance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Signal Agent', role: 'Detects measurable operational risk signals with weights and confidence ratings.' },
              { name: 'Evidence Agent', role: 'Categorizes evidence into Verified Evidence vs User Provided vs Model Inference.' },
              { name: 'Root Cause Agent', role: 'Synthesizes primary root cause, contributing factors, and alternative explanations.' },
              { name: 'Action Planner Agent', role: 'Formulates 4-step actionable intervention plan with assigned roles and deadlines.' },
              { name: 'Critic Agent', role: 'Challenges Action Planner recommendations (e.g. detecting premature commercial discounts when technical issues dominate).' }
            ].map((ag, idx) => (
              <div key={idx} style={{ padding: 12, backgroundColor: '#0F172A', borderRadius: 6, border: '1px solid #334155' }}>
                <strong style={{ color: '#60A5FA', fontSize: 13 }}>{ag.name}: </strong>
                <span style={{ color: '#CBD5E1', fontSize: 12 }}>{ag.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: CONTINUOUS LEARNING LAYER */}
      {activeSection === 'learning' && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#F8FAFC' }}>
            Human-Guided Continuous Learning & Data Leakage Protection
          </h3>
          <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
            Human decisions (Approve, Modify, Reject) and actual operational outcomes generate structured <code>LearningRecord</code>s. Pre-prediction features are extracted into immutable, SHA-256 versioned training datasets excluding post-prediction fields to prevent data leakage.
          </p>
        </div>
      )}

      {/* SECTION 5: SECURITY & AUDIT CHAIN */}
      {activeSection === 'security' && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#F8FAFC' }}>
            Security, RBAC & SHA-256 Tamper-Evident Audit Chain
          </h3>
          <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
            OpsGuard enforces 4 RBAC roles (<code>ADMIN</code>, <code>OPERATIONS_LEAD</code>, <code>ANALYST</code>, <code>VIEWER</code>). Pre-inference SHA-256 model hash checks block tampered models, while append-only SHA-256 hash chaining (<code>eventHash = SHA256(previousHash + payload)</code>) guarantees tamper-evident auditability.
          </p>
        </div>
      )}

      {/* SECTION 6: ROCKETRIDE PLATFORM INTEGRATION */}
      {activeSection === 'architecture' && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#F8FAFC' }}>
            RocketRide Platform Micro-Frontend & Module Federation Integration
          </h3>
          <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
            OpsGuard exposes an <code>AppDescriptor</code> via Module Federation pinned to runtime version <code>2.5.1</code>. It inherits host session identity (<code>identity</code>) and renders inside RocketRide's host frame using standard platform UI components.
          </p>
        </div>
      )}
    </div>
  );
};
