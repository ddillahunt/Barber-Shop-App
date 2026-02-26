import { Scissors, Sparkles, Waves, User, LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  gradient: string;
  bgGradient: string;
  duration: string;
  included: string[];
  detailedDescription: string[];
}

export const services: Service[] = [
  {
    id: "classic-haircut",
    icon: Scissors,
    title: "Classic Haircut",
    description: "Traditional cuts with precision and style",
    price: "$40",
    gradient: "from-amber-500 to-yellow-600",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "30-45 minutes",
    included: [
      "Personal consultation with your barber",
      "Professional shampoo and conditioning",
      "Precision scissor and/or clipper cutting",
      "Detailed edge work and line-up",
      "Premium styling products",
      "Complimentary beverage during service"
    ],
    detailedDescription: [
      "Our Classic Haircut is the foundation of traditional barbering excellence. Whether you're looking for a timeless business cut, a clean fade, or a stylish taper, our expert barbers will craft a look that suits your personality and lifestyle.",
      "Each haircut includes a detailed consultation to understand your preferences, followed by precision cutting techniques passed down through generations of master barbers. We finish with careful detailing and styling to ensure you leave looking sharp and feeling confident."
    ]
  },
  {
    id: "premium-cut-style",
    icon: Sparkles,
    title: "Haircut & Shave",
    description: "Complete styling with premium products",
    price: "$50",
    gradient: "from-yellow-500 to-amber-600",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "45-60 minutes",
    included: [
      "In-depth style consultation",
      "Luxury shampoo and deep conditioning treatment",
      "Expert precision cutting",
      "Professional blow-dry and styling",
      "High-end styling products application",
      "Scalp massage",
      "Hot towel treatment"
    ],
    detailedDescription: [
      "Elevate your grooming experience with our Haircut & Shave service. This comprehensive package combines expert cutting with a professional shave to create a sophisticated, polished look.",
      "Our barbers use premium products and tools to deliver a transformative experience. From the initial consultation to the final styling touches, every step is designed to exceed your expectations and leave you looking your absolute best."
    ]
  },
  {
    id: "beard-trim-shape",
    icon: Waves,
    title: "Beard Trim & Lineup",
    description: "Expert beard grooming and maintenance",
    price: "$30",
    gradient: "from-amber-600 to-yellow-500",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "20-30 minutes",
    included: [
      "Beard consultation and design",
      "Precise trimming and shaping",
      "Edge definition and cleanup",
      "Beard oil or balm application",
      "Styling and grooming tips",
      "Hot towel finish"
    ],
    detailedDescription: [
      "A well-maintained beard is a statement of style and sophistication. Our Beard Trim & Lineup service is designed to keep your facial hair looking sharp, clean, and perfectly groomed.",
      "Our skilled barbers understand the art of beard sculpting. We'll work with your natural growth patterns and facial structure to create a shape that enhances your features. Whether you prefer a full beard, goatee, or any style in between, we'll deliver precision results."
    ]
  },
  {
    id: "full-grooming-package",
    icon: User,
    title: "Children's Haircut (11 & Under)",
    description: "Quality haircuts for kids 11 and under",
    price: "$35",
    gradient: "from-yellow-600 to-amber-500",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "20-30 minutes",
    included: [
      "Consultation with barber",
      "Professional haircut tailored for kids",
      "Gentle shampoo",
      "Styling and finishing touches",
      "Fun and comfortable experience"
    ],
    detailedDescription: [
      "Our Children's Haircut service is designed to make your child's barbershop visit fun and comfortable. Our experienced barbers are great with kids and know how to keep them relaxed while delivering a sharp, stylish cut.",
      "Whether it's a first haircut or a regular trim, we take the time to make sure every child leaves looking great and feeling confident. For kids 11 and under."
    ]
  }
];
