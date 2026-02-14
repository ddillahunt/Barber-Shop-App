import { NavigationEs } from "../components/es/NavigationEs";
import { HeroEs } from "../components/es/HeroEs";
import { ServicesEs } from "../components/es/ServicesEs";
import { GalleryEs } from "../components/es/GalleryEs";
import { ScheduleEs } from "../components/es/ScheduleEs";
import { AppointmentBookingEs } from "../components/es/AppointmentBookingEs";
import { ContactEs } from "../components/es/ContactEs";
import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors } from "lucide-react";

export function HomePageEs() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationEs />
      <HeroEs />
      <ServicesEs />
      <GalleryEs />
      <ScheduleEs />
      <AppointmentBookingEs />
      <ContactEs />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="size-6 text-amber-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barbería. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <ScrollToTop />

      {/* Floating Book Now Button */}
      <button
        onClick={() => document.getElementById('booking')?.scrollIntoView()}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-6 py-4 rounded-full font-bold text-lg shadow-2xl shadow-amber-500/50 hover:scale-110 transition-all duration-300 animate-bounce"
      >
        📱 ¡RESERVA AHORA!!
      </button>
    </div>
  );
}
