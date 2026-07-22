import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import CookieBanner from "./components/CookieBanner";
import ComoFunciona from "./pages/ComoFunciona";
import Privacidad from "./pages/Privacidad";
import PorQueSomosDiferentes from "./pages/PorQueSomosDiferentes";

function PantallaResetPassword() {
  const [parametros] = useSearchParams();
  const token = parametros.get("token");
  return <ResetPassword token={token} />;
}

function App() {
  const [usuarioId, setUsuarioId] = useState(() => {
    const guardado = localStorage.getItem("usuarioId");
    return guardado ? Number(guardado) : null;
  });

  function manejarLoginExitoso(id) {
    localStorage.setItem("usuarioId", id);
    setUsuarioId(id);
  }

  function manejarCerrarSesion() {
    localStorage.removeItem("usuarioId");
    setUsuarioId(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<PantallaResetPassword />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/por-que-somos-diferentes" element={<PorQueSomosDiferentes />} />

        <Route
          path="/"
          element={
            usuarioId ? (
              <Dashboard usuarioId={usuarioId} onCerrarSesion={manejarCerrarSesion} />
            ) : (
              <AuthForm onLoginExitoso={manejarLoginExitoso} />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CookieBanner />
    </BrowserRouter>
  );
}

export default App;