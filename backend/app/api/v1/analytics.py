from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..services.analytics_lake import get_analytics
from ..db.session import get_db

router = APIRouter()

@router.get("/dashboard")
async def get_analytics_dashboard(db: Session = Depends(get_db)):
    analytics_data = get_analytics(db)
    return analytics_data