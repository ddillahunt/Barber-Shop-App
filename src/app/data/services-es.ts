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

export const servicesEs: Service[] = [
  {
    id: "classic-haircut",
    icon: Scissors,
    title: "Corte Clásico",
    description: "Cortes tradicionales con precisión y estilo",
    price: "$40",
    gradient: "from-red-700 to-red-600",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "30-45 minutos",
    included: [
      "Consulta personal con tu barbero",
      "Champú y acondicionador profesional",
      "Corte de precisión con tijeras y/o máquina",
      "Trabajo detallado de bordes y líneas",
      "Productos de peinado premium",
      "Bebida de cortesía durante el servicio"
    ],
    detailedDescription: [
      "Nuestro Corte Clásico es la base de la excelencia en barbería tradicional. Ya sea que busques un corte de negocios atemporal, un degradado limpio o un desvanecido elegante, nuestros barberos expertos crearán un look que se adapte a tu personalidad y estilo de vida.",
      "Cada corte incluye una consulta detallada para comprender tus preferencias, seguida de técnicas de corte de precisión transmitidas a través de generaciones de maestros barberos. Terminamos con un detallado cuidadoso y peinado para asegurarnos de que salgas luciendo elegante y sintiéndote seguro."
    ]
  },
  {
    id: "premium-cut-style",
    icon: Sparkles,
    title: "Corte y Afeitado",
    description: "Peinado completo con productos premium",
    price: "$50",
    gradient: "from-red-600 to-red-700",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "45-60 minutos",
    included: [
      "Consulta de estilo en profundidad",
      "Champú de lujo y tratamiento de acondicionamiento profundo",
      "Corte de precisión experto",
      "Secado y peinado profesional",
      "Aplicación de productos de peinado de alta gama",
      "Masaje de cuero cabelludo",
      "Tratamiento con toalla caliente"
    ],
    detailedDescription: [
      "Eleva tu experiencia de cuidado personal con nuestro servicio de Corte y Estilo Premium. Este paquete integral combina corte experto con técnicas avanzadas de peinado para crear un look sofisticado y pulido.",
      "Nuestros barberos utilizan productos y herramientas premium para ofrecer una experiencia transformadora. Desde la consulta inicial hasta los toques finales de peinado, cada paso está diseñado para superar tus expectativas y dejarte luciendo lo mejor posible."
    ]
  },
  {
    id: "beard-trim-shape",
    icon: Waves,
    title: "Recorte de Barba y Alineado",
    description: "Cuidado y mantenimiento experto de la barba",
    price: "$30",
    gradient: "from-red-700 to-red-600",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "20-30 minutos",
    included: [
      "Consulta y diseño de barba",
      "Recorte y moldeado preciso",
      "Definición de bordes y limpieza",
      "Aplicación de aceite o bálsamo para barba",
      "Consejos de peinado y cuidado",
      "Acabado con toalla caliente"
    ],
    detailedDescription: [
      "Una barba bien cuidada es una declaración de estilo y sofisticación. Nuestro servicio de Recorte y Diseño de Barba está diseñado para mantener tu vello facial luciendo afilado, limpio y perfectamente arreglado.",
      "Nuestros barberos hábiles entienden el arte de esculpir la barba. Trabajaremos con tus patrones de crecimiento natural y estructura facial para crear una forma que realce tus características. Ya sea que prefieras una barba completa, perilla o cualquier estilo intermedio, entregaremos resultados de precisión."
    ]
  },
  {
    id: "full-grooming-package",
    icon: User,
    title: "Corte de Niños (11 Años y Menores)",
    description: "Cortes de calidad para niños de 11 años y menores",
    price: "$35",
    gradient: "from-red-700 to-red-600",
    bgGradient: "from-slate-900 to-slate-800",
    duration: "20-30 minutos",
    included: [
      "Consulta con el barbero",
      "Corte profesional adaptado para niños",
      "Champú suave",
      "Peinado y toques finales",
      "Experiencia divertida y cómoda"
    ],
    detailedDescription: [
      "Nuestro servicio de Corte de Niños está diseñado para que la visita de tu hijo a la barbería sea divertida y cómoda. Nuestros barberos experimentados son excelentes con los niños y saben cómo mantenerlos relajados mientras les dan un corte elegante y limpio.",
      "Ya sea su primer corte o un recorte regular, nos tomamos el tiempo para asegurarnos de que cada niño salga luciendo genial y sintiéndose seguro. Para niños de 11 años y menores."
    ]
  }
];
