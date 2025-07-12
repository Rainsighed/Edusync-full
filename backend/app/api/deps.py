from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from .db.session import get_db

def get_db_session():
    try:
        db = get_db()
        yield db
    finally:
        db.close()