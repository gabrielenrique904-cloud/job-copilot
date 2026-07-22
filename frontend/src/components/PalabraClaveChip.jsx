import { useState } from "react";
import { sugerirInclusion } from "../services/api";
import { iniciarContadorEspera } from "../utils/contador";

function PalabraClaveChip({
  palabra,
  cumplida,
  cvTexto,
  usuarioId,
  onConfirmarInclusion,
}) {
  const [mostrarSugerencia, setMostrarSugerencia] = useState(false);
  const [sugerencia, setSugerencia] = useState("");
  const [cargandoSugerencia, setCargandoSugerencia] = useState(false);
  const [avisoSugerencia, setAvisoSugerencia] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  async function manejarSugerir() {
    setMostrarSugerencia(true);
    setCargandoSugerencia(true);
    setAvisoSugerencia("");
    try {
      const datos = await sugerirInclusion(usuarioId, cvTexto, palabra);
      setSugerencia(datos.sugerencia);
    } catch (error) {
      if (error.segundosRestantes) {
        iniciarContadorEspera(setAvisoSugerencia, error.segundosRestantes);
      } else {
        setAvisoSugerencia(
          error.message || "No pudimos generar la sugerencia. Inténtalo de nuevo."
        );
      }
    } finally {
      setCargandoSugerencia(false);
    }
  }

  function manejarConfirmar(evento) {
    const marcado = evento.target.checked;
    setConfirmado(marcado);
    onConfirmarInclusion(palabra, marcado ? sugerencia : null);
  }

  const esSugerenciaValida =
    sugerencia &&
    !sugerencia.toLowerCase().startsWith("no encontramos experiencia");

  if (cumplida) {
    return (
      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
        {palabra}
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col">
      <div className="inline-flex items-center gap-1">
        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500 line-through">
          {palabra}
        </span>
        <button
          onClick={manejarSugerir}
          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
        >
          Sugerir inclusión
        </button>
      </div>

      {mostrarSugerencia && (
        <div className="mt-1 mb-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-900 max-w-xs">
          <p>
            {cargandoSugerencia
              ? "Pensando una sugerencia..."
              : avisoSugerencia || sugerencia}
          </p>

          {!cargandoSugerencia && sugerencia && !avisoSugerencia && (
            <>
              <button
                onClick={() => navigator.clipboard.writeText(sugerencia)}
                className="mt-1 mr-3 text-blue-600 hover:underline font-medium"
              >
                Copiar sugerencia
              </button>

              {esSugerenciaValida && (
                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmado}
                    onChange={manejarConfirmar}
                    className="mt-0.5"
                  />
                  <span className="text-blue-900">
                    Confirmo que esta experiencia es real y verídica, y asumo
                    toda la responsabilidad de incluirla en mi CV.
                  </span>
                </label>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PalabraClaveChip;