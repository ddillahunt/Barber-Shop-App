import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar, UserCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { saveAppointment, subscribeToBookedTimes, isTimeSlotAvailable } from "../lib/appointments";

const barbers = [
  { id: "1", name: "Yorki", phone: "(774) 244-2984" },
  { id: "2", name: "Maestro", phone: "(774) 204-1098" },
  { id: "3", name: "El Menor", phone: "(774) 219-1098" },
  { id: "4", name: "Yefri", phone: "(774) 303-8891" },
  { id: "5", name: "Joel", phone: "(774) 522-9135" },
  { id: "6", name: "Montro", phone: "(508) 371-5827" },
  { id: "7", name: "Jairo", phone: "(347) 374-9866" },
  { id: "8", name: "Jose", phone: "(774) 279-2881" },
  { id: "9", name: "Darrell Dillahunt", phone: "(774) 279-4008" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM"
];

const services = [
  "Classic Haircut",
  "Premium Cut & Style",
  "Beard Trim & Shape",
  "Full Grooming Package"
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function AppointmentBooking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    barber: "",
    service: "",
    date: "",
    time: "",
    notes: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  useEffect(() => {
    if (formData.date) {
      const selectedBarber = barbers.find(b => b.id === formData.barber);
      const barberLabel = selectedBarber ? `${selectedBarber.name} - ${selectedBarber.phone}` : undefined;
      const unsubscribe = subscribeToBookedTimes(formData.date, barberLabel, setBookedTimes);
      return () => unsubscribe();
    } else {
      setBookedTimes([]);
    }
  }, [formData.date, formData.barber]);

  const availableTimeSlots = timeSlots.filter((t) => !bookedTimes.includes(t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      toast.error("Please fill in name, phone number, date, and time");
      return;
    }

    setSubmitting(true);

    const selectedBarber = barbers.find(b => b.id === formData.barber);
    const barberLabel = selectedBarber ? `${selectedBarber.name} - ${selectedBarber.phone}` : formData.barber;

    // Check for double booking
    if (selectedBarber) {
      try {
        const available = await isTimeSlotAvailable(formData.date, formData.time, barberLabel);
        if (!available) {
          toast.error("This time slot is already booked for this barber. Please choose another time.");
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("Availability check failed:", err);
      }
    }

    try {
      const barberField = selectedBarber ? `${selectedBarber.name} - ${selectedBarber.phone}` : formData.barber;

      // Save to Firestore FIRST to block the time slot
      await saveAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        barber: barberField,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        source: "en",
      });

      // Send notification to shop
      try {
        await emailjs.send(
          "service_grandesligas",
          "template_s4xq8bl",
          {
            to_email: "ddillahunt59@gmail.com",
            from_name: formData.name,
            from_email: formData.email,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            barber: barberField,
            service: formData.service,
            date: formData.date,
            time: formData.time,
            notes: formData.notes,
          },
          "byZkVrNvtLJutxIt5"
        );
      } catch (emailError) {
        console.error("Shop email failed:", emailError);
      }

      // Send confirmation to customer (only if email provided)
      if (formData.email) {
        try {
          await emailjs.send(
            "service_grandesligas",
            "template_yqpkz9e",
            {
              to_email: formData.email,
              to_name: formData.name,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              barber: barberField,
              service: formData.service,
              date: formData.date,
              time: formData.time,
              notes: formData.notes,
            },
            "byZkVrNvtLJutxIt5"
          );
        } catch (emailError) {
          console.error("Customer email failed:", emailError);
        }
      }

      toast.success("Appointment booked successfully! We'll send you a confirmation email.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        barber: "",
        service: "",
        date: "",
        time: "",
        notes: ""
      });
    } catch (error) {
      toast.error("Failed to send. Please call us at (508) 872-5556 to book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold text-black">Book an Appointment</h2>
          <p className="text-slate-700 text-lg">Reserve your spot with our expert barbers</p>
          <p className="mt-3 inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <UserCheck className="size-4" />
            Walk-ins also welcome — no appointment needed!
          </p>
        </div>
        <Card className="max-w-4xl mx-auto border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 bg-slate-900">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-8">
            <CardHeader className="p-0">
              <div className="flex items-center gap-4 text-black">
                <div className="p-3 bg-black/20 backdrop-blur-sm rounded-xl">
                  <Calendar className="size-8 text-black" />
                </div>
                <div>
                  <CardTitle className="text-black text-3xl mb-2 font-bold">Schedule Your Visit</CardTitle>
                  <CardDescription className="text-slate-900 text-base font-medium">Choose your barber, service, and preferred time</CardDescription>
                </div>
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-8 md:p-10 bg-gradient-to-br from-slate-900 to-black">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    placeholder="(508) 872-5556"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Choose Your Barber</Label>
                  <Select value={formData.barber} onValueChange={(value) => setFormData({ ...formData, barber: value, time: "" })}>
                    <SelectTrigger id="barber">
                      <SelectValue placeholder="Select a barber" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name} - {barber.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Service</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Preferred Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Preferred Time *</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder={availableTimeSlots.length === 0 && formData.date ? "No times available" : "Select a time"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests or additional information"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button type="submit" disabled={submitting} className="h-10 px-6 text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50 disabled:opacity-50">
                  {submitting ? "Sending..." : "Book Appointment"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ name: "", email: "", phone: "", barber: "", service: "", date: "", time: "", notes: "" })}
                  className="h-10 px-4 text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50"
                >
                  <RotateCcw className="size-4 mr-1" />
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}