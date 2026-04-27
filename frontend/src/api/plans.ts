import { apiRequest } from "./client";
import type {
  PlanTaskCreateResponse,
  TripPlanCreateRequest,
  TripPlanEditRequest,
  TripPlanResponse,
  TripPlanVersionResponse,
} from "./types";

export function createPlan(payload: TripPlanCreateRequest) {
  return apiRequest<PlanTaskCreateResponse>("/api/plans", {
    method: "POST",
    body: payload,
  });
}

export function listPlans() {
  return apiRequest<TripPlanResponse[]>("/api/plans");
}

export function getPlan(planId: number) {
  return apiRequest<TripPlanResponse>(`/api/plans/${planId}`);
}

export function listPlanVersions(planId: number) {
  return apiRequest<TripPlanVersionResponse[]>(`/api/plans/${planId}/versions`);
}

export function regeneratePlan(planId: number, versionId: number, payload: TripPlanCreateRequest) {
  return apiRequest<PlanTaskCreateResponse>(`/api/plans/${planId}/versions/${versionId}/regenerate`, {
    method: "POST",
    body: payload,
  });
}

export function editPlanVersion(planId: number, versionId: number, payload: TripPlanEditRequest) {
  return apiRequest<TripPlanVersionResponse>(`/api/plans/${planId}/versions/${versionId}`, {
    method: "PUT",
    body: payload,
  });
}
