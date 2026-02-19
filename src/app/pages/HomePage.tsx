import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";

import { Team } from "../components/Team";
import { Schedule } from "../components/Schedule";
import { AppointmentBooking } from "../components/AppointmentBooking";
import { Contact } from "../components/Contact";

import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Services />
      <Team />

      <Schedule />
      <AppointmentBooking />
      <Contact />
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="size-6 text-amber-400" />
            <span className="font-bold italic text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Quick Links</h3>
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="#services" className="text-slate-300 hover:text-amber-400 transition-colors">Services</a>
            <a href="#team" className="text-slate-300 hover:text-amber-400 transition-colors">Meet Our Team</a>
            <a href="#schedule" className="text-slate-300 hover:text-amber-400 transition-colors">Schedule</a>
            <a href="#booking" className="text-slate-300 hover:text-amber-400 transition-colors">Book Now</a>
            <a href="#contact" className="text-slate-300 hover:text-amber-400 transition-colors">Contact</a>
            <Link to="/about" className="text-slate-300 hover:text-amber-400 transition-colors">About</Link>
          </nav>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barber Shop. All rights reserved.
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
