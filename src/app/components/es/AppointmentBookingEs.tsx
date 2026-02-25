import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Calendar, UserCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { sendEmail, sendSMS } from "../../lib/email";
import { saveAppointment, subscribeToBookedTimes, isTimeSlotAvailable, subscribeToBarbers, type Barber } from "../../lib/appointments";

const timeSlots = [
  "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
  "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
  "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
  "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
  "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
  "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
  "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
  "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
  "5:00 PM", "5:15 PM", "5:30 PM", "5:45 PM",
  "6:00 PM", "6:15 PM", "6:30 PM", "6:45 PM",
  "7:00 PM"
];

const services = [
  "Corte Clásico",
  "Corte y Estilo Premium",
  "Recorte y Diseño de Barba",
  "Paquete de Cuidado Completo"
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function AppointmentBookingEs() {
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
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    const unsub = subscribeToBarbers(setBarbers);
    return () => unsub();
  }, []);

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

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const notes = formData.notes.trim();

    if (!name || !phone || !formData.date || !formData.time) {
      toast.error("Por favor complete nombre, teléfono, fecha y hora");
      return;
    }
    if (name.length < 2 || name.length > 100) {
      toast.error("El nombre debe tener entre 2 y 100 caracteres");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Por favor ingrese un número de teléfono válido de 10 dígitos");
      return;
    }
    if (notes.length > 500) {
      toast.error("Las notas deben tener menos de 500 caracteres");
      return;
    }

    setSubmitting(true);

    const selectedBarber = barbers.find(b => b.id === formData.barber);
    const barberLabel = selectedBarber ? `${selectedBarber.name} - ${selectedBarber.phone}` : formData.barber;

    // Verificar doble reserva
    if (selectedBarber) {
      try {
        const available = await isTimeSlotAvailable(formData.date, formData.time, barberLabel);
        if (!available) {
          toast.error("Este horario ya está reservado para este barbero. Elige otro horario.");
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("Availability check failed:", err);
      }
    }

    try {
      const barberField = selectedBarber ? `${selectedBarber.name} - ${selectedBarber.phone}` : formData.barber;

      // Guardar en Firestore PRIMERO para bloquear el horario
      await saveAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        barber: barberField,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        source: "es",
      });

      // Enviar notificación a la barbería
      try {
        await sendEmail("shop_notification", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          barber: barberField,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        });
      } catch (emailError) {
        console.error("Shop email failed:", emailError);
      }

      // Enviar confirmación al cliente (solo si hay correo)
      if (formData.email) {
        try {
          await sendEmail("customer_confirmation", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            barber: barberField,
            service: formData.service,
            date: formData.date,
            time: formData.time,
            notes: formData.notes,
            message: `Su cita ha sido confirmada para ${formData.date} a las ${formData.time}${barberField ? ` con ${barberField.split(" - ")[0]}` : ""}. ¡Esperamos verle pronto!`,
          });
        } catch (emailError) {
          console.error("Customer email failed:", emailError);
          toast.error("No se pudo enviar el correo de confirmación, pero su cita está reservada.");
        }
      }

      // Enviar SMS de confirmación al cliente
      if (formData.phone) {
        try {
          await sendSMS(
            formData.phone,
            `Hola ${formData.name}, su cita en Grandes Ligas Barber está confirmada para ${formData.date} a las ${formData.time}${barberField ? ` con ${barberField.split(" - ")[0]}` : ""}. ¡Le esperamos!`
          );
        } catch (smsError) {
          console.error("SMS failed:", smsError);
        }
      }

      toast.success("¡Cita reservada con éxito! Te enviaremos un correo de confirmación.");

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
      toast.error("Error al enviar. Llámanos al (508) 872-5556 para reservar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold text-black">Reserva una Cita</h2>
          <p className="text-slate-700 text-lg">Reserva tu lugar con nuestros barberos expertos</p>
          <p className="mt-3 inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <UserCheck className="size-4" />
            También se aceptan sin cita — ¡no necesitas reservar!
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
                  <CardTitle className="text-black text-3xl mb-2 font-bold">Programa Tu Visita</CardTitle>
                  <CardDescription className="text-slate-900 text-base font-medium">Elige tu barbero, servicio y hora preferida</CardDescription>
                </div>
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-8 md:p-10 bg-gradient-to-br from-slate-900 to-black">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                    placeholder="Juan Pérez"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Número de Teléfono *</Label>
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
                  <Label htmlFor="barber" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Elige Tu Barbero</Label>
                  <Select value={formData.barber} onValueChange={(value) => setFormData({ ...formData, barber: value, time: "" })}>
                    <SelectTrigger id="barber">
                      <SelectValue placeholder="Selecciona un barbero" />
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
                  <Label htmlFor="service" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Servicio</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Selecciona un servicio" />
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
                  <Label htmlFor="date" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Fecha Preferida *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Hora Preferida *</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder={availableTimeSlots.length === 0 && formData.date ? "No hay horarios disponibles" : "Selecciona una hora"} />
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
                  <Label htmlFor="notes" style={{ color: "#fbbf24", fontSize: "1rem", fontWeight: 600 }}>Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value.slice(0, 500) })}
                    placeholder="Cualquier solicitud especial o información adicional"
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button type="submit" disabled={submitting} className="h-10 px-6 text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50 disabled:opacity-50">
                  {submitting ? "Enviando..." : "Reservar Cita"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ name: "", email: "", phone: "", barber: "", service: "", date: "", time: "", notes: "" })}
                  className="h-10 px-4 text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50"
                >
                  <RotateCcw className="size-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
