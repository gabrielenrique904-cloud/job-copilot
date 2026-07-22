import { Link } from "react-router-dom";
import { Clock, Target, Scale, TrendingUp, ShieldCheck } from "lucide-react";

const PILARES = [
  {
    icono: Clock,
    titulo: "Estructurado para el escaneo rápido",
    texto:
      "Los reclutadores no leen: escanean. Diseñamos cada documento en una sola columna limpia, con jerarquía visual clara, para que tus puntos fuertes destaquen al instante, sin gráficos ni barras de progreso decorativas.",
  },
  {
    icono: Target,
    titulo: "Una página, garantizada",
    texto:
      "Optimizamos el espacio de forma inteligente. La capacidad de síntesis es una competencia valorada en cualquier sector. Garantizamos un PDF A4 denso en valor real, sin espacios en blanco desaprovechados.",
  },
  {
    icono: Scale,
    titulo: "Densidad adaptada a tu perfil",
    texto:
      "Con trayectoria consolidada o recién salido de un bootcamp: para perfiles senior, priorizamos tus logros más recientes; para perfiles junior, elevamos tus proyectos relevantes y formación práctica.",
  },
  {
    icono: TrendingUp,
    titulo: "Logros con impacto real",
    texto:
      "Cada punto de tu experiencia se redacta con la fórmula acción + contexto + resultado, evitando listas pasivas de tareas sin propósito ni resultado visible.",
  },
  {
    icono: ShieldCheck,
    titulo: "Veraz y adaptado a la oferta",
    texto:
      "Analizamos los requisitos clave del puesto y adaptamos la terminología de tu experiencia real para maximizar tu compatibilidad, sin inventar jamás un solo dato de tu trayectoria.",
  },
];

function PorQueSomosDiferentes() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          &larr; Volver
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ¿Por qué nuestros CVs son potentes?
        </h1>
        <p className="text-gray-600 mb-6">
          No creamos CVs bonitos para la vista; construimos herramientas
          diseñadas para pasar el filtro ATS y captar la atención de un
          reclutador en los primeros segundos de lectura.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {PILARES.map(({ icono: Icono, titulo, texto }, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <Icono size={22} className="text-blue-600 mb-2" />
              <p className="font-semibold text-gray-800 mb-1">{titulo}</p>
              <p className="text-sm text-gray-600">{texto}</p>
            </div>
          ))}
        </div>

        <p className="font-semibold text-gray-800 mb-2">Lo que evitamos, por diseño</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 text-gray-700">Diseños con barras de "80% Inglés" o gráficos decorativos</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 text-gray-700">Listas de tareas pasivas sin contexto ni resultado</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 text-gray-700">CVs de dos páginas con espacio sobrante sin aprovechar</td>
              </tr>
              <tr>
                <td className="p-3 text-gray-700">Inventar experiencia o añadir relleno no verificable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PorQueSomosDiferentes;