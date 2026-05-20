from typing import Any

from app.agents.state import PlanningState
from app.services.weather_service import WeatherService


def run_warning_agent(state: PlanningState) -> dict[str, Any]:
    final_plan = dict(state.final_plan)
    weather_info = final_plan.get("weather_info") or state.weather

    try:
        warning_response = WeatherService.build_warnings(
            plan_id=0,
            version_id=0,
            weather_info=weather_info,
        )
        warnings = [item.model_dump() for item in warning_response.warnings]
        errors = state.errors
    except Exception as exc:
        warnings = []
        errors = [*state.errors, f"weather warning check failed: {exc}"]

    final_plan["warnings"] = warnings
    return {
        "final_plan": final_plan,
        "warnings": warnings,
        "errors": errors,
        "progress_events": [*state.progress_events, "alert_check"],
    }
