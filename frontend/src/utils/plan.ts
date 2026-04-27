import type { TripPlanResponse, TripPlanVersionResponse } from "../api/types";

type PlanContent = {
  title?: string;
  city?: string;
  days?: Array<{
    date: string;
    theme?: string;
    activities?: Array<{ time: string; title: string; transport?: string }>;
  }>;
  budget?: {
    range?: string;
    estimated_total?: number;
  };
  hotel?: {
    name?: string;
    location?: string;
    price_per_night?: number;
  };
  overall_suggestions?: string[];
};

export function getCurrentVersion(plan: TripPlanResponse): TripPlanVersionResponse | null {
  return plan.current_version ?? null;
}

export function getPlanContent(plan: TripPlanResponse): PlanContent {
  return (plan.current_version?.content_json ?? {}) as PlanContent;
}
