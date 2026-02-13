import { Card } from './ui/card';
import { Calendar, Code, TestTube, Rocket, Wrench } from 'lucide-react';

export function Timeline() {
  const phases = [
    {
      icon: Calendar,
      phase: 'Phase 1: Discovery & Planning',
      duration: '1 week',
      activities: [
        'Initial consultation and requirements gathering',
        'Content and image collection',
        'Sitemap and wireframe creation',
        'Design mockup approval',
      ],
    },
    {
      icon: Code,
      phase: 'Phase 2: Design & Development',
      duration: '2-4 weeks',
      activities: [
        'UI/UX design implementation',
        'Frontend development (HTML, CSS, JavaScript)',
        'Backend development (booking system, database)',
        'Integration of third-party services',
      ],
    },
    {
      icon: TestTube,
      phase: 'Phase 3: Testing & Refinement',
      duration: '1-2 weeks',
      activities: [
        'Cross-browser testing',
        'Mobile responsiveness testing',
        'Performance optimization',
        'Client review and feedback incorporation',
      ],
    },
    {
      icon: Rocket,
      phase: 'Phase 4: Launch',
      duration: '3-5 days',
      activities: [
        'Final client approval',
        'Domain and hosting setup',
        'Website deployment',
        'SEO and analytics configuration',
      ],
    },
    {
      icon: Wrench,
      phase: 'Phase 5: Post-Launch Support',
      duration: '30-90 days',
      activities: [
        'Bug fixes and adjustments',
        'Training for admin dashboard',
        'Performance monitoring',
        'Content updates assistance',
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Development Timeline</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          A structured approach to deliver your website on time
        </p>
      </div>

      <div className="space-y-6">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <Card
              key={index}
              className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-amber-100 p-4 rounded-full">
                    <Icon className="size-8 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{phase.phase}</h3>
                    <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold">
                      {phase.duration}
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {phase.activities.map((activity, activityIndex) => (
                      <li
                        key={activityIndex}
                        className="flex items-start gap-2 text-slate-700"
                      >
                        <div className="bg-green-100 rounded-full p-1 mt-1">
                          <div className="size-2 bg-green-600 rounded-full" />
                        </div>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-12 p-8 bg-amber-50 border-2 border-amber-200">
        <div className="flex items-start gap-4">
          <Calendar className="size-8 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Timeline Notes</h3>
            <p className="text-slate-700 mb-4">
              The timeline may vary depending on the selected package, complexity of requirements, 
              and timely provision of content and feedback from the client. We maintain regular 
              communication throughout the process and provide weekly progress updates.
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Estimated Total Duration:</span> 4-12 weeks depending on package selection
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
