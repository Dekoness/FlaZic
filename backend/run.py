from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Text, Boolean, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID  # ← ELIMINAR ESTA LÍNEA
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr, field_validator
from passlib.context import CryptContext
import uuid
import os
from datetime import datetime, timedelta
from typing import Optional, Any
# import hashlib
import bcrypt

# ==================== CONFIGURACIÓN BASE DE DATOS ====================
SQLALCHEMY_DATABASE_URL = "sqlite:///./flazic.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==================== MODELO USER ====================
class User(Base):
    __tablename__ = "users"
    
    # CAMBIO AQUÍ: Usar String en lugar de UUID para SQLite
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=False)
    bio = Column(Text)
    avatar_url = Column(String(500))
    location = Column(String(100))
    website_url = Column(String(500))
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.username} ({self.email})>"

# Crear tablas
Base.metadata.create_all(bind=engine)
print("✅ Tablas de base de datos creadas")

# ==================== ESQUEMAS PYDANTIC (ACTUALIZADO) ====================
class UserBase(BaseModel):
    email: EmailStr
    username: str
    display_name: str
    
    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username solo puede contener letras, números, _ y -')
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Username debe tener entre 3 y 50 caracteres')
        return v.lower()

class UserCreate(UserBase):
    password: str
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password debe tener al menos 8 caracteres')
        if len(v) > 72:
            raise ValueError('Password no puede tener más de 72 caracteres')
        return v

class UserResponse(UserBase):
    id: str  # CAMBIO AQUÍ: Ahora es string en lugar de UUID
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    website_url: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ==================== AUTENTICACIÓN ====================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar password usando bcrypt directamente"""
    try:
        # Asegurarse de que hashed_password es bytes
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
    except Exception as e:
        print(f"❌ Error verificando password: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hashear password usando bcrypt directamente"""
    try:
        # Limitar longitud para bcrypt
        if len(password) > 72:
            password = password[:72]
            print("⚠️ Password truncado a 72 caracteres")
        
        # Generar salt y hash
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Devolver como string (no bytes)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"❌ Error hasheando password: {e}")
        # Fallback temporal
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

# ==================== SERVICIO DE USUARIOS ====================
class UserService:
    @staticmethod
    def create_user(db: Session, user_data: UserCreate):
        # Verificar si el email ya existe
        if db.query(User).filter(User.email == user_data.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Verificar si el username ya existe
        if db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Crear el usuario
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            # CAMBIO AQUÍ: Ya no necesitamos pasar id explícitamente por el default
            email=user_data.email,
            username=user_data.username,
            display_name=user_data.display_name,
            password_hash=hashed_password
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user

# ==================== FASTAPI APP ====================
app = FastAPI(
    title="flazic API",
    description="Backend para la red social de músicos amateur",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== RUTAS ====================
@app.get("/")
def read_root():
    return {"message": "🎵 flazic API está funcionando!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    user = UserService.create_user(db, user_data)
    return user

@app.post("/auth/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login de usuario"""
    user = UserService.authenticate_user(db, login_data.email, login_data.password)
    return {
        "message": "Login successful",
        "user_id": user.id,  # CAMBIO AQUÍ: Ya es string, no necesita str()
        "username": user.username,
        "email": user.email
    }

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    """Obtener todos los usuarios (para testing)"""
    users = db.query(User).all()
    return {"users": [{"id": user.id, "username": user.username, "email": user.email} for user in users]}

# ==================== INICIAR SERVIDOR ====================
if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando flazic API en http://localhost:8000")
    print("📚 Documentación disponible en http://localhost:8000/docs")
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)