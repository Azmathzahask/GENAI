from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

from ..config import get_settings


router = APIRouter()
settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# NOTE: For a real deployment, replace this with Supabase or another DB.
fake_users_db: dict[str, dict] = {}


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class User(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=4))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_user_by_email(email: str) -> Optional[dict]:
    return fake_users_db.get(email.lower())


def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        email: str | None = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user_dict = get_user_by_email(email)
    if user_dict is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(id=user_dict["id"], email=user_dict["email"], full_name=user_dict.get("full_name"))


@router.post("/register", response_model=User)
async def register_user(payload: UserCreate) -> User:
    email = payload.email.lower()
    if email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = f"user_{len(fake_users_db) + 1}"
    fake_users_db[email] = {
        "id": user_id,
        "email": email,
        "full_name": payload.full_name,
        "hashed_password": get_password_hash(payload.password),
    }
    return User(id=user_id, email=email, full_name=payload.full_name)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user["email"]})
    return Token(access_token=access_token)


@router.get("/me", response_model=User)
async def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user

