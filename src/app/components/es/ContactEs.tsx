import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { toast } from "sonner";

export function ContactEs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    toast.success("¡Mensaje enviado! Te responderemos pronto.");
    
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">Contáctanos</h2>
          <p className="text-amber-200 text-lg">Ponte en contacto con nuestro equipo</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
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
                    <p className="text-slate-300">info@grandesligas.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/50">
                    <Globe className="size-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-amber-400">Sitio Web</h3>
                    <a 
                      href="https://www.grandesligas.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-amber-400 transition-colors underline underline-offset-4"
                    >
                      GrandesLigas.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map & Contact Form */}
          <div className="space-y-6">
            {/* Google Maps Embed */}
            <Card className="border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-900">
              <div className="relative">
                <iframe
                  title="Ubicación de Grandes Ligas Barbería"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.123!2d-71.4162!3d42.2793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e38a3e1b1b1b1b%3A0x1234567890abcdef!2s3A%202nd%20St%2C%20Framingham%2C%20MA%2001702!5e0!3m2!1ses!2sus!4v1700000000000!5m2!1ses!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>
              <CardContent className="p-4 bg-gradient-to-br from-slate-900 to-black">
                <p className="text-amber-400 text-sm font-medium text-center">
                  3A 2nd St, Framingham, MA 01702
                </p>
              </CardContent>
            </Card>

          <Card className="border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 bg-slate-900">
            <CardHeader className="p-8 pb-6">
              <CardTitle className="text-2xl text-amber-400">Envíanos un Mensaje</CardTitle>
              <CardDescription className="text-base text-slate-300">Responderemos en 24 horas</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-base text-amber-400">Nombre</Label>
                  <Input
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-base text-amber-400">Correo Electrónico</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@correo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base text-amber-400">Mensaje</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="¿Cómo podemos ayudarte?"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50">
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
