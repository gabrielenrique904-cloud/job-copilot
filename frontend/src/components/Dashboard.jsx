import AnalizadorManual from "./AnalizadorManual";
import BuscadorOfertas from "./BuscadorOfertas";
import MenuHamburguesa from "./MenuHamburguesa";
import ModalInfo from "./ModalInfo";

function Dashboard({ onCerrarSesion, modalAbierto, onAbrirModal, onCerrarModal }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Job Copilot</h1>
          <MenuHamburguesa onCerrarSesion={onCerrarSesion} onAbrirModal={onAbrirModal} />
        </div>

        <AnalizadorManual />
        <BuscadorOfertas />
      </div>

      <ModalInfo tipo={modalAbierto} onCerrar={onCerrarModal} />
    </div>
  );
}

export default Dashboard;