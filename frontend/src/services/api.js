const API_URL = "http://127.0.0.1:8000";

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
  const respuesta = await fetch(`${API_URL}/analizar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_texto: cvTexto, oferta_texto: ofertaTexto }),
  });
  return respuesta.json();
}

export async function buscarOfertas(cvTexto, palabrasClave, ubicacion) {
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

export async function generarCV(cvTexto, ofertaTexto) {
  const respuesta = await fetch(`${API_URL}/generar-cv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_texto: cvTexto, oferta_texto: ofertaTexto }),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo generar el CV");
  }

  return respuesta.blob();
}