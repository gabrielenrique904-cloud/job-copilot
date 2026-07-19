import { useState } from "react";
import { enviarContacto } from "../../services/api";

function ModalContacto({ abierto, onCerrar }) {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  if (!abierto) return null;

  async function manejarEnviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setResultado(null);

    try {
      const datos = await enviarContacto(email, mensaje);
      setResultado(datos);
      if (datos.exito) {
        setEmail("");
        setMensaje("");
      }
    } catch (error) {
      setResultado({ exito: false, mensaje: "No pudimos enviar tu mensaje. Inténtalo de nuevo." });
    } finally {
      setEnviando(false);
    }
  }

  function manejarCerrar() {
    setResultado(null);
    onCerrar();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Contactar</h2>
        <p className="text-gray-600 text-sm mb-4">
          Escribe tu mensaje y te responderé directamente a tu email.
        </p>

        <form onSubmit={manejarEnviar} className="space-y-4">
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Tu mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {resultado && (
            <p className={`text-sm text-center ${resultado.exito ? "text-green-700" : "text-red-600"}`}>
              {resultado.mensaje}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={manejarCerrar}
              className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-200"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalContacto;