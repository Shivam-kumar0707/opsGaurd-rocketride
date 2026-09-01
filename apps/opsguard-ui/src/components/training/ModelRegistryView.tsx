// =============================================================================
// ModelRegistryView Component (Secured with RBAC & SHA-256 Hashes)
// =============================================================================

import React, { useState } from 'react';
import { Button, Banner } from 'shell';
import { ModelRegistry } from '../../ml/modelRegistry';
import { ModelVersion, UserRole } from '../../types/opsguard';
import { PolicyEngine } from '../../security/policyEngine';
import { ModelIntegrity } from '../../security/modelIntegrity';

interface ModelRegistryViewProps {
  userRole: UserRole;
}

export const ModelRegistryView: React.FC<ModelRegistryViewProps> = ({ userRole }) => {
  const [models, setModels] = useState<ModelVersion[]>(ModelRegistry.getModels());
  const [bannerMessage, setBannerMessage] = useState<{ text: string; variant: 'info' | 'error' } | null>(null);

  const handleActivate = (modelId: string, modelName: string) => {
    try {
      PolicyEngine.enforce(userRole, 'ACTIVATE_MODEL', `activate production model "${modelId}"`, 'User');
      ModelRegistry.activateModel(modelId);
      setModels(ModelRegistry.getModels());
      setBannerMessage({
        text: `✓ Candidate Model "${modelName}" (${modelId}) successfully activated as primary inference model by ${userRole}.`,
        variant: 'info'
      });
    } catch (err: any) {
      setBannerMessage({
        text: `⚠ ${err.message}`,
        variant: 'error'
      });
    }

    setTimeout(() => setBannerMessage(null), 5000);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          Model Registry & Inference Governance
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Manage production risk models, candidate evaluation metrics, SHA-256 model hashes, and explicit human activation workflows.
        </div>
      </div>

      {bannerMessage && (
        <div style={{ marginBottom: 16 }}>
          <Banner variant={bannerMessage.variant}>
            {bannerMessage.text}
          </Banner>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {models.map(model => {
          const hashes = ModelIntegrity.generateModelHashes(model);
          const displayHash = (model.modelHash || hashes.modelHash).slice(0, 16);

          return (
            <div
              key={model.modelId}
              style={{
                padding: 20,
                backgroundColor: '#1E293B',
                borderRadius: 8,
                border: model.status === 'active' ? '1px solid #388E3C' : '1px solid #334155'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      backgroundColor: model.status === 'active' ? '#1C2B20' : '#334155',
                      color: model.status === 'active' ? '#81C784' : '#94A3B8',
                      border: `1px solid ${model.status === 'active' ? '#2A4431' : '#475569'}`
                    }}>
                      {model.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>
                      Domain: <strong style={{ color: '#CBD5E1' }}>{model.domain.replace('_', ' ').toUpperCase()}</strong>
                    </span>
                    <span style={{ fontSize: 11, color: '#60A5FA', fontFamily: 'monospace' }}>
                      SHA-256: {displayHash}...
                    </span>
                  </div>

                  <h3 style={{ margin: '2px 0 4px 0', fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>
                    {model.name} ({model.version})
                  </h3>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    Model ID: <strong style={{ color: '#CBD5E1' }}>{model.modelId}</strong> &bull; Dataset: {model.trainingDatasetId} &bull; Trained {model.trainedDate}
                  </div>
                </div>

                <div>
                  {model.status !== 'active' ? (
                    <Button
                      variant="primary"
                      small
                      onClick={() => handleActivate(model.modelId, model.name)}
                    >
                      [Activate Candidate Model]
                    </Button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#81C784', fontWeight: 600 }}>
                      ✓ Active Model
                    </span>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 14 }}>
                <div style={{ backgroundColor: '#0F172A', padding: 8, borderRadius: 4, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>ACCURACY</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>{(model.metrics.accuracy * 100).toFixed(1)}%</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: 8, borderRadius: 4, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>PRECISION</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>{(model.metrics.precision * 100).toFixed(1)}%</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: 8, borderRadius: 4, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>RECALL</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>{(model.metrics.recall * 100).toFixed(1)}%</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: 8, borderRadius: 4, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>F1-SCORE</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>{(model.metrics.f1Score * 100).toFixed(1)}%</div>
                </div>
                <div style={{ backgroundColor: '#0F172A', padding: 8, borderRadius: 4, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>ROC-AUC</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#60A5FA' }}>{model.metrics.rocAuc.toFixed(2)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
