from fastapi import FastAPI
from pydantic import BaseModel
from core.analizador_cv import analizar_match
from core.generador_cv import generar_cv_adaptado, crear_pdf_desde_texto
from core.buscador_ofertas import buscar_y_analizar_ofertas
from database.autenticacion import registrar_usuario, verificar_login
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
    cv_texto: str
    oferta_texto: str


class GenerarCVRequest(BaseModel):
    cv_texto: str
    oferta_texto: str
    palabras_clave_ats: list[str] | None = None


class BusquedaRequest(BaseModel):
    cv_texto: str
    palabras_clave: str
    ubicacion: str | None = None


class RegistroRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def raiz():
    return {"mensaje": "AI Job Copilot API funcionando correctamente"}


@app.post("/analizar")
def analizar(datos: AnalisisRequest):
    return analizar_match(datos.cv_texto, datos.oferta_texto)


@app.post("/generar-cv")
def generar_cv(datos: GenerarCVRequest):
    cv_adaptado_texto = generar_cv_adaptado(datos.cv_texto, datos.oferta_texto, datos.palabras_clave_ats)
    ruta_pdf = crear_pdf_desde_texto(cv_adaptado_texto)
    return FileResponse(ruta_pdf, media_type="application/pdf", filename="cv_adaptado.pdf")


@app.post("/buscar-ofertas")
def buscar_ofertas_endpoint(datos: BusquedaRequest):
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