function ModalInfo({ tipo, onCerrar }) {
  if (!tipo) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
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