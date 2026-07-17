import streamlit as st
from core.buscador_ofertas import buscar_y_analizar_ofertas
from core.analizador_cv import analizar_match
from core.generador_cv import generar_cv_adaptado, crear_pdf_desde_texto


st.set_page_config(page_title="AI Job Copilot", page_icon="🎯")

st.title("AI Job Copilot")
st.write("Pega tu CV y una oferta de trabajo para ver el análisis de compatibilidad.")

col1, col2 = st.columns(2)

with col1:
    cv_texto = st.text_area("Tu CV", height=300)

with col2:
    oferta_texto = st.text_area("Oferta de trabajo", height=300)

if "resultado_analisis" not in st.session_state:
    st.session_state.resultado_analisis = None

if st.button("Analizar"):
    if not cv_texto.strip() or not oferta_texto.strip():
        st.warning("Por favor, pega tanto el CV como la oferta antes de analizar.")
    else:
        with st.spinner("Analizando con IA..."):
            resultado = analizar_match(cv_texto, oferta_texto)
        st.session_state.resultado_analisis = resultado

if st.session_state.resultado_analisis:
    resultado = st.session_state.resultado_analisis

    if "error" in resultado:
        st.error(resultado["error"])
    else:
        st.metric("Porcentaje de match", f"{resultado['porcentaje_match']}%")

        st.subheader("Fortalezas")
        for punto in resultado["fortalezas"]:
            st.write(f"✅ {punto}")

        st.subheader("Carencias")
        for punto in resultado["carencias"]:
            st.write(f"⚠️ {punto}")

        st.divider()

        if st.button("📄 Generar CV adaptado a esta oferta (PDF)"):
            with st.spinner("Generando tu CV adaptado..."):
                cv_adaptado_texto = generar_cv_adaptado(cv_texto, oferta_texto)
                ruta_pdf = crear_pdf_desde_texto(cv_adaptado_texto)

            with open(ruta_pdf, "rb") as archivo_pdf:
                st.download_button(
                    label="⬇️ Descargar CV en PDF",
                    data=archivo_pdf,
                    file_name="cv_adaptado.pdf",
                    mime="application/pdf"
                )


st.divider()
st.header("🔍 Buscar mi trabajo ideal")
st.write("Pega tu CV y te buscamos ofertas reales publicadas en las últimas 24h, ordenadas por compatibilidad.")

cv_busqueda = st.text_area("Tu CV (para la búsqueda automática)", height=200, key="cv_busqueda")
palabras_clave = st.text_input("Palabras clave", value="customer success", key="palabras_clave")

provincias_espana = [
    "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga",
    "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao", "Alicante",
    "Córdoba", "Valladolid", "Vigo", "Gijón", "A Coruña", "Granada",
    "Elche", "Oviedo", "Badalona", "Cartagena", "Terrassa", "Jerez de la Frontera",
    "Sabadell", "Móstoles", "Alcalá de Henares", "Pamplona", "Fuenlabrada",
    "Almería", "Leganés", "San Sebastián", "Santander", "Burgos", "Castellón de la Plana",
    "Albacete", "Getafe", "Alcorcón", "Logroño", "Badajoz", "Salamanca",
    "Huelva", "Marbella", "Lleida", "Tarragona", "León", "Cádiz",
    "Jaén", "Ourense", "Girona", "Toda España"
]

ubicacion_busqueda = st.selectbox("Ubicación", provincias_espana, index=0, key="ubicacion_busqueda")

if "ofertas_encontradas" not in st.session_state:
    st.session_state.ofertas_encontradas = None

if st.button("Buscar ofertas idóneas"):
    if not cv_busqueda.strip():
        st.warning("Por favor, pega tu CV antes de buscar.")
    else:
        ubicacion_para_busqueda = None if ubicacion_busqueda == "Toda España" else ubicacion_busqueda

        with st.spinner("Buscando y analizando ofertas reales... esto puede tardar unos segundos"):
            resultados = buscar_y_analizar_ofertas(cv_busqueda, palabras_clave, ubicacion=ubicacion_para_busqueda)

        st.session_state.ofertas_encontradas = resultados

if st.session_state.ofertas_encontradas is not None:
    ofertas = st.session_state.ofertas_encontradas

    if len(ofertas) == 0:
        st.info("No se encontraron ofertas para esos criterios en las últimas 24h. Prueba otras palabras clave.")
    else:
        st.success(f"Se encontraron {len(ofertas)} ofertas, ordenadas de mayor a menor compatibilidad:")

        for oferta in ofertas:
            with st.container(border=True):
                st.subheader(f"{oferta['match']}% match — {oferta['titulo']}")
                st.write(f"**{oferta['empresa']}** | {oferta['ubicacion']}")

                with st.expander("Ver fortalezas y carencias"):
                    st.write("**Fortalezas:**")
                    for punto in oferta["fortalezas"]:
                        st.write(f"✅ {punto}")
                    st.write("**Carencias:**")
                    for punto in oferta["carencias"]:
                        st.write(f"⚠️ {punto}")

                col_link, col_cv = st.columns(2)

                with col_link:
                    st.link_button("Ver oferta original", oferta["url"])

                with col_cv:
                    if st.button("📄 Generar CV adaptado", key=f"generar_cv_{oferta['url']}"):
                        with st.spinner("Generando tu CV adaptado a esta oferta..."):
                            cv_adaptado_texto = generar_cv_adaptado(cv_busqueda, oferta["descripcion"])
                            ruta_pdf = crear_pdf_desde_texto(cv_adaptado_texto, ruta_salida=f"cv_{oferta['empresa']}.pdf")

                        with open(ruta_pdf, "rb") as archivo_pdf:
                            st.download_button(
                                label="⬇️ Descargar CV en PDF",
                                data=archivo_pdf,
                                file_name=f"cv_adaptado_{oferta['empresa']}.pdf",
                                mime="application/pdf",
                                key=f"descargar_cv_{oferta['url']}"
                            )