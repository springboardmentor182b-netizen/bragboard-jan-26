from __future__ import annotations

import json
import os
import re
from typing import Iterable

from google import genai


MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        # Remove first fence line and last fence if present.
        text = re.sub(r"^```[a-zA-Z0-9_-]*\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _clean_line(line: str) -> str:
    line = line.strip()
    # Remove bullets / numbering like "1. ", "- ", "* "
    line = re.sub(r"^\s*[\-\*\u2022]\s+", "", line)
    line = re.sub(r"^\s*\d+[\).\:-]\s+", "", line)
    # Remove surrounding quotes
    line = line.strip().strip('"').strip("'").strip()
    return line


def _dedupe_keep_order(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in items:
        k = x.lower()
        if not x or k in seen:
            continue
        seen.add(k)
        out.append(x)
    return out


def _enforce_word_limit(text: str, max_words: int = 10) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text
    return " ".join(words[:max_words]).strip()


def _parse_replies(raw_text: str) -> list[str]:
    """
    Convert Gemini output to a clean list of replies.
    Handles JSON arrays, JSON objects, or plain text lines.
    """
    text = _strip_code_fences(raw_text)
    if not text:
        return []

    # Try JSON first.
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict) and "replies" in parsed and isinstance(parsed["replies"], list):
            candidates = [str(x) for x in parsed["replies"]]
        elif isinstance(parsed, list):
            candidates = [str(x) for x in parsed]
        else:
            candidates = []
    except Exception:
        candidates = []

    # Fallback: split lines.
    if not candidates:
        candidates = [ln for ln in text.splitlines() if ln.strip()]

    cleaned = [_clean_line(c) for c in candidates]
    cleaned = [c for c in cleaned if c]
    cleaned = _dedupe_keep_order(cleaned)

    # Ensure shortness
    cleaned = [_enforce_word_limit(c, 10) for c in cleaned]
    cleaned = [c for c in cleaned if c]

    # Exactly 3 results.
    if len(cleaned) >= 3:
        return cleaned[:3]

    fallbacks = [
        "Love this—nice work!",
        "Congrats, you crushed it!",
        "That’s awesome, well done!",
        "So proud of you!",
        "Big win—keep going!",
    ]
    for fb in fallbacks:
        fb = _enforce_word_limit(fb, 10)
        if fb.lower() not in {x.lower() for x in cleaned}:
            cleaned.append(fb)
        if len(cleaned) == 3:
            break
    return cleaned[:3]


def generate_comment_replies(comment: str) -> list[str]:
    """
    Generate exactly 3 short, friendly replies using Google Gemini.
    Reads API key from environment variable GEMINI_API_KEY.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    client = genai.Client(api_key=api_key)

    prompt = (
        "You are writing social media comment replies.\n"
        "Generate exactly 3 replies to the comment below.\n"
        "Rules:\n"
        "- Each reply max 10 words\n"
        "- Friendly, positive tone\n"
        "- Avoid repetition\n"
        "- No numbering, no bullets, no extra text\n"
        "- No emojis unless they feel natural\n"
        "Return ONLY the 3 replies, each on its own line.\n\n"
        f'Comment: "{comment.strip()}"\n'
    )

    resp = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )
    text = getattr(resp, "text", "") or ""
    replies = _parse_replies(text)

    # Hard guarantee: always exactly 3 strings.
    if len(replies) != 3:
        raise RuntimeError("Failed to generate 3 clean replies")
    return replies

