from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...models.domain import User, UserUpdate, UserResponse, PasswordChange
from ...utils.auth import get_current_user_id, hash_password, verify_password

router = APIRouter()

@router.get("/users/me", response_model=UserResponse)
async def get_current_user_profile(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile.

    Args:
        user_id: Current user ID from token dependency
        db: Database session

    Returns:
        UserResponse with current user data

    Raises:
        HTTPException 404: If user not found
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        created_at=user.created_at
    )

@router.put("/users/me", response_model=UserResponse)
async def update_user_profile(
    user_data: UserUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.

    Args:
        user_data: Updated user data (email, name)
        user_id: Current user ID from token dependency
        db: Database session

    Returns:
        UserResponse with updated user data

    Raises:
        HTTPException 400: If email already exists
        HTTPException 404: If user not found
    """
    # Find current user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # If email is being changed, check if new email already exists
    if user_data.email and user_data.email != user.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        user.email = user_data.email

    # Update name if provided
    if user_data.name is not None:
        user.name = user_data.name

    # Save changes
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        created_at=user.created_at
    )

@router.post("/users/me/password")
async def change_password(
    password_data: PasswordChange,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Change current user's password.

    Args:
        password_data: Old and new password
        user_id: Current user ID from token dependency
        db: Database session

    Returns:
        Success message

    Raises:
        HTTPException 400: If old password is incorrect
        HTTPException 404: If user not found
    """
    # Find current user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Verify old password
    if not verify_password(password_data.old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )

    # Hash and update new password
    user.password_hash = hash_password(password_data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}

@router.delete("/users/me")
async def delete_user_account(
    response: Response,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Delete (deactivate) current user's account.

    Args:
        response: FastAPI Response object
        user_id: Current user ID from token dependency
        db: Database session

    Returns:
        Success message

    Raises:
        HTTPException 404: If user not found
    """
    # Find current user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Soft delete - set is_active to False
    user.is_active = False
    db.commit()

    # Clear auth cookies
    response.set_cookie(key="access_token", value="", max_age=0)
    response.set_cookie(key="refresh_token", value="", max_age=0)

    return {"message": "Account deleted successfully"}
