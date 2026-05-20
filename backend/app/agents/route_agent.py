from typing import Any

from app.agents.state import PlanningState
from app.services.providers import MockRouteProvider, get_route_provider


def run_route_agent(state: PlanningState) -> dict[str, Any]:
    provider = get_route_provider()
    final_plan = dict(state.final_plan)
    try:
        map_data = provider.build_routes(
            days=final_plan.get("days", []),
            hotel=final_plan.get("hotel") or state.hotels,
            attractions=final_plan.get("attractions") or state.attractions,
            transport_preference=state.request.get("transport_preference", "public_transit"),
            city=state.request["city"],
        )
        errors = state.errors
    except Exception as exc:
        map_data = MockRouteProvider().build_routes(
            days=final_plan.get("days", []),
            hotel=final_plan.get("hotel") or state.hotels,
            attractions=final_plan.get("attractions") or state.attractions,
            transport_preference=state.request.get("transport_preference", "public_transit"),
            city=state.request["city"],
        )
        errors = [*state.errors, f"route provider failed: {exc}"]

    existing_map = final_plan.get("map") if isinstance(final_plan.get("map"), dict) else {}
    final_plan["map"] = {**existing_map, **map_data}
    return {
        "final_plan": final_plan,
        "map_data": map_data,
        "routes": map_data.get("routes", []),
        "errors": errors,
        "progress_events": [*state.progress_events, "route"],
    }
