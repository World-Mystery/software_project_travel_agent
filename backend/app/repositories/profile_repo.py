from sqlmodel import Session, select

from app.db.models import UserProfile


class ProfileRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_user_id(self, user_id: int) -> UserProfile | None:
        return self.session.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()

    def save(self, profile: UserProfile) -> UserProfile:
        self.session.add(profile)
        self.session.commit()
        self.session.refresh(profile)
        return profile
