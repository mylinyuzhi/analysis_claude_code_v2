#!/usr/bin/env bash
export CLAUDE_CONFIG_DIR="/root/.claude_api"
source /lyz/codespace/loop/.venv/bin/activate
python /lyz/codespace/loop/loop_agent.py /lyz/codespace/analysis_claude_code_v2 20
