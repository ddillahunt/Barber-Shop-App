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
                      123 Calle Principal<br />
                      Distrito Centro<br />
                      Ciudad, Estado 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/50">
                    <Phone className="size-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-amber-400">Teléfono</h3>
                    <p className="text-slate-300">(555) 123-4567</p>
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

          {/* Contact Form */}
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
    </section>
  );
}
