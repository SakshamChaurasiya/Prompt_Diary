"""
Prompt Playground API endpoint.

POST /playground/run  — Execute a prompt against a simulated or real LLM
GET  /playground/models — List available models
"""

import time
import hashlib
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional

from app.core.config import settings
from app.core.security import get_optional_user

router = APIRouter(prefix="/playground", tags=["Playground"])


class PromptRunRequest(BaseModel):
    """Request to execute a prompt."""
    prompt: str = Field(..., min_length=1, max_length=10000, description="The prompt text to execute")
    model: str = Field(default="gpt-4", description="Model to use for generation")
    temperature: float = Field(default=0.7, ge=0, le=2, description="Sampling temperature")
    max_tokens: int = Field(default=500, ge=1, le=4000, description="Maximum tokens to generate")
    system_prompt: Optional[str] = Field(default=None, description="Optional system prompt")


class ModelInfo(BaseModel):
    """Information about an available model."""
    id: str
    name: str
    provider: str
    available: bool
    description: str


# Available models registry
AVAILABLE_MODELS = [
    ModelInfo(
        id="gpt-4",
        name="GPT-4",
        provider="OpenAI",
        available=bool(settings.OPENAI_API_KEY),
        description="Most capable OpenAI model for complex tasks",
    ),
    ModelInfo(
        id="gpt-3.5-turbo",
        name="GPT-3.5 Turbo",
        provider="OpenAI",
        available=bool(settings.OPENAI_API_KEY),
        description="Fast and cost-effective for simpler tasks",
    ),
    ModelInfo(
        id="gemini-pro",
        name="Gemini Pro",
        provider="Google",
        available=bool(settings.GEMINI_API_KEY),
        description="Google's advanced multimodal model",
    ),
    ModelInfo(
        id="claude-3",
        name="Claude 3",
        provider="Anthropic",
        available=False,
        description="Anthropic's thoughtful AI assistant",
    ),
    ModelInfo(
        id="llama-3",
        name="Llama 3",
        provider="Meta (via HuggingFace)",
        available=False,
        description="Open-source model from Meta AI",
    ),
]


def _generate_simulated_response(prompt: str, model: str, temperature: float) -> str:
    """
    Generate a deterministic simulated response for playground testing.

    In Phase 4+, this will be replaced with actual LLM API calls.
    """
    # Create a deterministic but varied response based on prompt content
    prompt_lower = prompt.lower()

    if "summarize" in prompt_lower or "summary" in prompt_lower:
        return (
            "Here is a concise summary of the provided content:\n\n"
            "**Key Points:**\n"
            "1. The main topic focuses on efficient information processing\n"
            "2. Several important factors were identified for optimization\n"
            "3. The conclusion recommends a structured approach to implementation\n\n"
            "This summary captures the essential elements while maintaining "
            "the core message of the original text."
        )
    elif "json" in prompt_lower or "extract" in prompt_lower:
        return (
            '```json\n'
            '{\n'
            '  "name": "Example Product",\n'
            '  "category": "Technology",\n'
            '  "rating": 4.5,\n'
            '  "sentiment": "positive",\n'
            '  "key_features": [\n'
            '    "User-friendly interface",\n'
            '    "High performance",\n'
            '    "Reliable support"\n'
            '  ],\n'
            '  "recommendation": true\n'
            '}\n'
            '```\n\n'
            "The above JSON was extracted from the provided text using "
            "structured output formatting."
        )
    elif "code" in prompt_lower or "function" in prompt_lower or "program" in prompt_lower:
        return (
            "Here's the implementation:\n\n"
            "```python\n"
            "def process_data(items: list) -> dict:\n"
            '    """Process a list of items and return aggregated results."""\n'
            "    results = {\n"
            '        "total": len(items),\n'
            '        "processed": [],\n'
            '        "summary": {}\n'
            "    }\n"
            "    \n"
            "    for item in items:\n"
            "        processed = transform(item)\n"
            '        results["processed"].append(processed)\n'
            "    \n"
            "    return results\n"
            "```\n\n"
            "**Explanation:**\n"
            "- The function takes a list of items as input\n"
            "- It processes each item through a transformation\n"
            "- Returns a structured dictionary with results"
        )
    elif "explain" in prompt_lower or "what is" in prompt_lower:
        return (
            "Great question! Let me break this down:\n\n"
            "## Overview\n"
            "This concept relates to how AI systems process and generate "
            "responses based on input patterns.\n\n"
            "## Key Concepts\n"
            "1. **Input Processing**: The system analyzes the structure and "
            "semantics of the input\n"
            "2. **Pattern Matching**: Relevant patterns from training are "
            "identified\n"
            "3. **Response Generation**: A coherent response is constructed\n\n"
            "## Practical Application\n"
            "Understanding these fundamentals helps you craft better prompts "
            "that leverage the model's strengths."
        )
    else:
        # Generic response
        seed = hashlib.md5(prompt.encode()).hexdigest()[:8]
        return (
            f"I've analyzed your prompt and here's my response:\n\n"
            f"Your request involves an interesting combination of concepts. "
            f"Let me address the key aspects:\n\n"
            f"1. **Understanding**: The core of your prompt asks about "
            f"a topic that requires careful consideration\n"
            f"2. **Analysis**: Breaking this down, there are several "
            f"important factors to consider\n"
            f"3. **Recommendation**: Based on this analysis, I suggest "
            f"approaching this systematically\n\n"
            f"Would you like me to elaborate on any of these points?\n\n"
            f"---\n"
            f"*Response ID: {seed}*"
        )


@router.get("/models")
async def list_models():
    """
    List all available models for the playground.

    Models marked as `available: true` have API keys configured.
    """
    return {
        "models": [m.model_dump() for m in AVAILABLE_MODELS],
        "total": len(AVAILABLE_MODELS),
    }


@router.post("/run")
async def run_prompt(
    data: PromptRunRequest,
    user: Optional[dict] = Depends(get_optional_user),
):
    """
    Execute a prompt against a model.

    Currently returns simulated responses. When LLM API keys are configured,
    this will call the actual model APIs.

    Authentication is optional — anonymous users can try the playground,
    but their usage may be rate-limited in the future.
    """
    start_time = time.time()

    # TODO: Phase 4 — integrate real LLM APIs
    # if settings.OPENAI_API_KEY and data.model.startswith("gpt"):
    #     response = await call_openai(data.prompt, data.model, ...)
    # elif settings.GEMINI_API_KEY and data.model == "gemini-pro":
    #     response = await call_gemini(data.prompt, ...)

    # For now, generate a simulated response
    response_text = _generate_simulated_response(
        data.prompt, data.model, data.temperature
    )

    elapsed = time.time() - start_time
    input_tokens = len(data.prompt.split())
    output_tokens = len(response_text.split())

    return {
        "success": True,
        "response": response_text,
        "model": data.model,
        "simulated": True,
        "usage": {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
        },
        "latency_ms": round(elapsed * 1000, 1),
        "note": "This is a simulated response. Configure LLM API keys for real model integration.",
    }
