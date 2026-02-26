import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, UserCheck, CalendarCheck } from "lucide-react";

const schedule = [
  { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM", walkIn: true },
  { day: "Saturday", hours: "9:00 AM - 6:00 PM", walkIn: true },
  { day: "Sunday", hours: "Closed", walkIn: false }
];

export function Schedule() {
  return (
    <section id="schedule" className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent">Business Hours</h2>
          <p className="text-sky-200 text-lg">We're here when you need us</p>
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">
              <UserCheck className="size-4" />
              Walk-ins Welcome
            </div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 rounded-full text-sm font-semibold">
              <CalendarCheck className="size-4" />
              Appointments Recommended
            </div>
          </div>
        </div>
        <Card className="max-w-2xl mx-auto border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden bg-slate-900">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 p-6">
            <CardHeader className="p-0">
              <div className="flex items-center gap-3 text-white">
                <Clock className="size-10" />
                <CardTitle className="text-white text-2xl font-bold">Our Schedule</CardTitle>
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-0 bg-gradient-to-br from-slate-900 to-black">
            <div className="grid grid-cols-3 px-8 py-4" style={{ backgroundColor: "rgba(43, 108, 176, 0.2)", borderBottom: "2px solid rgba(43, 108, 176, 0.5)" }}>
              <span style={{ color: "#7CB9E8", fontSize: "1.25rem", fontWeight: 700 }}>Day</span>
              <span style={{ color: "#7CB9E8", fontSize: "1.25rem", fontWeight: 700, textAlign: "center" }}>Status</span>
              <span style={{ color: "#7CB9E8", fontSize: "1.25rem", fontWeight: 700, textAlign: "right" }}>Hours</span>
            </div>
            <div className="px-8 py-4">
              {schedule.map((item) => (
                <div key={item.day} className="grid grid-cols-3 items-center py-4 border-b last:border-b-0 border-blue-500/30">
                  <span className="font-semibold text-lg text-sky-300">{item.day}</span>
                  <div className="text-center">
                    {item.walkIn && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full">
                        <UserCheck className="size-3" />
                        Walk-ins OK
                      </span>
                    )}
                  </div>
                  <span className="text-sky-200 text-lg font-medium text-right">{item.hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-12">
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView()}
            className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/50"
          >
            Reserve Your Spot Now
          </button>
        </div>
      </div>
    </section>
  );
}
