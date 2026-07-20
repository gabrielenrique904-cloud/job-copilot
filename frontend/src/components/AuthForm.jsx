import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { registrarUsuario, iniciarSesion, iniciarSesionGoogle, solicitarRecuperacion } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

function AuthForm({ onLoginExitoso }) {
  const [modo, setModo] = useState("login"); // "login" | "registro" | "olvide"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      if (modo === "registro") {
        const resultado = await registrarUsuario(email, password);
        if (resultado.exito) {
          setMensaje("Cuenta creada. Ahora inicia sesión.");
          setModo("login");
        } else {
          setMensaje(resultado.mensaje);
        }
      } else if (modo === "olvide") {
        const resultado = await solicitarRecuperacion(email);
        setMensaje(resultado.mensaje);
      } else {
        const resultado = await iniciarSesion(email, password);
        if (resultado.exito) {
          onLoginExitoso(resultado.usuario_id);
        } else {
          setMensaje(resultado.mensaje);
        }
      }
    } catch (error) {
      setMensaje("No pudimos conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function manejarLoginGoogle(credentialResponse) {
    setMensaje("");
    try {
      const resultado = await iniciarSesionGoogle(credentialResponse.credential);
      if (resultado.exito) {
        onLoginExitoso(resultado.usuario_id);
      } else {
        setMensaje(resultado.mensaje);
      }
    } catch (error) {
      setMensaje("No pudimos conectar con el servidor. Inténtalo de nuevo.");
    }
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setMensaje("");
  }

  const titulo =
    modo === "registro"
      ? "Crear cuenta"
      : modo === "olvide"
      ? "Recuperar contraseña"
      : "Iniciar sesión";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          AI Job Copilot
        </h1>

        <h2 className="text-lg font-semibold mb-4 text-gray-700">{titulo}</h2>

        {modo !== "olvide" && (
          <>
            <div className="mb-4 flex justify-center">
              <GoogleLogin
                onSuccess={manejarLoginGoogle}
                onError={() => setMensaje("No pudimos iniciar sesión con Google.")}
              />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-sm text-gray-400">o</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
          </>
        )}

        <form onSubmit={manejarSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {modo !== "olvide" && (
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {modo === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => cambiarModo("olvide")}
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {mensaje && (
            <p className="text-sm text-red-600 text-center">{mensaje}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {cargando
              ? "Cargando..."
              : modo === "registro"
              ? "Registrarme"
              : modo === "olvide"
              ? "Enviar enlace de recuperación"
              : "Entrar"}
          </button>
        </form>

        {modo === "olvide" ? (
          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              onClick={() => cambiarModo("login")}
              className="text-blue-600 hover:underline font-medium"
            >
              Volver a iniciar sesión
            </button>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-600 mt-4">
            {modo === "registro" ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              onClick={() => cambiarModo(modo === "registro" ? "login" : "registro")}
              className="text-blue-600 hover:underline font-medium"
            >
              {modo === "registro" ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;