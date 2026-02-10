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
    price: "$30",
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
    title: "Premium Cut & Style",
    description: "Complete styling with premium products",
    price: "$45",
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
      "Elevate your grooming experience with our Premium Cut & Style service. This comprehensive package combines expert cutting with advanced styling techniques to create a sophisticated, polished look.",
      "Our barbers use premium products and tools to deliver a transformative experience. From the initial consultation to the final styling touches, every step is designed to exceed your expectations and leave you looking your absolute best."
    ]
  },
  {
    id: "beard-trim-shape",
    icon: Waves,
    title: "Beard Trim & Shape",
    description: "Expert beard grooming and maintenance",
    price: "$25",
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
      "A well-maintained beard is a statement of style and sophistication. Our Beard Trim & Shape service is designed to keep your facial hair looking sharp, clean, and perfectly groomed.",
      "Our skilled barbers understand the art of beard sculpting. We'll work with your natural growth patterns and facial structure to create a shape that enhances your features. Whether you prefer a full beard, goatee, or any style in between, we'll deliver precision results."
    ]
  },
  {
    id: "full-grooming-package",
    icon: User,
    title: "Full Grooming Package",
    description: "Haircut, beard trim, and hot towel treatment",
    price: "$65",
    gradient: "from-yellow-600 to-amber-500",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "60-75 minutes",
    included: [
      "Complete style consultation",
      "Premium haircut with styling",
      "Professional beard trim and shaping",
      "Luxury hot towel treatment",
      "Scalp and facial massage",
      "Premium product application",
      "Complimentary beverage",
      "Grooming recommendations"
    ],
    detailedDescription: [
      "Experience the ultimate in men's grooming with our Full Grooming Package. This comprehensive service combines our best offerings into one complete experience that will leave you looking and feeling like a new man.",
      "This is more than just a haircut and beard trim - it's a full grooming transformation. From the relaxing hot towel treatment to the invigorating scalp massage, every element is designed to provide both style and relaxation. Perfect for special occasions or when you simply want to treat yourself to the best."
    ]
  }
];
