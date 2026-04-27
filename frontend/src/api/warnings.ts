import { apiRequest } from "./client";
import type { WeatherWarningResponse } from "./types";

export function getPlanWarnings(planId: number) {
  return apiRequest<WeatherWarningResponse>(`/api/plans/${planId}/warnings`);
}

export function getVersionWarnings(planId: number, versionId: number) {
  return apiRequest<WeatherWarningResponse>(`/api/plans/${planId}/versions/${versionId}/warnings`);
}
