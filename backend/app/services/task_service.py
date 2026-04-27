from fastapi import HTTPException, status
from sqlmodel import Session

from app.db.models import User
from app.dto.plan import TripPlanVersionResponse
from app.dto.task import PlanTaskStatusResponse
from app.repositories.task_repo import TaskRepository
from app.repositories.version_repo import VersionRepository


class TaskService:
    def __init__(self, session: Session) -> None:
        self.tasks = TaskRepository(session)
        self.versions = VersionRepository(session)

    def get_status(self, task_id: int, user: User) -> PlanTaskStatusResponse:
        task = self._get_owned_task(task_id, user)
        return PlanTaskStatusResponse.model_validate(task)

    def get_result(self, task_id: int, user: User) -> TripPlanVersionResponse:
        task = self._get_owned_task(task_id, user)
        if not task.result_version_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task result not ready")
        version = self.versions.get_by_id(task.result_version_id)
        if not version:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task result missing")
        return TripPlanVersionResponse.model_validate(version)

    def _get_owned_task(self, task_id: int, user: User):
        task = self.tasks.get_by_id(task_id)
        if not task or task.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task
