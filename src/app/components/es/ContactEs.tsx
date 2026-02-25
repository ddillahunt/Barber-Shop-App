import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import { saveMessage } from "../../lib/appointments";
import { sendEmail } from "../../lib/email";

export function ContactEs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    if (name.length < 2 || name.length > 100) {
      toast.error("El nombre debe tener entre 2 y 100 caracteres");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }
    if (message.length < 10 || message.length > 1000) {
      toast.error("El mensaje debe tener entre 10 y 1000 caracteres");
      return;
    }

    setSubmitting(true);
    try {
      await saveMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: "es",
      });

      try {
        await sendEmail("contact_notification", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        });
      } catch {
        console.error("Owner email failed");
      }

      try {
        await sendEmail("contact_reply", {
          name: formData.name,
          email: formData.email,
          message: "Gracias por tu mensaje. ¡Te responderemos pronto!",
        });
      } catch {
        console.error("Auto-reply email failed");
      }

      toast.success("¡Mensaje enviado! Te responderemos pronto.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Error al enviar el mensaje. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">Contáctanos</h2>
          <p className="text-amber-200 text-lg">Ponte en contacto con nuestro equipo</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Information */}
          <Card className="border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-900">
            <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-black text-2xl mb-2 font-bold">Ponte en Contacto</CardTitle>
                <CardDescription className="text-slate-900 font-medium">Visítanos o contáctanos con cualquier pregunta</CardDescription>
              </CardHeader>
            </div>
            <CardContent className="space-y-8 p-8 bg-gradient-to-br from-slate-900 to-black">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/50">
                  <MapPin className="size-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-amber-400">Ubicación</h3>
                  <p className="text-slate-300 leading-relaxed">
                    3A 2nd St<br />
                    Framingham, MA 01702
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/50">
                  <Phone className="size-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-amber-400">Teléfono</h3>
                  <p className="text-slate-300">(508) 872-5556</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/50">
                  <Mail className="size-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-amber-400">Correo Electrónico</h3>
                  <a href="mailto:ddillahunt59@gmail.com" className="text-slate-300 hover:text-amber-400 transition-colors underline underline-offset-4">ddillahunt59@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/50">
                  <Globe className="size-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-amber-400">Sitio Web</h3>
                  <a
                    href="https://www.grandes-ligas.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-amber-400 transition-colors underline underline-offset-4"
                  >
                    Grandes-Ligas.net
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-900">
            <div className="relative h-full">
              <iframe
                title="Ubicación de Grandes Ligas Barbería"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.123!2d-71.4162!3d42.2793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e38a3e1b1b1b1b%3A0x1234567890abcdef!2s3A%202nd%20St%2C%20Framingham%2C%20MA%2001702!5e0!3m2!1ses!2sus!4v1700000000000!5m2!1ses!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4 pt-8">
                <p className="text-amber-400 text-sm font-medium text-center">
                  3A 2nd St, Framingham, MA 01702
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Form */}
          <Card className="border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 bg-slate-900">
            <CardHeader className="p-8 pb-6">
              <CardTitle className="text-2xl text-amber-400">Envíanos un Mensaje</CardTitle>
              <CardDescription className="text-base text-slate-300">Te responderemos en 24 horas</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="contact-name-es" className="text-base text-amber-400">Nombre</Label>
                  <Input
                    id="contact-name-es"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                    placeholder="Tu nombre"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email-es" className="text-base text-amber-400">Correo Electrónico</Label>
                  <Input
                    id="contact-email-es"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@correo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone-es" className="text-base text-amber-400">Número de Teléfono</Label>
                  <Input
                    id="contact-phone-es"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    placeholder="(508) 872-5556"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message-es" className="text-base text-amber-400">Mensaje</Label>
                  <Textarea
                    id="message-es"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 1000) })}
                    placeholder="¿Cómo podemos ayudarte?"
                    rows={5}
                    maxLength={1000}
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50 disabled:opacity-50">
                  {submitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
