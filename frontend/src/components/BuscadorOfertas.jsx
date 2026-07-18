import { useState } from "react";
import { buscarOfertas } from "../services/api";

const PROVINCIAS_ESPANA = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga",
  "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao", "Alicante",
  "Córdoba", "Valladolid", "Vigo", "Gijón", "A Coruña", "Granada",
  "Elche", "Oviedo", "Badalona", "Cartagena", "Terrassa", "Jerez de la Frontera",
  "Sabadell", "Móstoles", "Alcalá de Henares", "Pamplona", "Fuenlabrada",
  "Almería", "Leganés", "San Sebastián", "Santander", "Burgos", "Castellón de la Plana",
  "Albacete", "Getafe", "Alcorcón", "Logroño", "Badajoz", "Salamanca",
  "Huelva", "Marbella", "Lleida", "Tarragona", "León", "Cádiz",
  "Jaén", "Ourense", "Girona", "Toda España",
];

function BuscadorOfertas() {
  const [cvTexto, setCvTexto] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("customer success");
  const [ubicacion, setUbicacion] = useState("Madrid");
  const [ofertas, setOfertas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");

  async function manejarBuscar() {
    setAviso("");

    if (!cvTexto.trim()) {
      setAviso("Por favor, pega tu CV antes de buscar.");
      return;
    }

    setCargando(true);
    setOfertas(null);

    const ubicacionParaBusqueda = ubicacion === "Toda España" ? null : ubicacion;

    try {
      const datos = await buscarOfertas(cvTexto, palabrasClave, ubicacionParaBusqueda);
      setOfertas(datos.ofertas);
    } catch (error) {
      setAviso("No pudimos buscar ofertas en este momento. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        🔍 Buscar mi trabajo ideal
      </h2>
      <p className="text-gray-600 mb-4">
        Pega tu CV y te buscamos ofertas reales publicadas en las últimas 24h,
        ordenadas por compatibilidad.
      </p>

      <textarea
        value={cvTexto}
        onChange={(e) => setCvTexto(e.target.value)}
        placeholder="Tu CV (para la búsqueda automática)"
        rows={8}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={palabrasClave}
          onChange={(e) => setPalabrasClave(e.target.value)}
          placeholder="Palabras clave"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PROVINCIAS_ESPANA.map((provincia) => (
            <option key={provincia} value={provincia}>
              {provincia}
            </option>
          ))}
        </select>
      </div>

      {aviso && <p className="text-amber-600 mb-3">{aviso}</p>}

      <button
        onClick={manejarBuscar}
        disabled={cargando}
        className="bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {cargando ? "Buscando y analizando..." : "Buscar ofertas idóneas"}
      </button>

      {ofertas !== null && (
        <div className="mt-6 border-t pt-6">
          {ofertas.length === 0 ? (
            <p className="text-gray-600">
              No se encontraron ofertas para esos criterios en las últimas 24h.
              Prueba otras palabras clave.
            </p>
          ) : (
            <p className="text-green-700 font-medium">
              Se encontraron {ofertas.length} ofertas, ordenadas de mayor a menor
              compatibilidad. (Tarjetas de resultado: siguiente paso)
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default BuscadorOfertas;