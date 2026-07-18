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