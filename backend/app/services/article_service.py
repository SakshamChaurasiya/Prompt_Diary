"""
Article service — business logic for article operations.

Queries Supabase PostgreSQL for articles data.
Falls back to mock data if Supabase is not configured.
"""

from typing import Optional
from app.core.config import settings

# ---------------------------------------------------------------------------
# Supabase-powered functions
# ---------------------------------------------------------------------------


def _get_supabase():
    """Get the Supabase client, or None if not configured."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    try:
        from app.core.supabase_client import get_supabase_admin
        return get_supabase_admin()
    except Exception:
        return None


def get_all_articles(category: Optional[str] = None, difficulty: Optional[str] = None) -> dict:
    """Get all published articles, optionally filtered."""
    supabase = _get_supabase()

    if supabase:
        try:
            query = supabase.table("articles").select("*").eq("published", True)
            if category:
                query = query.eq("category", category)
            if difficulty:
                query = query.eq("difficulty", difficulty)
            query = query.order("created_at", desc=True)
            result = query.execute()
            return {
                "articles": result.data or [],
                "total": len(result.data or []),
            }
        except Exception as e:
            print(f"[ArticleService] Supabase query failed, using mock: {e}")

    # Fallback to mock data
    articles = MOCK_ARTICLES.copy()
    if category:
        articles = [a for a in articles if a["category"] == category]
    if difficulty:
        articles = [a for a in articles if a["difficulty"] == difficulty]
    return {
        "articles": articles,
        "total": len(articles),
    }


def get_article_by_id(article_id: str) -> Optional[dict]:
    """Get a single article by ID."""
    supabase = _get_supabase()

    if supabase:
        try:
            result = supabase.table("articles").select("*").eq("id", article_id).single().execute()
            return result.data
        except Exception:
            pass

    for article in MOCK_ARTICLES:
        if article["id"] == article_id:
            return article
    return None


def get_article_by_slug(slug: str) -> Optional[dict]:
    """Get a single article by slug."""
    supabase = _get_supabase()

    if supabase:
        try:
            result = supabase.table("articles").select("*").eq("slug", slug).single().execute()
            return result.data
        except Exception:
            pass

    for article in MOCK_ARTICLES:
        if article["slug"] == slug:
            return article
    return None


# ---------------------------------------------------------------------------
# Mock data (fallback when Supabase tables don't exist yet)
# ---------------------------------------------------------------------------

MOCK_ARTICLES = [
    {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "title": "Introduction to Prompt Engineering",
        "slug": "intro-to-prompt-engineering",
        "content": """# Introduction to Prompt Engineering

Prompt engineering is the art and science of crafting effective prompts to get the best results from Large Language Models (LLMs).

## What is a Prompt?

A prompt is the input text you provide to an AI model to get a desired output. It can be a question, instruction, or context that guides the model's response.

## Why Does It Matter?

The quality of your prompt directly affects the quality of the AI's response. A well-crafted prompt can:

- **Improve accuracy** — Get more precise and relevant answers
- **Save time** — Reduce the need for follow-up queries
- **Unlock capabilities** — Access advanced model features
- **Reduce costs** — Fewer tokens needed for good results

## Key Principles

1. **Be Specific** — Clearly state what you want
2. **Provide Context** — Give the model relevant background information
3. **Set the Format** — Specify how you want the output structured
4. **Use Examples** — Show the model what good output looks like

## Getting Started

The best way to learn prompt engineering is through practice. Start with simple prompts and gradually increase complexity as you understand how models respond to different inputs.
""",
        "excerpt": "Learn the fundamentals of prompt engineering and why it matters in the age of AI.",
        "category": "fundamentals",
        "difficulty": "beginner",
        "author_id": None,
        "tags": ["prompt-engineering", "basics", "llm"],
        "published": True,
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
    },
    {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "title": "Zero-Shot vs Few-Shot Prompting",
        "slug": "zero-shot-vs-few-shot",
        "content": """# Zero-Shot vs Few-Shot Prompting

Understanding the difference between zero-shot and few-shot prompting is fundamental to effective prompt engineering.

## Zero-Shot Prompting

Zero-shot prompting means asking the model to perform a task **without any examples**. You rely purely on the model's pre-trained knowledge.

**Example:**
```
Classify the sentiment of this review: "This product is amazing!"
```

## Few-Shot Prompting

Few-shot prompting provides **examples** of the desired input-output pairs before the actual task.

**Example:**
```
Classify the sentiment:
"I love this!" → Positive
"This is terrible" → Negative
"It's okay" → Neutral

"This product is amazing!" →
```

## When to Use Which?

| Approach | Best For | Limitations |
|----------|----------|-------------|
| Zero-Shot | Simple, well-defined tasks | May lack precision |
| Few-Shot | Complex or nuanced tasks | Uses more tokens |

## Best Practices

- Start with zero-shot and add examples only if needed
- Use 2-5 examples for few-shot (more isn't always better)
- Ensure examples are diverse and representative
""",
        "excerpt": "Master the two foundational prompting techniques that every AI engineer needs to know.",
        "category": "techniques",
        "difficulty": "beginner",
        "author_id": None,
        "tags": ["zero-shot", "few-shot", "techniques"],
        "published": True,
        "created_at": "2025-01-15T00:00:00Z",
        "updated_at": "2025-01-15T00:00:00Z",
    },
    {
        "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "title": "Chain-of-Thought Prompting",
        "slug": "chain-of-thought-prompting",
        "content": """# Chain-of-Thought Prompting

Chain-of-Thought (CoT) prompting encourages the model to break down complex problems into intermediate reasoning steps.

## The Core Idea

Instead of asking for a direct answer, you prompt the model to "think step by step." This dramatically improves performance on:

- Mathematical reasoning
- Logic puzzles
- Multi-step problems
- Complex analysis

## Example

**Without CoT:**
```
If a store has 23 apples and receives 3 boxes of 12 apples each, how many apples total?
```

**With CoT:**
```
If a store has 23 apples and receives 3 boxes of 12 apples each, how many apples total? Let's think step by step.
```

The model will now show its reasoning:
1. Starting apples: 23
2. Apples per box: 12
3. Number of boxes: 3
4. New apples: 12 × 3 = 36
5. Total: 23 + 36 = 59

## Variants

- **Zero-Shot CoT**: Just add "Let's think step by step"
- **Manual CoT**: Provide worked examples with reasoning
- **Self-Consistency**: Generate multiple CoT paths and vote
""",
        "excerpt": "Learn how Chain-of-Thought prompting unlocks advanced reasoning in AI models.",
        "category": "techniques",
        "difficulty": "intermediate",
        "author_id": None,
        "tags": ["chain-of-thought", "reasoning", "advanced-techniques"],
        "published": True,
        "created_at": "2025-02-01T00:00:00Z",
        "updated_at": "2025-02-01T00:00:00Z",
    },
    {
        "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "title": "RAG Architecture Deep Dive",
        "slug": "rag-architecture-deep-dive",
        "content": """# RAG Architecture Deep Dive

Retrieval-Augmented Generation (RAG) is a hybrid architecture that combines information retrieval with text generation.

## Why RAG?

LLMs have a knowledge cutoff date and can hallucinate. RAG solves this by:
- Grounding responses in real, up-to-date data
- Reducing hallucinations
- Allowing domain-specific knowledge

## Architecture

```
User Query → Embedding → Vector Search → Retrieved Context → LLM → Response
```

## Components

1. **Document Store**: Your knowledge base (PDFs, docs, databases)
2. **Embedding Model**: Converts text to vectors
3. **Vector Database**: Stores and searches embeddings
4. **Retriever**: Finds relevant documents
5. **Generator**: LLM that produces the final answer

## Implementation Steps

1. Chunk your documents into manageable pieces
2. Generate embeddings for each chunk
3. Store embeddings in a vector database
4. At query time, embed the user's question
5. Retrieve the most similar chunks
6. Feed retrieved context + question to the LLM
7. Return the generated answer
""",
        "excerpt": "Understand the RAG architecture pattern used in production AI systems.",
        "category": "architecture",
        "difficulty": "advanced",
        "author_id": None,
        "tags": ["rag", "architecture", "retrieval", "vector-database"],
        "published": True,
        "created_at": "2025-02-15T00:00:00Z",
        "updated_at": "2025-02-15T00:00:00Z",
    },
    {
        "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
        "title": "Building AI Agent Systems",
        "slug": "building-ai-agent-systems",
        "content": """# Building AI Agent Systems

AI agents are autonomous systems that can plan, reason, and take actions to accomplish tasks.

## What is an AI Agent?

An AI agent is an LLM-powered system that can:
- Understand a goal
- Break it into sub-tasks
- Use tools to accomplish each task
- Reflect on results and iterate

## Agent Architecture

```
Goal → Planning → Tool Selection → Execution → Observation → Reflection → (loop)
```

## Core Components

### 1. Planning Module
The agent breaks down complex tasks into actionable steps.

### 2. Tool Use
Agents can call external tools:
- Web search
- Code execution
- Database queries
- API calls

### 3. Memory
- **Short-term**: Current conversation context
- **Long-term**: Persistent knowledge store

### 4. Reflection
The agent evaluates its own outputs and decides whether to iterate or conclude.

## Popular Frameworks

- LangChain Agents
- AutoGPT
- CrewAI
- Microsoft AutoGen
""",
        "excerpt": "Learn how to design and build autonomous AI agent systems.",
        "category": "architecture",
        "difficulty": "advanced",
        "author_id": None,
        "tags": ["agents", "architecture", "autonomous-ai"],
        "published": True,
        "created_at": "2025-03-01T00:00:00Z",
        "updated_at": "2025-03-01T00:00:00Z",
    },
]
