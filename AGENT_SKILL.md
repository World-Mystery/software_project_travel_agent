---
name: smart-travel-agent-maintainer
description: Use when modifying the Smart Travel Assistant backend Agent pipeline, especially work under backend/app/agents, provider integrations, planning state, weather-risk handling, or migration from sequential agent functions to a real LangGraph StateGraph while preserving the existing FastAPI task and plan-version flow.
---

# Smart Travel Agent Maintainer

## Purpose

Maintain the backend Agent layer for the Smart Travel Assistant. The target architecture is a real LangGraph `StateGraph`, not a plain for-loop over functions. Keep the Agent layer easy to explain, deterministic in tests, and compatible with the existing async task, plan persistence, version history, and weather-warning APIs.

## Current Project Context

Core files:

- `backend/app/agents/state.py`: shared planning state.
- `backend/app/agents/graph.py`: graph entry point used by `PlanService`.
- `backend/app/agents/profile_agent.py`: profile normalization and preference extraction.
- `backend/app/agents/attraction_agent.py`: attraction candidate retrieval.
- `backend/app/agents/weather_agent.py`: forecast retrieval and weather risk input.
- `backend/app/agents/hotel_agent.py`: hotel candidate retrieval.
- `backend/app/agents/planner_agent.py`: final itinerary assembly.
- `backend/app/agents/route_agent.py`: map point and route assembly for frontend display.
- `backend/app/services/providers.py`: provider boundary. Mock providers are the current default.
- `backend/app/services/plan_service.py`: async task orchestration, persistence, and version creation.
- `backend/app/services/weather_service.py`: warning rule helper used by API responses.

Preserve the public service contract unless the user explicitly asks for a breaking refactor:

```python
state = PlanningState(
    user_id=task.user_id,
    request=payload,
    user_profile=profile_json,
)
state = run_planning_graph(state)
```

`run_planning_graph(state)` must return a state object or mapping with `final_plan` available to `PlanService`.

## Target Graph

Use LangGraph with this baseline topology:

```text
START
  -> profile
  -> attraction
  -> weather_lookup
  -> hotel
  -> planner
  -> route
  -> alert_check
  -> END
```

This project values controllability over complex multi-agent autonomy. Keep the graph sequential unless there is a clear need for parallel branches. If parallel branches are added later, define deterministic merge behavior and tests before relying on them.

Recommended implementation shape:

```python
from langgraph.graph import END, START, StateGraph

from app.agents.state import PlanningState
from app.agents.profile_agent import run_profile_agent
from app.agents.attraction_agent import run_attraction_agent
from app.agents.weather_agent import run_weather_agent
from app.agents.hotel_agent import run_hotel_agent
from app.agents.planner_agent import run_planner_agent
from app.agents.route_agent import run_route_agent
from app.agents.warning_agent import run_warning_agent


def build_planning_graph():
    graph = StateGraph(PlanningState)
    graph.add_node("profile", run_profile_agent)
    graph.add_node("attraction", run_attraction_agent)
    graph.add_node("weather_lookup", run_weather_agent)
    graph.add_node("hotel", run_hotel_agent)
    graph.add_node("planner", run_planner_agent)
    graph.add_node("route", run_route_agent)
    graph.add_node("alert_check", run_warning_agent)

    graph.add_edge(START, "profile")
    graph.add_edge("profile", "attraction")
    graph.add_edge("attraction", "weather_lookup")
    graph.add_edge("weather_lookup", "hotel")
    graph.add_edge("hotel", "planner")
    graph.add_edge("planner", "route")
    graph.add_edge("route", "alert_check")
    graph.add_edge("alert_check", END)
    return graph.compile()


planning_graph = build_planning_graph()


def run_planning_graph(state: PlanningState) -> PlanningState:
    return planning_graph.invoke(state)
```

Adapt this template to the actual installed LangGraph version. If `StateGraph` requires a `TypedDict` state, convert `PlanningState` carefully and update callers/tests in the same change.

Do not use a node id that is also a state field name. For example, use `weather_lookup` instead of `weather`, because `PlanningState.weather` already exists.

## State Contract

Keep state explicit and serializable. Required fields:

- `user_id`: authenticated user id.
- `request`: normalized `TripPlanCreateRequest` payload plus task mode metadata.
- `user_profile`: profile JSON from persistence.
- `attractions`: list of attraction candidate dicts.
- `weather`: list of daily weather dicts.
- `hotels`: selected hotel or hotel candidate dict.
- `routes`: route list for map display.
- `map_data`: frontend map payload.
- `final_plan`: complete plan JSON snapshot to store in `TripPlanVersion.content_json`.

Optional fields that are useful for LangGraph:

- `profile_summary`: short explanation of preference interpretation.
- `warnings`: weather warning items before persistence.
- `errors`: non-fatal provider or node errors.
- `progress_events`: node-level progress messages for future task UI.

Rules:

- Do not store database sessions, ORM objects, clients, or non-serializable objects in state.
- Validate required request fields before provider calls: `city`, `start_date`, `end_date`, `budget_range`, `transport_preference`, `accommodation_preference`.
- Prefer typed state (`TypedDict` or Pydantic model) over ad hoc dict mutation when migrating to LangGraph.
- Keep defaults for list/dict fields safe. Never use mutable objects as class-level defaults.

## Node Responsibilities

`profile`:

- Normalize `user_profile`.
- Ensure `interest_tags` exists.
- Derive preference hints used by later nodes.
- Do not write profile changes to the database inside the graph unless the user explicitly asks for adaptive profile persistence.

`attraction`:

- Read `city` and `interest_tags`.
- Call an attraction provider through `services/providers.py` or a provider interface.
- Return structured candidates. On provider failure, add an error and fall back to an empty list or simple default candidates.

`weather`:

- Read `city`, `start_date`, and `end_date`.
- Call a weather provider.
- Normalize each item to include at least `date`, `city`, `condition`, and `risk_score`.
- Provider failure should not block the whole plan unless the user asks for strict weather correctness.

`hotel`:

- Read `city`, `budget_range`, and `accommodation_preference`.
- Call a hotel provider.
- Return one selected hotel or a small candidate structure.
- Provider failure should fall back to a basic placeholder hotel.

`planner`:

- Assemble the final itinerary JSON from request, profile, attractions, weather, and hotel.
- Use OpenAI only in this node when real providers are enabled.
- Keep the output schema stable for persistence and frontend rendering.
- If no attractions are available, still produce a usable day plan with free-time activities.

`route`:

- Build `final_plan["map"]` from hotel and attraction coordinates.
- Request route lines from Amap when real providers are enabled.
- Fall back to deterministic mock route data if route lookup fails.

`alert_check`:

- Inspect `weather` or `final_plan["weather_info"]`.
- Produce warning items and attach them to `final_plan["warnings"]`.
- Do not depend on persisted `plan_id` or `version_id` inside the graph. Persistence IDs are assigned later by `PlanService`.

## Final Plan JSON Contract

Every successful graph run must produce `state.final_plan` with these keys:

```json
{
  "title": "string",
  "city": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "days": [],
  "attractions": [],
  "hotel": {},
  "meals": [],
  "weather_info": [],
  "budget": {
    "range": "string",
    "estimated_total": 0
  },
  "warnings": [],
  "overall_suggestions": [],
  "map": {
    "points": [],
    "routes": []
  }
}
```

Do not rename these keys without updating DTOs, frontend parsing, tests, and stored-version compatibility.

## Provider Boundary

Keep external service logic outside graph nodes.

- Mock providers may remain the default for tests and course demos.
- Real weather, POI, hotel, map, or image APIs must be wrapped behind provider classes or interfaces.
- Nodes should call provider methods, not embed HTTP request logic directly.
- Provider output must be normalized before it enters `final_plan`.
- Tests must not depend on live network calls.
- Do not introduce a separate adapter layer for this project unless the user explicitly asks for it.

If adding real providers, include a simple selection mechanism such as settings-based provider choice:

```text
APP_ENV=test/development -> mock providers
APP_ENV=production with API keys -> real providers
```

## Error Handling

Use this policy:

- Missing required request data: raise a clear exception and let the task fail.
- Provider timeout or third-party failure: record a non-fatal error and fall back where possible.
- Planner cannot produce `final_plan`: raise a clear exception.
- Weather warning calculation failure: leave `warnings` empty and keep the plan usable.

Do not catch all exceptions silently. `PlanService.process_plan_task` is responsible for marking failed tasks.

## Migration Checklist

When converting or maintaining the Agent layer:

1. Inspect `backend/app/services/plan_service.py` to preserve how tasks invoke the graph.
2. Add `langgraph` to `backend/requirements.txt` if it is not already present.
3. Decide whether `PlanningState` remains a dataclass or becomes a `TypedDict`/Pydantic model based on the installed LangGraph version.
4. Replace the manual loop in `backend/app/agents/graph.py` with a compiled `StateGraph`.
5. Keep node function names stable unless there is a clear reason to rename them.
6. Add `route_agent.py` if map route data should be exposed to the frontend.
7. Add `warning_agent.py` or equivalent `alert_check` node if warnings move into the graph.
8. Keep `run_planning_graph(state)` as the public entry point.
9. Add or update backend tests for graph topology, success output, provider fallback, and API task flow.
10. Run backend tests before reporting completion.

## Testing Requirements

Minimum tests for significant Agent changes:

- Direct graph test: invokes `run_planning_graph` with a sample request and verifies `final_plan` schema.
- Fallback test: simulates provider failure and verifies the graph still returns a usable plan where required.
- Warning test: weather with high risk creates warning items.
- API flow test: existing `/api/plans` task flow still creates a plan version.

On this Windows workspace, prefer:

```powershell
$env:TMP='c:\learning-tmp'; $env:TEMP='c:\learning-tmp'; python -m pytest -q --basetemp .tmp\pytest
```

If using the project path directly, create the temp folder inside `backend` and avoid relying on the user-level Temp directory if permissions fail.

## Coding Rules

- Keep graph nodes small and single-purpose.
- Keep generated plan content deterministic in tests.
- Keep Chinese display text valid UTF-8. Do not introduce mojibake.
- Do not write database rows from graph nodes.
- Do not let frontend mock data define backend contracts.
- Do not make live API calls in tests.
- Keep LLM calls limited to planner logic unless the user explicitly broadens the scope.
- If adding LLM output later, validate it against the final plan JSON contract before persistence.

## Completion Report

When finishing Agent work, report:

- Files changed under `backend/app/agents` and related provider/service files.
- Whether `langgraph` dependency was added or already present.
- Whether `run_planning_graph` still preserves the service contract.
- Tests run and results.
- Any remaining mock provider or external API gap.
