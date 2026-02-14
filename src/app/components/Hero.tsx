import { Scissors, Globe, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full mt-[3in] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="size-4" />
            Website Development Proposal
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-amber-400">Grandes Ligas</span>
            <br />
            Barber Shop
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            A modern, bilingual website to elevate your barbershop's online presence,
            attract new customers, and streamline appointment booking.
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Scissors className="size-5 text-amber-500" />
              <span>Custom Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-amber-500" />
              <span>Bilingual (EN/ES)</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              <span>Mobile Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
