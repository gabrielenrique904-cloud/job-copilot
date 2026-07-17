from core.ai_client import preguntar_a_gemini


def generar_cv_adaptado(cv_texto: str, oferta_texto: str) -> str:
    """
    Reescribe el CV del usuario destacando lo más relevante para la oferta,
    sin inventar experiencia que no esté en el CV original.
    Devuelve el CV adaptado como texto plano, listo para convertir a PDF.
    """

    prompt = f"""
Eres un experto en redacción de CVs y en optimización para sistemas ATS
(Applicant Tracking System). Reescribe el siguiente CV para que destaque
lo más relevante de cara a la oferta de trabajo indicada.

REGLAS IMPORTANTES:
- NO inventes experiencia, títulos ni habilidades que no estén en el CV original.
- El resultado DEBE caber en una sola página (aproximadamente 400-450 palabras en total).
  Para lograrlo: prioriza SOLO la experiencia y logros más relevantes para esta oferta.
  Resume o elimina experiencia antigua o poco relevante en vez de incluirlo todo.
- Optimización ATS: incluye de forma natural las palabras clave y términos exactos
  que aparecen en la oferta de trabajo (títulos de puesto, tecnologías, habilidades),
  siempre que sean ciertos según el CV original.
- Usa títulos de sección estándar en mayúsculas: PERFIL PROFESIONAL, EXPERIENCIA,
  HABILIDADES, FORMACIÓN, IDIOMAS.
- Para las listas, usa el guion simple "-" al inicio de cada línea, nunca el símbolo "*".
- No uses guiones largos (–) ni comillas especiales; usa solo guion simple "-" y comillas rectas.
- Estructura clara y directa, sin relleno ni frases genéricas vacías.
- Devuelve SOLO el texto del CV final, sin explicaciones ni comentarios adicionales.
- Adapta la terminología de los títulos de puesto y logros para reflejar el lenguaje
  exacto de la oferta (sinónimos incluidos), sin inventar ni tergiversar lo que hiciste realmente.
- Prioriza logros cuantificados (números, porcentajes, resultados medibles) sobre
  descripciones genéricas de responsabilidades. Si el CV original tiene datos numéricos,
  destácalos; no inventes cifras que no estén en el CV original.
- Empieza cada punto de experiencia con un verbo de acción fuerte (ej: "Lideré",
  "Optimicé", "Gestioné", "Reduje"), evitando frases pasivas.
- Incluye variantes y sinónimos reales de las palabras clave de la oferta cuando
  correspondan a experiencia genuina del candidato (ej: si el CV menciona "CRM" y la
  oferta dice "gestión de relaciones con clientes", usa ambos términos si es natural).
- Usa fechas en formato consistente en todo el documento (ej: "Enero 2024 - Enero 2025").

CV ORIGINAL:
{cv_texto}

OFERTA DE TRABAJO:
{oferta_texto}
"""

    return preguntar_a_gemini(prompt)

from fpdf import FPDF


def crear_pdf_desde_texto(texto_cv: str, ruta_salida: str = "cv_adaptado.pdf") -> str:
    """
    Convierte el texto del CV adaptado en un archivo PDF compacto, pensado
    para caber en una sola página cuando el texto está bien resumido.
    """
    pdf = FPDF(format="A4")
    pdf.set_margins(left=14, top=12, right=14)
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()
    pdf.set_font("Helvetica", size=9.5)

    ancho_util = pdf.w - pdf.l_margin - pdf.r_margin
    titulos_seccion = {
        "PERFIL PROFESIONAL", "EXPERIENCIA", "EXPERIENCIA PROFESIONAL",
        "HABILIDADES", "HABILIDADES CLAVE", "FORMACIÓN",
        "FORMACIÓN COMPLEMENTARIA", "IDIOMAS", "LIDERAZGO Y VOLUNTARIADO"
    }

    for linea in texto_cv.split("\n"):
        linea = linea.strip()

        # Normalizamos caracteres que la fuente basica no soporta
        linea = linea.replace("–", "-").replace("—", "-")
        linea = linea.replace("’", "'").replace("‘", "'")
        linea = linea.replace("“", '"').replace("”", '"')
        linea_segura = linea.encode("latin-1", "replace").decode("latin-1")

        pdf.set_x(pdf.l_margin)

        if linea_segura == "":
            pdf.ln(2)
        elif linea_segura.upper() in titulos_seccion:
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 11)
            pdf.multi_cell(ancho_util, 6, linea_segura)
            pdf.set_font("Helvetica", size=9.5)
        elif linea_segura.startswith("*") or linea_segura.startswith("-"):
            texto_viñeta = linea_segura.lstrip("*-").strip()
            pdf.set_x(pdf.l_margin + 3)
            pdf.multi_cell(ancho_util - 3, 5, f"- {texto_viñeta}")
        else:
            pdf.multi_cell(ancho_util, 5, linea_segura)

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