const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const ultimasAcciones = {};

function verificarLimite(clave, segundosEspera) {
  const ahora = Date.now(), ultima = ultimasAcciones[clave] || 0, tiempoMinimo = segundosEspera * 1000;
  if (ahora - ultima < tiempoMinimo) {
    const segundosRestantes = Math.ceil((tiempoMinimo - (ahora - ultima)) / 1000);
    const error = new Error(`Espera ${segundosRestantes} segundos antes de volver a intentarlo.`);
    error.segundosRestantes = segundosRestantes;
    throw error;
  }
}

function marcarInicioAccion(clave) { ultimasAcciones[clave] = Date.now(); }

export async function registrarUsuario(email, password) {
  const respuesta = await fetch(`${API_URL}/registro`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  return respuesta.json();
}

export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${API_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  return respuesta.json();
}

export async function analizarMatch(usuarioId, cvTexto, ofertaTexto) {
  verificarLimite("analizar", 15);
  const respuesta = await fetch(`${API_URL}/analizar`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: usuarioId, cv_texto: cvTexto, oferta_texto: ofertaTexto }) });
  marcarInicioAccion("analizar");
  return respuesta.json();
}

export async function buscarOfertas(usuarioId, cvTexto, palabrasClave, ubicacion) {
  verificarLimite("buscarOfertas", 45);
  const respuesta = await fetch(`${API_URL}/buscar-ofertas`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: usuarioId, cv_texto: cvTexto, palabras_clave: palabrasClave, ubicacion }) });
  marcarInicioAccion("buscarOfertas");
  return respuesta.json();
}

export async function generarCV(usuarioId, cvTexto, ofertaTexto, palabrasClaveAts = null, inclusionesConfirmadas = null, instruccionesAdicionales = null) {
  verificarLimite("generarCV", 15);
  const respuesta = await fetch(`${API_URL}/generar-cv`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: usuarioId, cv_texto: cvTexto, oferta_texto: ofertaTexto, palabras_clave_ats: palabrasClaveAts, inclusiones_confirmadas: inclusionesConfirmadas, instrucciones_adicionales: instruccionesAdicionales }) });
  if (!respuesta.ok) throw new Error("No se pudo generar el CV");
  marcarInicioAccion("generarCV");
  return respuesta.blob();
}

export async function extraerTextoCV(archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);
  const respuesta = await fetch(`${API_URL}/extraer-cv`, { method: "POST", body: formData });
  return respuesta.json();
}

export async function iniciarSesionGoogle(credential) {
  const respuesta = await fetch(`${API_URL}/login-google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential }) });
  return respuesta.json();
}

export async function sugerirInclusion(usuarioId, cvTexto, palabraClave) {
  const respuesta = await fetch(`${API_URL}/sugerir-inclusion`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: usuarioId, cv_texto: cvTexto, palabra_clave: palabraClave }) });
  return respuesta.json();
}

export async function solicitarRecuperacion(email) {
  const respuesta = await fetch(`${API_URL}/olvide-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  return respuesta.json();
}

export async function resetearPassword(token, nuevaPassword) {
  const respuesta = await fetch(`${API_URL}/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, nueva_password: nuevaPassword }) });
  return respuesta.json();
}

export async function enviarContacto(email, mensaje) {
  const respuesta = await fetch(`${API_URL}/contacto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, mensaje }) });
  return respuesta.json();
}