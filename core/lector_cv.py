from pypdf import PdfReader
from docx import Document
import io


def extraer_texto_cv(archivo_subido) -> str:
    """
    Extrae el texto de un CV subido, soportando PDF y Word (.docx).
    Devuelve el texto extraído como string, o un string vacío si el
    formato no es compatible o el archivo está vacío/corrupto.
    """
    nombre = archivo_subido.name.lower()

    try:
        if nombre.endswith(".pdf"):
            lector = PdfReader(archivo_subido)
            texto = ""
            for pagina in lector.pages:
                texto += pagina.extract_text() or ""
            return texto.strip()

        elif nombre.endswith(".docx"):
            documento = Document(archivo_subido)
            texto = "\n".join(parrafo.text for parrafo in documento.paragraphs)
            return texto.strip()

        else:
            return ""

    except Exception as error:
        from core.manejo_errores import registrar_error
        registrar_error("Lector CV", str(error))
        return ""