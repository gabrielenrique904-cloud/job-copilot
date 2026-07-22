import { Link, useLocation } from "react-router-dom";
import { Sparkles, ShieldCheck, Info } from "lucide-react";

const ENLACES = [
  { to: "/como-funciona", texto: "Cómo funciona", icono: Info },
  { to: "/por-que-somos-diferentes", texto: "Por qué somos diferentes", icono: Sparkles },
  { to: "/privacidad", texto: "Privacidad", icono: ShieldCheck },
];

function Header() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {ENLACES.map(({ to, texto, icono: Icono }) => {
        const activo = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activo
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Icono size={14} />
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}

export default Header;