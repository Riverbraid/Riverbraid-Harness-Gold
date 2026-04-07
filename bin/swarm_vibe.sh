#!/bin/bash
echo "--- RIVERBRAID SWARM VIBE ---"
printf "%-30s | %-10s\n" "REPOSITORY" "STATUS"
echo "-----------------------------------------------"

for repo in */ ; do
  if [ -d "$repo/.git" ]; then
    # Check if the repo is on main
    BRANCH=$(cd "$repo" && git rev-parse --abbrev-ref HEAD)
    # Check the Pulse
    /workspaces/check_swarm.sh > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      STATUS="NOMINAL"
    else
      STATUS="DECOUPLED"
    fi
    printf "%-30s | %-10s (%s)\n" "$repo" "$STATUS" "$BRANCH"
  fi
done
