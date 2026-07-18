PATRONES_SOSPECHOSOS = [
    "ignora las instrucciones",
    "ignora todas las instrucciones",
    "olvida las instrucciones",
    "olvida lo anterior",
    "actúa como",
    "eres ahora",
    "nuevo rol",
    "system prompt",
    "responde siempre con",
    "no importa el contenido",
]


def contiene_intento_manipulacion(texto: str) -> bool:
    """
    Detecta patrones comunes de intento de manipular a la IA (prompt injection).
    """
    texto_normalizado = texto.lower()
    return any(patron in texto_normalizado for patron in PATRONES_SOSPECHOSOS)
