from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

Base = declarative_base()


class Usuario(Base):
    """
    Representa a un usuario registrado en la aplicación.
    La contraseña NUNCA se guarda en texto plano — se guarda ya hasheada
    (transformada de forma irreversible) en el campo password_hash.
    """
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)


# El archivo job_copilot.db se crea automáticamente en la raíz del proyecto
engine = create_engine("sqlite:///job_copilot.db")
Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)