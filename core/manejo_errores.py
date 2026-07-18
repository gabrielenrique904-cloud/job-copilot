import logging

logging.basicConfig(
    filename="errores_app.log",
    level=logging.ERROR,
    format="%(asctime)s - %(message)s"
)


def registrar_error(contexto: str, error_original: str):
    """
    Guarda el detalle técnico del error en un archivo de log,
    para que tú puedas depurarlo sin exponer detalles internos al usuario.
    """
    logging.error(f"[{contexto}] {error_original}")


def mensaje_amigable_ia() -> str:
    return (
        "No pudimos completar el análisis en este momento. "
        "Esto suele pasar por alta demanda en el servicio de IA. "
        "Por favor, inténtalo de nuevo en unos segundos."
    )


def mensaje_amigable_busqueda() -> str:
    return (
        "No pudimos buscar ofertas en este momento. "
        "Por favor, inténtalo de nuevo en unos minutos."
    )