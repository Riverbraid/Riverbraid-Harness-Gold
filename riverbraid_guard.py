# Riverbraid Guard v1.5.0 - Universal Sidecar Reference
import hashlib, json, os

class RiverbraidGuard:
    def __init__(self, constitution_path):
        with open(constitution_path, 'r') as f:
            self.constitution = json.load(f)
        self.state_root = self.constitution.get('genesis_root', '0'*64)
        self.step = 0

    def _hash(self, data):
        return hashlib.sha256(data.encode()).hexdigest()

    def validate_io(self, input_data, output_data):
        """
        The Fail-Closed Logic Gate.
        """
        # Entropy Check (The Anti-Chaos Invariant)
        forbidden = ["Math.random", "Date.now", "crypto.getRandomValues"]
        if any(p in str(output_data) for p in forbidden):
            return {"status": "HALT", "reason": "ENTROPY_DETECTED"}

        # State Transition Calculation
        delta_hash = self._hash(json.dumps(output_data, sort_keys=True))
        new_root = self._hash(self.state_root + delta_hash + str(self.step))

        self.state_root = new_root
        self.step += 1
        
        return {"status": "VALID", "root": self.state_root, "step": self.step}

