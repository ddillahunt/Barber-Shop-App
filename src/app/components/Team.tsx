import { Card, CardContent } from "./ui/card";
import { Scissors, Sparkles, Waves, User, Star, Award } from "lucide-react";
import barberCarlos from "../../assets/images/barber-carlos.jpg";
import barberMiguel from "../../assets/images/barber-miguel.jpg";
import barberJuan from "../../assets/images/barber-juan.jpg";
import barberDiego from "../../assets/images/barber-diego.jpg";

const barbers = [
  {
    id: "1",
    name: "Carlos Martinez",
    role: "Owner & Master Barber",
    specialty: "Classic Cuts",
    experience: "15+ years",
    bio: "Carlos founded Grandes Ligas with a vision to bring premium barbering to the community. Trained in traditional techniques passed down through generations, he specializes in classic fades, tapers, and razor work.",
    icon: Scissors,
    image: barberCarlos,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Miguel Rodriguez",
    role: "Senior Stylist",
    specialty: "Modern Styles",
    experience: "10+ years",
    bio: "Miguel brings a creative edge to every cut. Known for his precision with modern styles, textured crops, and design work, he stays on top of the latest trends to keep clients looking fresh.",
    icon: Sparkles,
    image: barberMiguel,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Juan Hernandez",
    role: "Beard Specialist",
    specialty: "Beard Sculpting",
    experience: "8+ years",
    bio: "Juan is the go-to expert for all things facial hair. From full beard sculpting to precise lineup work, he transforms beards into works of art with meticulous attention to detail.",
    icon: Waves,
    image: barberJuan,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Diego Santos",
    role: "All-Around Master",
    specialty: "Full Grooming",
    experience: "12+ years",
    bio: "Diego is a versatile master barber who excels at everything from classic cuts to modern styles and beard work. His calm demeanor and expert hands make every visit a relaxing experience.",
    icon: User,
    image: barberDiego,
    rating: 4.7,
  },
];

export function Team() {
  return (
    <section id="team" className="py-20 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Expert barbers dedicated to making you look and feel your best
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className="border-2 border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={barber.image}
                  alt={barber.name}
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-black text-sm font-bold px-3 py-1 rounded-full">
                    <Star className="size-3.5 fill-current" />
                    {barber.rating}
                  </div>
                  <div className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm text-amber-400 text-sm font-medium px-3 py-1 rounded-full">
                    <Award className="size-3.5" />
                    {barber.experience}
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-amber-400">{barber.name}</h3>
                  <p className="text-amber-200/80 text-sm font-medium">{barber.role}</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1.5 rounded-full">
                  <barber.icon className="size-4" />
                  {barber.specialty}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{barber.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
