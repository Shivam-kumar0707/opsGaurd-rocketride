// =============================================================================
// LearningCenterView Component
// =============================================================================

import React, { useState } from 'react';
import { Button, Banner } from 'shell';
import { UserRole } from '../../types/opsguard';
import { FeedbackAnalyzer } from '../../learning/feedbackAnalyzer';
import { FeedbackStore } from '../../learning/feedbackStore';
import { RecommendationLearning } from '../../learning/recommendationLearning';
import { ModelImprovement } from '../../learning/modelImprovement';
import { ModelRegistry } from '../../ml/modelRegistry';
import { TrainingDatasetBuilder } from '../../learning/trainingDatasetBuilder';
import { MLBackendAdapter } from '../../ml/mlBackendAdapter';
import { ModelIntegrity } from '../../security/modelIntegrity';
import { PolicyEngine } from '../../security/policyEngine';
import { LLMTrainingAdapter } from '../../learning/llmTrainingAdapter';

interface LearningCenterViewProps {
  userRole: UserRole;
}

export const LearningCenterView: React.FC<LearningCenterViewProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'feedback' | 'patterns' | 'retraining' | 'pipeline'>('metrics');
  const [bannerMessage, setBannerMessage] = useState<{ text: string; variant: 'info' | 'error' } | null>(null);

  const metrics = FeedbackAnalyzer.calculateMetrics();
  const records = FeedbackStore.getRecords();
  const patterns = RecommendationLearning.getDiscoveredPatterns();
  const comparison = ModelImprovement.compareCandidateWithActive('customer_churn');
  const llmStatus = LLMTrainingAdapter.getCurrentJobStatus();

  const handleTrainNewCandidate = () => {
    try {
      PolicyEngine.enforce(userRole, 'TRAIN_MODEL', 'train candidate learning model', 'User');
      const dataset = TrainingDatasetBuilder.buildFeedbackDataset('customer_churn');
      const rawModel = MLBackendAdapter.trainModel(dataset);
      const hashes = ModelIntegrity.generateModelHashes(rawModel);
      const candidate = { ...rawModel, ...hashes };
      ModelRegistry.addCandidateModel(candidate);

      setBannerMessage({
        text: `✓ New Candidate Model "${candidate.name}" (${candidate.modelId}) successfully trained from 741 feedback outcome records! Hash: ${candidate.modelHash?.slice(0, 16)}...`,
        variant: 'info'
      });
    } catch (err: any) {
      setBannerMessage({ text: `⚠ ${err.message}`, variant: 'error' });
    }
  };

  const handleActivateCandidate = (modelId: string, modelName: string) => {
    try {
      PolicyEngine.enforce(userRole, 'ACTIVATE_MODEL', `activate learned model "${modelId}"`, 'User');
      ModelRegistry.activateModel(modelId);
      setBannerMessage({
        text: `✓ Candidate Model "${modelName}" activated as primary production inference model by ${userRole}.`,
        variant: 'info'
      });
    } catch (err: any) {
      setBannerMessage({ text: `⚠ ${err.message}`, variant: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          🧠 Human-Guided Continuous Learning Center
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          OpsGuard learns continuously from human approvals, modifications, rejections, and verified operational outcomes under strict model governance.
        </div>
      </div>

      {bannerMessage && (
        <div style={{ marginBottom: 16 }}>
          <Banner variant={bannerMessage.variant}>
            {bannerMessage.text}
          </Banner>
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #334155', paddingBottom: 10 }}>
        {[
          { id: 'metrics', label: '1. Alignment & Metrics' },
          { id: 'feedback', label: '2. Human Feedback Log' },
          { id: 'patterns', label: '3. Learned Patterns' },
          { id: 'retraining', label: '4. Candidate Retraining' },
          { id: 'pipeline', label: '5. Learning Flowchart' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#1E3A8A' : 'transparent',
              color: activeTab === tab.id ? '#60A5FA' : '#94A3B8',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS & ALIGNMENT */}
      {activeTab === 'metrics' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            <div style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 6, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>REVIEWED DECISIONS</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC' }}>{metrics.totalReviewed}</div>
            </div>
            <div style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 6, border: '1px solid #388E3C' }}>
              <div style={{ fontSize: 11, color: '#81C784' }}>APPROVED RATE</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#81C784' }}>{metrics.approvalRatePct}%</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{metrics.approvedCount} recommendations</div>
            </div>
            <div style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 6, border: '1px solid #F57C00' }}>
              <div style={{ fontSize: 11, color: '#FFB74D' }}>MODIFIED RATE</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#FFB74D' }}>{metrics.modificationRatePct}%</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{metrics.modifiedCount} recommendations</div>
            </div>
            <div style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 6, border: '1px solid #D32F2F' }}>
              <div style={{ fontSize: 11, color: '#E57373' }}>REJECTED RATE</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#E57373' }}>{metrics.rejectionRatePct}%</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{metrics.rejectedCount} recommendations</div>
            </div>
          </div>

          {/* Domain Specific Alignment Split */}
          <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 8, border: '1px solid #334155', marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
              Domain-Specific AI / Human Agreement Split
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(metrics.domainBreakdown).map(([domainKey, d]) => (
                <div key={domainKey} style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 6, border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#F8FAFC', marginBottom: 6 }}>
                    <span>{domainKey.replace('_', ' ').toUpperCase()}</span>
                    <span style={{ color: '#81C784' }}>{d.approvalRatePct}% Approval Rate ({d.approved}/{d.total})</span>
                  </div>
                  <div style={{ width: '100%', height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${d.total > 0 ? (d.approved / d.total) * 100 : 0}%`, backgroundColor: '#81C784', height: '100%' }} />
                    <div style={{ width: `${d.total > 0 ? (d.modified / d.total) * 100 : 0}%`, backgroundColor: '#FFB74D', height: '100%' }} />
                    <div style={{ width: `${d.total > 0 ? (d.rejected / d.total) * 100 : 0}%`, backgroundColor: '#E57373', height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LLM Fine-Tuning Adapter Status */}
          <div style={{ backgroundColor: '#1E293B', padding: 18, borderRadius: 8, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>
              LLM Fine-Tuning Adapter Status
            </div>
            <div style={{ fontSize: 13, color: '#F8FAFC', marginTop: 4, fontWeight: 600 }}>
              {llmStatus.backendNotes}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HUMAN FEEDBACK LOG */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {records.map(rec => (
            <div key={rec.id} style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 8, border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: rec.humanDecision === 'APPROVED' ? '#1C2B20' : rec.humanDecision === 'MODIFIED' ? '#2C2419' : '#2C1C1D',
                    color: rec.humanDecision === 'APPROVED' ? '#81C784' : rec.humanDecision === 'MODIFIED' ? '#FFB74D' : '#E57373'
                  }}>
                    {rec.humanDecision}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>{rec.entityName}</span>
                </div>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{rec.createdAt} &bull; Actor: {rec.actor}</span>
              </div>

              <div style={{ fontSize: 12, color: '#CBD5E1', marginBottom: 6 }}>
                <strong>AI Recommendation:</strong> {rec.aiRecommendation.actionTitle}
              </div>

              {rec.humanDecision === 'MODIFIED' && (
                <div style={{ fontSize: 12, color: '#FFB74D', marginBottom: 6 }}>
                  <strong>Human Modified Action:</strong> {rec.humanModificationText}
                </div>
              )}

              {rec.humanReason && (
                <div style={{ fontSize: 12, color: '#94A3B8', backgroundColor: '#0F172A', padding: 8, borderRadius: 4, fontStyle: 'italic' }}>
                  "{rec.humanReason}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LEARNED PATTERNS */}
      {activeTab === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {patterns.map(pat => (
            <div key={pat.id} style={{ backgroundColor: '#1E293B', padding: 18, borderRadius: 8, border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: '#1C2B20', color: '#81C784' }}>
                  {pat.status} PATTERN ({pat.caseCount} Cases)
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA' }}>
                  {pat.successRatePct}% Success Rate
                </span>
              </div>

              <h4 style={{ margin: '4px 0', fontSize: 15, fontWeight: 600, color: '#F8FAFC' }}>
                Signal Trigger: {pat.signalPattern}
              </h4>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>
                AI Default Recommendation: <span style={{ color: '#E57373' }}>{pat.aiDefaultRecommendation}</span>
              </div>
              <div style={{ fontSize: 12, color: '#81C784', fontWeight: 600, marginBottom: 6 }}>
                Discovered Human Preferred Intervention: {pat.preferredHumanIntervention}
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1', fontStyle: 'italic' }}>
                Observed Result: {pat.observedOutcome}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CANDIDATE RETRAINING & MODEL COMPARISON */}
      {activeTab === 'retraining' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>
                Active vs Candidate Model Performance Evaluation
              </h3>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                Compare current production baseline model against candidate trained from verified feedback outcomes.
              </div>
            </div>
            <Button variant="primary" onClick={handleTrainNewCandidate}>
              ⚡ Train New Candidate Model
            </Button>
          </div>

          {comparison && (
            <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 8, border: '1px solid #334155', marginBottom: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <Banner variant={comparison.isCandidateBetter ? 'info' : 'warning'}>
                  {comparison.recommendationNote}
                </Banner>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Active Model */}
                <div style={{ backgroundColor: '#0F172A', padding: 16, borderRadius: 6, border: '1px solid #388E3C' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#81C784' }}>ACTIVE PRODUCTION MODEL</span>
                  <h4 style={{ margin: '4px 0 8px 0', color: '#FFF' }}>{comparison.activeModel.name} ({comparison.activeModel.modelId})</h4>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    ROC-AUC: <strong style={{ color: '#60A5FA' }}>{comparison.activeModel.metrics.rocAuc.toFixed(2)}</strong> &bull; Accuracy: {(comparison.activeModel.metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Candidate Model */}
                <div style={{ backgroundColor: '#0F172A', padding: 16, borderRadius: 6, border: '1px solid #3B82F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA' }}>CANDIDATE MODEL</span>
                    <Button variant="primary" small onClick={() => handleActivateCandidate(comparison.candidateModel.modelId, comparison.candidateModel.name)}>
                      [Activate Candidate Model]
                    </Button>
                  </div>
                  <h4 style={{ margin: '4px 0 8px 0', color: '#FFF' }}>{comparison.candidateModel.name} ({comparison.candidateModel.modelId})</h4>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    ROC-AUC: <strong style={{ color: '#81C784' }}>{comparison.candidateModel.metrics.rocAuc.toFixed(2)} (+{(comparison.metricsDelta.rocAucDelta * 100).toFixed(1)}%)</strong> &bull; Accuracy: {(comparison.candidateModel.metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: LEARNING PIPELINE FLOWCHART */}
      {activeTab === 'pipeline' && (
        <div style={{ backgroundColor: '#1E293B', padding: 24, borderRadius: 8, border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>
            Controlled Human-Guided Continuous Learning Architecture
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {[
              { stage: '1. AI ANALYSIS & PREDICTION', detail: 'Deterministic Risk Engine evaluates input features and generates baseline score' },
              { stage: '2. MULTI-AGENT REASONING & CRITIC', detail: 'Signal, Evidence, Root Cause & Action Planner generate action plan; Critic Agent challenges' },
              { stage: '3. HUMAN DECISION CAPTURE', detail: 'Operations Lead approves, modifies, or rejects action plan with structured reason' },
              { stage: '4. ACTUAL OPERATIONAL OUTCOME', detail: 'Verified real-world result (Retained, Penalty avoided, Resolved) logged into store' },
              { stage: '5. LEARNING RECORD & FEEDBACK STORE', detail: 'Immutable LearningRecord connects prediction -> recommendation -> human decision -> outcome' },
              { stage: '6. DATA-LEAKAGE-FREE DATASET GENERATION', detail: 'Pre-prediction features compiled into versioned SHA-256 feedback training datasets' },
              { stage: '7. CANDIDATE MODEL RETRAINING & EVALUATION', detail: 'Candidate model trained & evaluated side-by-side against active production model' },
              { stage: '8. HUMAN ADMIN ACTIVATION', detail: 'Authorized Admin reviews performance delta & model hash before promoting candidate to active' }
            ].map((stg, idx) => (
              <div key={idx} style={{ width: '100%', maxWidth: 700, padding: 14, backgroundColor: '#0F172A', borderRadius: 6, border: '1px solid #334155', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA' }}>{stg.stage}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{stg.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
