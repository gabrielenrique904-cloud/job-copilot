import { useState } from "react";
import AuthForm from "./components/AuthForm";
import AnalizadorManual from "./components/AnalizadorManual";
import BuscadorOfertas from "./components/BuscadorOfertas";
import MenuHamburguesa from "./components/MenuHamburguesa";
import ModalInfo from "./components/ModalInfo";

function App() {
  const [usuarioId, setUsuarioId] = useState(() => {
    const guardado = localStorage.getItem("usuarioId");
    return guardado ? Number(guardado) : null;
  });
  const [modalAbierto, setModalAbierto] = useState(null);

  function manejarLoginExitoso(id) {
    localStorage.setItem("usuarioId", id);
    setUsuarioId(id);
  }

  function manejarCerrarSesion() {
    localStorage.removeItem("usuarioId");
    setUsuarioId(null);
  }

  if (!usuarioId) {
    return <AuthForm onLoginExitoso={manejarLoginExitoso} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Job Copilot</h1>
          <MenuHamburguesa
            onCerrarSesion={manejarCerrarSesion}
            onAbrirModal={(tipo) => setModalAbierto(tipo)}
          />
        </div>

        <AnalizadorManual />
        <BuscadorOfertas />
      </div>

      <ModalInfo tipo={modalAbierto} onCerrar={() => setModalAbierto(null)} />
    </div>
  );
}

export default App;