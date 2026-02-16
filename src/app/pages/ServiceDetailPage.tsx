import { ArrowLeft, Clock, DollarSign, CheckCircle } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { services } from "../data/services";
import { Navigation } from "../components/Navigation";
import { ScrollToTop } from "../components/ScrollToTop";
import { Scissors } from "lucide-react";

export function ServiceDetailPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100 flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold">
            Return to Home
          </Button>
        </div>
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex p-4 bg-gradient-to-br ${service.gradient} rounded-2xl mb-6 shadow-2xl shadow-amber-500/50`}>
              <service.icon className="size-12 text-black" />
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              {service.title}
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed">
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
              <Card className="border-2 border-amber-500/30 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-3xl bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    Service Description
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

              <Card className="border-2 border-amber-500/30 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-3xl bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.included.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="size-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-lg text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-amber-500/30 shadow-xl bg-gradient-to-br from-slate-900 to-black sticky top-6">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center pb-6 border-b border-amber-500/30">
                    <p className="text-amber-400 text-lg mb-2 font-semibold">Service Price</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                      {service.price}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-200">
                      <Clock className="size-6 text-amber-500" />
                      <div>
                        <p className="font-semibold text-amber-400">Duration</p>
                        <p>{service.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-amber-200">
                      <DollarSign className="size-6 text-amber-500" />
                      <div>
                        <p className="font-semibold text-amber-400">Payment</p>
                        <p>Cash or Card accepted</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        document.getElementById("booking")?.scrollIntoView();
                      }, 100);
                    }}
                    className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50"
                  >
                    Book This Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="size-6 text-amber-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Quick Links</h3>
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/" className="text-slate-300 hover:text-amber-400 transition-colors">Home</Link>
            <Link to="/#services" className="text-slate-300 hover:text-amber-400 transition-colors">Services</Link>
            <Link to="/#gallery" className="text-slate-300 hover:text-amber-400 transition-colors">Gallery</Link>
            <Link to="/#team" className="text-slate-300 hover:text-amber-400 transition-colors">Team</Link>
            <Link to="/#schedule" className="text-slate-300 hover:text-amber-400 transition-colors">Schedule</Link>
            <Link to="/#booking" className="text-slate-300 hover:text-amber-400 transition-colors">Book Now</Link>
            <Link to="/#contact" className="text-slate-300 hover:text-amber-400 transition-colors">Contact</Link>
            <Link to="/about" className="text-slate-300 hover:text-amber-400 transition-colors">About</Link>
          </nav>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barber Shop. All rights reserved.
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}