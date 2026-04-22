---
name: stock-api-docs
description: Reference and apply the `stock-platform` REST API contract in `docs/api.md`. Use when implementing, modifying, documenting, testing, or reviewing work that touches `/api/v1` endpoints, especially portfolios, legacy watchlists, symbol static info, and quote APIs. Also use when syncing backend/frontend API expectations, preserving response fields, or preparing curl-based self-checks.
---

# Stock API Docs

## Quick start

- Read `docs/api.md` before changing any `/api/v1` route, frontend API consumer, or API documentation.
- Use `rg -n '^## |^### ' docs/api.md` to jump to the relevant section instead of scanning the whole file.
- Treat `docs/api.md` as the source of truth for request parameters, response fields, and error codes; do not duplicate large endpoint specs inside this skill.
- Default to the Portfolios API for new work. The document marks Watchlists as legacy maintenance only.
- Keep code and contract synchronized: if an API path, parameter, response field, or error rule changes, update `docs/api.md` in the same task.

## API map

Use these document sections to find the right contract quickly:

- `## 1` 基础约定: base URL, auth headers, common response envelope, common error codes.
- `## 3.1` to `## 3.5`: legacy Watchlists endpoints.
- `## P1` and `## P2.1` to `## P2.7`: Portfolio node shapes, tree responses, and node CRUD endpoints.
- `## S1`: `GET /symbols/{symbol}/static-info` contract.
- `## S2`: `POST /quotes` contract.

## Workflow

1. Locate the endpoint section in `docs/api.md` and extract the required method, path, parameters, and response shape.
2. Inspect the implementation that owns the behavior:
   - `api/app.py` for route definitions and request/response assembly.
   - `api/models.py` for persisted fields and node structure.
   - `api/symbol_registry.py` plus `api/providers/` and `api/clients/` for symbol/static-info or quote-related behavior.
3. Inspect the callers before changing the contract:
   - `frontend/src/components/PortfolioSidebar.jsx` for portfolio tree interactions.
   - `frontend/src/components/TradingChart.jsx` and related chart files for market data usage.
   - `frontend/src/App.jsx` for top-level API wiring.
4. If the documented contract and code differ, decide which one is intended and make them match in the same change.
5. Include at least one minimal `curl` example in the handoff whenever you add or change an API.

## Contract rules to preserve

- Use `/api/v1` as the REST base path unless the task explicitly introduces a different namespace.
- Preserve the common response envelope shape: `code`, `message`, `data`.
- Reuse the documented common error codes unless the task intentionally defines a new code path.
- Prefer Portfolio endpoints for active product behavior; touch Watchlists only for compatibility fixes or explicit legacy work.
- If auth behavior matters, check the auth section in `docs/api.md` and verify whether the backend currently enforces the documented headers.

## Verification

Run the smallest validation that proves the contract still works.

- Read endpoint example:
  ```bash
  curl -X GET 'http://127.0.0.1:5200/api/v1/portfolios/tree'
  ```
- Path parameter example:
  ```bash
  curl -X GET 'http://127.0.0.1:5200/api/v1/symbols/AAPL.US/static-info'
  ```
- JSON body example:
  ```bash
  curl -X POST 'http://127.0.0.1:5200/api/v1/quotes' \
    -H 'Content-Type: application/json' \
    -d '{"symbols":["AAPL.US","TSLA.US"]}'
  ```

When the change affects both backend and frontend, also verify the related page entry point after the API check so the documented contract, server response, and UI usage stay aligned.
