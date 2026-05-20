from typing import Any

from app.agents.state import PlanningState


def run_profile_agent(state: PlanningState) -> dict[str, Any]:
    profile = dict(state.user_profile or {})
    interest_tags = profile.get("interest_tags") or []
    profile["interest_tags"] = interest_tags

    summary_parts = []
    if profile.get("travel_style"):
        summary_parts.append(f"style={profile['travel_style']}")
    if interest_tags:
        summary_parts.append(f"interests={','.join(map(str, interest_tags))}")
    if profile.get("risk_sensitivity"):
        summary_parts.append(f"risk={profile['risk_sensitivity']}")

    return {
        "user_profile": profile,
        "profile_summary": "; ".join(summary_parts),
        "progress_events": [*state.progress_events, "profile"],
    }
