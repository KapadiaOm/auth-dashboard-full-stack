from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import TaskResponse, TaskCreate, TaskUpdate
from app.crud import (
    create_task, get_user_tasks, search_tasks,
    get_task, update_task, delete_task
)
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=TaskResponse)
def create_new_task(
    task: TaskCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_task(db, task, current_user.id)

@router.get("/", response_model=List[TaskResponse])
def list_tasks(
    search: str = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if search:
        return search_tasks(db, current_user.id, search)
    return get_user_tasks(db, current_user.id)

@router.get("/{task_id}", response_model=TaskResponse)
def get_single_task(
    task_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_single_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = update_task(db, task_id, current_user.id, task_update)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{task_id}")
def delete_single_task(
    task_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not delete_task(db, task_id, current_user.id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
