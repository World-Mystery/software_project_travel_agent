from pydantic import BaseModel


class WeatherWarningItem(BaseModel):
    date: str
    type: str
    level: str
    impact: str
    suggestion: str


class WeatherWarningResponse(BaseModel):
    plan_id: int
    version_id: int
    warnings: list[WeatherWarningItem]
