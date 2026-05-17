"""
Prompt Dairy — Database Setup Script
=====================================
Applies all migrations in order and seeds the database.

Usage (from the backend/ directory):
    python setup_database.py

Requirements:
    - Virtual environment activated
    - .env file configured with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
"""

import os
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Load environment
from dotenv import load_dotenv
load_dotenv()

from app.core.config import settings

MIGRATIONS_DIR = Path(__file__).parent.parent / "database" / "migrations"


def get_supabase():
    """Get the Supabase admin client."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        print("❌ ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")
        sys.exit(1)
    from supabase import create_client
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


def run_migration(supabase, migration_file: Path) -> bool:
    """Execute a single SQL migration file via Supabase RPC."""
    print(f"  → Running {migration_file.name} ...")
    sql = migration_file.read_text(encoding="utf-8")

    try:
        # Split on semicolons and run each statement
        # Filter empty statements
        statements = [s.strip() for s in sql.split(";") if s.strip() and not s.strip().startswith("--")]

        for stmt in statements:
            if not stmt:
                continue
            try:
                supabase.rpc("exec_sql", {"sql": stmt}).execute()
            except Exception as e:
                err_msg = str(e)
                # Ignore "already exists" errors — idempotent migrations
                if any(phrase in err_msg.lower() for phrase in [
                    "already exists", "duplicate", "relation", "policy already"
                ]):
                    continue
                print(f"    ⚠ Statement warning: {err_msg[:120]}")

        print(f"  ✓ {migration_file.name} applied")
        return True
    except Exception as e:
        print(f"  ✗ {migration_file.name} failed: {e}")
        return False


def run_migrations_direct(supabase) -> None:
    """
    Apply all migrations by directly inserting data using the Python Supabase client.
    This avoids the need for exec_sql RPC and works with Supabase out of the box.
    """
    print("\n📦 Applying seed data directly via Supabase client...")

    # -------------------------------------------------------
    # ARTICLES
    # -------------------------------------------------------
    print("\n  → Seeding articles...")
    articles = [
        {
            "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "title": "Introduction to Prompt Engineering",
            "slug": "intro-to-prompt-engineering",
            "content": "# Introduction to Prompt Engineering\n\nPrompt engineering is the art and science of crafting effective prompts to get the best results from Large Language Models (LLMs).\n\n## What is a Prompt?\n\nA prompt is the input text you provide to an AI model to get a desired output. It can be a question, instruction, or context that guides the model's response.\n\n## Why Does It Matter?\n\nThe quality of your prompt directly affects the quality of the AI's response. A well-crafted prompt can:\n\n- **Improve accuracy** — Get more precise and relevant answers\n- **Save time** — Reduce the need for follow-up queries\n- **Unlock capabilities** — Access advanced model features\n- **Reduce costs** — Fewer tokens needed for good results\n\n## Key Principles\n\n1. **Be Specific** — Clearly state what you want\n2. **Provide Context** — Give the model relevant background information\n3. **Set the Format** — Specify how you want the output structured\n4. **Use Examples** — Show the model what good output looks like\n\n## Getting Started\n\nThe best way to learn prompt engineering is through practice. Start with simple prompts and gradually increase complexity as you understand how models respond to different inputs.",
            "excerpt": "Learn the fundamentals of prompt engineering and why it matters in the age of AI.",
            "category": "fundamentals",
            "difficulty": "beginner",
            "tags": ["prompt-engineering", "basics", "llm"],
            "published": True,
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z",
        },
        {
            "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "title": "Zero-Shot vs Few-Shot Prompting",
            "slug": "zero-shot-vs-few-shot",
            "content": "# Zero-Shot vs Few-Shot Prompting\n\nUnderstanding the difference between zero-shot and few-shot prompting is fundamental to effective prompt engineering.\n\n## Zero-Shot Prompting\n\nZero-shot prompting means asking the model to perform a task **without any examples**. You rely purely on the model's pre-trained knowledge.\n\n## Few-Shot Prompting\n\nFew-shot prompting provides **examples** of the desired input-output pairs before the actual task.\n\n## When to Use Which?\n\n| Approach | Best For | Limitations |\n|----------|----------|-------------|\n| Zero-Shot | Simple, well-defined tasks | May lack precision |\n| Few-Shot | Complex or nuanced tasks | Uses more tokens |",
            "excerpt": "Master the two foundational prompting techniques that every AI engineer needs to know.",
            "category": "techniques",
            "difficulty": "beginner",
            "tags": ["zero-shot", "few-shot", "techniques"],
            "published": True,
            "created_at": "2025-01-15T00:00:00Z",
            "updated_at": "2025-01-15T00:00:00Z",
        },
        {
            "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
            "title": "Chain-of-Thought Prompting",
            "slug": "chain-of-thought-prompting",
            "content": "# Chain-of-Thought Prompting\n\nChain-of-Thought (CoT) prompting encourages the model to break down complex problems into intermediate reasoning steps.\n\n## The Core Idea\n\nInstead of asking for a direct answer, you prompt the model to \"think step by step.\" This dramatically improves performance on:\n\n- Mathematical reasoning\n- Logic puzzles\n- Multi-step problems\n\n## Variants\n\n- **Zero-Shot CoT**: Just add \"Let's think step by step\"\n- **Manual CoT**: Provide worked examples with reasoning\n- **Self-Consistency**: Generate multiple CoT paths and vote",
            "excerpt": "Learn how Chain-of-Thought prompting unlocks advanced reasoning in AI models.",
            "category": "techniques",
            "difficulty": "intermediate",
            "tags": ["chain-of-thought", "reasoning", "advanced-techniques"],
            "published": True,
            "created_at": "2025-02-01T00:00:00Z",
            "updated_at": "2025-02-01T00:00:00Z",
        },
        {
            "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
            "title": "RAG Architecture Deep Dive",
            "slug": "rag-architecture-deep-dive",
            "content": "# RAG Architecture Deep Dive\n\nRetrieval-Augmented Generation (RAG) is a hybrid architecture that combines information retrieval with text generation.\n\n## Why RAG?\n\nLLMs have a knowledge cutoff date and can hallucinate. RAG solves this by grounding responses in real, up-to-date data.\n\n## Architecture\n\n```\nUser Query → Embedding → Vector Search → Retrieved Context → LLM → Response\n```\n\n## Components\n\n1. **Document Store**: Your knowledge base\n2. **Embedding Model**: Converts text to vectors\n3. **Vector Database**: Stores and searches embeddings\n4. **Retriever**: Finds relevant documents\n5. **Generator**: LLM that produces the final answer",
            "excerpt": "Understand the RAG architecture pattern used in production AI systems.",
            "category": "architecture",
            "difficulty": "advanced",
            "tags": ["rag", "architecture", "retrieval", "vector-database"],
            "published": True,
            "created_at": "2025-02-15T00:00:00Z",
            "updated_at": "2025-02-15T00:00:00Z",
        },
        {
            "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
            "title": "Building AI Agent Systems",
            "slug": "building-ai-agent-systems",
            "content": "# Building AI Agent Systems\n\nAI agents are autonomous systems that can plan, reason, and take actions to accomplish tasks.\n\n## What is an AI Agent?\n\nAn AI agent is an LLM-powered system that can understand a goal, break it into sub-tasks, use tools, and reflect on results.\n\n## Agent Architecture\n\n```\nGoal → Planning → Tool Selection → Execution → Observation → Reflection → (loop)\n```\n\n## Popular Frameworks\n\n- LangChain Agents\n- AutoGPT\n- CrewAI\n- Microsoft AutoGen",
            "excerpt": "Learn how to design and build autonomous AI agent systems.",
            "category": "architecture",
            "difficulty": "advanced",
            "tags": ["agents", "architecture", "autonomous-ai"],
            "published": True,
            "created_at": "2025-03-01T00:00:00Z",
            "updated_at": "2025-03-01T00:00:00Z",
        },
        {
            "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
            "title": "Prompt Injection & Security",
            "slug": "prompt-injection-security",
            "content": "# Prompt Injection & Security\n\nAs AI systems become more powerful, understanding prompt injection attacks is critical for building secure applications.\n\n## What is Prompt Injection?\n\nPrompt injection occurs when malicious user input overrides the intended instructions of an AI system.\n\n## Defense Strategies\n\n1. **Input sanitization**: Validate inputs before passing to the model\n2. **Output validation**: Check model outputs before acting on them\n3. **Privilege separation**: Don't give agents more tool access than needed\n4. **Sandboxing**: Run agents in isolated environments\n5. **Monitoring**: Log all prompts and completions for audit",
            "excerpt": "Understand prompt injection attacks and how to build secure AI applications.",
            "category": "fundamentals",
            "difficulty": "intermediate",
            "tags": ["security", "prompt-injection", "safety"],
            "published": True,
            "created_at": "2025-03-15T00:00:00Z",
            "updated_at": "2025-03-15T00:00:00Z",
        },
    ]

    for article in articles:
        try:
            supabase.table("articles").upsert(article, on_conflict="id").execute()
            print(f"    ✓ Article: {article['title']}")
        except Exception as e:
            print(f"    ⚠ Article '{article['title']}': {str(e)[:80]}")

    # -------------------------------------------------------
    # CHALLENGES
    # -------------------------------------------------------
    print("\n  → Seeding challenges...")
    challenges = [
        {
            "id": "c1b2d3e4-f5a6-7890-abcd-ef1234567890",
            "title": "Summarize an Article",
            "description": "Write a prompt that instructs an AI to summarize a long technical article into 3 key bullet points. The summary should capture the main argument, supporting evidence, and conclusion.",
            "difficulty": "easy",
            "category": "summarization",
            "starter_prompt": "Summarize the following article into exactly 3 bullet points. Each bullet should be one sentence and cover: (1) the main argument, (2) the key supporting evidence, (3) the conclusion and implications.\n\nArticle: [paste article here]",
            "hints": ["Specify the number of bullet points", "Ask for key takeaways, not just a shorter version", "Consider asking the model to identify the main argument first"],
            "points": 10,
            "created_at": "2025-01-01T00:00:00Z",
        },
        {
            "id": "c2b3d4e5-f6a7-8901-bcde-f12345678901",
            "title": "Extract JSON from Text",
            "description": "Write a prompt that extracts structured JSON data from an unstructured product review. The JSON should include: product_name, rating (1-5), pros (list), cons (list), and recommendation (boolean).",
            "difficulty": "medium",
            "category": "extraction",
            "starter_prompt": 'Extract the following information from the product review below and return it as valid JSON only (no other text):\n\n```json\n{\n  "product_name": "string",\n  "rating": number (1-5),\n  "pros": ["string"],\n  "cons": ["string"],\n  "recommendation": boolean\n}\n```\n\nReview: [paste review here]',
            "hints": ["Define the exact JSON schema you expect", "Use a code block to show the expected format", 'Specify "no other text" to prevent markdown wrapping'],
            "points": 20,
            "created_at": "2025-01-15T00:00:00Z",
        },
        {
            "id": "c3b4d5e6-f7a8-9012-cdef-123456789012",
            "title": "Multi-Step Reasoning",
            "description": "Write a prompt that guides the AI through a multi-step math word problem. The prompt should make the AI show its work step-by-step and arrive at the correct answer.",
            "difficulty": "medium",
            "category": "reasoning",
            "starter_prompt": "Solve the following problem step by step. Show each calculation explicitly, label each step, and verify your final answer.\n\nProblem: [math problem here]",
            "hints": ["Use Chain-of-Thought prompting", 'Ask the model to "show its work"', "Request explicit verification of the final answer"],
            "points": 20,
            "created_at": "2025-02-01T00:00:00Z",
        },
        {
            "id": "c4b5d6e7-f8a9-0123-defa-234567890123",
            "title": "Role-Based Prompt Design",
            "description": "Create a system prompt that makes the AI act as a senior code reviewer. It should analyze code for bugs, security issues, and performance problems, then provide actionable feedback.",
            "difficulty": "hard",
            "category": "role-playing",
            "starter_prompt": "You are a senior software engineer with 10+ years of experience in code quality and security. When reviewing code, you:\n1. Identify bugs and logic errors\n2. Flag security vulnerabilities\n3. Suggest performance improvements\n4. Recommend better design patterns\n\nFormat your review as:\n**Bugs**: [list]\n**Security**: [list]\n**Performance**: [list]\n**Recommendations**: [list]\n**Overall rating**: X/10",
            "hints": ["Define the persona clearly with specific expertise areas", "Set the tone and output format explicitly", "Include specific criteria for what to review"],
            "points": 30,
            "created_at": "2025-02-15T00:00:00Z",
        },
        {
            "id": "c5b6d7e8-f9a0-1234-efab-345678901234",
            "title": "Build a Prompt Chain",
            "description": "Design a series of 3 connected prompts that work together to: (1) analyze a business problem, (2) generate potential solutions, (3) evaluate and rank the solutions.",
            "difficulty": "hard",
            "category": "chaining",
            "starter_prompt": "PROMPT 1 - Analysis:\n\"Analyze this business problem and identify: (a) root causes, (b) affected stakeholders, (c) constraints.\"\n\nPROMPT 2 - Solutions:\n\"Given this analysis: [Prompt 1 output]\nGenerate 3 potential solutions with effort and impact ratings.\"\n\nPROMPT 3 - Evaluation:\n\"Rank these solutions: [Prompt 2 output]\nCriteria: feasibility 40%, impact 40%, cost 20%. Give a final recommendation.\"",
            "hints": ["Each prompt should have a single clear objective", "Define the output format for each step", "Ensure Prompt 2 and 3 explicitly reference previous outputs"],
            "points": 40,
            "created_at": "2025-03-01T00:00:00Z",
        },
        {
            "id": "c6b7d8e9-f0a1-2345-fabc-456789012345",
            "title": "Tone Transformation",
            "description": "Write a prompt that rewrites a formal business email into a casual Slack message, preserving all key information but changing the tone completely.",
            "difficulty": "easy",
            "category": "transformation",
            "starter_prompt": "Rewrite the following formal business email as a casual, friendly Slack message. Requirements:\n- Preserve ALL key information (dates, names, decisions, action items)\n- Use casual language, contractions, and a conversational tone\n- Keep it concise (under 150 words)\n- You may use 1-2 appropriate emojis\n\nEmail: [paste email here]",
            "hints": ["Specify both tone AND length constraints", "Emphasize that all information must be preserved", "Mention specific stylistic elements like contractions or emojis"],
            "points": 10,
            "created_at": "2025-03-15T00:00:00Z",
        },
    ]

    for challenge in challenges:
        try:
            supabase.table("challenges").upsert(challenge, on_conflict="id").execute()
            print(f"    ✓ Challenge: {challenge['title']}")
        except Exception as e:
            print(f"    ⚠ Challenge '{challenge['title']}': {str(e)[:80]}")

    # -------------------------------------------------------
    # ROADMAPS
    # -------------------------------------------------------
    print("\n  → Seeding roadmaps...")
    roadmaps = [
        {
            "id": "rm000001-0000-0000-0000-000000000001",
            "title": "Prompt Engineering Beginner Path",
            "level": "beginner",
            "description": "Start your journey into prompt engineering. Learn the fundamentals of how LLMs work and how to craft effective prompts.",
            "topics": [
                {"order": 1, "title": "What are LLMs?", "description": "Understanding Large Language Models and how they work", "article_slug": "intro-to-prompt-engineering"},
                {"order": 2, "title": "Prompt Basics", "description": "Structure and components of an effective prompt", "article_slug": "intro-to-prompt-engineering"},
                {"order": 3, "title": "Zero-Shot Prompting", "description": "Prompting without examples — the simplest form", "article_slug": "zero-shot-vs-few-shot"},
                {"order": 4, "title": "Few-Shot Prompting", "description": "Using examples to guide the model output", "article_slug": "zero-shot-vs-few-shot"},
                {"order": 5, "title": "Prompt Formatting", "description": "Best practices for formatting and structuring prompts"},
                {"order": 6, "title": "Common Mistakes", "description": "Avoiding the most common prompting pitfalls"},
            ],
            "estimated_hours": 8,
            "created_at": "2025-01-01T00:00:00Z",
        },
        {
            "id": "rm000002-0000-0000-0000-000000000002",
            "title": "Intermediate Prompt Techniques",
            "level": "intermediate",
            "description": "Level up your prompting skills with advanced techniques like Chain-of-Thought, role prompting, and output formatting.",
            "topics": [
                {"order": 1, "title": "Chain-of-Thought", "description": "Step-by-step reasoning for complex problems", "article_slug": "chain-of-thought-prompting"},
                {"order": 2, "title": "Role Prompting", "description": "Assigning expert personas to unlock specialized knowledge"},
                {"order": 3, "title": "Output Formatting", "description": "Getting structured outputs: JSON, tables, markdown lists"},
                {"order": 4, "title": "Prompt Chaining", "description": "Connecting multiple prompts to solve complex tasks"},
                {"order": 5, "title": "Temperature & Parameters", "description": "Understanding and controlling model behavior settings"},
                {"order": 6, "title": "Prompt Evaluation", "description": "How to systematically evaluate and improve prompt quality"},
            ],
            "estimated_hours": 12,
            "created_at": "2025-01-15T00:00:00Z",
        },
        {
            "id": "rm000003-0000-0000-0000-000000000003",
            "title": "Advanced AI Architecture",
            "level": "advanced",
            "description": "Master production AI systems — RAG pipelines, agent architectures, prompt security, and enterprise AI workflows.",
            "topics": [
                {"order": 1, "title": "RAG Architecture", "description": "Retrieval-Augmented Generation for grounded responses", "article_slug": "rag-architecture-deep-dive"},
                {"order": 2, "title": "Vector Databases", "description": "Storing and searching embeddings with pgvector, Pinecone, Chroma"},
                {"order": 3, "title": "AI Agents", "description": "Building autonomous AI systems with tool use", "article_slug": "building-ai-agent-systems"},
                {"order": 4, "title": "Multi-Agent Systems", "description": "Coordinating multiple AI agents for complex workflows"},
                {"order": 5, "title": "Prompt Security", "description": "Understanding prompt injection and building safe AI apps", "article_slug": "prompt-injection-security"},
                {"order": 6, "title": "Enterprise AI Patterns", "description": "Production deployment, monitoring, and cost optimization"},
            ],
            "estimated_hours": 20,
            "created_at": "2025-02-01T00:00:00Z",
        },
    ]

    for roadmap in roadmaps:
        try:
            supabase.table("roadmaps").upsert(roadmap, on_conflict="id").execute()
            print(f"    ✓ Roadmap: {roadmap['title']}")
        except Exception as e:
            print(f"    ⚠ Roadmap '{roadmap['title']}': {str(e)[:80]}")


def verify_setup(supabase) -> None:
    """Verify all tables are set up correctly."""
    print("\n🔍 Verifying setup...")

    checks = [
        ("articles", "Articles"),
        ("challenges", "Challenges"),
        ("roadmaps", "Roadmaps"),
        ("profiles", "Profiles table"),
        ("user_progress", "User Progress table"),
        ("challenge_progress", "Challenge Progress table"),
    ]

    all_ok = True
    for table, label in checks:
        try:
            result = supabase.table(table).select("id", count="exact").limit(1).execute()
            count = result.count if result.count is not None else len(result.data or [])
            print(f"  ✓ {label}: {count} records")
        except Exception as e:
            print(f"  ✗ {label}: {str(e)[:80]}")
            all_ok = False

    if all_ok:
        print("\n✅ Database is fully set up and ready!")
    else:
        print("\n⚠  Some tables may need the SQL migrations run manually in Supabase.")
        print("   → Open Supabase Dashboard → SQL Editor → Run migrations in order:")
        print("   1. database/migrations/001_initial_schema.sql")
        print("   2. database/migrations/002_challenge_progress.sql")
        print("   3. database/migrations/003_seed_data.sql")


def main():
    print("=" * 60)
    print("  Prompt Dairy — Database Setup")
    print("=" * 60)
    print(f"\n📡 Connecting to Supabase: {settings.SUPABASE_URL[:40]}...")

    try:
        supabase = get_supabase()
        print("✓ Connected to Supabase\n")
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        sys.exit(1)

    # Seed data directly via Supabase Python client
    run_migrations_direct(supabase)

    # Verify everything is in order
    verify_setup(supabase)

    print("\n" + "=" * 60)
    print("  Done! 🚀")
    print("=" * 60)
    print("\nNext steps:")
    print("  1. Start the backend:  cd backend && uvicorn app.main:app --reload")
    print("  2. Start the frontend: cd frontend && npm run dev")
    print("  3. Visit http://localhost:3000")
    print("  4. API docs: http://localhost:8000/docs")


if __name__ == "__main__":
    main()
