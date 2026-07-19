import { useState } from "react";
import AuthForm from "./components/AuthForm";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";

function App() {
  const [usuarioId, setUsuarioId] = useState(() => {
    const guardado = localStorage.getItem("usuarioId");
    return guardado ? Number(guardado) : null;
  });
  const [modalAbierto, setModalAbierto] = useState(null);

  const parametrosUrl = new URLSearchParams(window.location.search);
  const tokenReset = parametrosUrl.get("token");

  function manejarLoginExitoso(id) {
    localStorage.setItem("usuarioId", id);
    setUsuarioId(id);
  }

  function manejarCerrarSesion() {
    localStorage.removeItem("usuarioId");
    setUsuarioId(null);
  }

  if (tokenReset) {
    return <ResetPassword token={tokenReset} />;
  }

  if (!usuarioId) {
    return <AuthForm onLoginExitoso={manejarLoginExitoso} />;
  }

  return (
    <Dashboard
      onCerrarSesion={manejarCerrarSesion}
      modalAbierto={modalAbierto}
      onAbrirModal={setModalAbierto}
      onCerrarModal={() => setModalAbierto(null)}
    />
  );
}

export default App;