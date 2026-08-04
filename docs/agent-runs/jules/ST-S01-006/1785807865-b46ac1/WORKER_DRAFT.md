# OpenCode Worker Draft

        Draft branch: `opencode-worker/st-s01-006-1785807602-fcd8cd`
        Preserved patch: `docs/agent-runs/jules/ST-S01-006/1785807865-b46ac1/WORKER_PARTIAL.patch` if present
        Worker model: `opencode/deepseek-v4-flash-free`
        Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/ST-S01-006/opencode-deepseek-v4-flash-free-raw.jsonl`

        Jules role:
        - Treat the worker patch as a draft implementation.
        - Inspect the diff before changing anything.
        - Run focused validation and add only minimal corrections/evidence.
        - Open the PR only after validation is coherent.
        - If the draft is unsafe, out of scope, empty, or impossible to validate, stop with a concise blocker.

        Worker changed files:
        - `CHANGELOG.md`
- `packages/trading-domain/src/index.ts`
- `packages/trading-domain/src/trading-lab.ts`
- `packages/trading-domain/tests/trading-lab.test.ts`
