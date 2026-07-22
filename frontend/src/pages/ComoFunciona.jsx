import { Link } from "react-router-dom";

function ComoFunciona() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          &larr; Volver
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ¿Cómo funciona AI Job Copilot?
        </h1>

        <div className="text-gray-700 space-y-5 text-sm">
          <p>
            <strong>AI Job Copilot</strong> no es un simple generador de CV.
            Es un asistente de carrera basado en inteligencia artificial que analiza
            tu perfil profesional, identifica qué te impide conseguir entrevistas y
            te ayuda a crear un CV optimizado para cada oferta de empleo.
          </p>

          <div>
            <p className="font-semibold text-gray-800 mb-1">1. Importa tu CV</p>
            <p>
              Pega el contenido de tu currículum o sube un archivo PDF o Word.
              Nuestro sistema extraerá automáticamente la información necesaria
              para comenzar el análisis.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">
              2. Analiza una oferta o descubre nuevas oportunidades
            </p>
            <p>
              Puedes pegar una oferta específica (por ejemplo, copiando el texto
              desde LinkedIn, InfoJobs o cualquier portal) para conocer tu
              compatibilidad, o dejar que AI Job Copilot busque automáticamente
              ofertas recientes adaptadas a tu perfil profesional.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">
              3. Descubre dónde te encuentras realmente
            </p>
            <p>
              Obtendrás un análisis completo con tu porcentaje de compatibilidad,
              fortalezas, habilidades que ya cumplen los requisitos, competencias
              que deberías desarrollar, coincidencia con sistemas ATS y posibles
              señales de alerta detectadas en la oferta.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">
              4. Mejora tu perfil de forma inteligente
            </p>
            <p>
              Si detectamos oportunidades de mejora, la IA propondrá formas de
              reflejar mejor tu experiencia real utilizando un lenguaje más alineado
              con la oferta. Nunca se inventará experiencia ni competencias que no
              hayas realizado realmente.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">
              5. Genera un CV optimizado para esa oferta
            </p>
            <p>
              Cuando tu perfil esté optimizado, podrás generar un CV adaptado,
              organizado para maximizar la claridad, el impacto y la compatibilidad
              con los sistemas de selección utilizados por las empresas.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">
              ¿Qué hace diferente a AI Job Copilot?
            </p>
            <ul className="list-disc pl-5 text-blue-900 space-y-2">
              <li>Analiza tu CV como lo haría un reclutador.</li>
              <li>Compara automáticamente tu perfil con la oferta.</li>
              <li>Detecta habilidades que ya posees y aquellas que te faltan.</li>
              <li>Te ayuda a mejorar la redacción de tu experiencia profesional.</li>
              <li>Optimiza tu CV para ATS sin perder naturalidad.</li>
              <li>Nunca inventa experiencia profesional.</li>
            </ul>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">
              ¿Cómo se calcula el porcentaje de compatibilidad?
            </p>
            <p className="text-amber-900">
              El porcentaje es una estimación generada por inteligencia artificial
              tras comparar el contenido de tu CV con los requisitos de la oferta.
              Tiene en cuenta experiencia, habilidades técnicas, palabras clave,
              competencias, responsabilidades y otros factores que normalmente
              evalúa un reclutador durante una primera revisión.
              Su finalidad es orientarte sobre tu nivel de adecuación y ayudarte
              a identificar oportunidades de mejora, no garantizar el resultado
              de un proceso de selección.
            </p>
          </div>

          <p className="text-xs text-gray-500 border-t pt-3">
            Cada análisis consume recursos de inteligencia artificial, por lo que
            existe un límite diario de uso para garantizar la disponibilidad del
            servicio para todos los usuarios.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComoFunciona;