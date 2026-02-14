import { Card } from './ui/card';
import { FileCheck, DollarSign, Clock, AlertCircle } from 'lucide-react';

export function Terms() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Terms & Conditions</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Clear and transparent terms for our working relationship
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white shadow-lg flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <DollarSign className="size-7 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Payment Terms</h3>
          <ul className="space-y-2 text-slate-700 text-sm list-disc list-inside text-left">
            <li><span className="font-semibold">40%</span> upfront deposit to begin project</li>
            <li><span className="font-semibold">30%</span> upon design approval & development milestone</li>
            <li><span className="font-semibold">30%</span> upon project completion and launch</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            Bank transfer, credit card, PayPal
          </p>
        </Card>

        <Card className="p-6 bg-white shadow-lg flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Clock className="size-7 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Project Timeline</h3>
          <ul className="space-y-2 text-slate-700 text-sm list-disc list-inside text-left">
            <li>Timeline begins after deposit & content provided</li>
            <li>Delays in content may extend timeline</li>
            <li>Includes specified revision rounds</li>
            <li>Extra revisions at $75-125/hr</li>
            <li>Rush delivery +25% fee</li>
          </ul>
        </Card>

        <Card className="p-6 bg-white shadow-lg flex flex-col items-center text-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <FileCheck className="size-7 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Deliverables</h3>
          <ul className="space-y-2 text-slate-700 text-sm list-disc list-inside text-left">
            <li>Fully functional website per package</li>
            <li>Source code (client owned)</li>
            <li>Documentation & training</li>
            <li>Post-launch support included</li>
            <li>All assets and design files</li>
          </ul>
        </Card>

        <Card className="p-6 bg-white shadow-lg flex flex-col items-center text-center">
          <div className="bg-amber-100 p-4 rounded-full mb-4">
            <AlertCircle className="size-7 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-slate-700 text-sm list-disc list-inside text-left">
            <li>Client provides content, images & branding</li>
            <li>Client handles domain & hosting costs</li>
            <li>Scope changes may incur charges</li>
            <li>Content must comply with laws</li>
            <li>Third-party fees not included</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-[3in] p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">What's Included in All Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Before Launch</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• Project planning & consultation</li>
              <li>• Design mockups</li>
              <li>• Quality assurance testing</li>
              <li>• Content integration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-2">At Launch</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• Website deployment</li>
              <li>• SEO configuration</li>
              <li>• Analytics setup</li>
              <li>• Training session</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-2">After Launch</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• Bug fixes (during support period)</li>
              <li>• Documentation</li>
              <li>• Email support</li>
              <li>• Performance monitoring</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6 bg-red-50 border-2 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Additional Costs Not Included</h3>
            <p className="text-sm text-slate-700">
              The following costs are separate and not included in the pricing: domain registration 
              ($10-20/year), web hosting ($10-100/month depending on provider), SSL certificate (may be 
              included with hosting), Grandes Ligas photography (if required), premium stock images, 
              third-party service fees (payment processing, SMS notifications, etc.), and ongoing 
              maintenance after the support period ends.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}