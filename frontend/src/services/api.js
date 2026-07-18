const API_URL = "http://127.0.0.1:8000";

const TIEMPO_MINIMO_ENTRE_ACCIONES = 15000; // 15 segundos, en milisegundos
let ultimaAccion = 0;

function puedeEjecutarAccion() {
  const ahora = Date.now();
  if (ahora - ultimaAccion < TIEMPO_MINIMO_ENTRE_ACCIONES) {
    const segundosRestantes = Math.ceil((TIEMPO_MINIMO_ENTRE_ACCIONES - (ahora - ultimaAccion)) / 1000);
    throw new Error(`Espera ${segundosRestantes} segundos antes de volver a intentarlo.`);
  }
  ultimaAccion = ahora;
}

export async function registrarUsuario(email, password) {
  const respuesta = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return respuesta.json();
}

export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return respuesta.json();
}

export async function analizarMatch(cvTexto, ofertaTexto) {
  puedeEjecutarAccion();
  const respuesta = await fetch(`${API_URL}/analizar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_texto: cvTexto, oferta_texto: ofertaTexto }),
  });
  return respuesta.json();
}

export async function buscarOfertas(cvTexto, palabrasClave, ubicacion) {
  puedeEjecutarAccion();
  const respuesta = await fetch(`${API_URL}/buscar-ofertas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cv_texto: cvTexto,
      palabras_clave: palabrasClave,
      ubicacion: ubicacion,
    }),
  });
  return respuesta.json();
}

export async function generarCV(cvTexto, ofertaTexto, palabrasClaveAts = null) {
  puedeEjecutarAccion();
  const respuesta = await fetch(`${API_URL}/generar-cv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cv_texto: cvTexto,
      oferta_texto: ofertaTexto,
      palabras_clave_ats: palabrasClaveAts,
    }),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo generar el CV");
  }

  return respuesta.blob();
}

export async function extraerTextoCV(archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const respuesta = await fetch(`${API_URL}/extraer-cv`, {
    method: "POST",
    body: formData,
  });

  return respuesta.json();
}