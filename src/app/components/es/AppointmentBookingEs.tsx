import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, UserCheck } from "lucide-react";
import { toast } from "sonner";

const barbers = [
  { id: "1", name: "Carlos Martínez", specialty: "Cortes Clásicos" },
  { id: "2", name: "Miguel Rodríguez", specialty: "Estilos Modernos" },
  { id: "3", name: "Juan Hernández", specialty: "Especialista en Barbas" },
  { id: "4", name: "Diego Santos", specialty: "Maestro Todo Terreno" }
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM"
];

const services = [
  "Corte Clásico",
  "Corte y Estilo Premium",
  "Recorte y Diseño de Barba",
  "Paquete de Cuidado Completo"
];

export function AppointmentBookingEs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    barber: "",
    service: "",
    date: "",
    time: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.barber || 
        !formData.service || !formData.date || !formData.time) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    toast.success("¡Cita reservada con éxito! Te enviaremos un correo de confirmación.");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      barber: "",
      service: "",
      date: "",
      time: ""
    });
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Reserva una Cita</h2>
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
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber">Elige Tu Barbero</Label>
                  <Select value={formData.barber} onValueChange={(value) => setFormData({ ...formData, barber: value })}>
                    <SelectTrigger id="barber">
                      <SelectValue placeholder="Selecciona un barbero" />
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
                  <Label htmlFor="service">Servicio</Label>
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
                  <Label htmlFor="date">Fecha Preferida</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="time">Hora Preferida</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50">
                Reservar Cita
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
