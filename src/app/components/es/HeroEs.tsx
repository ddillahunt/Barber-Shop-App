import { Scissors } from "lucide-react";
import heroBg from "../../../assets/images/hero-bg.jpg";

export function HeroEs() {
  return (
    <section className="relative bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white py-32 overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 animate-pulse" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 mb-6 bg-gradient-to-br from-amber-500 to-yellow-600 backdrop-blur-sm rounded-2xl border border-amber-400/30 shadow-2xl shadow-amber-500/50">
          <Scissors className="size-16 text-black" />
        </div>
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Left Barber Pole */}
          <div className="relative w-8 h-32 bg-white rounded-full overflow-hidden shadow-lg shadow-amber-500/50 border-2 border-amber-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-white to-blue-600" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #dc2626 0px, #dc2626 10px, #ffffff 10px, #ffffff 20px, #2563eb 20px, #2563eb 30px)',
              animation: 'barberSpin 2s linear infinite'
            }} />
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-br from-amber-500 to-yellow-600 border-b-2 border-amber-500" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-br from-amber-500 to-yellow-600 border-t-2 border-amber-500" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
            Grandes Ligas
          </h1>
          
          {/* Right Barber Pole */}
          <div className="relative w-8 h-32 bg-white rounded-full overflow-hidden shadow-lg shadow-amber-500/50 border-2 border-amber-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-white to-blue-600" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #dc2626 0px, #dc2626 10px, #ffffff 10px, #ffffff 20px, #2563eb 20px, #2563eb 30px)',
              animation: 'barberSpin 2s linear infinite'
            }} />
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-br from-amber-500 to-yellow-600 border-b-2 border-amber-500" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-br from-amber-500 to-yellow-600 border-t-2 border-amber-500" />
          </div>
        </div>
        <p className="text-xl md:text-2xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
          Experiencia de barbería premium para el caballero moderno. Cortes clásicos, estilos contemporáneos.
        </p>
        <div className="mt-10">
          <button 
            onClick={() => document.getElementById('booking')?.scrollIntoView()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/50"
          >
            Reserva Tu Cita
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes barberSpin {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(30px);
          }
        }
      `}</style>
    </section>
  );
}