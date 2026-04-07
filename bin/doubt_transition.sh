#!/bin/bash
# Move current changes to a doubt branch across the current repo
REPO_NAME=$(basename $(pwd))
TIMESTAMP=$(date +%Y%m%d-%H%M)
BRANCH_NAME="doubt-$TIMESTAMP"

echo "Decoupling $REPO_NAME to $BRANCH_NAME..."
git checkout -b $BRANCH_NAME
echo "Safety branch created. You may now push to origin $BRANCH_NAME."
