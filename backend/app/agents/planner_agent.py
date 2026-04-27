from datetime import date, timedelta

from app.agents.state import PlanningState


def run_planner_agent(state: PlanningState) -> PlanningState:
    start = date.fromisoformat(state.request["start_date"])
    end = date.fromisoformat(state.request["end_date"])
    total_days = (end - start).days + 1
    days = []
    for index in range(total_days):
        travel_date = start + timedelta(days=index)
        attraction = state.attractions[index % len(state.attractions)] if state.attractions else None
        weather = state.weather[index] if index < len(state.weather) else {}
        days.append(
            {
                "date": travel_date.isoformat(),
                "theme": f"Day {index + 1}",
                "weather": weather,
                "activities": [
                    {
                        "time": "09:30",
                        "title": attraction["name"] if attraction else "自由活动",
                        "transport": state.request["transport_preference"],
                    }
                ],
            }
        )

    budget_total = state.hotels.get("price_per_night", 0) * total_days + 200 * total_days
    state.final_plan = {
        "title": state.request["title"],
        "city": state.request["city"],
        "start_date": state.request["start_date"],
        "end_date": state.request["end_date"],
        "days": days,
        "attractions": state.attractions,
        "hotel": state.hotels,
        "meals": [{"suggestion": f"{state.request['city']}本地特色餐厅"}],
        "weather_info": state.weather,
        "budget": {
            "range": state.request["budget_range"],
            "estimated_total": budget_total,
        },
        "warnings": [],
        "overall_suggestions": [
            "优先安排热门景点在上午，减少排队时间",
            "根据天气情况灵活切换室内外活动",
        ],
    }
    return state
