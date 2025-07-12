from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..services.mistral_ai import analyze_lesson
from ..db.session import get_db
from ..models.domain import Lesson

router = APIRouter()

@router.post("/analyze")
async def analyze_lesson_endpoint(lesson: Lesson, db: Session = Depends(get_db)):
    try:
        analysis = await analyze_lesson(lesson.content)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))