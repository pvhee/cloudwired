---
title: "What happens to your data when you use Cutover AI"
date: "2026-05-20"
tags: ["AI", "Security", "Data Privacy", "AWS Bedrock", "Cutover"]
original_url: "https://www.cutover.com/blog/what-happens-to-your-data-when-you-use-cutover-ai"
---

Every enterprise security review of an AI feature starts in roughly the same place. We hear the same three questions across our customer base:

- Where is my data going?
- Is my data stored and if so, for how long?
- Is my data being used to train the model?

Those are the right questions to ask. They're also questions whose answers, in the AI vendor market right now, range from "encrypted at rest" hand-waving to cross-cloud routing diagrams no one actually reads.

So this post is the plain version: where your data goes when you use Cutover AI, what we keep, what we discard, and what we will never do with it.

If you only have thirty seconds, this is it:

**TL;DR.** Your runbook content, task details, and conversation history are sent to Cutover's AI service, processed inside AWS Bedrock in the AWS region you've selected, and discarded as soon as the response is returned. Nothing leaves the AWS network. We retain operational telemetry such as token counts, latency, and tool usage, but we never retain customer payloads. We do not fine-tune models on your data, and the foundation-model providers we use (Anthropic via AWS Bedrock) contractually cannot train on that data either. The AI runs with the calling user's permissions, audited like any other action on the platform.

The rest of this post walks through each of those claims.

## 1. Where your data goes

**Your data is processed inside AWS, in the geography you chose, and never leaves the AWS network.**

AI changes where your data goes. The common pattern in AI-enhanced products is the addition of a gateway that routes requests to one of several third-party models such as Anthropic, OpenAI, or Microsoft Copilot, which sit outside the vendor's trust boundary. Once those models start calling third-party tools to fetch context, the boundary effectively stops existing because the tool runs somewhere else, and your data goes wherever the tool happens to run.

Cutover's AI service sits on the same internal-only network path as the rest of the Cutover platform. It's reachable only by the tenants using it. It isn't exposed to the public internet. It calls AWS Bedrock in the AWS geography where your Cutover instance is configured.

- US instances are processed inside AWS US regions
- EU instances are processed inside AWS EU regions

This is a sovereignty guarantee, not a configuration default. EU customer data is never processed by a model running in a US region, and vice versa.

Bedrock invokes Anthropic's Claude foundation model as the primary, with AWS Titan and Nova for specific use cases, all inside the same AWS geography. The third-party model providers don't see the request; their weights run entirely on AWS infrastructure. Even when traffic moves between AWS services, it stays on the AWS backbone.

## 2. What we keep, what we discard

**We retain telemetry, not content. Token counts and latency, never prompts or outputs.**

The simplest answer is that we do not keep the data you use to prompt our AI service.

Runbook content, task details, file uploads, and conversation history are all processed in-flight and discarded once the response is returned. No databases, no caches, no logs. Each request lives in memory for the duration of a single call; then it is gone.

Requests are fully isolated from each other. There is no shared state, no cross-instance caching, and no warm context bleeding from one customer's session into another's.

We do retain operational telemetry such as token counts, model identifier, latency, tool-call counts, timestamps, and cost. We use this to monitor service health, catch regressions, and decide when to roll forward model versions.

That telemetry contains no prompts, no model outputs, no runbook contents, no task data, no API keys, and no file contents. It carries the workspace and request IDs needed to debug a single trace, and nothing more.

Every AI action is also recorded in the same audit trail as a human action because, as the next section explains, every AI action *is* a human action as far as the platform is concerned.

## 3. What the AI is allowed to see

**If you can't access a runbook through the UI, the AI can't access it either.**

Cutover AI does not have a back door into the Cutover core database. It calls the same public API that external developers use to integrate Cutover with their other tools, and it calls that API with the credentials of the user who invoked it.

The AI therefore inherits the calling user's permissions exactly. If a user cannot see a runbook through the UI, the AI cannot see it either.

Every read and every write the AI performs is authorized, validated, and audited like a human-initiated action because the platform genuinely cannot tell the difference.

This was a deliberate architectural choice, not an emergent property. The alternative would be privileged database access for the AI service, and that would have created a class of permission bugs we did not want to spend the next few years chasing.

## 4. What we never do with your data

**Your data is not used to train Anthropic's models, AWS's models, or ours.**

Two things:
1. We do not fine-tune models on your data
2. The foundation-model providers we use cannot train on it either

We use off-the-shelf models from AWS Bedrock, specifically Anthropic's Claude as primary, with AWS Titan for specific use cases. Bedrock's terms prohibit AWS and the third-party model providers it hosts from using customer inputs or outputs to train their models.

That commitment is contractual and is enforced at the AWS layer, not at the Cutover layer.

Inside Cutover, we get results through prompt engineering, multi-shot prompting, and retrieval-augmented generation (RAG) over data already in your instance. None of those techniques require or produce model weights derived from your data. And no cross-tenant signal flows anywhere: one customer's runbooks never inform another customer's responses.

## Summary

If you've read this far, you've read Cutover's position: we treat the AI service as a strictly bounded extension of the platform your team is already using. It has the same authentication, permissions, audit trail, AWS region, and enterprise commitments.

The AI only performs actions a human user could, but faster and without manual keystrokes. That's a deliberate boundary, and it's the one our customers' InfoSec reviewers tend to find most reassuring.

AI in the enterprise rarely fails because the model said something wrong. It fails because the perimeter wasn't drawn cleanly, the audit trail wasn't honest, or the retention story shifted. We've drawn the lines in places we can stand behind.

---

*Originally published on the [Cutover Blog](https://www.cutover.com/blog/what-happens-to-your-data-when-you-use-cutover-ai).*