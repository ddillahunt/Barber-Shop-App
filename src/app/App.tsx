import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectOverview } from './components/ProjectOverview';
import { PricingTiers } from './components/PricingTiers';
import { Timeline } from './components/Timeline';
import { Features } from './components/Features';
import { Terms } from './components/Terms';
import { Contact } from './components/Contact';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import gdiLogo from '../assets/gdi-logo.png';

export default function App() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    if (exporting) return;
    setExporting(true);
    toast.info('Opening print dialog... Select "Save as PDF" to download.');

    // Short delay to let the toast show before print dialog blocks the UI
    setTimeout(() => {
      window.print();
      setExporting(false);
      toast.success('PDF dialog closed.');
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main>
          <div className="page-break-after flex items-center justify-center min-h-screen">
            <Hero />
          </div>
          <div className="page-break-after">
            <ProjectOverview />
          </div>
          <div className="page-break-after">
            <PricingTiers selectedTier={selectedTier} onSelectTier={setSelectedTier} />
          </div>
          <div className="page-break-after">
            <Features />
          </div>
          <div className="page-break-after">
            <Timeline />
          </div>
          <div className="page-break-after">
            <Terms />
          </div>
          <div>
            <Contact selectedTier={selectedTier} />
          </div>
          
          {/* Download PDF Button */}
          <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 flex items-center gap-2 mx-auto text-lg px-8 py-6 disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileDown className="size-5" />
                  Download Proposal PDF
                </>
              )}
            </Button>
          </div>
        </main>
        <footer className="bg-slate-900 text-slate-300 py-8 text-center">
          <p className="text-sm">© 2026 Grandes Ligas. All rights reserved.</p>
          <p className="text-xs mt-2">Grandes Ligas Barber Shop Website Development Proposal</p>
        </footer>
      </div>
      {/* Print-only footer logo on every page */}
      <div className="print-footer">
        <img src={gdiLogo} alt="GDI Digital Solutions" className="print-footer-logo" />
      </div>
      <Toaster />
    </>
  );
}