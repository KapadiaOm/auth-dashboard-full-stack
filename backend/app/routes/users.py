from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserResponse
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_profile(current_user = Depends(get_current_user)):
    return current_user
