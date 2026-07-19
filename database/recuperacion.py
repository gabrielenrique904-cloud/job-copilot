import os
import secrets
from datetime import datetime, timedelta, date
import resend
from dotenv import load_dotenv
from database.modelos import Usuario, TokenRecuperacion, IntentoRecuperacion, SessionLocal

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

MINUTOS_EXPIRACION = 30
LIMITE_SOLICITUDES_DIARIAS = 3
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def solicitar_recuperacion(email: str) -> dict:
    """
    Genera un token de recuperación y envía un email con el enlace.
    Por seguridad, siempre devuelve el mismo mensaje de éxito, exista
    o no el email en la base de datos (evita revelar qué emails están
    registrados). Limita a un maximo de solicitudes por email al dia
    para evitar spam del endpoint (que dispara emails reales).
    """
    sesion = SessionLocal()
    try:
        hoy = date.today()

        intento = (
            sesion.query(IntentoRecuperacion)
            .filter(IntentoRecuperacion.email == email, IntentoRecuperacion.fecha == hoy)
            .first()
        )

        if not intento:
            intento = IntentoRecuperacion(email=email, fecha=hoy, contador=0)
            sesion.add(intento)

        if intento.contador >= LIMITE_SOLICITUDES_DIARIAS:
            return {
                "exito": True,
                "mensaje": "Si el email existe, recibirás un enlace de recuperación."
            }

        intento.contador += 1
        sesion.commit()

        usuario = sesion.query(Usuario).filter(Usuario.email == email).first()

        if not usuario:
            return {
                "exito": True,
                "mensaje": "Si el email existe, recibirás un enlace de recuperación."
            }

        token = secrets.token_urlsafe(32)

        nuevo_token = TokenRecuperacion(email=email, token=token)
        sesion.add(nuevo_token)
        sesion.commit()

        enlace = f"{FRONTEND_URL}/reset-password?token={token}"

        try:
            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": email,
                "subject": "Recuperación de contraseña - AI Job Copilot",
                "html": f"""
                    <p>Has solicitado recuperar tu contraseña en AI Job Copilot.</p>
                    <p>Haz clic en el siguiente enlace para crear una nueva contraseña
                    (válido por {MINUTOS_EXPIRACION} minutos):</p>
                    <p><a href="{enlace}">{enlace}</a></p>
                    <p>Si no solicitaste esto, ignora este correo.</p>
                """
            })
        except Exception as error:
            from core.manejo_errores import registrar_error
            registrar_error("Envio email recuperacion", str(error))

        return {
            "exito": True,
            "mensaje": "Si el email existe, recibirás un enlace de recuperación."
        }

    finally:
        sesion.close()


def resetear_password(token: str, nueva_password: str) -> dict:
    """
    Verifica el token y actualiza la contraseña del usuario correspondiente.
    """
    import bcrypt

    sesion = SessionLocal()
    try:
        registro_token = sesion.query(TokenRecuperacion).filter(
            TokenRecuperacion.token == token,
            TokenRecuperacion.usado == False
        ).first()

        if not registro_token:
            return {"exito": False, "mensaje": "El enlace no es válido o ya fue utilizado."}

        limite_expiracion = registro_token.fecha_creacion + timedelta(minutes=MINUTOS_EXPIRACION)
        if datetime.utcnow() > limite_expiracion:
            return {"exito": False, "mensaje": "El enlace ha expirado. Solicita uno nuevo."}

        usuario = sesion.query(Usuario).filter(Usuario.email == registro_token.email).first()
        if not usuario:
            return {"exito": False, "mensaje": "No pudimos completar la operación."}

        password_bytes = nueva_password.encode("utf-8")
        salt = bcrypt.gensalt()
        usuario.password_hash = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

        registro_token.usado = True

        sesion.commit()

        return {"exito": True, "mensaje": "Contraseña actualizada correctamente."}

    finally:
        sesion.close()