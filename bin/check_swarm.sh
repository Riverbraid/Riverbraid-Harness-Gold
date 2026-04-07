#!/bin/bash
echo "--- SWARM INTEGRITY CHECK ---"
# Check the Core Pulse
node /workspaces/Riverbraid-Core/bin/pulse.mjs
if [ $? -eq 0 ]; then
  echo "RESULT: Swarm is Coupled to adef13"
else
  echo "RESULT: ENTROPY DETECTED - Swarm Decoupled"
  exit 1
fi
