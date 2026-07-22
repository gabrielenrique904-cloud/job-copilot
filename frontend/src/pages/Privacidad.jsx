import { Link } from "react-router-dom";

function Privacidad() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          &larr; Volver
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Política de privacidad</h1>

        <div className="text-gray-700 space-y-4 text-sm">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="font-medium text-blue-800">
              Este es un proyecto educativo, desarrollado como Trabajo de Fin de
              Bootcamp, sin ánimo de lucro. No se vende, monetiza, ni comparte
              información con fines comerciales o publicitarios.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">Qué datos recogemos</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Email y contraseña (guardada cifrada, nunca en texto plano)</li>
              <li>El texto del CV y de las ofertas que analizas, únicamente en el momento del análisis</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">Qué NO hacemos</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No vendemos ni compartimos tus datos con terceros con fines comerciales</li>
              <li>No guardamos permanentemente el contenido de tu CV ni de tus búsquedas</li>
              <li>No usamos tus datos para entrenar modelos de IA</li>
              <li>No mostramos publicidad ni rastreamos tu actividad con fines de marketing</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">
              Terceros involucrados en el procesamiento
            </p>
            <p>
              Para ofrecer el análisis, el texto de tu CV y de la oferta se
              envía de forma puntual a la API de Gemini (Google) para el
              análisis con IA, y a la API de Adzuna para la búsqueda de ofertas
              reales. Estos proveedores procesan la información según sus
              propias políticas de privacidad, ajenas a este proyecto.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">
              Dónde termina nuestra responsabilidad
            </p>
            <p>
              Como proyecto educativo desarrollado por un estudiante, este
              servicio no ofrece garantías de disponibilidad, seguridad de
              nivel empresarial, ni cumplimiento normativo formal (RGPD, ISO,
              etc.). Las decisiones que tomes basándote en el análisis de esta
              herramienta (aplicar o no a una oferta, confiar en el % de match)
              son tuyas: la IA puede cometer errores y no sustituye tu propio
              criterio.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">Tus derechos</p>
            <p>
              Puedes solicitar la eliminación de tu cuenta y tus datos en
              cualquier momento contactando al desarrollador. Al ser un
              proyecto de demostración, no existe actualmente un panel
              automático de autoeliminación de cuenta.
            </p>
          </div>

          <p className="text-xs text-gray-500 pt-2 border-t">
            Última actualización: julio de 2026. Este proyecto fue desarrollado
            con fines educativos como parte de un bootcamp de programación.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacidad;