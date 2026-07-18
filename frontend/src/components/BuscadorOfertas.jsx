import { useState } from "react";
import { buscarOfertas, generarCV, extraerTextoCV } from "../services/api";

const PROVINCIAS_ESPANA = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma de Mallorca",
  "Las Palmas",
  "Bilbao",
  "Alicante",
  "Córdoba",
  "Valladolid",
  "Vigo",
  "Gijón",
  "A Coruña",
  "Granada",
  "Elche",
  "Oviedo",
  "Badalona",
  "Cartagena",
  "Terrassa",
  "Jerez de la Frontera",
  "Sabadell",
  "Móstoles",
  "Alcalá de Henares",
  "Pamplona",
  "Fuenlabrada",
  "Almería",
  "Leganés",
  "San Sebastián",
  "Santander",
  "Burgos",
  "Castellón de la Plana",
  "Albacete",
  "Getafe",
  "Alcorcón",
  "Logroño",
  "Badajoz",
  "Salamanca",
  "Huelva",
  "Marbella",
  "Lleida",
  "Tarragona",
  "León",
  "Cádiz",
  "Jaén",
  "Ourense",
  "Girona",
  "Toda España",
];

function TarjetaOferta({ oferta, cvTexto }) {
  const [generandoCV, setGenerandoCV] = useState(false);
  const [aviso, setAviso] = useState("");
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  async function manejarGenerarCV() {
    setGenerandoCV(true);
    setAviso("");
    try {
      const blob = await generarCV(cvTexto, oferta.descripcion, oferta.palabras_clave_ats);
      const url = window.URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `cv_adaptado_${oferta.empresa}.pdf`;
      enlace.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setAviso("No pudimos generar el CV. Inténtalo de nuevo.");
    } finally {
      setGenerandoCV(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold text-gray-800">
        {oferta.match}% match — {oferta.titulo}
      </h3>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">{oferta.empresa}</span> |{" "}
        {oferta.ubicacion}
      </p>

      <button
        onClick={() => setMostrarDetalle(!mostrarDetalle)}
        className="text-blue-600 text-sm hover:underline mb-2"
      >
        {mostrarDetalle ? "Ocultar detalle" : "Ver fortalezas y carencias"}
      </button>

      {mostrarDetalle && (
        <div className="mb-3 text-sm">
          <p className="font-medium text-gray-700 mt-2">Fortalezas:</p>
          <ul className="space-y-1">
            {oferta.fortalezas.map((punto, i) => (
              <li key={i} className="text-gray-700">
                ✅ {punto}
              </li>
            ))}
          </ul>
          <p className="font-medium text-gray-700 mt-2">Carencias:</p>
          <ul className="space-y-1">
            {oferta.carencias.map((punto, i) => (
              <li key={i} className="text-gray-700">
                ⚠️ {punto}
              </li>
            ))}
          </ul>
          <p className="font-medium text-gray-700 mt-2">
            Compatibilidad ATS: {oferta.palabras_clave_cumplidas.length} de{" "}
            {oferta.palabras_clave_ats.length} palabras clave
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {oferta.palabras_clave_ats.map((palabra, i) => {
              const cumplida = oferta.palabras_clave_cumplidas.includes(palabra);
              return (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-full text-xs ${
                    cumplida
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-500 line-through"
                  }`}
                >
                  {palabra}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {aviso && <p className="text-red-600 text-sm mb-2">{aviso}</p>}

      <div className="flex gap-3">
        <a href={oferta.url} target="_blank" rel="noopener noreferrer" className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50" >
          Ver oferta original
        </a>
        <button
          onClick={manejarGenerarCV}
          disabled={generandoCV}
          className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {generandoCV ? "Generando..." : "📄 Generar CV adaptado"}
        </button>
      </div>
    </div>
  );
}

function BuscadorOfertas() {
  const [cvTexto, setCvTexto] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("customer success");
  const [ubicacion, setUbicacion] = useState("Madrid");
  const [ofertas, setOfertas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

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
      setAviso("No pudimos leer el archivo. Inténtalo de nuevo.");
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

    const ubicacionParaBusqueda =
      ubicacion === "Toda España" ? null : ubicacion;

    try {
      const datos = await buscarOfertas(
        cvTexto,
        palabrasClave,
        ubicacionParaBusqueda,
      );
      setOfertas(datos.ofertas);
    } catch (error) {
      setAviso(
        "No pudimos buscar ofertas en este momento. Inténtalo de nuevo.",
      );
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

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          O sube tu CV (PDF o Word)
        </label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={manejarSubirArchivo}
          disabled={subiendoArchivo}
          className="text-sm text-gray-600"
        />
        {subiendoArchivo && <p className="text-blue-600 text-sm mt-1">Leyendo archivo...</p>}
      </div>

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
            <>
              <p className="text-green-700 font-medium mb-4">
                Se encontraron {ofertas.length} ofertas, ordenadas de mayor a
                menor compatibilidad:
              </p>
              {ofertas.map((oferta, i) => (
                <TarjetaOferta key={i} oferta={oferta} cvTexto={cvTexto} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BuscadorOfertas;