from dataclasses import dataclass, field
from typing import Any


@dataclass
class PlanningState:
    user_id: int
    request: dict[str, Any]
    user_profile: dict[str, Any] = field(default_factory=dict)
    attractions: list[dict[str, Any]] = field(default_factory=list)
    weather: list[dict[str, Any]] = field(default_factory=list)
    hotels: dict[str, Any] = field(default_factory=dict)
    routes: list[dict[str, Any]] = field(default_factory=list)
    map_data: dict[str, Any] = field(default_factory=dict)
    final_plan: dict[str, Any] = field(default_factory=dict)
    warnings: list[dict[str, Any]] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    profile_summary: str = ""
    progress_events: list[str] = field(default_factory=list)
