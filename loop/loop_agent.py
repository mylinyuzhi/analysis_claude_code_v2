#!/usr/bin/env python3
"""
loop_agent.py — Run Claude in a plan-then-execute loop.

Usage:
    python loop_agent.py <work_dir> <n_iterations>

Reads prompt.txt from CWD, runs Claude n times against work_dir.
Each iteration: plan (read-only) → execute (bypassPermissions / YOLO).
"""

import argparse
import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    TextBlock,
    ResultMessage,
)


async def run_iteration(prompt: str, work_dir: str, iteration: int) -> None:
    print(f"\n{'='*60}")
    print(f" Iteration {iteration + 1}  [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}]")
    print(f"{'='*60}")

    # Propagate CLAUDE_CONFIG_DIR explicitly so the spawned claude subprocess
    # uses the correct config directory regardless of how the script is invoked.
    extra_env: dict[str, str] = {}
    if config_dir := os.environ.get("CLAUDE_CONFIG_DIR"):
        extra_env["CLAUDE_CONFIG_DIR"] = config_dir

    options = ClaudeAgentOptions(
        cwd=work_dir,
        permission_mode="plan",          # start in plan mode
        setting_sources=["project"],     # load CLAUDE.md if present
        env=extra_env,
    )

    async with ClaudeSDKClient(options=options) as client:
        # ── Phase 1: Plan ─────────────────────────────────────────
        print("\n[Phase 1] Planning...\n")
        await client.query(prompt)

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text, end="", flush=True)
            elif isinstance(message, ResultMessage):
                cost = message.total_cost_usd or 0
                print(f"\n[plan cost: ${cost:.4f}]")

        # ── Phase 2: Execute ───────────────────────────────────────
        print("\n[Phase 2] Executing...\n")
        await client.set_permission_mode("bypassPermissions")
        await client.query(
            "Now execute the plan above. Proceed with all steps automatically."
        )

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text, end="", flush=True)
            elif isinstance(message, ResultMessage):
                cost = message.total_cost_usd or 0
                print(f"\n[execute cost: ${cost:.4f}]")

    print(f"\n[Iteration {iteration + 1} done]  [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}]")


async def main() -> None:
    parser = argparse.ArgumentParser(
        description="Loop Claude (plan → execute) over a working directory."
    )
    parser.add_argument("work_dir", help="Directory for Claude to operate in")
    parser.add_argument("n", type=int, help="Number of iterations")
    args = parser.parse_args()

    work_dir = str(Path(args.work_dir).resolve())

    prompt_path = Path("prompt.txt")
    if not prompt_path.exists():
        print(f"Error: prompt.txt not found in {Path.cwd()}", file=sys.stderr)
        sys.exit(1)

    prompt = prompt_path.read_text().strip()
    if not prompt:
        print("Error: prompt.txt is empty", file=sys.stderr)
        sys.exit(1)

    print(f"Prompt  : {prompt[:80]}{'...' if len(prompt) > 80 else ''}")
    print(f"Work dir: {work_dir}")
    print(f"Loops   : {args.n}")

    for i in range(args.n):
        await run_iteration(prompt, work_dir, i)

    print("\nAll iterations completed.")


if __name__ == "__main__":
    asyncio.run(main())
