function ModalInfo({ tipo, onCerrar }) {
  if (!tipo) return null;

  const contenidoAbout = (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Sobre nosotros</h2>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
          GM
        </div>
        <div>
          <p className="font-semibold text-gray-800">Gabriel Méndez</p>
          <p className="text-sm text-gray-600">Full Stack Developer</p>
        </div>
      </div>

      <div className="text-gray-700 space-y-3 text-sm">
        <p>
          Soy Gabriel Méndez, graduado en Marketing y Negocios Internacionales
          y con un Máster en Dirección Empresarial. Este proyecto nació de una
          experiencia muy personal: la búsqueda de un trabajo afín a lo que
          estudié, en un mercado que cambia constantemente y donde cada vez es
          más difícil destacar entre tantas ofertas y candidatos.
        </p>
        <p>
          Ante tanta innovación tecnológica, me pregunté cómo podía usar la
          inteligencia artificial no solo para acelerar mi propia búsqueda,
          sino para entender mejor tanto la oferta como a mí mismo: qué tan
          preparado estoy realmente para un puesto, y qué me falta para
          estarlo.
        </p>
        <p>
          Así nació AI Job Copilot: una herramienta que te ayuda a conocer la
          oferta, conocerte a ti mismo, y descubrir qué opciones tienes
          realmente para acercarte al trabajo de tus sueños.
        </p>
        <p>
          La visión a futuro incluye un agente de IA capaz de darte
          recomendaciones personalizadas de mejora, más allá del análisis
          puntual de cada oferta.
        </p>
      </div>
    </>
  );

  const contenidoPrivacidad = (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Política de privacidad
      </h2>
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
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
        {tipo === "about" ? contenidoAbout : contenidoPrivacidad}
        <button
          onClick={onCerrar}
          className="mt-6 w-full bg-gray-100 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalInfo;