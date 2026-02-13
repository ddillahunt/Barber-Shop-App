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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="size-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Payment Terms</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-fit">• 40%</span>
                  <span>upfront deposit to begin project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-fit">• 30%</span>
                  <span>upon design approval and development milestone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-fit">• 30%</span>
                  <span>upon project completion and launch</span>
                </li>
              </ul>
              <p className="text-sm text-slate-600 mt-4">
                Accepted payment methods: Bank transfer, credit card, PayPal
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="size-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Project Timeline</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Timeline begins after deposit is received and all content is provided</li>
                <li>• Delays in content provision may extend the timeline</li>
                <li>• Each package includes specified revision rounds</li>
                <li>• Additional revisions billed at hourly rate ($75-125/hour)</li>
                <li>• Rush delivery available with 25% premium fee</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileCheck className="size-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Deliverables</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Fully functional website as per selected package</li>
                <li>• Source code (client owns the code)</li>
                <li>• Documentation and training materials</li>
                <li>• Post-launch support as specified in package</li>
                <li>• All purchased assets and design files</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <AlertCircle className="size-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Important Notes</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Client must provide all content, images, and branding materials</li>
                <li>• Client responsible for domain registration and hosting costs</li>
                <li>• Scope changes may incur additional charges</li>
                <li>• Website content must comply with all applicable laws</li>
                <li>• Third-party service fees (hosting, SMS, etc.) not included</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
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

      <Card className="mt-8 p-6 bg-red-50 border-2 border-red-200">
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