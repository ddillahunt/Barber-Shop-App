import { Navigation } from "../components/Navigation";
import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Shield className="size-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium italic">Your Privacy Matters</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            How we collect, use, and protect your information
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-3xl">

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Information We Collect
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you book an appointment or contact us through our website, we may collect the following information:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
              <li>Your name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Appointment preferences (barber, date, time, service)</li>
              <li>Any messages you send through our contact form</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              How We Use Your Information
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use your personal information solely for the purpose of:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
              <li>Scheduling and managing your appointments</li>
              <li>Sending appointment confirmations and reminders</li>
              <li>Responding to your inquiries and messages</li>
              <li>Improving our services and customer experience</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Data Protection
            </h2>
            <p className="text-slate-700 leading-relaxed">
              We take reasonable measures to protect your personal information from unauthorized access,
              alteration, or destruction. Your data is stored securely and is only accessed by authorized
              staff for the purposes described above.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Third-Party Sharing
            </h2>
            <p className="text-slate-700 leading-relaxed">
              We do not sell, trade, or share your personal information with third parties. Your information
              is used exclusively by Grandes Ligas Barber Shop for the purposes outlined in this policy.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Your Rights
            </h2>
            <p className="text-slate-700 leading-relaxed">
              You have the right to request access to, correction of, or deletion of your personal data at
              any time. To make such a request, please contact us directly at the shop or through our website.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Changes to This Policy
            </h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be reflected on this page
              with the updated date below.
            </p>
          </div>

          <p className="text-slate-500 text-sm italic">Last updated: February 2026</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="size-6 text-amber-400" />
            <span className="font-bold italic text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Quick Links</h3>
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/" className="text-slate-300 hover:text-amber-400 transition-colors">Home</Link>
            <Link to="/#services" className="text-slate-300 hover:text-amber-400 transition-colors">Services</Link>
            <Link to="/#team" className="text-slate-300 hover:text-amber-400 transition-colors">Team</Link>
            <Link to="/#schedule" className="text-slate-300 hover:text-amber-400 transition-colors">Schedule</Link>
            <Link to="/#booking" className="text-slate-300 hover:text-amber-400 transition-colors">Book Now</Link>
            <Link to="/#contact" className="text-slate-300 hover:text-amber-400 transition-colors">Contact</Link>
            <Link to="/about" className="text-slate-300 hover:text-amber-400 transition-colors">About</Link>
          </nav>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barber Shop. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-3">Powered by GDI Digital Solutions</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
