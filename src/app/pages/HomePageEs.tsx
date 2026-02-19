import { NavigationEs } from "../components/es/NavigationEs";
import { HeroEs } from "../components/es/HeroEs";
import { ServicesEs } from "../components/es/ServicesEs";

import { TeamEs } from "../components/es/TeamEs";
import { ScheduleEs } from "../components/es/ScheduleEs";
import { AppointmentBookingEs } from "../components/es/AppointmentBookingEs";
import { ContactEs } from "../components/es/ContactEs";
import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePageEs() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationEs />
      <HeroEs />
      <ServicesEs />
      <TeamEs />

      <ScheduleEs />
      <AppointmentBookingEs />
      <ContactEs />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="size-6 text-amber-400" />
            <span className="font-bold italic text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Enlaces Rápidos</h3>
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="#services" className="text-slate-300 hover:text-amber-400 transition-colors">Servicios</a>
            <a href="#team" className="text-slate-300 hover:text-amber-400 transition-colors">Nuestro Equipo</a>
            <a href="#schedule" className="text-slate-300 hover:text-amber-400 transition-colors">Horario</a>
            <a href="#booking" className="text-slate-300 hover:text-amber-400 transition-colors">Reservar</a>
            <a href="#contact" className="text-slate-300 hover:text-amber-400 transition-colors">Contacto</a>
            <Link to="/es/acerca-de" className="text-slate-300 hover:text-amber-400 transition-colors">Acerca De</Link>
          </nav>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barbería. Todos los derechos reservados.
          </p>
          <Link to="/admin/login" className="text-slate-600 hover:text-amber-400 transition-colors text-xs mt-2 inline-block">
            Admin
          </Link>
          <p className="text-slate-400 text-sm mt-3">Powered by GDI Digital Solutions</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
