# Green Shillings — Strategic Plan & Decision Guide

> Living document for keeping engineering, MRV, and tokenization work tethered to outcomes. Update every sprint when decisions shift.

## 1. Current Snapshot (Dec 2024)

- Workspace + package boundaries scaffolded (`apps/api`, `apps/web`)
- API boots an Express server with `/health` and environment scaffolding; Prisma dependencies installed but schema/migrations pending
- Next.js 15 web shell renders placeholder messaging (no routing, design system, or API integration yet)
- Vision + mission captured in `README`/`docs/vision.md`; no shared linting, infra, or data pipelines committed

## 2. Strategic Objectives (next 6 months)

1. **Trustworthy MRV Backbone** – reliably ingest satellite/AI outputs, version baselines, and expose verifiable audit logs.
2. **Tokenized Incentives** – translate verified tonnes to $GTS issuance with automated settlement into mobile wallets.
3. **Farmer + Verifier Experience** – give stakeholders self-serve onboarding, parcel management, approvals, and payout visibility.
4. **Capital & Marketplace Readiness** – surface inventory, credit quality, and pricing for institutional buyers.

## 3. Phased Roadmap & Decision Gates

| Phase                     | Focus                                                    | Exit Criteria                                                                                  | Strategic Decisions                                                          |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Phase 0 (Foundations)** | Tooling, schemas, mock data                              | ✅ Prisma schema + migrations, Tailwind UI shell, MRV/tokens docs published                    | DB model boundaries, MRV data contract, blockchain target (Celo vs Polygon)  |
| **Phase 1 (Closed Beta)** | End-to-end MRV → token issuance for 2 pilot cooperatives | ✅ Automated ingestion, verifier approval workflow, demo $GTS mint on testnet, SMS payout stub | Remote-sensing providers, payout rails priority, custody/compliance approach |
| **Phase 2 (Scale)**       | Production readiness + marketplace                       | ✅ Observability, infra automation, buyer portal, liquidity partners signed                    | Revenue model, fee split, regional expansion playbook                        |

## 4. Decision Guardrails

- **Data Integrity First** – all MRV-derived numbers must cite source imagery/model metadata; no tokenization without reproducible evidence.
- **Farmer Liquidity < 7 days** – design every process so verified farmers can see payouts inside a week (guides infra + ops choices).
- **Prefer Open / Composable** – default to open standards (Prisma, OpenMRV, ERC-20) to avoid bespoke tooling that slows audits.
- **Regenerative Impact KPI** – optimize for verified tonnes + farmer income uplift, not vanity metrics.

## 5. Workstreams & Owners (placeholder)

| Workstream         | Lead               | Key Deliverables                                     |
| ------------------ | ------------------ | ---------------------------------------------------- |
| MRV Backend        | `@api` team        | Prisma schema, ingestion endpoints, verifier actions |
| Tokenization       | `@protocol`        | Smart contracts, issuance rules, audit trail         |
| Farmer/Verifier UX | `@web`             | App Router dashboard, SMS hooks, onboarding          |
| Data Pipelines     | `@worker` (future) | Sentinel/Planet ingestion, AI scoring                |
| Infrastructure     | `@infra`           | Vercel/Neon configs, observability, CI               |

## 6. Upcoming Decision Windows (next 4 weeks)

1. **Schema v0 freeze** – finalize farm/parcel/batch/token tables before writing seeds.
2. **Blockchain target** – choose Celo Alfajores vs Polygon Amoy for MVP token issuance.
3. **Imagery provider contract** – decide Sentinel-only vs add PlanetScope for higher cadence.
4. **Payout rail prototype** – pick first integration (e.g., Hover/Mukuru API) for mobile money settlement stub.

## 7. Execution Cadence

- Weekly sync → demo progress vs roadmap, confirm blockers/decisions above.
- Bi-weekly architecture review → ensure MRV, contracts, and UX stay aligned; update guardrails if assumptions shift.
- Sprint retro → capture learnings + adjust objectives in this doc.

## 8. Immediate Next Actions (Sprint 1)

1. Stand up shared ESLint/Prettier + CI scaffold so repo stays consistent.
2. Author `prisma/schema.prisma` covering farmers, parcels, MRV batches, credits, payouts; push first migration.
3. Extend API with parcel + MRV endpoints + seed script using mock satellite data.
4. Add Tailwind + layout primitives to Next.js app; render farmer onboarding + verifier review placeholders.
5. Draft MRV ingestion spec in `docs/mrv-pipeline.md` describing data sources, cron cadence, and validation steps.

_Keep this doc short and opinionated: when priorities change, edit here first so every contributor sees the latest strategy._
