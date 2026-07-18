import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "No se encontró GEMINI_API_KEY. Revisa que tu archivo .env exista y tenga la clave."
    )

# Ya no creamos el cliente aquí arriba. Lo creamos "perezosamente"
# (solo la primera vez que se necesite), para no bloquear el arranque de la app.
_client = None


def _obtener_cliente():
    global _client
    if _client is None:
        _client = genai.Client(api_key=api_key)
    return _client


def preguntar_a_gemini(mensaje: str, intentos: int = 3) -> str:
    cliente = _obtener_cliente()

    for intento_actual in range(1, intentos + 1):
        try:
            respuesta = cliente.models.generate_content(
               model="gemini-flash-lite-latest",
                contents=mensaje
            )
            return respuesta.text
        except Exception as error:
            es_ultimo_intento = intento_actual == intentos
            if es_ultimo_intento:
                from core.manejo_errores import registrar_error, mensaje_amigable_ia
                registrar_error("Gemini", str(error))
                return mensaje_amigable_ia()

            espera = intento_actual * 2
            print(f"Intento {intento_actual} fallo ({error}). Reintentando en {espera}s...")
            time.sleep(espera)


if __name__ == "__main__":
    print("Probando conexión con Gemini...")
    resultado = preguntar_a_gemini("Responde solo con: 'Conexión exitosa'")
    print(resultado)