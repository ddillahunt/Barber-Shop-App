import { useState, useRef } from 'react';
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

export default function App() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Resolve an oklch(...) string to rgb using the browser's CSS engine
  const resolveOklch = (oklchValue: string): string => {
    const temp = document.createElement('div');
    temp.style.color = oklchValue;
    temp.style.display = 'none';
    document.body.appendChild(temp);
    const resolved = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return resolved;
  };

  // Replace all oklch(...) occurrences in CSS text with browser-resolved rgb values
  const replaceOklchInCSS = (cssText: string): string => {
    return cssText.replace(/oklch\([^)]+\)/g, (match) => {
      try {
        return resolveOklch(match);
      } catch {
        return '#000000';
      }
    });
  };

  const handleExportPDF = async () => {
    if (!contentRef.current || exporting) return;

    setExporting(true);
    try {
      toast.info('Generating PDF... This may take a moment.');

      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = contentRef.current;

      const opt = {
        margin: [10, 0, 10, 0],
        filename: 'Grandes_Ligas_Website_Proposal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
          onclone: (clonedDoc: Document) => {
            // Rewrite all <style> elements, replacing oklch() with rgb()
            clonedDoc.querySelectorAll('style').forEach((styleEl) => {
              if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
                styleEl.textContent = replaceOklchInCSS(styleEl.textContent);
              }
            });

            // Also handle inline styles on all elements
            clonedDoc.querySelectorAll('[style]').forEach((el) => {
              const htmlEl = el as HTMLElement;
              const inlineStyle = htmlEl.getAttribute('style');
              if (inlineStyle && inlineStyle.includes('oklch')) {
                htmlEl.setAttribute('style', replaceOklchInCSS(inlineStyle));
              }
            });

            // Disable animations
            const resetStyle = clonedDoc.createElement('style');
            resetStyle.textContent = '* { transition: none !important; animation: none !important; }';
            clonedDoc.head.appendChild(resetStyle);
          },
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
        }
      };

      await html2pdf().set(opt).from(element).save();

      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Check the browser console for details.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main ref={contentRef}>
          <div className="page-break-after">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
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
      <Toaster />
    </>
  );
}