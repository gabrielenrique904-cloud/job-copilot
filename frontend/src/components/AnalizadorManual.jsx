import { useState } from "react";
import { analizarMatch } from "../services/api";

function AnalizadorManual() {
  const [cvTexto, setCvTexto] = useState("");
  const [ofertaTexto, setOfertaTexto] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");

  async function manejarAnalizar() {
    setAviso("");

    if (!cvTexto.trim() || !ofertaTexto.trim()) {
      setAviso("Por favor, pega tanto el CV como la oferta antes de analizar.");
      return;
    }

    setCargando(true);
    setResultado(null);

    try {
      const datos = await analizarMatch(cvTexto, ofertaTexto);
      setResultado(datos);
    } catch (error) {
      setAviso("No pudimos conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Analizar compatibilidad
      </h2>
      <p className="text-gray-600 mb-4">
        Pega tu CV y una oferta de trabajo para ver el análisis de compatibilidad.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={cvTexto}
          onChange={(e) => setCvTexto(e.target.value)}
          placeholder="Tu CV"
          rows={10}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={ofertaTexto}
          onChange={(e) => setOfertaTexto(e.target.value)}
          placeholder="Oferta de trabajo"
          rows={10}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {aviso && <p className="text-amber-600 mt-3">{aviso}</p>}

      <button
        onClick={manejarAnalizar}
        disabled={cargando}
        className="mt-4 bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {cargando ? "Analizando..." : "Analizar"}
      </button>

      {resultado && (
        <div className="mt-6 border-t pt-6">
          {resultado.error ? (
            <p className="text-red-600">{resultado.error}</p>
          ) : (
            <>
              <div className="text-3xl font-bold text-blue-600">
                {resultado.porcentaje_match}% match
              </div>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Fortalezas</h3>
              <ul className="space-y-1">
                {resultado.fortalezas.map((punto, i) => (
                  <li key={i} className="text-gray-700">✅ {punto}</li>
                ))}
              </ul>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Carencias</h3>
              <ul className="space-y-1">
                {resultado.carencias.map((punto, i) => (
                  <li key={i} className="text-gray-700">⚠️ {punto}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalizadorManual;