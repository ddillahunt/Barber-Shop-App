import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar, UserCheck } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { saveAppointment, getBookedTimes } from "../lib/appointments";

const barbers = [
  { id: "1", name: "Carlos Martinez", specialty: "Classic Cuts" },
  { id: "2", name: "Miguel Rodriguez", specialty: "Modern Styles" },
  { id: "3", name: "Juan Hernandez", specialty: "Beard Specialist" },
  { id: "4", name: "Diego Santos", specialty: "All-Around Master" }
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
      getBookedTimes(formData.date).then(setBookedTimes).catch(() => setBookedTimes([]));
    } else {
      setBookedTimes([]);
    }
  }, [formData.date]);

  const availableTimeSlots = timeSlots.filter((t) => !bookedTimes.includes(t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      toast.error("Please fill in name, phone number, date, and time");
      return;
    }

    setSubmitting(true);

    const selectedBarber = barbers.find(b => b.id === formData.barber);

    try {
      // Send notification to shop
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
          barber: selectedBarber ? `${selectedBarber.name} - ${selectedBarber.specialty}` : formData.barber,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        },
        "byZkVrNvtLJutxIt5"
      );

      // Send confirmation to customer
      await emailjs.send(
        "service_grandesligas",
        "template_yqpkz9e",
        {
          to_email: formData.email,
          to_name: formData.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          barber: selectedBarber ? `${selectedBarber.name} - ${selectedBarber.specialty}` : formData.barber,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        },
        "byZkVrNvtLJutxIt5"
      );

      // Save to Firestore
      try {
        await saveAppointment({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          barber: selectedBarber ? `${selectedBarber.name} - ${selectedBarber.specialty}` : formData.barber,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
          source: "en",
        });
      } catch (firestoreError) {
        console.error("Firestore save failed:", firestoreError);
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
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Book an Appointment</h2>
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe *"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    placeholder="(508) 872-5556 *"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber">Choose Your Barber</Label>
                  <Select value={formData.barber} onValueChange={(value) => setFormData({ ...formData, barber: value })}>
                    <SelectTrigger id="barber">
                      <SelectValue placeholder="Select a barber" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name} - {barber.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
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
                  <Label htmlFor="date">Preferred Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder={availableTimeSlots.length === 0 && formData.date ? "No times available" : "Select a time *"} />
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests or additional information"
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50 disabled:opacity-50">
                {submitting ? "Sending..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}