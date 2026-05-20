from typing import Any

from app.agents.state import PlanningState
from app.services.providers import RuleBasedPlannerProvider, get_planner_provider


def run_planner_agent(state: PlanningState) -> dict[str, Any]:
    provider = get_planner_provider()
    try:
        final_plan = provider.generate_plan(
            request=state.request,
            user_profile=state.user_profile,
            attractions=state.attractions,
            weather_info=state.weather,
            hotel=state.hotels,
            profile_summary=state.profile_summary,
        )
        errors = state.errors
    except Exception as exc:
        final_plan = RuleBasedPlannerProvider().generate_plan(
            request=state.request,
            user_profile=state.user_profile,
            attractions=state.attractions,
            weather_info=state.weather,
            hotel=state.hotels,
            profile_summary=state.profile_summary,
        )
        errors = [*state.errors, f"planner provider failed: {exc}"]

    return {
        "final_plan": final_plan,
        "errors": errors,
        "progress_events": [*state.progress_events, "planner"],
    }
