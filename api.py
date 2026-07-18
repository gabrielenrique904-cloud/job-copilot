from fastapi import FastAPI
from pydantic import BaseModel
from core.analizador_cv import analizar_match
from core.generador_cv import generar_cv_adaptado, crear_pdf_desde_texto
from core.buscador_ofertas import buscar_y_analizar_ofertas
from database.autenticacion import registrar_usuario, verificar_login
from fastapi.responses import FileResponse

app = FastAPI(title="AI Job Copilot API")


class AnalisisRequest(BaseModel):
    cv_texto: str
    oferta_texto: str


class GenerarCVRequest(BaseModel):
    cv_texto: str
    oferta_texto: str


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
    cv_adaptado_texto = generar_cv_adaptado(datos.cv_texto, datos.oferta_texto)
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