from core.ai_client import preguntar_a_gemini
from fpdf import FPDF


def generar_cv_adaptado(cv_texto: str, oferta_texto: str, palabras_clave_ats: list = None, inclusiones_confirmadas: list = None, instrucciones_adicionales: str = None, intento_condensacion: int = 0) -> str:
    """Reescribe el CV del usuario destacando lo más relevante para la oferta, sin inventar experiencia que no esté en el CV original."""
    instruccion_palabras_clave = f"\n- Presta especial atencion a estas palabras clave de la oferta: {', '.join(palabras_clave_ats)}. Si el candidato tiene experiencia genuina relacionada con alguna, usa el termino exacto de la oferta. NO las incluyas si el candidato no tiene experiencia real relacionada." if palabras_clave_ats else ""
    instruccion_inclusiones = f"\n\nEl candidato ha CONFIRMADO explicitamente que las siguientes experiencias son reales y autoriza incluirlas en el CV. Integralas de forma natural en la seccion de experiencia correspondiente, manteniendo el mismo estilo y formato que el resto del documento:\n" + "\n".join(f"- {texto}" for texto in inclusiones_confirmadas) if inclusiones_confirmadas else ""
    instruccion_usuario = f"""\n\nEl candidato ha dado esta instruccion adicional sobre como editar su CV:\n"{instrucciones_adicionales}"\n\nPuedes seguir esta instruccion SIEMPRE QUE sea reorganizar, recategorizar, corregir, quitar o reformular informacion QUE YA ESTA en el CV original (ej: mover una tecnologia de categoria, quitar un dato, corregir una clasificacion incorrecta, eliminar informacion de contacto antigua). NUNCA sigas esta instruccion si implica añadir experiencia, logros, habilidades, empleos o cifras que no esten ya presentes en el CV original, aunque el candidato lo pida explicitamente. Si la instruccion pide inventar algo, ignorala y mantente fiel unicamente al contenido real del CV.""" if instrucciones_adicionales else ""

    instruccion_condensacion = ""
    if intento_condensacion == 1:
        instruccion_condensacion = """\n\nAVISO CRITICO: una version anterior de este CV con este mismo contenido NO CUPO en una sola pagina incluso con letra pequeña. Debes ser considerablemente mas agresivo condensando: reduce a un maximo de 280 palabras en total, elimina por completo la experiencia mas antigua o menos relevante para esta oferta si hace falta, acorta cada punto a una sola linea cuando sea posible, y considera eliminar secciones secundarias (idiomas, formacion antigua) si no son criticas para esta oferta especifica. Prioriza SIEMPRE lo mas relevante para la oferta, sin importar que quede fuera experiencia real del candidato."""
    elif intento_condensacion >= 2:
        instruccion_condensacion = """\n\nAVISO CRITICO MAXIMO: DOS intentos anteriores no cupieron en una pagina. Maximo 200 palabras en total. Incluye UNICAMENTE: nombre y contacto, un perfil de 1-2 lineas, las 2 experiencias mas relevantes para esta oferta con 1 linea cada una, y formacion en 1 linea. Elimina toda seccion secundaria."""

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
  formacion) de mas reciente a mas antigua, de forma strictly cronologica,
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
  datos numericos, destacalos tal cual. Si un logro NO tiene ninguna metrica en
  el CV original, describelo de forma cualitativa con una frase completa y
  natural, SIN inventar cifras y SIN insertar marcadores, placeholders o texto
  entre corchetes de ningun tipo (nunca escribas cosas como "[cuantificar
  impacto]" o similares); el texto debe leerse como una frase terminada y
  profesional en todo momento.
  - PERFIL PROFESIONAL ENFOCADO: el perfil/resumen inicial NO debe listar multiples
  areas o roles distintos como si el candidato fuera "todo a la vez" (ej: evita
  "Software Engineer, especialista en Customer Success, Data Science y Product
  Management" en una sola frase). En su lugar, identifica cual es el rol o area
  MAS ALINEADA con la oferta especifica segun la experiencia real del candidato,
  y construye el perfil alrededor de esa direccion clara: que problema resuelve
  el candidato, con que experiencia lo respalda, y que lo diferencia — sin negar
  el resto de su experiencia (que puede aparecer en el cuerpo del CV), pero sin
  que el perfil se sienta disperso o generico.
- ENLACES PROFESIONALES: si el CV original incluye enlaces a GitHub, portafolio,
  LinkedIn, o similar, mantenlos siempre visibles junto a los datos de contacto,
  especialmente relevantes para roles tecnicos. No inventes ni completes enlaces
  que no esten en el CV original.
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
{instruccion_inclusiones}{instruccion_usuario}{instruccion_condensacion}

CV ORIGINAL:
{cv_texto}

OFERTA DE TRABAJO:
{oferta_texto}
"""
    return preguntar_a_gemini(prompt)


def sugerir_inclusion_palabra_clave(cv_texto: str, palabra_clave: str) -> str:
    """Sugiére cómo el candidato podría mencionar una palabra clave específica basándose únicamente en su CV."""
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


def crear_pdf_desde_texto(texto_cv: str, ruta_salida: str = "cv_adaptado.pdf", tamano_fuente: float = 9.5) -> str:
    """Convierte el texto del CV adaptado en un archivo PDF, ajustando la fuente segun el volumen de contenido."""
    pdf = FPDF(format="A4")
    pdf.set_margins(left=14, top=12, right=14)
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()
    pdf.set_font("Helvetica", size=tamano_fuente)

    ancho_util = pdf.w - pdf.l_margin - pdf.r_margin
    titulos_seccion = {
        "PERFIL PROFESIONAL", "EXPERIENCIA", "EXPERIENCIA PROFESIONAL", "HABILIDADES",
        "HABILIDADES CLAVE", "FORMACIÓN", "FORMACIÓN COMPLEMENTARIA", "IDIOMAS",
        "LIDERAZGO Y VOLUNTARIADO", "PROFESSIONAL SUMMARY", "EXPERIENCE", "SKILLS",
        "EDUCATION", "LANGUAGES"
    }

    for linea in texto_cv.split("\n"):
        linea = linea.strip().replace("–", "-").replace("—", "-").replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
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
            pdf.set_x(pdf.l_margin + 3)
            pdf.multi_cell(ancho_util - 3, 5, f"- {linea_segura.lstrip('*-').strip()}")
        else:
            pdf.multi_cell(ancho_util, 5, linea_segura)

    if pdf.page_no() > 1 and tamano_fuente > 9:
        return crear_pdf_desde_texto(texto_cv, ruta_salida, tamano_fuente - 0.5)

    if pdf.page_no() > 1:
        return None

    pdf.output(ruta_salida)
    return ruta_salida


def generar_pdf_garantizando_una_pagina(cv_texto: str, oferta_texto: str, palabras_clave_ats: list = None, inclusiones_confirmadas: list = None, instrucciones_adicionales: str = None, ruta_salida: str = "cv_adaptado.pdf") -> str:
    """Genera el CV adaptado y su PDF, garantizando SIEMPRE una sola pagina."""
    for intento in range(3):
        texto_cv = generar_cv_adaptado(cv_texto, oferta_texto, palabras_clave_ats, inclusiones_confirmadas, instrucciones_adicionales, intento_condensacion=intento)
        ruta = crear_pdf_desde_texto(texto_cv, ruta_salida)
        if ruta is not None:
            return ruta

    pdf_forzado = crear_pdf_desde_texto(texto_cv, ruta_salida, tamano_fuente=9)
    return pdf_forzado if pdf_forzado else ruta_salida


if __name__ == "__main__":
    with open("mi_cv.txt", "r", encoding="utf-8") as archivo: cv_real = archivo.read()
    with open("oferta.txt", "r", encoding="utf-8") as archivo: oferta_real = archivo.read()

    print("Generando CV adaptado...")
    ruta = generar_pdf_garantizando_una_pagina(cv_real, oferta_real)
    print(f"\nPDF generado en: {ruta}")