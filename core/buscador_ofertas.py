import os
import requests
from dotenv import load_dotenv
from core.analizador_cv import analizar_match

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")

if not APP_ID or not APP_KEY:
    raise ValueError(
        "Faltan ADZUNA_APP_ID o ADZUNA_APP_KEY en el .env. Revisa que existan."
    )

BASE_URL = "https://api.adzuna.com/v1/api/jobs/es/search/1"


def buscar_ofertas(
    palabras_clave: str,
    ubicacion: str = "Madrid",
    max_dias_antiguedad: int = 1,
    cantidad: int = 10,
) -> list:
    """
    Busca ofertas reales de empleo en España usando la API de Adzuna.
    """
    parametros = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "what": palabras_clave,
        "max_days_old": max_dias_antiguedad,
        "results_per_page": cantidad,
        "content-type": "application/json",
    }

    if ubicacion:
        parametros["where"] = ubicacion

    try:
        respuesta = requests.get(BASE_URL, params=parametros, timeout=10)
        respuesta.raise_for_status()
        datos = respuesta.json()
    except requests.exceptions.RequestException as error:
        from core.manejo_errores import registrar_error

        registrar_error("Adzuna", str(error))
        return []

    ofertas_encontradas = []
    for oferta in datos.get("results", []):
        ofertas_encontradas.append(
            {
                "titulo": oferta.get("title", "Sin título"),
                "empresa": oferta.get("company", {}).get(
                    "display_name", "Empresa no especificada"
                ),
                "ubicacion": oferta.get("location", {}).get(
                    "display_name", "Ubicación no especificada"
                ),
                "descripcion": oferta.get("description", ""),
                "url": oferta.get("redirect_url", ""),
            }
        )

    return ofertas_encontradas


def buscar_y_analizar_ofertas(
    cv_texto: str,
    palabras_clave: str,
    ubicacion: str = "Madrid",
    max_dias_antiguedad: int = 1,
    cantidad: int = 10,
) -> list:
    """
    Busca ofertas reales y calcula el % de match de cada una contra el CV dado.
    Devuelve la lista ordenada de mayor a menor match.
    """
    ofertas = buscar_ofertas(palabras_clave, ubicacion, max_dias_antiguedad, cantidad)

    ofertas_analizadas = []
    for oferta in ofertas:
        resultado = analizar_match(cv_texto, oferta["descripcion"])

        if "error" not in resultado:
            oferta["match"] = resultado["porcentaje_match"]
            oferta["fortalezas"] = resultado["fortalezas"]
            oferta["carencias"] = resultado["carencias"]
            oferta["palabras_clave_ats"] = resultado.get("palabras_clave_ats", [])
            oferta["palabras_clave_cumplidas"] = resultado.get(
                "palabras_clave_cumplidas", []
            )
            oferta["red_flags"] = resultado.get("red_flags", [])
            ofertas_analizadas.append(oferta)

    ofertas_analizadas.sort(key=lambda o: o["match"], reverse=True)
    return ofertas_analizadas


if __name__ == "__main__":
    with open("mi_cv.txt", "r", encoding="utf-8") as archivo:
        cv_real = archivo.read()

    print(
        "Buscando y analizando ofertas de Customer Success en Madrid (últimas 24h)..."
    )
    ofertas = buscar_y_analizar_ofertas(
        cv_real, "customer success", ubicacion="Madrid", max_dias_antiguedad=1
    )

    print(
        f"\nSe encontraron y analizaron {len(ofertas)} ofertas, ordenadas por match:\n"
    )
    for i, oferta in enumerate(ofertas, start=1):
        print(
            f"{i}. [{oferta['match']}% match] {oferta['titulo']} — {oferta['empresa']}"
        )
        print(f"   {oferta['url']}\n")
