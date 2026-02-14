import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, UserCheck, CalendarCheck } from "lucide-react";

const schedule = [
  { day: "Lunes - Viernes", hours: "9:00 AM - 8:00 PM", walkIn: true },
  { day: "Sábado", hours: "9:00 AM - 6:00 PM", walkIn: true },
  { day: "Domingo", hours: "Cerrado", walkIn: false }
];

export function ScheduleEs() {
  return (
    <section id="schedule" className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">Horario de Atención</h2>
          <p className="text-amber-200 text-lg">Estamos aquí cuando nos necesitas</p>
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">
              <UserCheck className="size-4" />
              Se Aceptan Sin Cita
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold">
              <CalendarCheck className="size-4" />
              Se Recomienda Cita Previa
            </div>
          </div>
        </div>
        <Card className="max-w-2xl mx-auto border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-900">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-6">
            <CardHeader className="p-0">
              <div className="flex items-center gap-3 text-black">
                <Clock className="size-10" />
                <CardTitle className="text-black text-2xl font-bold">Nuestro Horario</CardTitle>
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-8 bg-gradient-to-br from-slate-900 to-black">
            <div className="space-y-6">
              {schedule.map((item) => (
                <div key={item.day} className="flex justify-between items-center py-4 border-b last:border-b-0 border-amber-500/30">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg text-amber-400">{item.day}</span>
                    {item.walkIn && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full">
                        <UserCheck className="size-3" />
                        Sin Cita OK
                      </span>
                    )}
                  </div>
                  <span className="text-amber-200 text-lg font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-12">
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/50"
          >
            ¡Reserva Tu Lugar Ahora!
          </button>
        </div>
      </div>
    </section>
  );
}
