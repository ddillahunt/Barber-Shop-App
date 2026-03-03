import { useState, useEffect } from "react";
import logoImg from "../../assets/images/barber-Grandes Ligas logo.png";

const heroImages = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white py-32 overflow-hidden">
      {/* Background Image Carousel */}
      {heroImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt="Barber shop"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImage ? 'opacity-50' : 'opacity-0'}`}
        />
      ))}

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-red-500/10 animate-pulse" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 mb-6">
          <img src={logoImg} alt="Grandes Ligas" className="h-32 w-auto object-contain" />
        </div>
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Left Barber Pole */}
          <div className="relative w-8 h-32 bg-white rounded-full overflow-hidden shadow-lg shadow-blue-500/50 border-2 border-blue-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-white to-blue-600" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #C41E3A 0px, #C41E3A 10px, #ffffff 10px, #ffffff 20px, #2B6CB0 20px, #2B6CB0 30px)',
              animation: 'barberSpin 2s linear infinite'
            }} />
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-br from-slate-600 to-slate-700 border-b-2 border-slate-500" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-br from-slate-600 to-slate-700 border-t-2 border-slate-500" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold italic bg-gradient-to-r from-sky-200 via-blue-300 to-sky-200 bg-clip-text text-transparent drop-shadow-lg leading-relaxed pb-2">
            Grandes Ligas
          </h1>

          {/* Right Barber Pole */}
          <div className="relative w-8 h-32 bg-white rounded-full overflow-hidden shadow-lg shadow-blue-500/50 border-2 border-blue-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-white to-blue-600" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #C41E3A 0px, #C41E3A 10px, #ffffff 10px, #ffffff 20px, #2B6CB0 20px, #2B6CB0 30px)',
              animation: 'barberSpin 2s linear infinite'
            }} />
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-br from-slate-600 to-slate-700 border-b-2 border-slate-500" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-br from-slate-600 to-slate-700 border-t-2 border-slate-500" />
          </div>
        </div>
        <a href="https://www.grandes-ligas.net" target="_blank" rel="noopener noreferrer" className="inline-block text-sky-300 hover:text-sky-200 text-lg font-medium tracking-wide transition-colors mb-4">
          Grandes-Ligas.net
        </a>
        <p className="text-xl md:text-2xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
          Premium barber shop experience for the modern gentleman. Classic cuts, contemporary styles.
        </p>
        <div className="mt-10">
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView()}
            className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/50"
          >
            Book Your Cut Now
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
