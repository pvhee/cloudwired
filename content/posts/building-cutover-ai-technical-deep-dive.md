---
title: "Building Cutover's AI service: A technical deep dive"
date: "2026-01-21"
tags: ["AI", "AWS", "Pydantic AI", "Architecture"]
original_url: "https://www.cutover.com/blog/building-cutover-ai-technical-deep-dive"
---

Behind every AI feature in Cutover sits a dedicated AI Service that does the heavy lifting. It powers our ability to create runbooks from static documents and summarize runbooks so everyone knows the intent behind them, and our in-runbook [AI Assistant](https://www.cutover.com/ai-enabled-runbooks) that offers conversational guidance exactly where teams need it.

The service is designed to let us build and ship AI agents safely and confidently. With clearly separated development, staging, and production environments, versioned releases, and automated testing pipelines, we can iterate quickly without sacrificing reliability or control.

At its core, our AI Service does two things:
- Defines, orchestrates and runs AI agents using [Pydantic AI](https://ai.pydantic.dev/) for structured, type-safe outputs
- Connects AI models (via [AWS Bedrock](https://aws.amazon.com/bedrock/)) to Cutover data via tools that read and manipulate runbooks, tasks, and other objects

We've designed this architecture with flexibility in mind, not just for our own AI features, but to support customers building and investing in their own agents that work with Cutover's extensive data and orchestration capabilities.

## The architecture that supports Cutover AI

We made a key architectural decision early on: all business logic lives behind our Public API. The AI Service doesn't access Cutover's database directly, rather it consumes the same Public API that our customers use for integrating their applications to Cutover. This means:

- AI Agents operate with the exact permissions you grant them (via the user's API key)
- Every AI action goes through the same validation and audit trail as human actions. AI actions are thereby audited in the same exact way as human actions.
- New AI capabilities drive Public API improvements that benefit everyone. This is particularly helpful for newer product lines such as Cutover Respond, where building AI functionality adds new capabilities to the Public API as well.

## Security and data isolation

Enterprise AI adoption requires confidence that sensitive data remains protected. Here's how we designed the AI Service with security as a core principle.

### Data handling
- **No data persistence**: The AI Service is a passthrough, meaning it doesn't store customer data. Runbook content, task details, and conversation history are processed in-flight but never persisted. This is important as this is a shared service, much like we have designed and implemented the Public API.
- **Permission inheritance**: AI Agents operate with the exact permissions of the calling user. If you can't access a runbook through the UI, the AI can't access it either.
- **Request isolation**: Each request is completely independent. So there is no shared state, no cross-tenant caching.
- **Audit trail**: Every AI operation is logged with full traceability, while sensitive data (API keys, prompts, file contents etc) is never stored in trace logs.

### Model agnostic
We chose AWS Bedrock as our current provider for enterprise-grade requirements, so there is no training on customer data, and access to Anthropic's Claude, our model of choice, is through a unified API. That said, our model layer is abstracted through [Pydantic AI](https://ai.pydantic.dev/), meaning the underlying provider can be configured without rewriting the AI service. The architecture supports alternative providers or self-hosted models for organizations with specific requirements.

## How we built Cutover AI: Technical patterns worth sharing

### Pydantic AI for validating LLM output
All AI Agent outputs produce Pydantic models, not raw text. For example, when Cutover AI Create generates a runbook the model is constrained to produce valid, typed outputs.

No regex parsing, no "the AI returned something weird" errors. This is by far the hardest part of building AI Agents as they are non-deterministic by nature and for us, Pydantic AI does the heavy lifting, including automatic retries when outputs don't match the schema.

### Dynamic Workflow Orchestration
Rather than hardcoding AI workflows, we store them in DynamoDB.

This lets us tune prompts without code deploys, A/B test different approaches, run different prompt versions for different clients, and add new workflow steps through configuration alone.
Each step is essentially its own agent with a dedicated prompt and output schema, and steps can run in parallel. For example, in our runbook creation process, one agent suggests task durations while another assigns task types and another recommends streams. Each produces a patch that gets merged into the base result.

### Context-aware tooling
AI Agents need different capabilities depending on what they're doing. Pydantic AI supports both native tool definitions and direct MCP server integration, giving us flexibility in how we expose Cutover capabilities to AI Agents.
Today, our AI Assistant has tools for reading runbooks, managing tasks, querying activity logs, and more. Going forward, we're building toward context-aware tool selection, so incident runbooks might include integrations with monitoring and alerting tools, while workspace-level analysis could include RAG search over historical data.

### Bring your own agents
The AI Service powers Cutover's built-in AI features, but we see Cutover becoming the place where humans and agents orchestrate work together. Customers building their own agents can connect via our [MCP server](https://github.com/gocutover/cutover-mcp-public), giving them full ownership of their agent logic (how they are built, where they are hosted, how permissions are handled) while leveraging Cutover's data and orchestration capabilities. We're designing the hand-off points and integration patterns to make this seamless, similar to how we've built runbook integrations today.

## What's next
The AI Service is just the first step in Cutover's agentic future. We see a world where AI Agents become participants in Cutover runbooks alongside humans. Where they are investigating incidents, executing routine operations, and learning from thousands of runbook executions to recommend next best actions and updating master templates.

Cutover is already the leading orchestration layer for complex work. Making it AI Agent ready means agents can create, execute, and learn from our runbooks just like humans do today.

---

*Originally published on the [Cutover Blog](https://www.cutover.com/blog/building-cutover-ai-technical-deep-dive).*
