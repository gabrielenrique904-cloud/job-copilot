import { useState } from "react";

function AyudaInstrucciones({ contenido }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-4 h-4 rounded-full bg-gray-300 text-white text-xs font-bold hover:bg-gray-400 inline-flex items-center justify-center align-middle"
        aria-label="Más información"
      >
        ?
      </button>

      {abierto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAbierto(false)} />
          <div className="absolute left-0 top-6 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 text-xs text-gray-700 space-y-2">
            {contenido}
            <button
              onClick={() => setAbierto(false)}
              className="text-blue-600 hover:underline font-medium"
            >
              Entendido
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AyudaInstrucciones;