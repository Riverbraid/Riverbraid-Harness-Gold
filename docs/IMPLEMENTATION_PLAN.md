# Riverbraid-Harness-Gold Implementation Plan

**Status:** Planning and compatibility review only  
**Scope:** Future implementation candidates for Harness-Gold  
**Current repository state:** stationary verifier surface, not full TypeScript harness implementation  
**Non-claims:** This plan does not claim production readiness, certification, external audit, security completeness, completed harness implementation, completed tests, or completed evidence-gated validation.

---

## 1. Current preserved boundary

The current repository is a canonical Harness-Gold surface with a narrow stationary verifier. Existing root files and verifier behavior must be preserved unless a separate migration plan is approved.

Current observed surfaces include:

- `README.md` declaring the repository as canonical Harness-Gold with a declared-conditions-only claim boundary.
- `package.json` using ESM, Node `24.11.1`, and existing scripts including `verify`, `test`, `verify:feature-flow`, `test:legacy`, and `verify:legacy`.
- `verify.mjs` reading `protocol.steps`, calling `verify(input)`, writing `verify-output.json`, and failing closed when output status is not `VERIFIED`.
- `index.js` implementing the current `HARNESS_STATIONARY` check.
- `feature-flow.json` requiring vector update for the active linear change.
- `run-vectors.cjs` preserving legacy verification behavior and excluding `docs` from vector hashing.

The implementation batches supplied for the future TypeScript harness are treated as source drafts. They are not yet repository truth.

---

## 2. Batch intake status

| Batch | Requested contents | Status | Plan disposition |
| --- | --- | --- | --- |
| Batch 1 | `.gitignore`, `.gitattributes`, README, changelog, evidence ledger | Draft only | Normalize claims before use. Do not import false pass/test/security claims. |
| Batch 2 | Claim ledger, limitations, architecture, test protocol | Draft only | Preserve as planning material. Rewrite ledgers as pending until evidence exists. |
| Batch 3 | Validation rules, succession, expansion gate, governance, CER template | Draft only | Convert to bounded governance docs; remove invented approvals, roles, releases, and PR references. |
| Batch 4 | Schemas and partial implementation files | Draft only | Requires API normalization before code mutation. |
| Batch 5 | Scripts and configs | Draft only | Must align with current ESM/package/runtime before implementation. |
| Batch 6 | `types.d.ts`, `TestCase.ts`, `TestSuite.ts` | Draft only | Requires compile audit and runtime error model correction. |
| Batch 7 | `TestRunner.ts`, `ValidationEngine.ts` | Draft only | Requires API consistency pass and schema compile strategy. |
| Batch 8 | `Reporter.ts` | Draft only | Add after reporter architecture decision and TypeScript fixes. |
| Batch 9 | `logger.ts`, `configLoader.ts`, `validator.ts`, `formatter.ts`, `index.ts` | Draft only | Add after utility API decision and runtime export correction. |
| Test files | harness tests and core error tests | Draft only | Do not add until implementation compiles and tests are made consistent with schemas. |

---

## 3. Required corrections before implementation

### 3.1 Claim and evidence corrections

The supplied batches contain completed-state language that is not currently evidenced. Before any files are committed as implementation, remove or downgrade claims such as:

- `EVIDENCE_GATE-005 PASSED`
- `100% test coverage achieved`
- `240 tests passed`
- `all quality gates passed`
- `security scans passed`
- `active`, `validated`, or `production-like` status unless supported by actual logs
- invented dates, PR numbers, maintainers, roles, releases, and approvals

Accepted replacement status language:

- `PLANNED`
- `DRAFT`
- `PENDING_EXECUTION_EVIDENCE`
- `PATCHED_UNVERIFIED`
- `IMPLEMENTATION_CANDIDATE`
- `NOT_PRODUCTION_READY`

### 3.2 Current package compatibility

The supplied implementation assumes a TypeScript build output under `dist/src`. The current repository uses ESM and has a root `index.js` plus `verify.mjs`. Before adding TypeScript source, decide whether the first implementation pass will:

1. preserve the existing ESM verifier and add TypeScript harness code as future source, or
2. migrate package/build tooling in a separate approved change.

Do not overwrite `index.js`, `verify.mjs`, `protocol.steps`, `feature-flow.json`, or legacy verifier scripts without a separate migration plan.

### 3.3 Runtime error model

The supplied `src/types.d.ts` declares error classes, but declaration files do not emit runtime JavaScript. Tests importing `HarnessError`, `ValidationError`, `ConfigurationError`, `TestExecutionError`, `ReporterError`, and `SchemaError` from runtime paths will fail unless those classes exist in real source files.

Required decision:

- create a runtime `src/errors.ts`, or
- move error classes into a runtime `src/types.ts`, while keeping type-only declarations separate.

### 3.4 TypeScript compile blockers

Known draft blockers include:

- `Reporter.ts` defines a private field named `type` and a getter named `type`; this is a conflict. Use `private readonly reporterType` or `public readonly type`.
- `Reporter` constructor does not accept `reportTypes`, but tests pass `reportTypes` and expect multi-report behavior.
- `TestCase.collectEvidence` is private, but `TestSuite` and `TestRunner` call it. Make it public or move evidence collection into a shared helper.
- `TestSuite` lacks `getDefinition()`, but `TestRunner` and tests call it.
- `TestRunner.runTestCase()` calls `testCase.execute(testFn, suiteContext)`, but `TestCase.execute()` accepts only one argument in the supplied draft.
- `ValidationEngine.validateDuration()` reads `data.timeout`, but `TestCaseResult` has no timeout field.
- `src/index.ts` re-exports classes but then references them in the default export without importing local bindings.
- `Logger.child()` references `this.config.context`, but `LoggerConfig` does not define `context`.
- several catch blocks use `err.message` without narrowing `unknown`.

### 3.5 Schema and configuration blockers

- `harness-schema.json` uses `additionalProperties: false`, but configs include `$schema`; either allow `$schema` or strip it before validation.
- Config `extends` currently concatenates suites, which can duplicate default suites unintentionally.
- Schema names used by code (`harness`, `harnessConfig`, `testResult`, `testRunResult`) need one consistent mapping.
- `Ajv` import style should be normalized for the chosen TypeScript module settings.
- External schema references to sibling repos must be optional or fail-closed with clear missing-dependency messages.

### 3.6 Test blockers

The supplied tests should not be committed as passing tests until aligned with the implementation.

Known blockers:

- Many test IDs use `TC-001`, but schemas require IDs like `TC-001-SOMETHING`.
- Some tests use empty `{}` for `input` and `expected`, while schemas require non-empty objects.
- One test comment says a case should fail even though returned output matches expected output.
- Tests import from `../../dist/src` before a build pipeline exists.
- Tests expect `ReporterError` constructor validation that the supplied `Reporter` does not implement.
- Tests expect multi-report behavior from one reporter instance, but the supplied implementation is single-type.
- Tests rely on runtime error classes that do not yet exist.

### 3.7 Reporter-specific blockers from Batch 8

Before adding `src/harness/Reporter.ts`, decide the reporter model:

- one `Reporter` instance per type, or
- one aggregate reporter that generates multiple report types.

Required fixes:

- sanitize timestamps in filenames for Windows compatibility.
- use a safe filename timestamp rather than raw ISO strings with colons.
- validate reporter type in constructor if tests expect constructor failure.
- escape XML content consistently, not only attribute values.
- repair evidence markdown table formatting.
- avoid writing to arbitrary paths without path normalization and output-dir containment.

### 3.8 Utility-specific blockers from Batch 9

Before adding utility files:

- `LoggerConfig` must allow a default constructor and optional `context`, or `Logger` must remove context usage.
- `ConfigLoader.mergeConfigs()` must define whether arrays concatenate or override.
- `ConfigLoader` must preserve the correct `configPath` after merge.
- `validator.ts` should align with `ValidationEngine` or be clearly separate as `ConfigValidator`.
- `index.ts` must import local bindings before constructing a default export object.

---

## 4. Safe implementation sequence

### Step A: Documentation-only intake

Create bounded planning docs only. No source code, workflows, release files, registry pins, or evidence pass claims.

Deliverables:

- this implementation plan
- optional compatibility checklist
- optional implementation tracker issue

### Step B: API decision record

Create `docs/API_DECISION_RECORD.md` before source mutation. It must decide:

- ESM versus CommonJS build surface
- TypeScript source layout
- runtime error module location
- reporter model
- config merge semantics
- schema name mapping
- test ID conventions
- output path containment

### Step C: Minimal source scaffold

Add only the smallest compileable source set:

- runtime errors
- logger
- config loader
- formatter
- one minimal reporter or none
- `index.ts` with correct imports/exports

Do not add broad tests until the source compiles.

### Step D: Harness core

Add `TestCase`, `TestSuite`, `ValidationEngine`, and `TestRunner` only after API decisions are locked.

Acceptance criteria:

- TypeScript compiles.
- Existing `npm test` / `node verify.mjs` behavior is preserved or intentionally migrated with evidence.
- No false pass/evidence claims are added.

### Step E: Schemas and configs

Add schemas and configs after source naming is stable.

Acceptance criteria:

- schemas compile with the selected validator.
- default config validates.
- sibling-repo configs fail closed when sibling repos are missing.

### Step F: Tests

Add tests only after implementation compiles.

Acceptance criteria:

- test IDs match schema.
- tests import from the actual package entry point.
- expected outcomes match implementation behavior.
- test output becomes evidence only after the command is actually run.

### Step G: Evidence update

Only after local or CI execution exists:

- update evidence ledger with command, output, exit code, commit SHA, and environment.
- update claim ledger as passed only for claims actually proven.

---

## 5. Explicit non-mutation boundary

The following are outside this implementation-plan update:

- workflow creation or modification under `.github/workflows`
- release workflow or tag changes
- registry pin updates
- GPG/private key handling
- branch protection or repo settings claims
- production readiness claims
- certification or external audit claims
- completed security scan claims
- completed test coverage claims

---

## 6. Next recommended file

The next safe file is:

`docs/API_DECISION_RECORD.md`

That file should lock the API and build decisions before any source or test files are added.
