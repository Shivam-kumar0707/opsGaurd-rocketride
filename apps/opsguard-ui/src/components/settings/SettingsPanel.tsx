// =============================================================================
// SettingsPanel Component (Generic Enterprise Theme)
// =============================================================================

import React, { useState } from 'react';
import { Button, Banner } from 'shell';
import { OpsGuardSettings } from '../../types/opsguard';
import { defaultSettings } from '../../data/mockOpsGuardData';

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<OpsGuardSettings>(defaultSettings);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#F8FAFC' }}>
          System Settings & Risk Thresholds
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Configure operational monitoring thresholds, notification rules, and escalation timing
        </div>
      </div>

      {savedBanner && (
        <div style={{ marginBottom: 16 }}>
          <Banner variant="info">
            Settings updated successfully. Changes applied to system monitoring rules.
          </Banner>
        </div>
      )}

      {/* 1. Risk Thresholds */}
      <div style={{ padding: 20, marginBottom: 16, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
          1. Risk Detection Parameters
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500, color: '#F8FAFC', marginBottom: 6 }}>
              <span>Customer Churn Risk Threshold</span>
              <span style={{ fontWeight: 600, color: '#CBD5E1' }}>{settings.churnThresholdPct}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={90}
              value={settings.churnThresholdPct}
              onChange={e => setSettings({ ...settings, churnThresholdPct: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              Flag accounts when calculated churn probability exceeds this percentage.
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500, color: '#F8FAFC', marginBottom: 6 }}>
              <span>Contract Obligation Window</span>
              <span style={{ fontWeight: 600, color: '#CBD5E1' }}>{settings.contractAlertWindowDays} Days</span>
            </div>
            <input
              type="range"
              min={3}
              max={60}
              value={settings.contractAlertWindowDays}
              onChange={e => setSettings({ ...settings, contractAlertWindowDays: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              Days prior to contractual obligation due dates to trigger compliance monitoring alerts.
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500, color: '#F8FAFC', marginBottom: 6 }}>
              <span>Project Delivery Delay Sensitivity</span>
              <span style={{ fontWeight: 600, color: '#CBD5E1' }}>{settings.projectDelayThresholdPct}% of timeline</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={settings.projectDelayThresholdPct}
              onChange={e => setSettings({ ...settings, projectDelayThresholdPct: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              Flag project risks when estimated delay exceeds this percentage of total timeline.
            </div>
          </div>
        </div>
      </div>

      {/* 2. Escalations */}
      <div style={{ padding: 20, marginBottom: 16, backgroundColor: '#1E293B', borderRadius: 6, border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
          2. Notification & Workflow Rules
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#F8FAFC' }}>
            <input
              type="checkbox"
              checked={settings.realtimeCriticalAlerts}
              onChange={e => setSettings({ ...settings, realtimeCriticalAlerts: e.target.checked })}
            />
            <span>Enable real-time push alerts for Critical Severity risks</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#F8FAFC' }}>
            <input
              type="checkbox"
              checked={settings.dailyDigestEmail}
              onChange={e => setSettings({ ...settings, dailyDigestEmail: e.target.checked })}
            />
            <span>Send daily summary digest to Operations Leadership</span>
          </label>

          <div style={{ marginTop: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#F8FAFC', display: 'block', marginBottom: 4 }}>
              Auto-Escalate Pending Reviews After
            </label>
            <select
              value={settings.autoEscalateUnapprovedHours}
              onChange={e => setSettings({ ...settings, autoEscalateUnapprovedHours: Number(e.target.value) })}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                backgroundColor: '#0F172A',
                color: '#FFF',
                border: '1px solid #334155',
                width: '100%',
                maxWidth: 280
              }}
            >
              <option value={12}>12 Hours</option>
              <option value={24}>24 Hours</option>
              <option value={48}>48 Hours (Default)</option>
              <option value={72}>72 Hours</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Button variant="primary" onClick={handleSave}>
          Save System Settings
        </Button>
      </div>
    </div>
  );
};
