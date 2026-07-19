from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Date
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


class TokenRecuperacion(Base):
    """
    Representa un token temporal para recuperar contraseña.
    Cada token es de un solo uso (usado=True tras cambiar la contraseña)
    y expira después de un tiempo limitado (verificado en el código, no aquí).
    """
    __tablename__ = "tokens_recuperacion"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    usado = Column(Boolean, default=False)


class UsoDiario(Base):
    """
    Cuenta cuántas veces un usuario ha usado una acción específica
    (analizar, buscar ofertas, generar CV) en un día determinado.
    Se usa para aplicar límites reales por cuenta de usuario, que
    sobreviven a recargas de pagina o cambios de navegador.
    """
    __tablename__ = "uso_diario"

    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, nullable=False)
    tipo_accion = Column(String, nullable=False)
    fecha = Column(Date, nullable=False)
    contador = Column(Integer, default=0)


class IntentoRecuperacion(Base):
    """
    Cuenta cuántas veces se ha solicitado un enlace de recuperacion de
    password para un email especifico en un dia determinado. Protege
    contra spam del endpoint de recuperacion (que dispara emails reales).
    """
    __tablename__ = "intentos_recuperacion"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    fecha = Column(Date, nullable=False)
    contador = Column(Integer, default=0)

class IntentoLogin(Base):
    """
    Registra intentos fallidos de login para un email especifico.
    Se usa para bloquear temporalmente el login tras varios fallos
    seguidos, protegiendo contra ataques de fuerza bruta.
    """
    __tablename__ = "intentos_login"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    fecha_intento = Column(DateTime, default=datetime.utcnow)


# El archivo job_copilot.db se crea automáticamente en la raíz del proyecto
engine = create_engine("sqlite:///job_copilot.db")
Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)