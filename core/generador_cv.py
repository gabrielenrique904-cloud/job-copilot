from core.ai_client import preguntar_a_gemini


def generar_cv_adaptado(
    cv_texto: str,
    oferta_texto: str,
    palabras_clave_ats: list = None,
    inclusiones_confirmadas: list = None,
) -> str:
    """
    Reescribe el CV del usuario destacando lo más relevante para la oferta,
    sin inventar experiencia que no esté en el CV original.
    Devuelve el CV adaptado como texto plano, listo para convertir a PDF.
    """

    instruccion_palabras_clave = ""
    if palabras_clave_ats:
        lista_palabras = ", ".join(palabras_clave_ats)
        instruccion_palabras_clave = (
            f"\n- Presta especial atencion a estas palabras clave de la oferta: "
            f"{lista_palabras}. Si el candidato tiene experiencia genuina relacionada "
            f"con alguna, usa el termino exacto de la oferta. NO las incluyas si el "
            f"candidato no tiene experiencia real relacionada."
        )

    instruccion_inclusiones = ""
    if inclusiones_confirmadas:
        lista_inclusiones = "\n".join(f"- {texto}" for texto in inclusiones_confirmadas)
        instruccion_inclusiones = (
            f"\n\nEl candidato ha CONFIRMADO explicitamente que las siguientes "
            f"experiencias son reales y autoriza incluirlas en el CV. Integralas "
            f"de forma natural en la seccion de experiencia correspondiente, "
            f"manteniendo el mismo estilo y formato que el resto del documento:\n"
            f"{lista_inclusiones}"
        )

    prompt = f"""
Eres un experto en redacción de CVs y en optimización para sistemas ATS
(Applicant Tracking System), especializado en el mercado laboral de España.
Reescribe el siguiente CV para que destaque lo más relevante de cara a la
oferta de trabajo indicada.

REGLAS IMPORTANTES:
- NO inventes experiencia, títulos ni habilidades que no estén en el CV original,
  salvo las inclusiones explicitamente confirmadas por el candidato (ver mas abajo,
  si las hay).
- REGLA ABSOLUTA E INNEGOCIABLE: el resultado DEBE caber en una sola pagina A4.
  Maximo 380 palabras en total, sin excepcion. Esto es mas importante que incluir
  todo el detalle posible: prioriza SOLO la experiencia y logros mas relevantes para
  esta oferta especifica. Resume agresivamente o elimina por completo experiencia
  antigua, poco relevante, o secciones secundarias si es necesario para cumplir
  este limite. Es preferible un CV corto y enfocado a uno completo que ocupe dos
  paginas.
- IDIOMA: detecta el idioma predominante de la OFERTA DE TRABAJO. El CV final
  debe estar COMPLETAMENTE en ese idioma, sin mezclar idiomas en ningun punto
  (ni siquiera en titulos de seccion o habilidades sueltas). Si la oferta esta
  mayoritariamente en ingles, el CV completo debe generarse en ingles. Si la
  oferta esta en español o el idioma no es claro, usa español. Nunca generes
  un CV con frases en dos idiomas distintos.
- ORDEN CRONOLOGICO: ordena TODA la experiencia (empleos, proyectos relevantes,
  formacion) de mas reciente a mas antigua, de forma estrictamente cronologica,
  usando fechas reales del CV original.
- FECHAS OBLIGATORIAS EN PROYECTOS: si incluyes una seccion de "Proyectos" o
  "Trabajo independiente", CADA proyecto debe llevar su fecha o rango de fechas
  visible, igual que cualquier empleo formal, usando el mismo formato de fecha
  consistente. Si el CV original no especifica fecha para un proyecto, usa el
  año que si este disponible aunque sea aproximado (ej: "2022"), pero nunca
  omitas la fecha por completo.
- POSICION DE PROYECTOS: la seccion de Proyectos debe integrarse en el orden
  cronologico real segun su fecha, junto con los empleos formales (no
  agrupada aparte al principio o al final salvo que cronologicamente le
  corresponda esa posicion). Si varios proyectos y empleos se solapan en fechas,
  ordena por fecha de inicio, mas reciente primero.
- METRICAS Y CUANTIFICACION: prioriza logros cuantificados (numeros, porcentajes,
  resultados medibles) sobre descripciones genericas. Si el CV original ya tiene
  datos numericos, destacalos. Si una experiencia relevante NO tiene ninguna
  metrica en el CV original pero el logro es cuantificable por naturaleza (ej:
  mejora de procesos, reduccion de tiempos, gestion de volumen), añade al final
  de esa linea la marca "[cuantificar impacto]" para que el candidato la rellene
  el mismo. NUNCA inventes una cifra especifica que no este en el CV original.
- Optimización ATS: incluye de forma natural las palabras clave y términos exactos
  que aparecen en la oferta de trabajo (títulos de puesto, tecnologías, habilidades),
  siempre que sean ciertos según el CV original.
- Usa títulos de sección estándar en mayúsculas, en el idioma detectado (ej:
  PERFIL PROFESIONAL / PROFESSIONAL SUMMARY, EXPERIENCIA / EXPERIENCE,
  HABILIDADES / SKILLS, FORMACIÓN / EDUCATION, IDIOMAS / LANGUAGES).
- Para las listas, usa el guion simple "-" al inicio de cada línea, nunca el símbolo "*".
- No uses guiones largos (–) ni comillas especiales; usa solo guion simple "-" y comillas rectas.
- Estructura clara y directa, sin relleno ni frases genéricas vacías.
- Devuelve SOLO el texto del CV final, sin explicaciones ni comentarios adicionales.
- Adapta la terminología de los títulos de puesto y logros para reflejar el lenguaje
  exacto de la oferta (sinónimos incluidos), sin inventar ni tergiversar lo que hiciste realmente.{instruccion_palabras_clave}
- Empieza cada punto de experiencia con un verbo de acción fuerte (ej: "Lideré",
  "Optimicé", "Gestioné", "Reduje" o sus equivalentes en el idioma detectado),
  evitando frases pasivas.
- Incluye variantes y sinónimos reales de las palabras clave de la oferta cuando
  correspondan a experiencia genuina del candidato (ej: si el CV menciona "CRM" y la
  oferta dice "gestión de relaciones con clientes", usa ambos términos si es natural).
- Usa fechas en formato consistente en todo el documento, con guion simple entre
  fechas (ej: "Enero 2024 - Enero 2025", nunca "Enero 2024 Enero 2025" sin separador).
{instruccion_inclusiones}

CV ORIGINAL:
{cv_texto}

OFERTA DE TRABAJO:
{oferta_texto}
"""

    return preguntar_a_gemini(prompt)


def sugerir_inclusion_palabra_clave(cv_texto: str, palabra_clave: str) -> str:
    """
    Sugiere cómo el candidato podría mencionar una palabra clave específica
    de forma natural, basándose únicamente en experiencia real de su CV.
    Si no hay relación genuina, lo indica claramente en vez de inventar.
    """
    prompt = f"""
Eres un experto en redacción de CVs. A continuación tienes el CV de un
candidato y una palabra clave especifica que NO aparece actualmente en su CV.

Tu tarea: revisa si el candidato tiene alguna experiencia REAL relacionada
(aunque este descrita con otras palabras) que permita incluir esa palabra
clave de forma honesta. Si la encuentras, sugiere una frase corta y natural
que el candidato podria añadir o modificar en su CV para reflejarlo.

Si NO hay ninguna experiencia real relacionada, responde exactamente:
"No encontramos experiencia relacionada en tu CV para incluir esta palabra
de forma honesta. Considera si realmente tienes esta habilidad antes de
añadirla."

NUNCA inventes experiencia que el candidato no tenga.

CV DEL CANDIDATO:
{cv_texto}

PALABRA CLAVE A CONSIDERAR:
{palabra_clave}

Responde solo con la sugerencia o el mensaje de "no encontrado", sin
explicaciones adicionales.
"""

    return preguntar_a_gemini(prompt)


from fpdf import FPDF


def crear_pdf_desde_texto(
    texto_cv: str, ruta_salida: str = "cv_adaptado.pdf", tamano_fuente: float = 9.5
) -> str:
    """
    Convierte el texto del CV adaptado en un archivo PDF compacto, pensado
    para caber en una sola página. Si el contenido no cabe con el tamaño
    de fuente indicado, se reintenta automáticamente con letra más pequeña,
    hasta un límite razonable, para garantizar que nunca se generen 2 páginas.
    """
    pdf = FPDF(format="A4")
    pdf.set_margins(left=14, top=12, right=14)
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()
    pdf.set_font("Helvetica", size=tamano_fuente)

    ancho_util = pdf.w - pdf.l_margin - pdf.r_margin
    titulos_seccion = {
        "PERFIL PROFESIONAL",
        "EXPERIENCIA",
        "EXPERIENCIA PROFESIONAL",
        "HABILIDADES",
        "HABILIDADES CLAVE",
        "FORMACIÓN",
        "FORMACIÓN COMPLEMENTARIA",
        "IDIOMAS",
        "LIDERAZGO Y VOLUNTARIADO",
        "PROFESSIONAL SUMMARY",
        "EXPERIENCE",
        "SKILLS",
        "EDUCATION",
        "LANGUAGES",
    }

    for linea in texto_cv.split("\n"):
        linea = linea.strip()

        linea = linea.replace("–", "-").replace("—", "-")
        linea = linea.replace("’", "'").replace("‘", "'")
        linea = linea.replace("“", '"').replace("”", '"')
        linea_segura = linea.encode("latin-1", "replace").decode("latin-1")

        pdf.set_x(pdf.l_margin)

        if linea_segura == "":
            pdf.ln(2)
        elif linea_segura.upper() in titulos_seccion:
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", tamano_fuente + 1.5)
            pdf.multi_cell(ancho_util, 6, linea_segura)
            pdf.set_font("Helvetica", size=tamano_fuente)
        elif linea_segura.startswith("*") or linea_segura.startswith("-"):
            texto_viñeta = linea_segura.lstrip("*-").strip()
            pdf.set_x(pdf.l_margin + 3)
            pdf.multi_cell(ancho_util - 3, 5, f"- {texto_viñeta}")
        else:
            pdf.multi_cell(ancho_util, 5, linea_segura)

    if pdf.page_no() > 1 and tamano_fuente > 9:
        return crear_pdf_desde_texto(texto_cv, ruta_salida, tamano_fuente - 0.5)

    pdf.output(ruta_salida)
    return ruta_salida


if __name__ == "__main__":
    with open("mi_cv.txt", "r", encoding="utf-8") as archivo:
        cv_real = archivo.read()

    with open("oferta.txt", "r", encoding="utf-8") as archivo:
        oferta_real = archivo.read()

    print("Generando CV adaptado...")
    cv_adaptado = generar_cv_adaptado(cv_real, oferta_real)
    print(cv_adaptado)

    ruta = crear_pdf_desde_texto(cv_adaptado)
    print(f"\nPDF generado en: {ruta}")
