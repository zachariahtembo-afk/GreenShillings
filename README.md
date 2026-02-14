# 🌿 Green Shillings

_Africa's satellite-verified, AI-powered carbon credit + payment network._

## Mission

Green Shillings connects Tanzanian communities directly to global carbon markets by verifying on-the-ground carbon sequestration, minting $GTS tokens, and enabling transparent benefit flows. The platform blends satellite imagery, AI MRV pipelines, and energy-efficient blockchains to make regenerative practices measurable, bankable, and rewarding.

## Repository Layout (planned)

```
apps/
  api/      # Node.js/Express API + Prisma + Postgres for MRV ingestion + payouts
  web/      # Next.js portal for farmers, verifiers, institutions
  worker/   # (future) AI + satellite data ingestion pipelines
packages/
  shared/   # Shared TypeScript types + SDKs
infra/
  terraform # (future) IaC for Vercel/Neon/Celo
scripts/
  cli/      # Tooling for MRV runs, token issuance, alerting
```

## Phase 0 Objectives

- [ ] Instantiate pnpm workspace + shared linting/prettier.
- [ ] Scaffold API service with Express, Prisma, PostgreSQL (Neon).
- [ ] Define initial Prisma schema for farms, parcels, verifications, $GTS credits.
- [ ] Scaffold Next.js 15 App Router dashboard with Tailwind.
- [ ] Document MRV ingestion pipeline expectations (Sentinel/Planet, Earth Engine).
- [ ] Draft tokenization flow targeting Celo/Polygon (EVM-compatible) testnets.

## MVP Scope (Technical)

1. **MRV Backend** – endpoints to ingest satellite/AI outputs, land parcel metadata, and verification state.
2. **Token Issuance Service** – map verified CO₂ removals to $GTS minting events on-chain.
3. **Farmer Portal** – onboarding, parcel management, payout history (web + SMS hooks).
4. **Verifier Dashboard** – review MRV batches, approve credits, track inventory for buyers.
5. **Database Foundation** – farms, fields, MRV batches, token issuance, payouts, reputation scores.

## Tech Stack (baseline)

- **Backend**: Node.js 20, Express, Prisma, PostgreSQL (Neon), Redis (queues later)
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Radix UI
- **Blockchain**: Polygon PoS (ERC-20 compliant $GTS tokenization)
- **AI/ML**: Databricks (carbon prediction, forecasting, MRV validation)
- **Satellite**: Planet Labs API (3m PlanetScope imagery, NDVI analysis)
- **Hosting**: Vercel (Web + API), Neon (DB), Cloudflare (DNS)

## Getting Started (future checklist)

```bash
pnpm install
pnpm --filter @green-shillings/api dev
pnpm --filter @green-shillings/web dev
```

## API (alpha)

- `GET /farmers` – list farmers with recent parcels and credit stats.
- `POST /farmers` – add a farmer (requires `fullName` + `countryCode`).
- `GET /parcels?farmerId=` – view parcels plus their latest MRV batches.
- `POST /parcels` – register a parcel for a farmer.
- `GET /mrv-batches` – inspect MRV batches (filter by `parcelId` or `status`).
- `POST /mrv-batches` – record a new MRV batch after an ingestion run.
- `GET /satellite/captures` / `POST /satellite/captures` – ingest satellite scenes (provider, capture date, indices) and query them per parcel.
- `POST /satellite/captures/:id/insights` – attach AI model summaries/anomalies to a capture (and fetch via `GET`).
- `POST /credits/:id/tokenize` – mark a credit as minted/transferred/retired, persist token metadata, and log immutable `TokenEvent`s.
- `GET /token-events` – review all token events (filter by `creditId` or `eventType`) or use `/credits/:id/token-events`.

Seed mock data with:

```bash
cp env.example .env # ensure DATABASE_URL is set
pnpm --filter @green-shillings/api db:seed
```

## Web (landing)

- Next.js + Tailwind landing page that replaces Squarespace; CTA links are driven by env vars so you can point Donate/Partner/Volunteer/Briefings to real flows.
- Optional preview lock: set `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` to enable basic auth for all routes.
- Deployment: ship to Vercel, set `NEXT_PUBLIC_API_URL`, CTA URLs, and optional basic auth secrets. Point Cloudflare CNAME to the Vercel domain when ready.

_All further architecture notes live in `docs/` — start with [`docs/vision.md`](docs/vision.md) for the why and [`docs/strategy.md`](docs/strategy.md) for the near-term roadmap and decision guardrails._
