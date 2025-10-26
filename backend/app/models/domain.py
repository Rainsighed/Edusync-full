from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import uuid4
from ..db.session import Base

# SQLAlchemy Models

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)

# Pydantic Schemas

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

    class Config:
        min_anystr_length = 8  # For password

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user: UserResponse
    message: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str
