import { useState } from "react";
import AuthForm from "./components/AuthForm";
import AnalizadorManual from "./components/AnalizadorManual";

function App() {
  const [usuarioId, setUsuarioId] = useState(null);

  if (!usuarioId) {
    return <AuthForm onLoginExitoso={(id) => setUsuarioId(id)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          AI Job Copilot
        </h1>

        <AnalizadorManual />
      </div>
    </div>
  );
}

export default App;