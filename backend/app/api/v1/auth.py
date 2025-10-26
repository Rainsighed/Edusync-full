from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from typing import Optional
from uuid import uuid4

from ...db.session import get_db
from ...models.domain import (
    User, UserCreate, UserResponse, LoginRequest, AuthResponse
)
from ...utils.auth import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, verify_token, get_current_user_id
)

router = APIRouter()

def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    """
    Set authentication cookies on response.

    Args:
        response: FastAPI Response object
        access_token: JWT access token
        refresh_token: JWT refresh token
    """
    # Set access token cookie (1 hour)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=3600,  # 1 hour in seconds
        path="/"
    )

    # Set refresh token cookie (7 days)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=604800,  # 7 days in seconds
        path="/"
    )

def clear_auth_cookies(response: Response):
    """
    Clear authentication cookies from response.

    Args:
        response: FastAPI Response object
    """
    response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=0,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value="",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=0,
        path="/"
    )

@router.post("/auth/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, response: Response, db: Session = Depends(get_db)):
    """
    Create a new user account.

    Args:
        user_data: User registration data (email, password, name)
        response: FastAPI Response object
        db: Database session

    Returns:
        AuthResponse with user data and success message

    Raises:
        HTTPException 400: If email already exists or validation fails
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate password length
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )

    # Hash password
    password_hash = hash_password(user_data.password)

    # Create new user
    new_user = User(
        id=uuid4(),
        email=user_data.email,
        password_hash=password_hash,
        name=user_data.name,
        is_active=True
    )

    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate tokens
    access_token = create_access_token(str(new_user.id))
    refresh_token = create_refresh_token(str(new_user.id))

    # Set cookies
    set_auth_cookies(response, access_token, refresh_token)

    # Prepare response
    user_response = UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        name=new_user.name,
        created_at=new_user.created_at
    )

    return AuthResponse(user=user_response, message="Account created")

@router.post("/auth/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Authenticate user and create session.

    Args:
        credentials: Login credentials (email, password)
        response: FastAPI Response object
        db: Database session

    Returns:
        AuthResponse with user data and success message

    Raises:
        HTTPException 401: If credentials are invalid
        HTTPException 403: If account is disabled
        HTTPException 404: If user not found
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account disabled"
        )

    # Generate tokens
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    # Set cookies
    set_auth_cookies(response, access_token, refresh_token)

    # Prepare response
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        created_at=user.created_at
    )

    return AuthResponse(user=user_response, message="Login successful")

@router.post("/auth/logout")
async def logout(response: Response):
    """
    Logout user by clearing authentication cookies.

    Args:
        response: FastAPI Response object

    Returns:
        Success message
    """
    clear_auth_cookies(response)
    return {"message": "Logged out"}

@router.post("/auth/refresh")
async def refresh(response: Response, refresh_token: Optional[str] = Cookie(None)):
    """
    Refresh access token using refresh token.

    Args:
        response: FastAPI Response object
        refresh_token: JWT refresh token from cookie

    Returns:
        Success message

    Raises:
        HTTPException 401: If refresh token is missing or invalid
    """
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required"
        )

    # Verify refresh token
    try:
        payload = verify_token(refresh_token, token_type="refresh")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Generate new access token
    new_access_token = create_access_token(user_id)

    # Set new access token cookie
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,  # Set to True in production
        samesite="lax",
        max_age=3600,  # 1 hour
        path="/"
    )

    return {"message": "Token refreshed"}

@router.get("/auth/me", response_model=UserResponse)
async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user's data.

    Args:
        user_id: Current user ID from token dependency
        db: Database session

    Returns:
        UserResponse with current user data

    Raises:
        HTTPException 404: If user not found
    """
    # Find user by ID
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Return user data
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        created_at=user.created_at
    )
