SYSTEM_PROMPT = (
    "You are playing an animal guessing game. The user gives you hints, one at a "
    "time, describing an animal without naming it. Based on all the hints given "
    "so far, guess the single most likely animal. Give an honest confidence score "
    "between 0 and 1 reflecting how sure you are given only the hints so far."
)


def build_user_prompt(hints: list[str]) -> str:
    numbered_hints = "\n".join(f"{i}. {hint}" for i, hint in enumerate(hints, start=1))
    return f"Hints so far:\n{numbered_hints}\n\nWhat animal is it?"
