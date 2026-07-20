function ModalGuia({ abierto, onCerrar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">¿Cómo funciona AI Job Copilot?</h2>

        <div className="text-gray-700 space-y-5 text-sm">
          <p>
            <strong>AI Job Copilot</strong> no es un simple generador de CV. Es un asistente de carrera basado en inteligencia artificial que analiza tu perfil profesional, identifica qué te impide conseguir entrevistas y te ayuda a crear un CV optimizado para cada oferta de empleo.
          </p>

          <div>
            <p className="font-semibold text-gray-800 mb-1">1. Importa tu CV</p>
            <p>Pega el contenido de tu currículum o sube un archivo PDF o Word. Nuestro sistema extraerá automáticamente la información necesaria para comenzar el análisis.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">2. Analiza una oferta o descubre nuevas oportunidades</p>
            <p>Puedes pegar una oferta específica para conocer tu compatibilidad o dejar que AI Job Copilot busque automáticamente ofertas recientes adaptadas a tu perfil profesional.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">3. Descubre dónde te encuentras realmente</p>
            <p>Obtendrás un análisis completo con tu porcentaje de compatibilidad, fortalezas, habilidades que ya cumplen los requisitos, competencias que deberías desarrollar, coincidencia con sistemas ATS y posibles señales de alerta detectadas en la oferta.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">4. Mejora tu perfil de forma inteligente</p>
            <p>Si detectamos oportunidades de mejora, la IA propondrá formas de reflejar mejor tu experiencia real utilizando un lenguaje más alineado con la oferta. Nunca se inventará experiencia ni competencias que no hayas realizado realmente.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">5. Genera un CV optimizado para esa oferta</p>
            <p>Cuando tu perfil esté optimizado, podrás generar un CV adaptado, organizado para maximizar la claridad, el impacto y la compatibilidad con los sistemas de selección utilizados por las empresas.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">¿Qué hace diferente a AI Job Copilot?</p>
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
            <p className="font-semibold text-amber-900 mb-2">¿Cómo se calcula el porcentaje de compatibilidad?</p>
            <p className="text-amber-900">
              El porcentaje es una estimación generada por inteligencia artificial tras comparar el contenido de tu CV con los requisitos de la oferta. Tiene en cuenta experiencia, habilidades técnicas, palabras clave, competencias, responsabilidades y otros factores que normalmente evalúa un reclutador durante una primera revisión. Su finalidad es orientarte sobre tu nivel de adecuación y ayudarte a identificar oportunidades de mejora, no garantizar el resultado de un proceso de selección.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-3">¿Por qué nuestros CVs son potentes?</p>

            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Criterios ATS (lo que exige el software de selección)</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Texto plano, sin tablas ni columnas complejas</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Fuentes estándar (no decorativas)</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Sin gráficos ni barras de nivel de habilidad</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Palabras clave exactas de la oferta</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Títulos de sección estándar y reconocibles</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Fechas en formato consistente</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Sin encabezados/pies con información crítica</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-gray-700">Nombre de archivo sin caracteres raros</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Criterios de reclutadores humanos</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Una sola página</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Garantizado</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Logros cuantificados, no solo responsabilidades</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Verbos de acción fuertes</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Orden cronológico inverso claro</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Perfil enfocado a un objetivo, no genérico</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-gray-700">Idioma coherente con el mercado objetivo</td>
                    <td className="p-2 text-green-700 font-medium whitespace-nowrap">✅ Cumplido</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Estos criterios están basados en buenas prácticas reales de optimización de CV y guían directamente las instrucciones que damos a nuestro motor de inteligencia artificial.
            </p>
          </div>

          <p className="text-xs text-gray-500 border-t pt-3">
            Cada análisis consume recursos de inteligencia artificial, por lo que existe un límite diario de uso para garantizar la disponibilidad del servicio para todos los usuarios.
          </p>
        </div>

        <button onClick={onCerrar} className="mt-6 w-full bg-gray-100 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-200">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalGuia;