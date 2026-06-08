---
title: "AI Native DevCon 2026 impressions"
date: "2026-06-04"
tags: ["AI", "Agentic AI", "DevCon", "Software Development", "Cutover"]
originalUrl: "https://www.cutover.com/blog/ai-native-devcon-2026-impressions"
---

Earlier this week I spent two days at [AI Native DevCon](https://tessl.io/devcon/) at The Brewery in London: a room full of people trying to work out what software development even is once agents do most of the typing. This post is my effort to distill those impressions.

## Skills are the new code

The thesis running through the conference: a new stack is forming where skills — reusable, versioned instructions for agents — are the new unit of software. The problem is we've recreated the early days of programming with none of the infrastructure. There are no good patterns yet for reusing or collaborating on skills, so the familiar stack is being rebuilt from scratch: static analysis, dynamic testing (evals on skills), security tooling, dependency management, observability.

Snyk's Liran Tal made the security gap concrete in the best-titled talk of the conference: "Your agent installed malware because a SKILL.md told it to." His framing: we were robbed of the security lessons npm taught us, and we're walking straight into the same trap. The [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) — private data + untrusted content + external comms — is the pattern to watch for in any agentic setup.

Tessl themselves pitched tooling to organise skills at team level. Useful ideas, though the pricing model was conspicuously vague — free to start, enterprise callouts everywhere — which makes it hard to bet on for private repos just yet.

## Harnesses and memory: the labs' view

Two talks from the big AI labs stood out. OpenAI's Ryan Ropopolo argued that a new set of constraints will dominate software development: human time, human and model attention, and the model context window. Harness engineering, in his framing, is context delivery — encoding your non-functional requirements into the harness rather than hoping the model infers them.

Anthropic's Lamis Mukta tackled the other half of the problem: agents don't learn. Intelligence doesn't compound — task 50 is the same as task 1. The progression from CLAUDE.md to memory tools to skills to agent-managed memory files is an attempt to fix that, including a "[dreaming](https://platform.claude.com/docs/en/managed-agents/dreams)" process that consolidates memory out of band. The best audience question of the conference: "at which point are we inventing databases from first principles again?"

## The enterprise transformation story

The most grounded talk came from ReCinq and Odevo, a 14,000-person property management company going AI native. Their starting point in 2025 looked like most enterprises: 30% of devs using AI, Copilot sprinkled around, a few lone Claude users. What worked was unfashionably human: in-person workshops (no laptops for the first half-day) to reduce fear and resistance, and training people on the failure modes of coding agents, not just the happy path. The jump from VS Code autocomplete to terminal agents is bigger than it looks, and people need help making it.

Two lines stuck with me. The warning: "if you are crap, AI will make you slower." (more commonly known as “Garbage in, garbage out”). And the measure of success: not throughput metrics, but "are you making bigger, bolder bets?" Their ambition — "everyone is a builder now" — is to extend their training programme beyond engineering to 13,000 non-developers.

## Zooming out

GitHub Next's Don Syme offered a useful polarity for the whole industry: individual productivity gains (where the hype is) versus team and SDLC continuity (undertalked, but where GitHub is placing its bet, with [agentic workflows](https://github.github.com/gh-aw/) and what they call CI/CD/CAI — "continuous AI"). Netlify's Dana Lawson added the design lens: we now need AX — agent experience — alongside UX and DX, and the new scarce resource is taste, judgment and architecture.

Thoughtworks' Birgitta Böckeler closed the conference with a clear-eyed look at where we actually are. Models are not magic, just math — and stateless math at that. She named the harness tax (Claude Code's is big, Codex's smaller) and the real costs beyond tokens: human energy, and what she called the flow crisis — humans becoming the congestion point in a system that generates code faster than we can review it. Her phrase "[cognitive surrender](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646)" — at which point do we stop caring and just accept everything? — is one I'll be reusing.

Two days, and the through-line was unmistakable: the typing is solved; everything around it — reuse, security, memory, review, taste? — is wide open.

That's where I'm spending my attention at [Cutover](https://www.cutover.com), where we're building these patterns into how enterprises run critical operations.

---

*Originally published on the [Cutover Blog](https://www.cutover.com/blog/ai-native-devcon-2026-impressions).*