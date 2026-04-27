from app.agents.state import PlanningState
from app.services.providers import MockHotelProvider


def run_hotel_agent(state: PlanningState) -> PlanningState:
    provider = MockHotelProvider()
    state.hotels = provider.search(
        city=state.request["city"],
        budget_range=state.request["budget_range"],
        accommodation_preference=state.request["accommodation_preference"],
    )
    return state
