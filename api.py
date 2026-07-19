from fastapi import FastAPI
from pydantic import BaseModel
from core.analizador_cv import analizar_match
from core.generador_cv import generar_cv_adaptado, crear_pdf_desde_texto, sugerir_inclusion_palabra_clave
from core.buscador_ofertas import buscar_y_analizar_ofertas
from database.autenticacion import registrar_usuario, verificar_login
from database.recuperacion import solicitar_recuperacion, resetear_password
from database.limites import verificar_y_registrar_uso
from database.contacto import enviar_mensaje_contacto
from fastapi.responses import FileResponse
from fastapi import UploadFile, File
from core.lector_cv import extraer_texto_cv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from database.modelos import Usuario, SessionLocal

app = FastAPI(title="AI Job Copilot API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalisisRequest(BaseModel):
    usuario_id: int
    cv_texto: str
    oferta_texto: str


class GenerarCVRequest(BaseModel):
    usuario_id: int
    cv_texto: str
    oferta_texto: str
    palabras_clave_ats: list[str] | None = None
    inclusiones_confirmadas: list[str] | None = None


class BusquedaRequest(BaseModel):
    usuario_id: int
    cv_texto: str
    palabras_clave: str
    ubicacion: str | None = None


class RegistroRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class SugerirInclusionRequest(BaseModel):
    usuario_id: int
    cv_texto: str
    palabra_clave: str


class OlvidePasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    nueva_password: str


class ContactoRequest(BaseModel):
    email: str
    mensaje: str


@app.get("/")
def raiz():
    return {"mensaje": "AI Job Copilot API funcionando correctamente"}


@app.post("/analizar")
def analizar(datos: AnalisisRequest):
    verificacion = verificar_y_registrar_uso(datos.usuario_id, "analizar")
    if not verificacion["permitido"]:
        return {"error": verificacion["mensaje"]}

    return analizar_match(datos.cv_texto, datos.oferta_texto)


@app.post("/generar-cv")
def generar_cv(datos: GenerarCVRequest):
    verificacion = verificar_y_registrar_uso(datos.usuario_id, "generar_cv")
    if not verificacion["permitido"]:
        return {"error": verificacion["mensaje"]}

    cv_adaptado_texto = generar_cv_adaptado(
        datos.cv_texto,
        datos.oferta_texto,
        datos.palabras_clave_ats,
        datos.inclusiones_confirmadas,
    )
    ruta_pdf = crear_pdf_desde_texto(cv_adaptado_texto)
    return FileResponse(ruta_pdf, media_type="application/pdf", filename="cv_adaptado.pdf")


@app.post("/buscar-ofertas")
def buscar_ofertas_endpoint(datos: BusquedaRequest):
    verificacion = verificar_y_registrar_uso(datos.usuario_id, "buscar_ofertas")
    if not verificacion["permitido"]:
        return {"error": verificacion["mensaje"]}

    resultados = buscar_y_analizar_ofertas(datos.cv_texto, datos.palabras_clave, ubicacion=datos.ubicacion)
    return {"ofertas": resultados}


@app.post("/registro")
def registro(datos: RegistroRequest):
    return registrar_usuario(datos.email, datos.password)


@app.post("/login")
def login(datos: LoginRequest):
    return verificar_login(datos.email, datos.password)


@app.post("/extraer-cv")
async def extraer_cv(archivo: UploadFile = File(...)):
    import io

    contenido = await archivo.read()
    buffer = io.BytesIO(contenido)
    buffer.name = archivo.filename

    texto = extraer_texto_cv(buffer)

    return {"texto": texto}


@app.post("/sugerir-inclusion")
def sugerir_inclusion(datos: SugerirInclusionRequest):
    verificacion = verificar_y_registrar_uso(datos.usuario_id, "sugerir_inclusion")
    if not verificacion["permitido"]:
        return {"sugerencia": verificacion["mensaje"]}

    sugerencia = sugerir_inclusion_palabra_clave(datos.cv_texto, datos.palabra_clave)
    return {"sugerencia": sugerencia}


@app.post("/olvide-password")
def olvide_password(datos: OlvidePasswordRequest):
    return solicitar_recuperacion(datos.email)


@app.post("/reset-password")
def reset_password(datos: ResetPasswordRequest):
    return resetear_password(datos.token, datos.nueva_password)


@app.post("/contacto")
def contacto(datos: ContactoRequest):
    return enviar_mensaje_contacto(datos.email, datos.mensaje)


GOOGLE_CLIENT_ID = "279674431785-mi0s5fm4ahco1n9a7lms03bnh766eaf1.apps.googleusercontent.com"


class GoogleLoginRequest(BaseModel):
    credential: str


@app.post("/login-google")
def login_google(datos: GoogleLoginRequest):
    try:
        info_token = id_token.verify_oauth2_token(
            datos.credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        return {"exito": False, "mensaje": "Token de Google invalido."}

    email = info_token.get("email")

    sesion = SessionLocal()
    try:
        usuario = sesion.query(Usuario).filter(Usuario.email == email).first()

        if not usuario:
            usuario = Usuario(email=email, password_hash="LOGIN_GOOGLE_SIN_PASSWORD")
            sesion.add(usuario)
            sesion.commit()
            sesion.refresh(usuario)

        return {"exito": True, "mensaje": "Login con Google correcto.", "usuario_id": usuario.id}
    finally:
        sesion.close()