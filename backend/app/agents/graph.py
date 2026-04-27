from app.agents.attraction_agent import run_attraction_agent
from app.agents.hotel_agent import run_hotel_agent
from app.agents.planner_agent import run_planner_agent
from app.agents.profile_agent import run_profile_agent
from app.agents.state import PlanningState
from app.agents.weather_agent import run_weather_agent


def run_planning_graph(state: PlanningState) -> PlanningState:
    for step in (
        run_profile_agent,
        run_attraction_agent,
        run_weather_agent,
        run_hotel_agent,
        run_planner_agent,
    ):
        state = step(state)
    return state
