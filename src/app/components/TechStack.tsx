import { Card } from './ui/card';
import { Code2, Database, Palette, Server, Shield, Smartphone } from 'lucide-react';

export function TechStack() {
  const technologies = [
    {
      icon: Code2,
      category: 'Frontend',
      items: [
        'React.js for dynamic user interfaces',
        'Tailwind CSS for modern styling',
        'TypeScript for type safety',
        'Next.js for server-side rendering (optional)',
      ],
    },
    {
      icon: Server,
      category: 'Backend',
      items: [
        'Node.js with Express.js',
        'RESTful API architecture',
        'Authentication & authorization',
        'Email/SMS notification services',
      ],
    },
    {
      icon: Database,
      category: 'Database',
      items: [
        'PostgreSQL or MySQL for data storage',
        'Redis for caching (optional)',
        'Database backup automation',
        'Secure data encryption',
      ],
    },
    {
      icon: Palette,
      category: 'Design',
      items: [
        'Modern UI/UX principles',
        'Custom branding and colors',
        'Figma for design mockups',
        'Accessible design (WCAG compliant)',
      ],
    },
    {
      icon: Shield,
      category: 'Security',
      items: [
        'HTTPS/SSL certificates',
        'GDPR compliance',
        'Secure payment processing',
        'Regular security updates',
      ],
    },
    {
      icon: Smartphone,
      category: 'Deployment',
      items: [
        'Cloud hosting (AWS, Vercel, or similar)',
        'CDN for fast content delivery',
        'Automated backups',
        'Continuous deployment pipeline',
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Technology Stack</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          We use modern, reliable technologies to build your website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {technologies.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <Card
              key={index}
              className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{tech.category}</h3>
              </div>
              <ul className="space-y-2">
                {tech.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-slate-700">
                    <div className="bg-green-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <div className="size-2 bg-green-600 rounded-full" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Why These Technologies?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
          <div>
            <h4 className="font-semibold mb-2">Performance & Scalability</h4>
            <p className="text-sm">
              Our tech stack ensures fast load times and can handle growing traffic as your business expands.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Maintainability</h4>
            <p className="text-sm">
              Using industry-standard technologies makes it easy to maintain and update your website in the future.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Security</h4>
            <p className="text-sm">
              We prioritize security with encryption, regular updates, and best practices to protect your data.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Future-Proof</h4>
            <p className="text-sm">
              Modern frameworks ensure your website stays relevant and compatible with new technologies.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
