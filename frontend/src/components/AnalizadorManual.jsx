import { useState } from "react";
import { analizarMatch, generarCV, extraerTextoCV } from "../services/api";
import { iniciarContadorEspera } from "../utils/contador";
import { Paperclip } from "lucide-react";
import AyudaInstrucciones from "./AyudaInstrucciones";
import ResultadoAnalisis from "./ResultadoAnalisis";

function AnalizadorManual() {
  const [cvTexto, setCvTexto] = useState("");
  const [ofertaTexto, setOfertaTexto] = useState("");
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState("");
  const [instruccionesConfirmadas, setInstruccionesConfirmadas] = useState(false);
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
      const blob = await generarCV(
        usuarioId,
        cvTexto,
        ofertaTexto,
        resultado.palabras_clave_ats,
        listaInclusiones.length > 0 ? listaInclusiones : null,
        instruccionesAdicionales.trim() || null,
        instruccionesConfirmadas
      );
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

  const contenidoAyuda = (
    <>
      <p>
        <strong>¿Cuándo se usan estas instrucciones?</strong> Solo al darle a
        "Generar CV adaptado (PDF)" — no afectan al análisis de compatibilidad.
      </p>
      <p>
        <strong>Flujo recomendado:</strong> 1) Pega tu CV y la oferta. 2) Dale
        a "Analizar" para ver tu compatibilidad. 3) Si quieres, escribe aquí
        ajustes para el CV final (reorganizar, corregir, actualizar contacto).
        4) Genera el PDF.
      </p>
      <p>
        <strong>Datos de contacto</strong> (teléfono, email, enlaces) se
        pueden cambiar libremente, sin marcar la casilla.
      </p>
      <p>
        <strong>Experiencia o logros nuevos</strong> solo se incluyen si
        marcas la casilla de confirmación, asumiendo que es información real.
      </p>
    </>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Analizar compatibilidad</h2>
      <p className="text-gray-600 mb-4">
        Pega tu CV y una oferta de trabajo para ver el análisis de compatibilidad.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          O sube tu CV (PDF o Word)
        </label>
        <label
          htmlFor="input-cv-manual"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 ${
            subiendoArchivo ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Paperclip size={16} />
          Seleccionar archivo
        </label>
        <input
          id="input-cv-manual"
          type="file"
          accept=".pdf,.docx"
          onChange={manejarSubirArchivo}
          disabled={subiendoArchivo}
          className="hidden"
        />
        {subiendoArchivo && <p className="text-blue-600 text-sm mt-2">Leyendo archivo...</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={cvTexto}
          onChange={(e) => setCvTexto(e.target.value)}
          placeholder="Pega aquí el texto completo de tu CV"
          className="w-full h-48 sm:h-64 md:h-96 resize-y border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <textarea
            value={ofertaTexto}
            onChange={(e) => setOfertaTexto(e.target.value)}
            placeholder="Pega aquí la oferta de trabajo (puedes copiarla de LinkedIn, InfoJobs o cualquier portal) y nosotros nos encargamos del resto"
            className="w-full h-48 sm:h-64 md:h-96 resize-y border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Máximo 6.000 caracteres por campo.</p>

      <div className="mt-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          Instrucciones adicionales para tu CV (opcional)
          <AyudaInstrucciones contenido={contenidoAyuda} />
        </label>
        <textarea
          value={instruccionesAdicionales}
          onChange={(e) => setInstruccionesAdicionales(e.target.value)}
          placeholder='Ej: "Node.js es una librería, no una tecnología, muévelo a Habilidades técnicas" o "actualiza mi teléfono a 674 15 23 25"'
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Puedes pedir que se reorganice, recategorice, elimine información
          existente, o actualice tus datos de contacto (teléfono, email,
          enlaces) libremente.
        </p>

        <label className="flex items-start gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={instruccionesConfirmadas}
            onChange={(e) => setInstruccionesConfirmadas(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-xs text-gray-700">
            Marca esta casilla SOLO si tus instrucciones incluyen experiencia,
            empleos o logros profesionales
            <strong> nuevos</strong> (no presentes antes en tu CV). Al marcarla,
            confirmas que esa información es real y verídica, y asumes toda la
            responsabilidad de incluirla.
          </span>
        </label>
      </div>

      {aviso && <p className="text-amber-600 mt-3">{aviso}</p>}

      <button
        onClick={manejarAnalizar}
        disabled={cargando}
        className="mt-4 w-full sm:w-auto bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {cargando ? "Analizando..." : "Analizar"}
      </button>

      {resultado && (
        <div className="mt-6 border-t pt-6">
          <ResultadoAnalisis
            resultado={resultado}
            cvTexto={cvTexto}
            usuarioId={usuarioId}
            onConfirmarInclusion={manejarConfirmarInclusion}
            onGenerarCV={manejarGenerarCV}
            generandoCV={generandoCV}
          />
        </div>
      )}
    </div>
  );
}

export default AnalizadorManual;