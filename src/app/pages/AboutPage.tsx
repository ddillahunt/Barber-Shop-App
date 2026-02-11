import { Navigation } from "../components/Navigation";
import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors, MapPin, Star, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Scissors className="size-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Grandes Ligas Barber Shop</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Where tradition meets modern style
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              Grandes Ligas Barber Shop was born from a passion for the art of barbering and a commitment
              to making every client look and feel their best. We believe a great haircut is more than just
              a service — it's an experience.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              Our skilled barbers bring years of experience, blending classic techniques with the latest
              trends to deliver cuts that are tailored to each individual. From the moment you walk in,
              you'll feel the difference.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            What Makes Us Special
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="inline-flex p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl mb-4">
                <Star className="size-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Premium Quality</h3>
              <p className="text-slate-300">
                We use only top-tier products and proven techniques to ensure every cut is flawless.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="inline-flex p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl mb-4">
                <MapPin className="size-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Welcoming Space</h3>
              <p className="text-slate-300">
                A comfortable, friendly atmosphere where everyone is treated like family.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="inline-flex p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl mb-4">
                <Clock className="size-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-3">Your Time Matters</h3>
              <p className="text-slate-300">
                Walk-ins welcome and appointments available — we work around your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Ready for a Fresh Look?
          </h2>
          <p className="text-slate-700 text-lg mb-8 max-w-xl mx-auto">
            Visit us today or book your appointment online. We can't wait to see you in the chair.
          </p>
          <button
            onClick={() => { navigate("/"); setTimeout(() => document.getElementById("booking")?.scrollIntoView(), 100); }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/50 hover:scale-105 transition-all duration-300"
          >
            Book an Appointment
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
            &copy; 2026 Grandes Ligas Barber Shop. All rights reserved.
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
