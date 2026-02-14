import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, Star } from 'lucide-react';

interface PricingTiersProps {
  selectedTier: string | null;
  onSelectTier: (tier: string) => void;
}

export function PricingTiers({ selectedTier, onSelectTier }: PricingTiersProps) {
  const tiers = [
    {
      id: 'basic',
      name: 'Website Development',
      price: '$1,000',
      popular: false,
      description: 'Includes full design, build, and launch',
      features: [
        'Responsive design (mobile, tablet, desktop)',
        'Home page with business info',
        'Services page with pricing',
        'About page with team profiles',
        'Contact page with location map',
        'Basic photo gallery (20-30 images)',
        'Contact form with email notifications',
        'Social media integration',
        'Basic SEO optimization',
        'Google Analytics setup',
        '3 rounds of revisions',
        '30 days post-launch support',
      ],
      timeline: '4-5 weeks',
    },
    {
      id: 'hosting',
      name: 'Hosting & Security',
      price: '$50/month',
      popular: false,
      description: 'Reliable hosting with security included',
      features: [
        'Fast, reliable web hosting',
        'SSL certificate (HTTPS)',
        'Daily backups',
        'Security monitoring',
        'Uptime monitoring',
        'Software updates',
      ],
      timeline: 'Ongoing',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing Options</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Choose the package that best fits your business needs and budget
        </p>
      </div>

      {tiers.map((tier) => (
        <div key={tier.id}>
          <Card
            className={`relative p-8 bg-white transition-all duration-300 mb-8 ${
              selectedTier === tier.id
                ? 'ring-4 ring-amber-500 shadow-2xl scale-105'
                : 'shadow-lg hover:shadow-xl'
            } ${tier.popular ? 'border-4 border-amber-500' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-amber-500 text-white px-6 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Star className="size-4 fill-white" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <p className="text-slate-600 text-sm mb-4">{tier.description}</p>
              <div className="text-4xl font-bold text-amber-600 mb-2">{tier.price}</div>
              <p className="text-sm text-slate-500">Timeline: {tier.timeline}</p>
            </div>

            <Button
              onClick={() => onSelectTier(tier.id)}
              className={`w-full mb-6 ${
                selectedTier === tier.id
                  ? 'bg-green-600 hover:bg-green-700'
                  : tier.popular
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {selectedTier === tier.id ? 'Selected ✓' : 'Select Package'}
            </Button>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ))}

      <Card className="mt-12 p-8 bg-blue-50 border-2 border-blue-200 page-break-before">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Additional Services (Optional Add-ons)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Maintenance & Support</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Monthly maintenance: $150-300/month</li>
              <li>• Content updates: $50-100/hour</li>
              <li>• Priority support plan: $500-1,000/year</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Marketing & Content</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Grandes Ligas photography: $500-1,500</li>
              <li>• Copywriting services: $300-800</li>
              <li>• Social media setup: $400-800</li>
              <li>• Google Ads campaign setup: $800-1,500</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}