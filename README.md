# Riverbraid-Harness-Gold

**Signal:** `STATIONARY_STATE_ACTIVE`  
**Cluster:** [Riverbraid Gold v1.1](https://github.com/Riverbraid/Riverbraid-Golds)  
**Language:** Python ≥ 3.10  
**Status:** Active — Stationary  
**Release:** [v1.1.0](https://github.com/Riverbraid/Riverbraid-Harness-Gold/releases/tag/v1.1.0)

-----

## What It Is

Riverbraid-Harness-Gold is the **fail-closed verification harness** for the Riverbraid Gold Cluster. It runs byte-floor audits and stationary sealing across all petals and reports whether the cluster as a whole is in a verified, drift-free state.

The governing principle is `dS/dt = 0` — zero entropy growth. If any part of the system cannot prove it is in the state it claims to be in, the cluster halts.

-----

## What It Is Not

- Not a test framework — it verifies state integrity, not functional behavior
- Not a monitoring or alerting system — it is a gate, not a dashboard
- Not adaptive — it confirms or denies; it does not remediate

-----

## How It Works

`audit_cluster()` iterates over all registered petals, runs each petal’s `verify.py`, and collects the results. If every petal returns `STATIONARY`, the cluster status is `STATIONARY`. If any petal returns `DRIFT_DETECTED` or cannot be reached, the cluster status is `FAIL-CLOSED`.

`byte_floor_audit()` confirms that key files exist and exceed a minimum byte size. Empty or missing files fail the audit.

Results are returned as a structured dict and printed to stdout. The process exits `0` on `STATIONARY` and `1` on `FAIL-CLOSED`.

-----

## Usage

```python
from harness import audit_cluster, byte_floor_audit

# Full cluster audit
report = audit_cluster()
# report["cluster_status"] → "STATIONARY" or "FAIL-CLOSED"
# report["petals"] → list of per-petal results

# Single file audit
result = byte_floor_audit(Path("protocol.steps"), min_bytes=1)
# result["passed"] → True or False
```

**From the command line:**

```bash
# Audit the full cluster
python verify.py

# Specify a custom cluster root
python verify.py --root /path/to/cluster
```

-----

## Files

|File                     |Purpose                               |
|-------------------------|--------------------------------------|
|`harness.py`             |Core audit and sealing logic          |
|`__init__.py`            |Public API surface                    |
|`verify.py`              |Cluster-level verification entry point|
|`identity.contract.json` |Identity contract (data, not code)    |
|`substrate.contract.json`|Substrate contract (data, not code)   |
|`ARCHITECTURE.md`        |Architectural documentation           |
|`SECURITY.md`            |Security policy                       |

-----

## Design Properties

- **Fail-closed** — partial cluster verification is not possible; all petals must pass
- **Auditable** — every petal result is recorded and returned in the cluster report
- **Zero dependencies** — uses Python’s `hashlib`, `pathlib`, and `subprocess`
- **Composable** — can be run standalone or called programmatically from the pipeline

-----

## Cluster Governance

- **Merkle Root:** `de2062`
- **Fingerprint:** `D9475D6B717D0E6C8EC84F6D8F86D9F4F2B083A4`
- **Stationary Mandate:** v1.1.0

-----

## Part of the Riverbraid Gold Cluster

|Petal                                                                                   |Signal              |Purpose                      |
|----------------------------------------------------------------------------------------|--------------------|-----------------------------|
|[Riverbraid-Golds](https://github.com/Riverbraid/Riverbraid-Golds)                      |—                   |Cluster manifest and pipeline|
|[Riverbraid-Core](https://github.com/Riverbraid/Riverbraid-Core)                        |Root                |Capacity control substrate   |
|[Riverbraid-Crypto-Gold](https://github.com/Riverbraid/Riverbraid-Crypto-Gold)          |`MECHANICAL_HONESTY`|SHA-256 state anchoring      |
|[Riverbraid-Judicial-Gold](https://github.com/Riverbraid/Riverbraid-Judicial-Gold)      |`LEAST_ENTROPY`     |Predicate governance         |
|[Riverbraid-Refusal-Gold](https://github.com/Riverbraid/Riverbraid-Refusal-Gold)        |`BOUNDARY_LOGIC`    |Boundary enforcement         |
|[Riverbraid-Memory-Gold](https://github.com/Riverbraid/Riverbraid-Memory-Gold)          |`MEANING_CENTRIC`   |Meaning-centric persistence  |
|[Riverbraid-Integration-Gold](https://github.com/Riverbraid/Riverbraid-Integration-Gold)|`SEMANTIC_BRIDGE`   |Mode enactment               |

-----

## License

See `LICENSE`.
