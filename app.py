print("PUNTO 1: arrancando app.py")

import streamlit as st
print("PUNTO 2: streamlit importado")

from core.analizador_cv import analizar_match
print("PUNTO 3: analizador_cv importado")

st.set_page_config(page_title="AI Job Copilot", page_icon="🎯")
print("PUNTO 4: page_config hecho")

st.title("AI Job Copilot")
print("PUNTO 5: titulo pintado")

st.write("Pega tu CV y una oferta de trabajo para ver el análisis de compatibilidad.")

col1, col2 = st.columns(2)

with col1:
    cv_texto = st.text_area("Tu CV", height=300)

with col2:
    oferta_texto = st.text_area("Oferta de trabajo", height=300)

print("PUNTO 6: interfaz completa dibujada")

if st.button("Analizar"):
    if not cv_texto.strip() or not oferta_texto.strip():
        st.warning("Por favor, pega tanto el CV como la oferta antes de analizar.")
    else:
        with st.spinner("Analizando con IA..."):
            resultado = analizar_match(cv_texto, oferta_texto)

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