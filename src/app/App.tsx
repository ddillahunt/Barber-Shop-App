import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Schedule } from "./components/Schedule";
import { AppointmentBooking } from "./components/AppointmentBooking";
import { Contact } from "./components/Contact";
import { Toaster } from "./components/ui/sonner";
import { ScrollToTop } from "./components/ScrollToTop";
import { Scissors } from "lucide-react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { HomePageEs } from "./pages/HomePageEs";
import { ServiceDetailPageEs } from "./pages/ServiceDetailPageEs";
import { AboutPage } from "./pages/AboutPage";
import { AboutPageEs } from "./pages/AboutPageEs";

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "instant" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename="/Barber-Shop-App">
      <ScrollToHash />
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/es" element={<HomePageEs />} />
        <Route path="/es/servicios/:serviceId" element={<ServiceDetailPageEs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/es/acerca-de" element={<AboutPageEs />} />
      </Routes>
    </BrowserRouter>
  );
}