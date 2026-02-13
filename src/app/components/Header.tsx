import { Scissors } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Scissors className="size-6" />
            </div>
            <div>
              <h1 className="font-bold">Grandes Ligas Proposal</h1>
              <p className="text-sm text-slate-300">Barber Shop Website Project</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mt-1">February 13, 2026</p>
          </div>
        </div>
      </div>
    </header>
  );
}