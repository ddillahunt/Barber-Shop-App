import { Card } from './ui/card';
import { Target, Users, Calendar, DollarSign } from 'lucide-react';

export function ProjectOverview() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Project Overview</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Based on our analysis of similar barber shop websites, here's what we propose to build
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="p-8 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Project Objectives</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Target className="size-5 text-amber-500 mt-1 flex-shrink-0" />
              <span className="text-slate-700">Create a modern, Grandes Ligas online presence for the barber shop</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="size-5 text-amber-500 mt-1 flex-shrink-0" />
              <span className="text-slate-700">Provide easy-to-use online booking system for customers</span>
            </li>
            <li className="flex items-start gap-3">
              <Calendar className="size-5 text-amber-500 mt-1 flex-shrink-0" />
              <span className="text-slate-700">Showcase services, pricing, and barber profiles</span>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign className="size-5 text-amber-500 mt-1 flex-shrink-0" />
              <span className="text-slate-700">Increase customer engagement and revenue through digital presence</span>
            </li>
          </ul>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Key Deliverables</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1 mt-1">
                <div className="size-2 bg-white rounded-full" />
              </div>
              <span>Fully responsive website (mobile, tablet, desktop)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1 mt-1">
                <div className="size-2 bg-white rounded-full" />
              </div>
              <span>Online booking and appointment management system</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1 mt-1">
                <div className="size-2 bg-white rounded-full" />
              </div>
              <span>Service catalog with pricing information</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1 mt-1">
                <div className="size-2 bg-white rounded-full" />
              </div>
              <span>Photo gallery showcasing work and atmosphere</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1 mt-1">
                <div className="size-2 bg-white rounded-full" />
              </div>
              <span>Contact information and location map</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-1 mt-1">
                <div className="size-2 bg-white rounded-full" />
              </div>
              <span>Admin dashboard for managing bookings</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-8 bg-slate-50 border-2 border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">About the Reference Website</h3>
        <p className="text-slate-700 leading-relaxed">
          The reference website (<span className="font-mono text-sm bg-white px-2 py-1 rounded">https://ddillahunt.github.io/Barber-Shop-App/</span>) 
          appears to be a barber shop application. Our proposal includes building a similar Grandes Ligas website with enhanced features, 
          modern design, better user experience, and additional functionality based on current industry standards. We'll incorporate 
          best practices for performance, SEO, and accessibility while ensuring the site is easy to maintain and update.
        </p>
      </Card>
    </section>
  );
}