from datetime import date

from app.agents.state import PlanningState
from app.services.providers import MockWeatherProvider


def run_weather_agent(state: PlanningState) -> PlanningState:
    provider = MockWeatherProvider()
    state.weather = provider.forecast(
        date.fromisoformat(state.request["start_date"]),
        date.fromisoformat(state.request["end_date"]),
        state.request["city"],
    )
    return state
