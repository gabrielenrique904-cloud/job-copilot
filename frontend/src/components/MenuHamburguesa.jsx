import { useState } from "react";
import ModalInfo from "./modals/ModalInfo";

function MenuHamburguesa({ onCerrarSesion, onAbrirContacto }) {
  const [abierto, setAbierto] = useState(false);
  const [aboutAbierto, setAboutAbierto] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="p-2 rounded-lg hover:bg-gray-100"
        aria-label="Menú"
      >
        <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
        <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
        <div className="w-6 h-0.5 bg-gray-700"></div>
      </button>

      {abierto && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAbierto(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-2">
            <button
              onClick={() => {
                setAboutAbierto(true);
                setAbierto(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Sobre nosotros
            </button>
            <button
              onClick={() => {
                onAbrirContacto();
                setAbierto(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Contactar
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={() => {
                onCerrarSesion();
                setAbierto(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}

      <ModalInfo tipo={aboutAbierto ? "about" : null} onCerrar={() => setAboutAbierto(false)} />
    </div>
  );
}

export default MenuHamburguesa;