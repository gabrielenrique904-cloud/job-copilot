# AI Job Copilot

**Plataforma de inteligencia de carrera con IA** — no es un generador de CV más. Analiza tu perfil frente a ofertas reales, te dice qué te falta y por qué, y te ayuda a construir un CV honesto y optimizado para cada oportunidad.

🔗 **Demo en vivo**: [job-copilot-bice.vercel.app](https://job-copilot-bice.vercel.app)

---

## ¿Qué hace?

- **Analiza tu CV contra una oferta**: % de compatibilidad, fortalezas, carencias y compatibilidad ATS.
- **Detecta señales de alerta en la oferta**: salario no especificado, jornadas excesivas, descripciones vagas.
- **Busca ofertas reales** (vía Adzuna) y las analiza automáticamente, ordenadas por compatibilidad.
- **Sugiere mejoras honestas**: para cada palabra clave ATS que falte, sugiere cómo reflejar experiencia *real* que ya tienes — nunca inventa nada, y requiere tu confirmación explícita.
- **Genera un CV adaptado en PDF**: en el idioma de la oferta, garantizado a una sola página, con logros priorizados según relevancia real (decidida por la IA, no recortada mecánicamente).
- **Permite instrucciones personalizadas**: puedes pedir reorganizar o corregir información existente (ej. "mueve Node.js a Habilidades técnicas") — nunca puede usarse para inventar experiencia.

## Principios de diseño (no negociables)

1. **La IA nunca inventa experiencia laboral que el usuario no tenga.**
2. **Cualquier inclusión de contenido nuevo al CV requiere confirmación explícita del usuario.**
3. **Seguridad real, no aparente**: hashing de contraseñas, protección contra prompt injection, límites de uso verificados en servidor, no solo en el navegador.

## Stack técnico

**Backend**
- Python 3 + FastAPI
- SQLite + SQLAlchemy
- Google Gemini API (análisis y generación con IA)
- Adzuna API (ofertas de empleo reales)
- Resend (emails transaccionales)
- bcrypt + Google OAuth 2.0 (autenticación)
- fpdf2 (generación de PDF)

**Frontend**
- React + Vite
- Tailwind CSS
- lucide-react (iconos)

**Infraestructura**
- Backend desplegado en [Render](https://render.com)
- Frontend desplegado en [Vercel](https://vercel.com)

## Arquitectura

```
Frontend (React) → Backend (FastAPI) → Gemini / Adzuna / Resend / Google OAuth
                         ↓
                    SQLite (usuarios, tokens, límites de uso)
```

El frontend nunca llama directamente a las APIs de IA o de terceros (salvo el flujo estándar de OAuth de Google para login) — todo pasa por el backend, que es el único con acceso a las claves API, guardadas como variables de entorno.

```
core/          → Lógica de negocio de IA (análisis, generación de CV, seguridad de prompts)
database/      → Autenticación, recuperación de contraseña, límites de uso, contacto
api.py         → Endpoints HTTP (FastAPI)
frontend/src/  → Interfaz React
```

## Seguridad implementada

- Contraseñas hasheadas con bcrypt (nunca en texto plano)
- Protección contra fuerza bruta en login (bloqueo tras 5 intentos fallidos / 15 min)
- Protección contra spam en recuperación de contraseña (máx. 3 solicitudes/día por email)
- Detección de intentos de prompt injection (dos capas: heurística + refuerzo en el prompt)
- Límites de uso diario reales por usuario, verificados en el servidor
- CORS configurado explícitamente, sin comodines
- Variables de entorno para todos los secretos, nunca hardcodeados

## Ejecutar el proyecto en local

### Backend

```bash
python -m venv venv
venv\Scripts\activate  # En Windows
pip install -r requirements.txt
```

Crea un archivo `.env` en la raíz con:

```
GEMINI_API_KEY=tu_clave
ADZUNA_APP_ID=tu_id
ADZUNA_APP_KEY=tu_clave
RESEND_API_KEY=tu_clave
FRONTEND_URL=http://localhost:5173
```

```bash
uvicorn api:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Roadmap / mejoras futuras conocidas

- Migrar de SQLite a PostgreSQL gestionado para persistencia real en producción
- Autenticación con JWT en lugar de `usuario_id` en el body de cada petición
- Colas asíncronas para peticiones largas (generación de CV, búsqueda de ofertas)
- Verificación de dominio propio en Resend para envío de emails sin restricciones
- Rediseño visual con scores desglosados (ATS, técnico, comunicación)

## Sobre el proyecto

Desarrollado por Gabriel Méndez como proyecto de fin de bootcamp, con el objetivo de construir una herramienta genuinamente útil para personas en búsqueda de empleo — nacida de la experiencia personal de no saber por qué un CV no genera entrevistas, y de la convicción de que la IA puede dar ese diagnóstico sin comprometer la honestidad del candidato.

## Licencia

Proyecto educativo, sin ánimo de lucro.