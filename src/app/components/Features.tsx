import { Card } from './ui/card';
import {
  Smartphone,
  Calendar,
  Users,
  Image,
  Mail,
  MessageSquare,
  Star,
  Search,
  ShoppingCart,
  BarChart,
  Lock,
  Zap,
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Fully optimized for mobile, tablet, and desktop devices',
    },
    {
      icon: Calendar,
      title: 'Online Booking',
      description: 'Easy-to-use appointment scheduling system',
    },
    {
      icon: Users,
      title: 'Team Profiles',
      description: 'Showcase your barbers with photos and bios',
    },
    {
      icon: Image,
      title: 'Photo Gallery',
      description: 'Display your best work and shop atmosphere',
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Automated appointment confirmations and reminders',
    },
    {
      icon: MessageSquare,
      title: 'Contact Forms',
      description: 'Easy communication channels for customers',
    },
    {
      icon: Star,
      title: 'Reviews & Testimonials',
      description: 'Build trust with customer feedback',
    },
    {
      icon: Search,
      title: 'SEO Optimized',
      description: 'Rank higher in search engine results',
    },
    {
      icon: ShoppingCart,
      title: 'Online Shop',
      description: 'Sell products and gift cards online (Premium)',
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Track website performance and bookings',
    },
    {
      icon: Lock,
      title: 'Secure & Reliable',
      description: 'HTTPS encryption and data protection',
    },
    {
      icon: Zap,
      title: 'Fast Loading',
      description: 'Optimized for speed and performance',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Key Features</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Modern functionality to help your barber shop succeed online
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="p-6 bg-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Icon className="size-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
