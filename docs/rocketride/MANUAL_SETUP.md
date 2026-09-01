# OpsGuard — Manual RocketRide Visual Builder Setup Guide

This document provides step-by-step manual setup instructions for configuring OpsGuard pipelines inside the visual RocketRide Pipeline Builder UI (if setting up via the graphical canvas).

---

## Pipeline 1: `opsguard.analyzeRisk`

### 1. Create New Pipeline
- Click **+ New Pipeline** in RocketRide Builder.
- Name: `opsguard.analyzeRisk`
- Save target directory: `./pipelines/analyzeRisk.pipe`

### 2. Add Source Node
- Select **Webhook** starting point from sidebar palette.
- Node ID: `webhook_1`
- Set `mode: "Source"`, `type: "webhook"`.

### 3. Add Data Processing Nodes
1. Drag **Anonymize Text** (`anonymize_text`):
   - Wire input: `webhook_1` (`tags` / `text`) -> `anonymize_text_1` (`text`)
2. Drag **Embedding Transformer** (`embedding_transformer`):
   - Profile: `miniLM`
   - Wire input: `anonymize_text_1` (`text`) -> `embedding_transformer_1` (`questions`)
3. Drag **Qdrant Vector DB** (`qdrant`):
   - Profile: `memory`
   - Wire input: `embedding_transformer_1` (`questions`) -> `qdrant_1` (`questions`)

### 4. Add Agent & Control Nodes
1. Drag **RocketRide Agent** (`agent_rocketride`):
   - Node ID: `agent_rocketride_1`
   - Max Waves: `10`
   - Wire input: `qdrant_1` (`questions`) -> `agent_rocketride_1` (`questions`)
2. Drag **OpenAI LLM** (`llm_openai`):
   - Profile: `openai-5`
   - Set API key variable: `${ROCKETRIDE_OPENAI_KEY}`
   - Wire control connection: `agent_rocketride_1` -> `llm_openai_1` (classType: `llm`)
3. Drag **Internal Memory** (`memory_internal`):
   - Wire control connection: `agent_rocketride_1` -> `memory_internal_1` (classType: `memory`)

### 5. Add Response Sink Node
- Drag **Response JSON** (`response_json`):
  - Set `laneName: "riskAnalysisResult"`
  - Wire input: `agent_rocketride_1` (`answers`) -> `response_json_1` (`answers`)

### 6. Save & Deploy
- Click **Save Pipeline** and verify `.pipe` JSON file is generated cleanly.
