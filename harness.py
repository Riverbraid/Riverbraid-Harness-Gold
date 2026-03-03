import json
import subprocess
import sys
from pathlib import Path

PETALS = ["Riverbraid-Crypto-Gold", "Riverbraid-Judicial-Gold", "Riverbraid-Memory-Gold", "Riverbraid-Integration-Gold"]

def audit_cluster(cluster_root: Path) -> dict:
    results = []
    all_stationary = True
    for petal_name in PETALS:
        petal_path = cluster_root / petal_name
        verify_script = petal_path / "verify.py"
        result = subprocess.run([sys.executable, str(verify_script)], capture_output=True, text=True, cwd=str(petal_path))
        status = "STATIONARY" if result.returncode == 0 else "DRIFT_DETECTED"
        results.append({"petal": petal_name, "status": status})
        if status != "STATIONARY": all_stationary = False
    return {"cluster_status": "STATIONARY" if all_stationary else "FAIL-CLOSED", "petals": results}
