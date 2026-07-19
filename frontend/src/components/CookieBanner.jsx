import { useState, useEffect } from "react";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const aceptado = localStorage.getItem("cookiesAceptadas");
    if (!aceptado) {
      setVisible(true);
    }
  }, []);

  function aceptar() {
    localStorage.setItem("cookiesAceptadas", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm">
        Usamos almacenamiento local del navegador únicamente para mantener tu
        sesión iniciada. No utilizamos cookies de rastreo ni publicidad. Más
        información en nuestra política de privacidad.
      </p>
      <button
        onClick={aceptar}
        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap hover:bg-gray-100"
      >
        Entendido
      </button>
    </div>
  );
}

export default CookieBanner;