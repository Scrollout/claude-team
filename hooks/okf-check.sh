#!/bin/sh
# PostToolUse hook: after a Write/Edit under the OKF bundle, run the validator. No-op without node.
command -v node >/dev/null 2>&1 || exit 0
exec node "${CLAUDE_PLUGIN_ROOT}/hooks/okf-hook.mjs"
