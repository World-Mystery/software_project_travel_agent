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
    final_plan: dict[str, Any] = field(default_factory=dict)
