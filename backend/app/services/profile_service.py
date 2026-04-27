from sqlmodel import Session

from app.core.time import utc_now
from app.db.models import User, UserProfile
from app.dto.profile import UserProfileBase, UserProfileResponse, UserProfileUpdateRequest
from app.repositories.profile_repo import ProfileRepository


def build_profile_summary(profile: UserProfileBase) -> str:
    tags = ", ".join(profile.interest_tags) if profile.interest_tags else "no explicit interest tags"
    return (
        f"{profile.travel_style} travel, budget {profile.budget_level}, interests {tags}, "
        f"transport {profile.transport_preference}, stay {profile.accommodation_preference}, "
        f"pace {profile.pace_preference}, weather sensitivity {profile.risk_sensitivity}"
    )


class ProfileService:
    def __init__(self, session: Session) -> None:
        self.repo = ProfileRepository(session)

    def get_or_create(self, user: User) -> UserProfileResponse:
        existing = self.repo.get_by_user_id(user.id)
        if not existing:
            default_profile = UserProfileBase()
            existing = self.repo.save(
                UserProfile(
                    user_id=user.id,
                    profile_json=default_profile.model_dump(),
                    profile_summary=build_profile_summary(default_profile),
                    updated_at=utc_now(),
                )
            )
        return UserProfileResponse(
            user_id=user.id,
            profile=UserProfileBase(**existing.profile_json),
            profile_summary=existing.profile_summary,
            updated_at=existing.updated_at,
        )

    def update(self, user: User, payload: UserProfileUpdateRequest) -> UserProfileResponse:
        existing = self.repo.get_by_user_id(user.id)
        if not existing:
            existing = UserProfile(user_id=user.id)
        existing.profile_json = payload.model_dump()
        existing.profile_summary = build_profile_summary(UserProfileBase(**existing.profile_json))
        existing.updated_at = utc_now()
        saved = self.repo.save(existing)
        return UserProfileResponse(
            user_id=user.id,
            profile=UserProfileBase(**saved.profile_json),
            profile_summary=saved.profile_summary,
            updated_at=saved.updated_at,
        )
