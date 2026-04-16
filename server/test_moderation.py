"""
Test script for AI-based content moderation using Google Gemini.
Sends a batch of safe and harmful messages to the moderation service
and reports the classification results.

Usage:
    python test_moderation.py
"""

import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from src.moderation.service import moderate_message

# -- Test Cases ----------------------------------------------------------------

SAFE_MESSAGES = [
    "Great job on the presentation, Sarah! You really nailed it.",
    "Thanks for staying late to help the team meet the deadline.",
    "Your code review feedback was incredibly helpful. Learned a lot!",
    "Welcome to the team! Looking forward to working with you.",
    "Shoutout to the QA team for catching that critical bug before release.",
]

HARMFUL_MESSAGES = [
    "You're the worst developer I've ever worked with, absolute garbage.",
    "Nobody likes you here, just quit already.",
    "What an idiot, can't believe they hired someone so stupid.",
    "Shut up and do your job, you worthless piece of crap.",
    "I'll make sure you regret crossing me. Watch your back.",
]

# -- Run Tests -----------------------------------------------------------------

def run_tests():
    print("=" * 65)
    print("  AI MODERATION TEST -- Google Gemini (gemini-2.0-flash)")
    print("=" * 65)

    passed = 0
    failed = 0

    # Test safe messages -- should all be classified as is_safe=True
    print("\n[SAFE] messages (expected: is_safe = True)\n")
    for i, msg in enumerate(SAFE_MESSAGES, 1):
        result = moderate_message(msg)
        tag = "PASS" if result.is_safe else "FAIL"
        if result.is_safe:
            passed += 1
        else:
            failed += 1
        print(f"  {i}. [{tag}] \"{msg[:60]}\"")
        print(f"     -> is_safe={result.is_safe}, reason: {result.reason}")
        print()

    # Test harmful messages -- should all be classified as is_safe=False
    print("\n[HARMFUL] messages (expected: is_safe = False)\n")
    for i, msg in enumerate(HARMFUL_MESSAGES, 1):
        result = moderate_message(msg)
        tag = "PASS" if not result.is_safe else "FAIL"
        if not result.is_safe:
            passed += 1
        else:
            failed += 1
        print(f"  {i}. [{tag}] \"{msg[:60]}\"")
        print(f"     -> is_safe={result.is_safe}, reason: {result.reason}")
        print()

    # Summary
    total = passed + failed
    print("=" * 65)
    print(f"  RESULTS: {passed}/{total} passed, {failed}/{total} failed")
    print("=" * 65)

    if failed == 0:
        print("\n  All tests passed! AI moderation is working correctly.\n")
    else:
        print(f"\n  {failed} test(s) failed. Review the results above.\n")


if __name__ == "__main__":
    run_tests()
