import { ArrowLeft, Clock, DollarSign, CheckCircle } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { servicesEs } from "../data/services-es";
import { NavigationEs } from "../components/es/NavigationEs";
import { ScrollToTop } from "../components/ScrollToTop";
import logoImg from "../../assets/images/barber-Grandes Ligas logo.png";

export function ServiceDetailPageEs() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const service = servicesEs.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100 flex items-center justify-center">
        <NavigationEs />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Servicio No Encontrado</h1>
          <Button onClick={() => navigate("/es")} className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-bold">
            Volver al Inicio
          </Button>
        </div>
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <NavigationEs />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-black text-white">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate("/es")}
            variant="ghost"
            className="mb-6 text-sky-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="size-5 mr-2" />
            Volver al Inicio
          </Button>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-4 mb-6">
              <img src={logoImg} alt="Grandes Ligas" className="h-20 w-auto object-contain" />
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 font-bold bg-gradient-to-r from-sky-200 via-blue-300 to-sky-200 bg-clip-text text-transparent">
              {service.title}
            </h1>
            <p className="text-xl text-sky-100 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-2 border-blue-500/30 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-3xl bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">
                    Descripción del Servicio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-700">
                  {service.detailedDescription.map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500/30 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-3xl bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">
                    Qué Incluye
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.included.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="size-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-lg text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-blue-500/30 shadow-xl bg-gradient-to-br from-slate-900 to-black sticky top-6">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center pb-6 border-b border-blue-500/30">
                    <p className="text-sky-300 text-lg mb-2 font-semibold">Precio del Servicio</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                      {service.price}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sky-200">
                      <Clock className="size-6 text-blue-500" />
                      <div>
                        <p className="font-semibold text-sky-300">Duración</p>
                        <p>{service.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sky-200">
                      <DollarSign className="size-6 text-blue-500" />
                      <div>
                        <p className="font-semibold text-sky-300">Pago</p>
                        <p>Solo efectivo</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      navigate("/es");
                      setTimeout(() => {
                        document.getElementById("booking")?.scrollIntoView();
                      }, 100);
                    }}
                    className="w-full h-14 text-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-bold shadow-lg shadow-red-500/50"
                  >
                    Reservar Este Servicio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-blue-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={logoImg} alt="Grandes Ligas" className="h-6 w-auto object-contain" />
            <span className="font-bold italic text-xl bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Enlaces Rápidos</h3>
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/es" className="text-slate-300 hover:text-sky-300 transition-colors">Inicio</Link>
            <Link to="/es#services" className="text-slate-300 hover:text-sky-300 transition-colors">Servicios</Link>
<Link to="/es#team" className="text-slate-300 hover:text-sky-300 transition-colors">Equipo</Link>
            <Link to="/es#schedule" className="text-slate-300 hover:text-sky-300 transition-colors">Horario</Link>
            <Link to="/es#booking" className="text-slate-300 hover:text-sky-300 transition-colors">Reservar</Link>
            <Link to="/es#contact" className="text-slate-300 hover:text-sky-300 transition-colors">Contacto</Link>
            <Link to="/es/acerca-de" className="text-slate-300 hover:text-sky-300 transition-colors">Acerca De</Link>
          </nav>
          <p className="text-sky-200">
            &copy; 2026 Grandes Ligas Barbería. Todos los derechos reservados.
          </p>
          <p className="text-slate-400 text-sm mt-3">Powered by GDI Digital Solutions</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
