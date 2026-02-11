import { NavigationEs } from "../components/es/NavigationEs";
import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors, MapPin, Star, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AboutPageEs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <NavigationEs />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Scissors className="size-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Grandes Ligas Barber Shop</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Sobre Nosotros
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Donde la tradicion se encuentra con el estilo moderno
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Nuestra Historia
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              Grandes Ligas Barber Shop nacio de una pasion por el arte de la barberia y un compromiso
              de hacer que cada cliente se vea y se sienta lo mejor posible. Creemos que un gran corte de
              pelo es mas que un servicio — es una experiencia.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              Nuestros barberos expertos traen anos de experiencia, combinando tecnicas clasicas con las
              ultimas tendencias para ofrecer cortes personalizados para cada individuo. Desde el momento
              en que entras, sentiras la diferencia.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Lo Que Nos Hace Especiales
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="inline-flex p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl mb-4">
                <Star className="size-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Calidad Premium</h3>
              <p className="text-slate-300">
                Usamos solo productos de primera calidad y tecnicas comprobadas para asegurar que cada corte sea perfecto.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="inline-flex p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl mb-4">
                <MapPin className="size-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Espacio Acogedor</h3>
              <p className="text-slate-300">
                Un ambiente comodo y amigable donde todos son tratados como familia.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="inline-flex p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl mb-4">
                <Clock className="size-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Tu Tiempo Importa</h3>
              <p className="text-slate-300">
                Aceptamos visitas sin cita y tambien con cita previa — nos adaptamos a tu horario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Listo Para un Nuevo Look?
          </h2>
          <p className="text-slate-700 text-lg mb-8 max-w-xl mx-auto">
            Visitanos hoy o reserva tu cita en linea. Te esperamos en la silla.
          </p>
          <button
            onClick={() => { navigate("/es"); setTimeout(() => document.getElementById("booking")?.scrollIntoView(), 100); }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/50 hover:scale-105 transition-all duration-300"
          >
            Reservar una Cita
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="size-6 text-amber-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barber Shop. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
