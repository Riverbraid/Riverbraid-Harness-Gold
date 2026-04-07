#!/bin/bash
echo "--- RIVERBRAID SWARM VIBE ---"
printf "%-30s | %-10s\n" "REPOSITORY" "STATUS"
echo "-----------------------------------------------"

# Explicitly target the workspaces root
for repo in /workspaces/*/ ; do
  if [ -d "$repo/.git" ]; then
    REPO_NAME=$(basename "$repo")
    # Check if the repo is on main
    BRANCH=$(cd "$repo" && git rev-parse --abbrev-ref HEAD)
    # Check the Pulse using the absolute path to the checker
    /workspaces/check_swarm.sh > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      STATUS="NOMINAL"
    else
      STATUS="DECOUPLED"
    fi
    printf "%-30s | %-10s (%s)\n" "$REPO_NAME" "$STATUS" "$BRANCH"
  fi
done
