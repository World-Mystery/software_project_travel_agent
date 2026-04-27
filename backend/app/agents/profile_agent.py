from app.agents.state import PlanningState


def run_profile_agent(state: PlanningState) -> PlanningState:
    state.user_profile.setdefault("interest_tags", [])
    return state
