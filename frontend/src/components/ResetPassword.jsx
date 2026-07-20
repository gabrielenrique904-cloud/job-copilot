import { useState } from "react";
import { resetearPassword } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword({ token }) {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const resultado = await resetearPassword(token, nuevaPassword);
      setMensaje(resultado.mensaje);
      setExito(resultado.exito);
    } catch (error) {
      setMensaje("No pudimos conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          AI Job Copilot
        </h1>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Crear nueva contraseña
        </h2>

        {exito ? (
          <div className="text-center">
            <p className="text-green-700 mb-4">{mensaje}</p>
              <a href="/" className="inline-block w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
              Ir a iniciar sesión </a>
          </div>
        ) : (
          <form onSubmit={manejarSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
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

            {mensaje && (
              <p className="text-sm text-red-600 text-center">{mensaje}</p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;