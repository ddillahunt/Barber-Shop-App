import { Card, CardContent } from "./ui/card";
import { Phone, User } from "lucide-react";
import joelImg from "../../assets/images/barber-joel.png";

const barbers = [
  { id: "1", name: "Yorki", phone: "(774) 244-2984" },
  { id: "2", name: "Maestro", phone: "(774) 204-1098" },
  { id: "3", name: "El Menor", phone: "(774) 219-1098" },
  { id: "4", name: "Yefri", phone: "(774) 303-8891" },
  { id: "5", name: "Montro", phone: "(508) 371-5827" },
  { id: "6", name: "Jairo", phone: "(347) 374-9866" },
  { id: "7", name: "Jose", phone: "(774) 279-2882" },
  { id: "8", name: "Joel", phone: "(774) 522-9135", image: joelImg },
];

export function Team() {
  return (
    <section id="team" className="py-20 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold text-black">
            Meet Our Team
          </h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Expert barbers dedicated to making you look and feel your best
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] border-2 border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                {barber.image ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-amber-500/30 border-2 border-amber-500/30">
                    <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <User className="size-10 text-black" />
                  </div>
                )}
                <div>
                  <h3 style={{ color: "#fbbf24", fontSize: "1.25rem", fontWeight: 700 }}>{barber.name}</h3>
                </div>
                <a
                  href={`tel:${barber.phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-4 py-2 rounded-full hover:bg-amber-500/20 transition-colors"
                >
                  <Phone className="size-4" />
                  {barber.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
