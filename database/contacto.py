import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

TU_EMAIL = "gabrielenrique904@gmail.com"


def enviar_mensaje_contacto(email_remitente: str, mensaje: str) -> dict:
    """
    Envia un mensaje de contacto a tu email, con el email del usuario
    como reply-to para que puedas responderle directamente.
    """
    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": TU_EMAIL,
            "reply_to": email_remitente,
            "subject": f"Nuevo mensaje de contacto - AI Job Copilot",
            "html": f"""
                <p><strong>De:</strong> {email_remitente}</p>
                <p><strong>Mensaje:</strong></p>
                <p>{mensaje}</p>
            """
        })
        return {"exito": True, "mensaje": "Tu mensaje ha sido enviado correctamente."}
    except Exception as error:
        from core.manejo_errores import registrar_error
        registrar_error("Envio email contacto", str(error))
        return {"exito": False, "mensaje": "No pudimos enviar tu mensaje. Inténtalo de nuevo."}