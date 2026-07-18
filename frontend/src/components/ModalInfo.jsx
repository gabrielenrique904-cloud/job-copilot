function ModalInfo({ tipo, onCerrar }) {
  if (!tipo) return null;

  const contenidoAbout = (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Sobre nosotros</h2>
      <div className="text-gray-700 space-y-3 text-sm">
        <p>
          AI Job Copilot nació de una necesidad real: hacer más eficiente la
          búsqueda de empleo usando inteligencia artificial.
        </p>
        <p>
          La herramienta analiza tu CV contra ofertas reales, calcula tu
          porcentaje de compatibilidad, identifica palabras clave relevantes
          para sistemas ATS, y genera versiones adaptadas de tu CV para cada
          oferta, todo sin inventar experiencia que no tengas.
        </p>
      </div>
    </>
  );

  const contenidoPrivacidad = (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Política de privacidad
      </h2>
      <div className="text-gray-700 space-y-3 text-sm">
        <p>
          <strong>Qué datos recogemos:</strong> tu email, contraseña (guardada
          de forma cifrada, nunca en texto plano), y el contenido de los CVs y
          ofertas que analizas.
        </p>
        <p>
          <strong>Para qué los usamos:</strong> exclusivamente para ofrecerte
          el análisis de compatibilidad y la generación de CVs adaptados.
        </p>
        <p>
          <strong>Terceros involucrados:</strong> el texto de tu CV y las
          ofertas se envían a la API de Gemini (Google) para el análisis con
          IA, y a Adzuna para la búsqueda de ofertas reales.
        </p>
        <p>
          <strong>Tus derechos:</strong> puedes solicitar la eliminación de tu
          cuenta y tus datos en cualquier momento.
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