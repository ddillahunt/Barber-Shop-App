import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock } from "lucide-react";

const schedule = [
  { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "Closed" }
];

export function Schedule() {
  return (
    <section id="schedule" className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">Business Hours</h2>
          <p className="text-amber-200 text-lg">We're here when you need us</p>
        </div>
        <Card className="max-w-2xl mx-auto border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-900">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-6">
            <CardHeader className="p-0">
              <div className="flex items-center gap-3 text-black">
                <Clock className="size-10" />
                <CardTitle className="text-black text-2xl font-bold">Our Schedule</CardTitle>
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-8 bg-gradient-to-br from-slate-900 to-black">
            <div className="space-y-6">
              {schedule.map((item) => (
                <div key={item.day} className="flex justify-between items-center py-4 border-b last:border-b-0 border-amber-500/30">
                  <span className="font-semibold text-lg text-amber-400">{item.day}</span>
                  <span className="text-amber-200 text-lg font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}