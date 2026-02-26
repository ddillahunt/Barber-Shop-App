import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Phone, MessageSquare, Mail, User } from "lucide-react";
import { subscribeToBarbers, type Barber } from "../../lib/appointments";
import yefriImg from "../../../assets/images/barber-yefri.jpg";
import joseImg from "../../../assets/images/barber-Jose.jpg";
import maestroImg from "../../../assets/images/barber-Maestro.png";

const barberImages: Record<string, string> = {
  "Yefri": yefriImg,
  "Jose": joseImg,
  "Maestro": maestroImg,
};

export function TeamEs() {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    const unsub = subscribeToBarbers(setBarbers);
    return () => unsub();
  }, []);

  return (
    <section id="team" className="py-20 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold text-black">
            Conoce a Nuestro Equipo
          </h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Barberos expertos dedicados a que te veas y te sientas mejor
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] border-2 border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                {(barber.imageUrl || barberImages[barber.name]) ? (
                  <img
                    src={barber.imageUrl || barberImages[barber.name]}
                    alt={barber.name}
                    className="w-20 h-20 rounded-full object-cover shadow-lg shadow-amber-500/30 border-2 border-amber-500/50"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <User className="size-10 text-black" />
                  </div>
                )}
                <div>
                  <h3 style={{ color: "#fbbf24", fontSize: "1.25rem", fontWeight: 700 }}>{barber.name}</h3>
                </div>
                <p className="text-amber-400 text-sm font-medium">{barber.phone}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <a
                    href={`tel:${barber.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                  >
                    <Phone className="size-4" />
                    Llamar
                  </a>
                  <a
                    href={`sms:${barber.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                  >
                    <MessageSquare className="size-4" />
                    Texto
                  </a>
                  {barber.email && (
                    <a
                      href={`mailto:${barber.email}`}
                      className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                    >
                      <Mail className="size-4" />
                      Correo
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
