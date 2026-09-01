// =============================================================================
// ModelTrainingView Component
// =============================================================================

import React, { useState } from 'react';
import { Button, Banner } from 'shell';
import { RiskDomain, TrainingDataset, ModelVersion } from '../../types/opsguard';
import { DatasetValidator, demoChurnDatasetCSV, demoContractDatasetCSV, demoDeliveryDatasetCSV } from '../../ml/datasetValidator';
import { MLBackendAdapter } from '../../ml/mlBackendAdapter';
import { ModelRegistry } from '../../ml/modelRegistry';

import { ModelIntegrity } from '../../security/modelIntegrity';

export const ModelTrainingView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<RiskDomain>('customer_churn');
  const [activeDataset, setActiveDataset] = useState<TrainingDataset | null>(null);
  const [trainedModel, setTrainedModel] = useState<ModelVersion | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handleSelectDemoDataset = (domain: RiskDomain) => {
    setSelectedDomain(domain);
    setTrainedModel(null);

    const csvContent = domain === 'customer_churn'
      ? demoChurnDatasetCSV
      : domain === 'contract_deadline'
      ? demoContractDatasetCSV
      : demoDeliveryDatasetCSV;

    const filename = `${domain}_historical_500.csv`;
    const validated = DatasetValidator.validateCSV(filename, domain, csvContent);
    setActiveDataset(validated);
    setPreviewContent(csvContent);
  };

  const handleTrainModel = () => {
    if (!activeDataset) return;
    setIsTraining(true);

    setTimeout(() => {
      const model = MLBackendAdapter.trainModel(activeDataset);
      const hashes = ModelIntegrity.generateModelHashes(model);
      const securedModel: ModelVersion = {
        ...model,
        ...hashes
      };
      setTrainedModel(securedModel);
      setIsTraining(false);
    }, 1000);
  };

  const handleSaveCandidate = () => {
    if (!trainedModel) return;
    ModelRegistry.addCandidateModel(trainedModel);
    alert(`Candidate Model "${trainedModel.modelId}" registered successfully in Model Registry!`);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
          ML Model Training & Dataset Validation
        </h2>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Train machine learning risk models against historical operational datasets or pre-loaded synthetic demo datasets.
        </div>
      </div>

      {/* Available Demo Datasets Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#F8FAFC', marginBottom: 12 }}>
          Available Demo Datasets (Pre-loaded)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {[
            { domain: 'customer_churn' as RiskDomain, title: 'Customer Churn Dataset', filename: 'customer_churn_historical_500.csv', target: 'churned' },
            { domain: 'contract_deadline' as RiskDomain, title: 'Contract Obligation Dataset', filename: 'contract_obligation_historical_500.csv', target: 'obligation_risk' },
            { domain: 'project_delay' as RiskDomain, title: 'Project Delivery Dataset', filename: 'project_delivery_historical_500.csv', target: 'delayed' }
          ].map(item => (
            <div
              key={item.domain}
              style={{
                padding: 16,
                backgroundColor: '#1E293B',
                borderRadius: 6,
                border: activeDataset?.domain === item.domain ? '1px solid #3B82F6' : '1px solid #334155'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, backgroundColor: '#334155', color: '#94A3B8' }}>
                  Synthetic Demo Dataset
                </span>
                <span style={{ fontSize: 11, color: '#81C784', fontWeight: 600 }}>
                  Target: `{item.target}`
                </span>
              </div>

              <h4 style={{ margin: '4px 0 6px 0', fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>
                {item.title}
              </h4>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
                500 historical synthetic records with feature variation & missing values.
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  variant="secondary"
                  small
                  onClick={() => {
                    handleSelectDemoDataset(item.domain);
                    setShowPreview(true);
                  }}
                >
                  Preview CSV
                </Button>
                <Button
                  variant="primary"
                  small
                  onClick={() => handleSelectDemoDataset(item.domain)}
                >
                  Use for Training
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Validation Report */}
      {activeDataset && (
        <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 6, border: '1px solid #334155', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#81C784' }}>VALIDATION PASSED</span>
              <h3 style={{ margin: '2px 0 0 0', fontSize: 16, fontWeight: 600, color: '#F8FAFC' }}>
                Dataset: {activeDataset.filename}
              </h3>
            </div>
            <Button variant="primary" onClick={handleTrainModel} disabled={isTraining}>
              {isTraining ? 'Training Model Engine...' : '⚡ Train Random Forest Model'}
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 4, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>RECORDS</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>{activeDataset.recordCount}</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 4, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>FEATURES</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>{activeDataset.featureCount}</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 4, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>TARGET FIELD</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#81C784' }}>`{activeDataset.targetColumn}`</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 4, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>DISTRIBUTION</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#FFB74D' }}>{activeDataset.classImbalanceRatio}</div>
            </div>
          </div>
        </div>
      )}

      {/* CSV Preview Modal */}
      {showPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: 8, maxWidth: 650, width: '100%', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, color: '#FFF' }}>Dataset Preview (Synthetic Demo)</h3>
            <pre style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, color: '#60A5FA', fontSize: 12, overflowX: 'auto', maxHeight: 300 }}>
              {previewContent}
            </pre>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowPreview(false)}>Close Preview</Button>
            </div>
          </div>
        </div>
      )}

      {/* Trained Model Evaluation Metrics */}
      {trainedModel && (
        <div style={{ backgroundColor: '#1E293B', padding: 22, borderRadius: 8, border: '1px solid #388E3C', marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#81C784', textTransform: 'uppercase' }}>
                Model Training Complete
              </span>
              <h3 style={{ margin: '2px 0 0 0', fontSize: 18, fontWeight: 700, color: '#F8FAFC' }}>
                {trainedModel.name} ({trainedModel.modelId})
              </h3>
            </div>
            <Button variant="primary" onClick={handleSaveCandidate}>
              Save as Candidate Model in Registry
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 18 }}>
            <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>ACCURACY</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#81C784' }}>{(trainedModel.metrics.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>PRECISION</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC' }}>{(trainedModel.metrics.precision * 100).toFixed(1)}%</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>RECALL</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC' }}>{(trainedModel.metrics.recall * 100).toFixed(1)}%</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>F1-SCORE</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC' }}>{(trainedModel.metrics.f1Score * 100).toFixed(1)}%</div>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: 12, borderRadius: 4, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>ROC-AUC</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#60A5FA' }}>{trainedModel.metrics.rocAuc.toFixed(2)}</div>
            </div>
          </div>

          {/* Feature Importance Chart */}
          <div style={{ backgroundColor: '#0F172A', padding: 14, borderRadius: 6, border: '1px solid #334155' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 10 }}>FEATURE IMPORTANCE RANKING</div>
            {trainedModel.featureImportance.map((feat, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#F8FAFC', marginBottom: 2 }}>
                  <span>{feat.feature}</span>
                  <span>{feat.importancePct}%</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${feat.importancePct}%`, height: '100%', backgroundColor: '#60A5FA' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
