import { useState } from "react";
import { generarCV } from "../services/api";
import { iniciarContadorEspera } from "../utils/contador";
import { obtenerRecomendacion } from "../utils/recomendacion";
import { CheckCircle2, AlertTriangle, ShieldAlert, FileText, ExternalLink } from "lucide-react";
import PalabraClaveChip from "./PalabraClaveChip";
import AyudaInstrucciones from "./AyudaInstrucciones";

const CONTENIDO_AYUDA = (
  <>
    <p>
      <strong>¿Cuándo se usan estas instrucciones?</strong> Solo al darle a
      "Generar CV adaptado" para esta oferta específica — no afectan al
      análisis de compatibilidad ni a las demás tarjetas.
    </p>
    <p>
      <strong>Datos de contacto</strong> (teléfono, email, enlaces) se pueden
      cambiar libremente, sin marcar la casilla.
    </p>
    <p>
      <strong>Experiencia o logros nuevos</strong> solo se incluyen si marcas
      la casilla de confirmación, asumiendo que es información real.
    </p>
  </>
);

function TarjetaOferta({ oferta, cvTexto, usuarioId }) {
  const [generandoCV, setGenerandoCV] = useState(false);
  const [aviso, setAviso] = useState("");
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [inclusionesConfirmadas, setInclusionesConfirmadas] = useState({});
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState("");
  const [instruccionesConfirmadas, setInstruccionesConfirmadas] = useState(false);

  function manejarConfirmarInclusion(palabra, texto) {
    setInclusionesConfirmadas((anterior) => ({ ...anterior, [palabra]: texto }));
  }

  async function manejarGenerarCV() {
    setGenerandoCV(true);
    setAviso("");
    try {
      const listaInclusiones = Object.values(inclusionesConfirmadas).filter(Boolean);
      const blob = await generarCV(
        usuarioId,
        cvTexto,
        oferta.descripcion,
        oferta.palabras_clave_ats,
        listaInclusiones.length > 0 ? listaInclusiones : null,
        instruccionesAdicionales.trim() || null,
        instruccionesConfirmadas
      );
      const url = window.URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `cv_adaptado_${oferta.empresa}.pdf`;
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

  const rec = obtenerRecomendacion(oferta.match);

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-5 mb-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-snug">
          {oferta.titulo}
        </h3>
        <span className="text-2xl sm:text-3xl font-bold text-blue-600 whitespace-nowrap">
          {oferta.match}%
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${rec.colorFondo} ${rec.colorTexto}`}
        >
          {rec.etiqueta}
        </span>
        <details className="relative">
          <summary className="list-none cursor-pointer w-4 h-4 rounded-full bg-gray-300 text-white text-xs font-bold inline-flex items-center justify-center hover:bg-gray-400">
            ?
          </summary>
          <div className="absolute left-0 top-6 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 text-xs text-gray-700">
            {rec.explicacion}
          </div>
        </details>
      </div>

      <p className="text-gray-600 mb-3 text-sm sm:text-base">
        <span className="font-medium">{oferta.empresa}</span> · {oferta.ubicacion}
      </p>

      <button
        onClick={() => setMostrarDetalle(!mostrarDetalle)}
        className="text-blue-600 text-sm hover:underline mb-2"
      >
        {mostrarDetalle ? "Ocultar detalle" : "Ver fortalezas y carencias"}
      </button>

      {mostrarDetalle && (
        <div className="mb-3 text-sm border-t pt-3">
          <p className="font-medium text-gray-700 mb-1">Fortalezas:</p>
          <ul className="space-y-1 mb-3">
            {oferta.fortalezas.map((punto, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>{punto}</span>
              </li>
            ))}
          </ul>

          <p className="font-medium text-gray-700 mb-1">Carencias:</p>
          <ul className="space-y-1 mb-3">
            {oferta.carencias.map((punto, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{punto}</span>
              </li>
            ))}
          </ul>

          <p className="font-medium text-gray-700 mb-1">
            Compatibilidad ATS: {oferta.palabras_clave_cumplidas.length} de{" "}
            {oferta.palabras_clave_ats.length} palabras clave
          </p>
          <div className="flex flex-wrap gap-2 mt-1 mb-3 items-start">
            {oferta.palabras_clave_ats.map((palabra, i) => {
              const cumplida = oferta.palabras_clave_cumplidas.includes(palabra);
              return (
                <PalabraClaveChip
                  key={i}
                  palabra={palabra}
                  cumplida={cumplida}
                  cvTexto={cvTexto}
                  usuarioId={usuarioId}
                  onConfirmarInclusion={manejarConfirmarInclusion}
                />
              );
            })}
          </div>

          {oferta.red_flags && oferta.red_flags.length > 0 && (
            <>
              <p className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" />
                Señales de alerta:
              </p>
              <div className="space-y-1 mb-3">
                {oferta.red_flags.map((flag, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-xs border-l-4 ${
                      flag.gravedad === "alta"
                        ? "bg-red-50 border-red-500 text-red-800"
                        : flag.gravedad === "media"
                        ? "bg-amber-50 border-amber-500 text-amber-800"
                        : "bg-gray-50 border-gray-400 text-gray-700"
                    }`}
                  >
                    {flag.senal}
                  </div>
                ))}
              </div>
            </>
          )}

          {oferta.alertas_integridad && oferta.alertas_integridad.length > 0 && (
            <>
              <p className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ShieldAlert size={14} className="text-indigo-600" />
                Sugerencias de precisión:
              </p>
              <div className="space-y-1 mb-3">
                {oferta.alertas_integridad.map((alerta, i) => (
                  <div
                    key={i}
                    className="p-2 rounded text-xs border-l-4 bg-indigo-50 border-indigo-500 text-indigo-900"
                  >
                    {alerta.mensaje}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-3">
            <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
              Instrucciones adicionales para este CV (opcional)
              <AyudaInstrucciones contenido={CONTENIDO_AYUDA} />
            </label>
            <textarea
              value={instruccionesAdicionales}
              onChange={(e) => setInstruccionesAdicionales(e.target.value)}
              placeholder='Ej: "quita mi dirección antigua" o "actualiza mi teléfono a 674 15 23 25"'
              rows={2}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes pedir reorganizar, recategorizar, eliminar información
              existente, o actualizar tus datos de contacto libremente.
            </p>

            <label className="flex items-start gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={instruccionesConfirmadas}
                onChange={(e) => setInstruccionesConfirmadas(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-gray-700">
                Marca esta casilla SOLO si tus instrucciones incluyen
                experiencia, empleos o logros
                <strong> nuevos</strong>. Al marcarla, confirmas que es real y
                asumes la responsabilidad de incluirla.
              </span>
            </label>
          </div>
        </div>
      )}

      {aviso && <p className="text-red-600 text-sm mb-2">{aviso}</p>}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        
          <a href={oferta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Ver oferta original
          <ExternalLink size={14} />
        </a>
        <button
          onClick={manejarGenerarCV}
          disabled={generandoCV}
          className="inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <FileText size={16} />
          {generandoCV ? "Generando..." : "Generar CV adaptado"}
        </button>
      </div>
    </div>
  );
}

export default TarjetaOferta;