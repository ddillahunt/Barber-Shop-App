import { Card } from './ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactProps {
  selectedTier: string | null;
}

export function Contact({ selectedTier }: ContactProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Get Started</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Ready to build your barber shop's online presence? Let's discuss your project.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Mail className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p className="text-slate-600">Darrell.Dillahunt@gdidigitalsolutions.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Phone className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p className="text-slate-600">774-279-4008</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <MapPin className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Location</p>
                <p className="text-slate-600">Available for remote and in-person consultations</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Availability</p>
                <p className="text-slate-600">Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Next Steps</h3>
          {selectedTier && (
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 mb-6">
              <p className="text-amber-400 font-semibold">
                Selected: {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Package
              </p>
            </div>
          )}
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold">Initial Consultation</p>
                <p className="text-slate-300 text-sm">Free 30-minute call to discuss your needs</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold">Detailed Proposal</p>
                <p className="text-slate-300 text-sm">Custom scope, timeline, and final pricing</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold">Design & Development</p>
                <p className="text-slate-300 text-sm">Build your website with regular progress updates</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-amber-500 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold">Launch & Support</p>
                <p className="text-slate-300 text-sm">Go live with ongoing maintenance and support</p>
              </div>
            </li>
          </ol>
        </Card>
      </div>
    </section>
  );
}
