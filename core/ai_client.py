import os
from dotenv import load_dotenv
from google import genai

# Carga las variables del archivo .env (nuestra clave secreta)
load_dotenv()

# Lee la clave desde las variables de entorno, nunca escrita directamente aquí
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "No se encontró GEMINI_API_KEY. Revisa que tu archivo .env exista y tenga la clave."
    )

# Creamos el cliente que hablará con Gemini
client = genai.Client(api_key=api_key)


def preguntar_a_gemini(mensaje: str) -> str:
    """
    Envía un mensaje a Gemini y devuelve su respuesta como texto.
    Si algo falla (sin internet, key inválida, etc.), lo indicamos claramente
    en vez de dejar que el programa se rompa sin explicación.
    """
    try:
        respuesta = client.models.generate_content(
            model="gemini-flash-latest",
            contents=mensaje
        )
        return respuesta.text
    except Exception as error:
        return f"Error al conectar con Gemini: {error}"


# Esto solo se ejecuta si corres ESTE archivo directamente (para probar)
if __name__ == "__main__":
    print("Probando conexión con Gemini...")
    resultado = preguntar_a_gemini("Responde solo con: 'Conexión exitosa'")
    print(resultado)