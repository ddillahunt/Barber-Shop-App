import { Scissors, ChevronDown, Clock, CalendarCheck, Mail, Languages, Menu, X, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { servicesEs } from "../../data/services-es";
import { useState } from "react";

export function NavigationEs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // If not on home page, navigate to home first
    if (location.pathname !== "/es") {
      navigate("/es");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView();
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView();
      }
    }
  };

  const handleServiceClick = (serviceId: string) => {
    setIsMobileMenuOpen(false);
    navigate(`/es/servicios/${serviceId}`);
  };

  const handleLanguageSwitch = () => {
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-black via-slate-900 to-black backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-amber-500/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/es")}>
            <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-lg shadow-amber-500/50">
              <Scissors className="size-6 text-black" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <DropdownMenu open={isServicesOpen} onOpenChange={setIsServicesOpen}>
              <DropdownMenuTrigger 
                className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5 outline-none group"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <Scissors className="size-4" />
                Servicios
                <ChevronDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/30 border-2"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                {servicesEs.map((service) => (
                  <DropdownMenuItem
                    key={service.id}
                    onClick={() => navigate(`/es/servicios/${service.id}`)}
                    className="text-amber-400 hover:text-yellow-500 hover:bg-amber-500/10 cursor-pointer transition-all hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <service.icon className="size-5" />
                      <div>
                        <div className="font-semibold">{service.title}</div>
                        <div className="text-sm text-amber-300">{service.price}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={() => scrollToSection('schedule')} className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5">
              <Clock className="size-4" />
              Horario de Atención
            </button>
            <button onClick={() => scrollToSection('booking')} className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5">
              <CalendarCheck className="size-4" />
              Reservar
            </button>
            <button onClick={() => scrollToSection('contact')} className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5">
              <Mail className="size-4" />
              Contacto
            </button>
            <button onClick={() => { navigate("/es/acerca-de"); window.scrollTo(0, 0); }} className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5">
              <Info className="size-4" />
              Acerca de
            </button>
            <button
              onClick={() => navigate("/")} 
              className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5"
            >
              <Languages className="size-4" />
              English
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-amber-400 hover:text-yellow-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-500/30">
            <div className="flex flex-col gap-4">
              {/* Services Submenu */}
              <div className="flex flex-col gap-2">
                <div className="font-medium text-amber-400 flex items-center gap-1.5 px-2">
                  <Scissors className="size-4" />
                  Servicios
                </div>
                <div className="pl-6 flex flex-col gap-2">
                  {servicesEs.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-3 py-2"
                    >
                      <service.icon className="size-4" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{service.title}</div>
                        <div className="text-xs text-amber-300">{service.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollToSection('schedule')}
                className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5 px-2"
              >
                <Clock className="size-4" />
                Horario de Atención
              </button>
              <button 
                onClick={() => scrollToSection('booking')} 
                className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5 px-2"
              >
                <CalendarCheck className="size-4" />
                Reservar
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5 px-2"
              >
                <Mail className="size-4" />
                Contacto
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate("/es/acerca-de"); window.scrollTo(0, 0); }}
                className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5 px-2"
              >
                <Info className="size-4" />
                Acerca de
              </button>
              <button
                onClick={handleLanguageSwitch}
                className="font-medium text-amber-400 hover:text-yellow-500 transition-colors flex items-center gap-1.5 px-2"
              >
                <Languages className="size-4" />
                English
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}