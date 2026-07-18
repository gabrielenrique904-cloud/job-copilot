import { useState } from "react";
import AuthForm from "./components/AuthForm";

function App() {
  const [usuarioId, setUsuarioId] = useState(null);

  if (!usuarioId) {
    return <AuthForm onLoginExitoso={(id) => setUsuarioId(id)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Bienvenido! Sesión iniciada correctamente.
        </h1>
        <p className="text-gray-600 mt-2">Tu ID de usuario es: {usuarioId}</p>
      </div>
    </div>
  );
}

export default App;