---
title: "AWS re:Invent 2025 impressions"
date: "2025-12-23"
---

## A new LEGO block joins the builder's toolkit

AWS re:Invent has concluded, and as expected, the buzz around AI was inescapable. Amidst the flurry of announcements and general noise, I managed to attend some truly thought-provoking sessions. This post is my effort to distill those impressions.

AWS is positioning AI as a fundamental new building block—a new "piece of LEGO"—to join its core services. Simply put, any app can be reduced to a combination of compute (e.g., Lambda), storage (e.g., S3), and database (e.g., DynamoDB). Now, LLM inference and its extension, agents—all housed within AWS Bedrock—are being added to this foundational layer. AWS excels at providing scalable and secure building blocks, and while this re:Invent may have seemed light on major launches, the message of AI being added as a new building block resonated with me, and I think we're just at the beginning of AI's potential on AWS.


### Accelerating Incident Response through AIOps

[The session on AIOps](https://www.youtube.com/watch?v=C4gIguFkxnE) underscored the principle that **data and context are absolutely key** for AI to provide any valuable insights. To that end, AWS seems to be positioning **CloudWatch as the central home for all operational data**, specifically by adopting **OpenTelemetry standards** and enabling ingestion of logs from virtually anywhere, including third-party sources.

The presenters used the analogy of a Formula 1 "pit crew" to explain their AIOps vision:

- **Tire Gunners**: Represented by CloudWatch features for rapid changes and instant queries, managing data ingestion from all disparate sources.
- **Jack Operators**: Referencing the MCP Server, which now allows for systems to be adjusted without stopping them.
- **Strategist**: Personified by CloudWatch Investigations, an agentic system that uses service topology to investigate issues, propose root cause hypotheses, and suggest runbook actions, with the ability to add user-provided "facts."

Ultimately, the long-term vision—the "north star"—is the **AWS DevOps Agent**. This "frontier agent" is designed to be always-on, constantly scanning for anomalies, and is intended to eventually subsume all three roles to fully automate incident resolution.

### [3P Open Models Customers Roundtable](https://aws-experience.com/amer/smb/e/bdd0d/3p-open-models-customer-roundtable)

This conversation with folks from Hugging Face, Fireworks, Pinterest, and EXL highlighted the rapid ascent of open-weighted AI models in the enterprise. With the launch of DeepSeek earlier this year, a new class of open-weighted models is gaining ground against established proprietary offerings. According to Hugging Face's CPO, a new "DeepSeek moment" is now happening every week.

One key advantage of open-weighted models is their ability to clear legal and compliance hurdles, particularly in highly regulated industries. Mistral in the EU and Llama in the US are seeing real traction in this space.

From a performance standpoint, the consensus was that fine-tuning your own model consistently outperforms a RAG (Retrieval-Augmented Generation) approach. That said, hallucination remains the most significant challenge in regulated environments.

Finally, the new engineering frontier is orchestrating LLMs into agentic systems—a theme echoed by Matt Garman in a later session. This often results in a hybrid architecture where a closed-source LLM acts as the orchestrator, fanning out tasks to agents powered by open models.


### J.P. Morgan Presents ACQUIRED at AWS re:Invent

This panel featured high-level insights on the future of AI from several perspectives:

- **Netflix (Greg Peters)**: For Netflix, AI is primarily a software architecture question, with the agentic model at the center of orchestration for tasks like personalization. They're currently "roman riding"—transitioning from their previous ML architecture to this new agentic paradigm.
- **Perplexity (Aravind Srinivas)**: As an "AI native" company, Srinivas declared that "web search is dead." Their focus is on building an answer engine, not foundational models, and they've been innovating along the way (including pioneering the "chain of thought" interaction design). They found that building a model router and post-training open models for brevity and ground-truth referencing is a capital-efficient path to closing the gap with proprietary models.
- **AWS (Matt Garman)**: Interestingly, Matt acknowledged that nobody at AWS saw the scale of the AI explosion coming until the ChatGPT moment in 2022. He claimed that inference via Bedrock is now a major business and that AI is the first truly cloud-native evolution—it simply can't be done effectively off-cloud today. He emphasized that frontier agents are a major AWS focus, but conceded that agent management—the difficulty of knowing what a deployed agent is actually doing, or "running blind"—remains completely unsolved. He predicts the conversation around agents will shift toward deploying them for high-value tasks like processing insurance claims. Organizationally, he noted that years ago AWS struggled to scale with Senior Technical Engineers (STEs), but now smaller teams are accomplishing more—the biggest constraint is no longer scaling, but having good ideas.


### Werner's Keynote: The Renaissance Developer

Werner Vogels' address was part pep talk, part call to action. His thesis: "The end of the developer?" is not here—instead, the "renaissance developer" must emerge. This new developer sees AI purely as a tool and must cultivate core qualities: Curiosity, Systems-thinking, Communication, and Ownership of the software, plus a fifth: being a Polymath with knowledge that spans beyond a single deep domain.

He highlighted key challenges in this AI-driven world:

- **Verification Debt**: Code is being produced faster than it can be comprehended—managing this debt is essential.
- **Hallucination and Overengineering**: Both run rampant when code isn't grounded in reality. The antidote lies in spec-driven development, automated reasoning, and robust CI/testing pipelines and AWS is betting hard on Kiro, their own spec-driven AI editor.

Vogels stressed that "vibe coding without human review is gambling" (with a cheeky nod to those wanting to gamble to head to the casinos around the corner). He emphasized mechanisms over good intentions, with human-to-human code review remaining the most critical—the place where assumptions and intent meet code. He also encouraged cultivating T-shaped developers: wide breadth of knowledge with deep expertise. He left us with this closing thought:

> Your best work is hidden. Have pride in your work, the best developer does their best work when nobody is watching.

All in all, I enjoyed attending re:Invent 2025. While the AI buzz was intense — and much of it hype-cycle noise rather than substance — the signal underneath is clear: AWS is adding a powerful new LEGO block to our builder's toolkit. Agents have arrived, and figuring out how to wield them effectively will define the next chapter for cloud-native development.

---

*Thanks to my employer [Cutover](https://www.cutover.com)—AI-powered runbooks built for the enterprise to de-risk mission-critical IT events like disaster recovery, major incidents, and cloud migrations—for sending me to this year's re:Invent. For more on the resilience angle, check out the [Cutover team's recap on resilience trends](https://www.cutover.com/blog/aws-re-invent-2025-recap-on-resilience-trends).*