import { useState } from "react";
import AnalizadorManual from "./AnalizadorManual";
import BuscadorOfertas from "./BuscadorOfertas";
import MenuHamburguesa from "./MenuHamburguesa";
import Header from "./layout/Header";
import ModalContacto from "./modals/ModalContacto";

function Dashboard({ usuarioId, onCerrarSesion }) {
  const [contactoAbierto, setContactoAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">AI Job Copilot</h1>
            <p className="text-gray-500 text-sm mt-1">
              Tu asistente de inteligencia de carrera
            </p>
          </div>
          <MenuHamburguesa
            onCerrarSesion={onCerrarSesion}
            onAbrirContacto={() => setContactoAbierto(true)}
          />
        </div>

        <Header />

        <div className="space-y-6">
          <AnalizadorManual />
          <BuscadorOfertas />
        </div>
      </div>

      <ModalContacto abierto={contactoAbierto} onCerrar={() => setContactoAbierto(false)} />
    </div>
  );
}

export default Dashboard;