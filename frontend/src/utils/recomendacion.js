export function obtenerRecomendacion(porcentaje) {
  if (porcentaje < 50) {
    return {
      etiqueta: "No recomendable participar",
      colorTexto: "text-red-700",
      colorFondo: "bg-red-100",
      explicacion:
        "Un ATS real suele descartar automáticamente candidaturas por debajo del 50% de compatibilidad. Antes de aplicar, revisa tus carencias y usa 'Sugerir inclusión' para ver si puedes reflejar mejor experiencia real que ya tengas.",
    };
  }
  if (porcentaje < 70) {
    return {
      etiqueta: "Notable",
      colorTexto: "text-amber-700",
      colorFondo: "bg-amber-100",
      explicacion:
        "Estás en la zona donde la mayoría de ATS ya no descartan automáticamente, pero un reclutador humano comparará tu perfil con otros candidatos. Vale la pena aplicar, y aún mejor si revisas las palabras clave que te faltan antes de enviar tu CV.",
    };
  }
  return {
    etiqueta: "Se recomienda aplicar",
    colorTexto: "text-green-700",
    colorFondo: "bg-green-100",
    explicacion:
      "Tu perfil está bien alineado con esta oferta según los criterios que suelen usar los sistemas ATS y los equipos de selección. Es una candidatura fuerte para esta posición.",
  };
}