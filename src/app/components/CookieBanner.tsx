import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const isSpanish = pathname.startsWith("/es");

  useEffect(() => {
    if (!localStorage.getItem("cookieConsent")) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 via-black to-slate-900 border-2 border-amber-500/30 rounded-2xl shadow-2xl shadow-black/50 p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shrink-0">
            <Cookie className="size-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-amber-400 font-bold text-lg mb-1">
              {isSpanish ? "Usamos Cookies" : "We Use Cookies"}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {isSpanish ? (
                <>
                  Usamos cookies para mejorar tu experiencia de navegación y recordar tus preferencias.
                  Al hacer clic en "Aceptar", consientes el uso de cookies. Lee nuestra{" "}
                  <Link to="/es/privacidad" className="text-amber-400 hover:text-yellow-500 underline transition-colors">
                    Política de Privacidad
                  </Link>{" "}
                  para más información.
                </>
              ) : (
                <>
                  We use cookies to enhance your browsing experience and remember your preferences.
                  By clicking "Accept", you consent to our use of cookies. Read our{" "}
                  <Link to="/privacy" className="text-amber-400 hover:text-yellow-500 underline transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  to learn more.
                </>
              )}
            </p>
          </div>
          <button onClick={handleDecline} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={handleDecline}
            className="px-5 py-2 text-sm font-medium text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isSpanish ? "Rechazar" : "Decline"}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-bold text-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-lg shadow-lg shadow-amber-500/30 transition-all"
          >
            {isSpanish ? "Aceptar" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
