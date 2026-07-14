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

client = genai.Client(api_key=api_key)


def preguntar_a_gemini(mensaje: str, intentos: int = 3) -> str:
    """
    Envía un mensaje a Gemini y devuelve su respuesta como texto.
    Reintenta automáticamente si el servicio está saturado (error 503),
    esperando un poco más entre cada intento.
    """
    for intento_actual in range(1, intentos + 1):
        try:
            respuesta = client.models.generate_content(
                model="gemini-flash-lite-latest",
                contents=mensaje
            )
            return respuesta.text
        except Exception as error:
            es_ultimo_intento = intento_actual == intentos
            if es_ultimo_intento:
                return f"Error al conectar con Gemini tras {intentos} intentos: {error}"

            espera = intento_actual * 2  # 2s, 4s, 6s...
            print(f"Intento {intento_actual} fallo ({error}). Reintentando en {espera}s...")
            time.sleep(espera)


if __name__ == "__main__":
    print("Probando conexión con Gemini...")
    resultado = preguntar_a_gemini("Responde solo con: 'Conexión exitosa'")
    print(resultado)