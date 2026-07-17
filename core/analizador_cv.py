import json
from core.ai_client import preguntar_a_gemini


def analizar_match(cv_texto: str, oferta_texto: str) -> dict:
    """
    Compara un CV contra una oferta de trabajo usando IA.
    Devuelve un diccionario con: porcentaje de match, fortalezas y carencias.
    Si algo falla (respuesta inválida, error de conexión), devuelve un
    diccionario de error en vez de romper el programa.
    """

    LIMITE_CARACTERES = 6000

    if len(cv_texto) > LIMITE_CARACTERES or len(oferta_texto) > LIMITE_CARACTERES:
        return {
            "error": f"El texto es demasiado largo (máximo {LIMITE_CARACTERES} caracteres). "
                     f"Por favor, revisa que no hayas pegado contenido de más."
        }

    prompt = f"""
Eres un experto en reclutamiento. Compara el siguiente CV con la oferta de trabajo.

CV DEL CANDIDATO:
{cv_texto}

OFERTA DE TRABAJO:
{oferta_texto}

Responde ÚNICAMENTE con un JSON válido, sin texto adicional antes ni después,
con exactamente esta estructura:

{{
  "porcentaje_match": <número entero del 0 al 100>,
  "fortalezas": ["punto fuerte 1", "punto fuerte 2"],
  "carencias": ["lo que le falta 1", "lo que le falta 2"]
}}
"""

    respuesta_texto = preguntar_a_gemini(prompt)

    # Gemini a veces envuelve el JSON en ```json ... ``` -> lo limpiamos
    respuesta_limpia = respuesta_texto.strip()
    if respuesta_limpia.startswith("```"):
        respuesta_limpia = respuesta_limpia.strip("`")
        respuesta_limpia = respuesta_limpia.replace("json", "", 1).strip()

    try:
        resultado = json.loads(respuesta_limpia)
        return resultado
    except json.JSONDecodeError:
        return {
            "error": "La IA no devolvió un JSON válido.",
            "respuesta_original": respuesta_texto
        }


# Prueba rápida al ejecutar este archivo directamente
if __name__ == "__main__":
    with open("mi_cv.txt", "r", encoding="utf-8") as archivo:
        cv_real = archivo.read()

    with open("oferta.txt", "r", encoding="utf-8") as archivo:
        oferta_real = archivo.read()

    resultado = analizar_match(cv_real, oferta_real)
    print(json.dumps(resultado, indent=2, ensure_ascii=False))