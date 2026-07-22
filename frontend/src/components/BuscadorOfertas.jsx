import { useState } from "react";
import { buscarOfertas, extraerTextoCV } from "../services/api";
import { iniciarContadorEspera } from "../utils/contador";
import { Paperclip, Search } from "lucide-react";
import TarjetaOferta from "./TarjetaOferta";

const PROVINCIAS_ESPANA = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao",
  "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "A Coruña", "Granada", "Elche", "Oviedo", "Badalona",
  "Cartagena", "Terrassa", "Jerez de la Frontera", "Sabadell", "Móstoles", "Alcalá de Henares", "Pamplona", "Fuenlabrada", "Almería", "Leganés",
  "San Sebastián", "Santander", "Burgos", "Castellón de la Plana", "Albacete", "Getafe", "Alcorcón", "Logroño", "Badajoz", "Salamanca",
  "Huelva", "Marbella", "Lleida", "Tarragona", "León", "Cádiz", "Jaén", "Ourense", "Girona", "Toda España",
];

function BuscadorOfertas() {
  const [cvTexto, setCvTexto] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("customer success");
  const [ubicacion, setUbicacion] = useState("Madrid");
  const [ofertas, setOfertas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  async function manejarSubirArchivo(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    setSubiendoArchivo(true);
    setAviso("");

    try {
      const datos = await extraerTextoCV(archivo);
      if (datos.texto) {
        setCvTexto(datos.texto);
      } else {
        setAviso("No pudimos leer el archivo. Prueba con otro PDF/Word, o pega el texto manualmente.");
      }
    } catch (error) {
      setAviso(error.message || "No pudimos leer el archivo. Inténtalo de nuevo.");
    } finally {
      setSubiendoArchivo(false);
    }
  }

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
      const datos = await buscarOfertas(usuarioId, cvTexto, palabrasClave, ubicacionParaBusqueda);
      setOfertas(datos.ofertas);
    } catch (error) {
      if (error.segundosRestantes) {
        iniciarContadorEspera(setAviso, error.segundosRestantes);
      } else {
        setAviso(error.message || "No pudimos buscar ofertas en este momento. Inténtalo de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Search size={20} className="text-blue-600" />
        Buscar mi trabajo ideal
      </h2>
      <p className="text-gray-600 mb-4">
        Pega tu CV y te buscamos ofertas reales publicadas en las últimas 24h,
        ordenadas por compatibilidad.
      </p>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          O sube tu CV (PDF o Word)
        </label>
        <label
          htmlFor="input-cv-busqueda"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 ${
            subiendoArchivo ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Paperclip size={16} />
          Seleccionar archivo
        </label>
        <input
          id="input-cv-busqueda"
          type="file"
          accept=".pdf,.docx"
          onChange={manejarSubirArchivo}
          disabled={subiendoArchivo}
          className="hidden"
        />
        {subiendoArchivo && <p className="text-blue-600 text-sm mt-2">Leyendo archivo...</p>}
      </div>

      <textarea
        value={cvTexto}
        onChange={(e) => setCvTexto(e.target.value)}
        placeholder="Pega aquí el texto completo de tu CV (usaremos tus palabras clave para buscar ofertas afines)"
        className="w-full h-40 sm:h-56 md:h-72 resize-y border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
      />
      <p className="text-xs text-gray-500 mb-4">Máximo 6.000 caracteres.</p>

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
        className="w-full sm:w-auto bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
            <>
              <p className="text-green-700 font-medium mb-4">
                Se encontraron {ofertas.length} ofertas, ordenadas de mayor a
                menor compatibilidad:
              </p>
              {ofertas.map((oferta, i) => (
                <TarjetaOferta key={i} oferta={oferta} cvTexto={cvTexto} usuarioId={usuarioId} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BuscadorOfertas;