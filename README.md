# OneAtlas AppSpec Pipeline

A compact Next.js + TypeScript implementation of a multi-stage AI generation pipeline:

1. Intent extraction -> `AppIntent`
2. Schema generation -> tenant-aware `DataSchema`
3. App spec generation -> pages, APIs, auth rules, integration hooks, and workflow stubs

The local generator is deterministic so the project can be evaluated without API keys. The gateway, routing config, cost table, provider env vars, and fallback behavior are still modeled as first-class code so live provider calls can replace the deterministic producers cleanly.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run evaluate
```

## Environment Variables

Copy `.env.example` to `.env.local` and provide keys as needed:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `GOOGLE_AI_API_KEY`
- `DEEPSEEK_API_KEY`
- `OPENROUTER_API_KEY`
- `MISTRAL_API_KEY`

## Architecture

- `lib/types.ts`: Zod schemas and TypeScript contracts for every pipeline artifact.
- `lib/routing.ts`: config-driven model routing, fallbacks, cost table, and stage-specific model choices.
- `lib/gateway.ts`: provider-agnostic gateway boundary. It supports all eight configured providers and falls back to OpenRouter-compatible routing when a local key is unavailable.
- `lib/generators.ts`: deterministic stage producers used for local evaluation.
- `lib/validation.ts`: structure and cross-layer validation. It checks tenant fields, relation consistency, page/API coverage, auth entity references, and integration/action validity.
- `lib/repair.ts`: targeted repair strategies for structural, field, and consistency failures.
- `lib/jobs.ts`: in-memory job store, SSE event replay, cost, latency, and repair logs.

## API

- `POST /api/generate` accepts `{ "prompt": "..." }` and returns `{ "jobId": "..." }`.
- `GET /api/generate/:jobId/stream` emits `stage_start`, `stage_complete`, `stage_failed`, and `generation_complete` SSE events. Previous events replay on reconnect.
- `GET /api/generate/:jobId` returns status, outputs, errors, repair log, cost breakdown, and latency.
- `POST /api/generate/:jobId/repair` accepts `{ "stage": "intent|schema|appSpec", "errorHint": "..." }`.
- `GET /api/integrations` returns the integration registry.

## Integrations

Fully described action stubs:

- Slack
- WhatsApp via Twilio
- Gmail / Google Workspace
- Stripe
- Jira
- Google Sheets

Registered but explicitly deferred:

- Salesforce
- Generic Webhook

Live OAuth/API execution is intentionally out of scope. The registry provides enough action metadata, payload shape, auth type, and trigger information for a downstream executor to implement the calls.

## Scope Cuts

- No live model calls are made by default; deterministic stage producers keep the trial reproducible.
- Job storage is in memory, not Redis/Postgres.
- Provider fallback logic is modeled at the gateway boundary, but real 429/5xx retry adapters are not implemented.
- UI is intentionally operational: no marketing page, no animations, no raw JSON-only output.

## Evaluation

Run:

```bash
npm run evaluate
```

This writes `evaluation/evaluation-log.json` with all 12 required prompts, success/fail status, failed stage, repairs, retry count, latency, cost, detected integrations, and a 300-word-max summary.
# appspec
