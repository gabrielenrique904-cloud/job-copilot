import { useState } from "react";
import { analizarMatch, generarCV, extraerTextoCV, sugerirInclusion } from "../services/api";
import { iniciarContadorEspera } from "../utils/contador";

function PalabraClaveChip({ palabra, cumplida, cvTexto, usuarioId, onConfirmarInclusion }) {
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
        setAvisoSugerencia(error.message || "No pudimos generar la sugerencia. Inténtalo de nuevo.");
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

  const esSugerenciaValida = sugerencia && !sugerencia.toLowerCase().startsWith("no encontramos experiencia");

  if (cumplida) {
    return <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">{palabra}</span>;
  }

  return (
    <div className="inline-flex flex-col">
      <div className="inline-flex items-center gap-1">
        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500 line-through">{palabra}</span>
        <button onClick={manejarSugerir} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
          Sugerir inclusión
        </button>
      </div>

      {mostrarSugerencia && (
        <div className="mt-1 mb-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-900 max-w-xs">
          <p>{cargandoSugerencia ? "Pensando una sugerencia..." : avisoSugerencia || sugerencia}</p>

          {!cargandoSugerencia && sugerencia && !avisoSugerencia && (
            <>
              <button onClick={() => navigator.clipboard.writeText(sugerencia)} className="mt-1 mr-3 text-blue-600 hover:underline font-medium">
                Copiar sugerencia
              </button>

              {esSugerenciaValida && (
                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={confirmado} onChange={manejarConfirmar} className="mt-0.5" />
                  <span className="text-blue-900">
                    Confirmo que esta experiencia es real y verídica, y asumo toda la responsabilidad de incluirla en mi CV.
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

function AnalizadorManual() {
  const [cvTexto, setCvTexto] = useState("");
  const [ofertaTexto, setOfertaTexto] = useState("");
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState("");
  const [generandoCV, setGenerandoCV] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [inclusionesConfirmadas, setInclusionesConfirmadas] = useState({});

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  function manejarConfirmarInclusion(palabra, texto) {
    setInclusionesConfirmadas((anterior) => ({ ...anterior, [palabra]: texto }));
  }

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
      setAviso(error.message || "No pudimos conectar con el servidor. Inténtalo de nuevo.");
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
    setInclusionesConfirmadas({});

    try {
      const datos = await analizarMatch(usuarioId, cvTexto, ofertaTexto);
      setResultado(datos);
    } catch (error) {
      if (error.segundosRestantes) {
        iniciarContadorEspera(setAviso, error.segundosRestantes);
      } else {
        setAviso(error.message || "No pudimos conectar con el servidor. Inténtalo de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  }

  async function manejarGenerarCV() {
    setGenerandoCV(true);
    try {
      const listaInclusiones = Object.values(inclusionesConfirmadas).filter(Boolean);
      const blob = await generarCV(usuarioId, cvTexto, ofertaTexto, resultado.palabras_clave_ats, listaInclusiones.length > 0 ? listaInclusiones : null, instruccionesAdicionales.trim() || null);
      const url = window.URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = "cv_adaptado.pdf";
      enlace.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.segundosRestantes) {
        iniciarContadorEspera(setAviso, error.segundosRestantes);
      } else {
        setAviso(error.message || "No pudimos generar el CV. Inténtalo de nuevo.");
      }
    } finally {
      setGenerandoCV(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Analizar compatibilidad</h2>
      <p className="text-gray-600 mb-4">Pega tu CV y una oferta de trabajo para ver el análisis de compatibilidad.</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">O sube tu CV (PDF o Word)</label>
        <label htmlFor="input-cv-manual" className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 ${subiendoArchivo ? "opacity-50 pointer-events-none" : ""}`}>
          📎 Seleccionar archivo
        </label>
        <input id="input-cv-manual" type="file" accept=".pdf,.docx" onChange={manejarSubirArchivo} disabled={subiendoArchivo} className="hidden" />
        {subiendoArchivo && <p className="text-blue-600 text-sm mt-2">Leyendo archivo...</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={cvTexto} onChange={(e) => setCvTexto(e.target.value)} placeholder="Tu CV" rows={18} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <textarea value={ofertaTexto} onChange={(e) => setOfertaTexto(e.target.value)} placeholder="Oferta de trabajo" rows={18} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <p className="text-xs text-gray-500 mt-1">Máximo 6.000 caracteres por campo.</p>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Instrucciones adicionales para tu CV (opcional)</label>
        <textarea value={instruccionesAdicionales} onChange={(e) => setInstruccionesAdicionales(e.target.value)} placeholder='Ej: "Node.js es una librería, no una tecnología, muévelo a Habilidades técnicas" o "quita mis datos de contacto antiguos"' rows={3} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p className="text-xs text-gray-500 mt-1">
          Puedes pedir que se reorganice, recategorice o elimine información existente. La IA nunca añadirá experiencia, logros o habilidades que no estén ya en tu CV.
        </p>
      </div>

      {aviso && <p className="text-amber-600 mt-3">{aviso}</p>}

      <button onClick={manejarAnalizar} disabled={cargando} className="mt-4 bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50">
        {cargando ? "Analizando..." : "Analizar"}
      </button>

      {resultado && (
        <div className="mt-6 border-t pt-6">
          {resultado.error ? (
            <p className="text-red-600">{resultado.error}</p>
          ) : (
            <>
              <div className="text-3xl font-bold text-blue-600">{resultado.porcentaje_match}% match</div>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Fortalezas</h3>
              <ul className="space-y-1">
                {resultado.fortalezas.map((punto, i) => <li key={i} className="text-gray-700">✅ {punto}</li>)}
              </ul>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">Carencias</h3>
              <ul className="space-y-1">
                {resultado.carencias.map((punto, i) => <li key={i} className="text-gray-700">⚠️ {punto}</li>)}
              </ul>

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">
                Compatibilidad ATS: {resultado.palabras_clave_cumplidas.length} de {resultado.palabras_clave_ats.length} palabras clave
              </h3>
              <div className="flex flex-wrap gap-2 mb-2 items-start">
                {resultado.palabras_clave_ats.map((palabra, i) => {
                  const cumplida = resultado.palabras_clave_cumplidas.includes(palabra);
                  return <PalabraClaveChip key={i} palabra={palabra} cumplida={cumplida} cvTexto={cvTexto} usuarioId={usuarioId} onConfirmarInclusion={manejarConfirmarInclusion} />;
                })}
              </div>

              {resultado.red_flags && resultado.red_flags.length > 0 && (
                <>
                  <h3 className="font-semibold text-gray-800 mt-4 mb-2">⚠️ Señales de alerta en la oferta</h3>
                  <div className="space-y-2 mb-2">
                    {resultado.red_flags.map((flag, i) => (
                      <div key={i} className={`p-3 rounded-lg text-sm border-l-4 ${flag.gravedad === "alta" ? "bg-red-50 border-red-500 text-red-800" : flag.gravedad === "media" ? "bg-amber-50 border-amber-500 text-amber-800" : "bg-gray-50 border-gray-400 text-gray-700"}`}>
                        {flag.senal}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button onClick={manejarGenerarCV} disabled={generandoCV} className="mt-4 bg-green-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-green-700 disabled:opacity-50">
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