import { apiRequest } from "./client";
import type { PlanTaskStatusResponse, TripPlanVersionResponse } from "./types";

export function getTask(taskId: number) {
  return apiRequest<PlanTaskStatusResponse>(`/api/tasks/${taskId}`);
}

export function getTaskResult(taskId: number) {
  return apiRequest<TripPlanVersionResponse>(`/api/tasks/${taskId}/result`);
}
