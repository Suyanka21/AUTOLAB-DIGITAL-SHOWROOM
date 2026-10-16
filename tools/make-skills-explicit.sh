#!/usr/bin/env bash
# OPTIONAL. Makes every skill in .agents/skills explicit-only (invoked with $skill-name),
# so skills never trigger implicitly and burn your plan allowance.
# Undo: delete the agents/openai.yaml files this script creates.
set -euo pipefail
cd "$(dirname "$0")/.."
for d in .agents/skills/*/; do
  mkdir -p "${d}agents"
  if [ ! -f "${d}agents/openai.yaml" ]; then
    printf 'policy:\n  allow_implicit_invocation: false\n' > "${d}agents/openai.yaml"
    echo "created ${d}agents/openai.yaml"
  fi
done
