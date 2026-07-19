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
        <p className="font-semibold text-gray-800">
          ¿Por qué creé AI Job Copilot?
        </p>
        <p>
          Soy Gabriel Méndez, graduado en Marketing y Negocios Internacionales
          y con un Máster en Dirección Empresarial por la Universidad del País
          Vasco (UPV/EHU).
        </p>
        <p>
          Como muchos estudiantes y profesionales, terminé mi formación
          convencido de que encontrar un trabajo relacionado con mi perfil
          sería el siguiente paso natural. Sin embargo, la realidad fue muy
          distinta.
        </p>
        <p>
          Durante meses envié decenas de currículums, adapté mi perfil una y
          otra vez y seguí preguntándome por qué no conseguía las
          oportunidades que buscaba. No sabía si el problema era mi
          experiencia, mi CV, la forma en la que me presentaba o simplemente
          que estaba compitiendo contra cientos de candidatos sin entender
          realmente qué buscaban las empresas.
        </p>
        <p>
          Entonces me hice una pregunta que terminó cambiándolo todo: ¿y si
          pudiera utilizar la inteligencia artificial para analizar mi
          perfil igual que lo haría un reclutador y descubrir qué me estaba
          impidiendo conseguir entrevistas?
        </p>
        <p>
          No quería crear otro generador de currículums. Quería construir
          una herramienta que me ofreciera respuestas reales: qué
          habilidades ya tenía, cuáles necesitaba desarrollar y cómo podía
          aumentar mis posibilidades de acceder al trabajo que realmente
          quería.
        </p>
        <p>
          Así nació AI Job Copilot. No para generar un CV bonito, sino para
          ayudar a las personas a comprender dónde están hoy, qué les falta
          para alcanzar sus objetivos profesionales y qué pasos concretos
          pueden dar para mejorar sus oportunidades.
        </p>
        <p>
          Mi visión es convertir AI Job Copilot en un auténtico copiloto
          profesional: un asistente inteligente que acompañe a cada persona
          durante todo su proceso de búsqueda de empleo, analizando ofertas,
          identificando oportunidades de mejora y ofreciendo recomendaciones
          personalizadas para construir una carrera profesional con mayor
          confianza.
        </p>
        <p>
          Porque creo que encontrar trabajo no debería depender únicamente
          de la suerte, sino también de entender qué buscan realmente las
          empresas y de saber demostrar el valor que cada persona ya tiene.
        </p>
        <p>
          No construí AI Job Copilot porque quisiera crear otro generador de
          currículums. Lo construí porque yo también necesitaba una
          herramienta que me dijera qué estaba haciendo mal, qué debía
          mejorar y cómo podía acercarme al trabajo que realmente quería.
          Creé la herramienta que me hubiera gustado tener cuando estaba
          buscando mi primera oportunidad profesional.
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

  const contenidos = {
    about: contenidoAbout,
    privacidad: contenidoPrivacidad,
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
        {contenidos[tipo]}
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