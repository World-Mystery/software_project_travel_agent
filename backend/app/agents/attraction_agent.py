from app.agents.state import PlanningState
from app.services.providers import MockAttractionProvider


def run_attraction_agent(state: PlanningState) -> PlanningState:
    provider = MockAttractionProvider()
    state.attractions = provider.search(
        state.request["city"],
        state.user_profile.get("interest_tags", []),
    )
    return state
