import { CheckCircle2, AlertTriangle, ShieldAlert, FileText } from "lucide-react";
import { obtenerRecomendacion } from "../utils/recomendacion";
import PalabraClaveChip from "./PalabraClaveChip";

function ResultadoAnalisis({
  resultado,
  cvTexto,
  usuarioId,
  onConfirmarInclusion,
  onGenerarCV,
  generandoCV,
}) {
  if (resultado.error) {
    return <p className="text-red-600">{resultado.error}</p>;
  }

  const rec = obtenerRecomendacion(resultado.porcentaje_match);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold text-blue-600">
          {resultado.porcentaje_match}% match
        </div>
        <div className="relative inline-flex items-center gap-1">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${rec.colorFondo} ${rec.colorTexto}`}
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
      </div>

      <h3 className="font-semibold text-gray-800 mt-4 mb-2">Fortalezas</h3>
      <ul className="space-y-1">
        {resultado.fortalezas.map((punto, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-gray-800 mt-4 mb-2">Carencias</h3>
      <ul className="space-y-1">
        {resultado.carencias.map((punto, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-gray-800 mt-4 mb-2">
        Compatibilidad ATS: {resultado.palabras_clave_cumplidas.length} de{" "}
        {resultado.palabras_clave_ats.length} palabras clave
      </h3>
      <div className="flex flex-wrap gap-2 mb-2 items-start">
        {resultado.palabras_clave_ats.map((palabra, i) => {
          const cumplida = resultado.palabras_clave_cumplidas.includes(palabra);
          return (
            <PalabraClaveChip
              key={i}
              palabra={palabra}
              cumplida={cumplida}
              cvTexto={cvTexto}
              usuarioId={usuarioId}
              onConfirmarInclusion={onConfirmarInclusion}
            />
          );
        })}
      </div>

      {resultado.red_flags && resultado.red_flags.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-800 mt-4 mb-2 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            Señales de alerta en la oferta
          </h3>
          <div className="space-y-2 mb-2">
            {resultado.red_flags.map((flag, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm border-l-4 ${
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

      {resultado.alertas_integridad && resultado.alertas_integridad.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-800 mt-4 mb-2 flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-600" />
            Sugerencias de precisión en tu CV
          </h3>
          <div className="space-y-2 mb-2">
            {resultado.alertas_integridad.map((alerta, i) => (
              <div
                key={i}
                className="p-3 rounded-lg text-sm border-l-4 bg-indigo-50 border-indigo-500 text-indigo-900"
              >
                {alerta.mensaje}
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={onGenerarCV}
        disabled={generandoCV}
        className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
      >
        <FileText size={18} />
        {generandoCV ? "Generando CV..." : "Generar CV adaptado (PDF)"}
      </button>
    </>
  );
}

export default ResultadoAnalisis;