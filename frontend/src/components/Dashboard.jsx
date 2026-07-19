import { useState } from "react";
import AnalizadorManual from "./AnalizadorManual";
import BuscadorOfertas from "./BuscadorOfertas";
import MenuHamburguesa from "./MenuHamburguesa";
import ModalInfo from "./modals/ModalInfo";
import ModalGuia from "./modals/ModalGuia";
import ModalContacto from "./modals/ModalContacto";

function Dashboard({ onCerrarSesion, modalAbierto, onAbrirModal, onCerrarModal }) {
  const [contactoAbierto, setContactoAbierto] = useState(false);

  function manejarAbrirModal(tipo) {
    if (tipo === "contacto") {
      setContactoAbierto(true);
    } else {
      onAbrirModal(tipo);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Job Copilot</h1>
          <MenuHamburguesa onCerrarSesion={onCerrarSesion} onAbrirModal={manejarAbrirModal} />
        </div>

        <AnalizadorManual />
        <BuscadorOfertas />
      </div>

      <ModalInfo tipo={modalAbierto === "guia" ? null : modalAbierto} onCerrar={onCerrarModal} />
      <ModalGuia abierto={modalAbierto === "guia"} onCerrar={onCerrarModal} />
      <ModalContacto abierto={contactoAbierto} onCerrar={() => setContactoAbierto(false)} />
    </div>
  );
}

export default Dashboard;