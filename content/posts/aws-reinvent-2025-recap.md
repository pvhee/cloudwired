---
title: "AWS re:Invent 2025 impressions"
date: "2025-12-09"
---

AWS re:Invent has concluded, and as expected, the buzz around AI was inescapable. Amidst the flurry of announcements and general noise, I managed to attend some truly thought-provoking sessions. This post is my effort to distill those impressions.

AWS is positioning AI as a fundamental new building block—a new "piece of LEGO"—to join its core services. Simply put, any app can be  reduced to a combination of compute (eg Lambda), storage (eg S3), and database (eg DynamoDB). Now, LLM inference and its extension, agents, all housed within AWS Bedrock, are being added to this foundational layer. AWS excels at providing scalable and secure building blocks, and while this re:Invent may have seemed light on overall major launches, I think we’re just at the beginning of the journey of AI on AWS.


### Accelerating Incident Response through AIOps

[The session on AIOps](https://www.youtube.com/watch?v=C4gIguFkxnE) underscored the principle that data and context are absolutely key for AI to provide any valuable insights. To that end, AWS seems to be positioning CloudWatch as the central home for all operational data, specifically by adopting OpenTelemetry standards and enabling ingestion of logs from virtually anywhere, including third-party sources.

The presenters used the analogy of a Formula 1 "pit crew" to explain their AIOps vision:

- **Tire Gunners**: Represented by CloudWatch features for rapid changes and instant queries, managing data ingestion from all disparate sources.
- **Jack Operators**: Referencing the MCP Server, which now allows for systems to be adjusted without stopping them.
- **Strategist**: Personified by CloudWatch Investigations, an agentic system that uses service topology to investigate issues, propose root cause hypotheses, and suggest runbook actions, with the ability to add user-provided "facts."

Ultimately, the long-term vision —the "north star" — is the **AWS DevOps Agent**. This "frontier agent" is designed to be always-on, constantly looking for anomalies, and is intended to eventually replace the previous three roles to automate incident resolution.

### [3P Open Models Customers Roundtable](https://aws-experience.com/amer/smb/e/bdd0d/3p-open-models-customer-roundtable)

This interesting conversation with folks from Hugging Face, Fireworks, Pinterest and EXL around open-weighted AI models highlighted their rapid ascent and adoption in the enterprise. With the launch of Deepseek earlier this year, a new class of open-weighted models is now rapidly on the rise and taking up competition with the established proprietary models. According to Hugging Face's CPO, a new "Deepseek moment" is now happening every week,

One advantage of deploying open-weighted models is their significant advantage is passing legal and compliance hurdles, particularly in highly regulated industries. Mistral in the EU and Llama in the US are getting real usage in this sector.

From a performance standpoint, one consensus was that training your own model consistently beats a RAG (Retrieval-Augmented Generation) approach. Despite this, the most significant continuing challenge is hallucination in highly regulated environments. The new engineering frontier is the challenge of orchestrating LLMs into agentic systems. This often results in a hybrid architecture where a closed-source LLM acts as the orchestrator, fanning out tasks to agents powered by open models.


### J.P. Morgan Presents ACQUIRED at AWS re:Invent

This discussion featured high-level insights and patterns on the future of AI from various perspectives:


- Netflix (Greg Peters): AI is primarily a software architecture question for them, with the agentic model at the center of orchestration for tasks like personalization. They are in the process of transitioning from their previous machine learning architecture ("roman riding") and famously use "Chaos Kong" (taking out entire availability zones) as part of their standard operating procedure (SOP) to ensure resilience.
- Perplexity (Aravind Srinivas): As an "AI native" company, they stated that "websearch is dead." Their focus is on building an answer engine, not foundational models, emphasizing a "train of thought" interaction design. They found that building a model router and post-training open models for brevity and ground-truth referencing is a capital-efficient path to closing the gap with proprietary models.
- AWS (Matt Garman): Interestingly, Matt acknowledged that nobody at AWS saw the scale of the AI explosion coming after the ChatGPT moment in 2022. He reiterated that inference via Bedrock is a major business and that AI is the first truly cloud-native evolution—it can't be done effectively off-cloud today. He emphasized that frontier agents are a major AWS focus, but conceded that agent management—the difficulty of knowing what a deployed agent is doing, or "running blind"—is still a completely unsolved problem. The conversation on agents in the next year will shift to how to deploy them for high-value tasks like processing insurance claims. Organizationally, he noted a change from struggling to scale with Senior Technical Engineers (STEs) years ago to now finding that smaller teams are doing more, and the biggest constraint is no longer scaling, but having good ideas.


### Werner's Keynote: The Renaissance Developer

Werner Vogels’ address was an ode to the developer, declaring "The end of the developer?" is not here, but rather, the "renaissance developer" must emerge. This new developer sees AI purely as a tool and must possess four core qualities: Curiosity, Systems-thinking, Communication, and Ownership of the software, plus a fifth: the need to be a Polymath with knowledge that spans beyond a single deep domain.

He highlighted key challenges in this new AI-driven world:
- Verification Debt: The issue of code being produced faster than it can be comprehended, which is essential to manage.
- Hallucination and Overengineering: These are rife when code is not grounded in reality, and the solution is progress through spec-driven development, automated reasoning, and improving CI/automated testing pipelines.

Vogels stressed that "Vibe coding without human review is gambling," (with a little nod to those wanting to do gambling better go to the casinos..) emphasizing the importance of mechanisms over good intentions. The most critical mechanism remains the human-to-human code review, where assumptions and intent meet the code. Finally, he encouraged the development of T-shaped developers—wide breadth of knowledge with deep understanding—and urged teams to keep broadening that knowledge base.

