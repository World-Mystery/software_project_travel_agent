import { apiRequest } from "./client";
import type { UserProfileResponse, UserProfileUpdateRequest } from "./types";

export function fetchMyProfile() {
  return apiRequest<UserProfileResponse>("/api/profile/me");
}

export function updateMyProfile(payload: UserProfileUpdateRequest) {
  return apiRequest<UserProfileResponse>("/api/profile/me", {
    method: "PUT",
    body: payload,
  });
}
