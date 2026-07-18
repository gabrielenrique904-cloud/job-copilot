import { useState } from "react";
import { analizarMatch, generarCV, extraerTextoCV } from "../services/api";

function AnalizadorManual() {
  const [cvTexto, setCvTexto] = useState("");
  const [ofertaTexto, setOfertaTexto] = useState("");
  const [generandoCV, setGenerandoCV] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  async function manejarSubirArchivo(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    setSubiendoArchivo(true);
    setAviso("");

    try {
      const datos = await extraerTextoCV(archivo);
      if (datos.texto) {
        setCvTexto(datos.texto);
      } else {
        setAviso("No pudimos leer el archivo. Prueba con otro PDF/Word, o pega el texto manualmente.");
      }
    } catch (error) {
      setAviso("No pudimos leer el archivo. Inténtalo de nuevo.");
    } finally {
      setSubiendoArchivo(false);
    }
  }

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

  async function manejarGenerarCV() {
    setGenerandoCV(true);
    try {
      const blob = await generarCV(cvTexto, ofertaTexto, resultado.palabras_clave_ats);
      const url = window.URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = "cv_adaptado.pdf";
      enlace.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setAviso("No pudimos generar el CV. Inténtalo de nuevo.");
    } finally {
      setGenerandoCV(false);
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          O sube tu CV (PDF o Word)
        </label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={manejarSubirArchivo}
          disabled={subiendoArchivo}
          className="text-sm text-gray-600"
        />
        {subiendoArchivo && <p className="text-blue-600 text-sm mt-1">Leyendo archivo...</p>}
      </div>

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

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">
                Compatibilidad ATS: {resultado.palabras_clave_cumplidas.length} de{" "}
                {resultado.palabras_clave_ats.length} palabras clave
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {resultado.palabras_clave_ats.map((palabra, i) => {
                  const cumplida = resultado.palabras_clave_cumplidas.includes(palabra);
                  return (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-sm ${
                        cumplida
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-500 line-through"
                      }`}
                    >
                      {palabra}
                    </span>
                  );
                })}
              </div>

              <button
                onClick={manejarGenerarCV}
                disabled={generandoCV}
                className="mt-4 bg-green-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {generandoCV ? "Generando CV..." : "📄 Generar CV adaptado (PDF)"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalizadorManual;