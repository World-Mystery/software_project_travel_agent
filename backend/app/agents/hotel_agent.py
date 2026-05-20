from typing import Any

from app.agents.state import PlanningState
from app.services.providers import get_hotel_provider


def run_hotel_agent(state: PlanningState) -> dict[str, Any]:
    provider = get_hotel_provider()
    try:
        hotels = provider.search(
            city=state.request["city"],
            budget_range=state.request["budget_range"],
            accommodation_preference=state.request["accommodation_preference"],
        )
        errors = state.errors
    except Exception as exc:
        hotels = {
            "name": f"{state.request['city']} Standard Hotel",
            "price_per_night": 300,
            "location": f"{state.request['city']} city center",
            "rating": None,
        }
        errors = [*state.errors, f"hotel provider failed: {exc}"]

    return {
        "hotels": hotels,
        "errors": errors,
        "progress_events": [*state.progress_events, "hotel"],
    }
