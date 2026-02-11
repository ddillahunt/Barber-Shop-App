import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Schedule } from "./components/Schedule";
import { AppointmentBooking } from "./components/AppointmentBooking";
import { Contact } from "./components/Contact";
import { Toaster } from "./components/ui/sonner";
import { ScrollToTop } from "./components/ScrollToTop";
import { Scissors } from "lucide-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { HomePageEs } from "./pages/HomePageEs";
import { ServiceDetailPageEs } from "./pages/ServiceDetailPageEs";
import { AboutPage } from "./pages/AboutPage";
import { AboutPageEs } from "./pages/AboutPageEs";

export default function App() {
  return (
    <BrowserRouter basename="/Barber-Shop-App">
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