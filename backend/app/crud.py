from sqlalchemy.orm import Session
from app.models import User, Task
from app.schemas import UserCreate, TaskCreate, TaskUpdate
from app.auth import get_password_hash, verify_password

# User CRUD
def create_user(db: Session, user: UserCreate):
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# Task CRUD
def create_task(db: Session, task: TaskCreate, owner_id: int):
    db_task = Task(**task.model_dump(), owner_id=owner_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_user_tasks(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    return db.query(Task).filter(Task.owner_id == owner_id).offset(skip).limit(limit).all()

def search_tasks(db: Session, owner_id: int, search: str):
    return db.query(Task).filter(
        Task.owner_id == owner_id,
        Task.title.ilike(f"%{search}%")
    ).all()

def get_task(db: Session, task_id: int, owner_id: int):
    return db.query(Task).filter(Task.id == task_id, Task.owner_id == owner_id).first()

def update_task(db: Session, task_id: int, owner_id: int, task: TaskUpdate):
    db_task = get_task(db, task_id, owner_id)
    if not db_task:
        return None
    
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, owner_id: int):
    db_task = get_task(db, task_id, owner_id)
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False
