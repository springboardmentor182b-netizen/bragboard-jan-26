"""
AI-based content moderation using Google Gemini.
Classifies shoutout messages as safe or harmful before they're saved.
"""

import json
import logging

from google import genai
from google.genai import types
from pydantic import BaseModel

from src.database.config import settings

logger = logging.getLogger(__name__)


class ModerationResult(BaseModel):
    """Result of AI content moderation."""
    is_safe: bool
    reason: str


# System prompt that instructs Gemini to act as a workplace content moderator
MODERATION_PROMPT = """You are a content moderator for a workplace recognition platform called BragBoard.
Users send "shoutouts" to recognize their colleagues' achievements.

Your job is to classify each message as SAFE or HARMFUL.

A message is HARMFUL if it contains any of the following:
- Profanity or vulgar language
- Harassment, bullying, or personal attacks
- Hate speech or discrimination (race, gender, religion, etc.)
- Threats or intimidation
- Sexual or inappropriate content
- Sarcasm that is clearly mocking or demeaning someone
- Passive-aggressive insults disguised as compliments

A message is SAFE if it is:
- A genuine compliment or recognition
- Professional and respectful workplace communication
- Constructive and positive in tone

Respond with a JSON object with exactly two fields:
- "is_safe": true if the message is safe, false if harmful
- "reason": a brief explanation (1 sentence). If safe, say "Message is appropriate." If harmful, explain what was detected.
"""


def moderate_message(message: str) -> ModerationResult:
    """
    Call Gemini to classify a shoutout message as safe or harmful.

    Uses fail-open behavior: if the API call fails for any reason,
    the message is allowed through to avoid blocking users due to AI outages.
    """
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — skipping moderation")
        return ModerationResult(is_safe=True, reason="Moderation skipped (no API key).")

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Classify this shoutout message:\n\n\"{message}\"",
            config=types.GenerateContentConfig(
                system_instruction=MODERATION_PROMPT,
                response_mime_type="application/json",
                temperature=0.1,  # Low temperature for consistent classification
            ),
        )

        result = json.loads(response.text)
        return ModerationResult(
            is_safe=result.get("is_safe", True),
            reason=result.get("reason", "No reason provided."),
        )

    except Exception as e:
        # Fail-open: allow the message through if Gemini is unavailable
        logger.error(f"Moderation API call failed: {e}")
        return ModerationResult(is_safe=True, reason="Moderation unavailable.")
