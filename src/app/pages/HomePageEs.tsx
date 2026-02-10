import { NavigationEs } from "../components/es/NavigationEs";
import { HeroEs } from "../components/es/HeroEs";
import { ServicesEs } from "../components/es/ServicesEs";
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
    </div>
  );
}
