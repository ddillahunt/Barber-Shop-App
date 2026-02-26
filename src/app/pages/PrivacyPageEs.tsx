import { NavigationEs } from "../components/es/NavigationEs";
import { ScrollToTop } from "../components/ScrollToTop";
import { Shield } from "lucide-react";
import logoImg from "../../assets/images/barber-Grandes Ligas logo.png";
import { Link } from "react-router-dom";

export function PrivacyPageEs() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationEs />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Shield className="size-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium italic">Tu Privacidad Importa</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Política de Privacidad
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Cómo recopilamos, usamos y protegemos tu información
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-3xl">

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Información que Recopilamos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Cuando reservas una cita o nos contactas a través de nuestro sitio web, podemos recopilar la siguiente información:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
              <li>Tu nombre</li>
              <li>Número de teléfono</li>
              <li>Dirección de correo electrónico</li>
              <li>Preferencias de cita (barbero, fecha, hora, servicio)</li>
              <li>Cualquier mensaje que envíes a través de nuestro formulario de contacto</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Cómo Usamos Tu Información
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Usamos tu información personal únicamente con el propósito de:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
              <li>Programar y gestionar tus citas</li>
              <li>Enviar confirmaciones y recordatorios de citas</li>
              <li>Responder a tus consultas y mensajes</li>
              <li>Mejorar nuestros servicios y la experiencia del cliente</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Protección de Datos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Tomamos medidas razonables para proteger tu información personal contra acceso no autorizado,
              alteración o destrucción. Tus datos se almacenan de forma segura y solo son accedidos por
              personal autorizado para los fines descritos anteriormente.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Compartir con Terceros
            </h2>
            <p className="text-slate-700 leading-relaxed">
              No vendemos, comerciamos ni compartimos tu información personal con terceros. Tu información
              es utilizada exclusivamente por Grandes Ligas Barber Shop para los fines descritos en esta política.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Tus Derechos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Tienes derecho a solicitar acceso, corrección o eliminación de tus datos personales en
              cualquier momento. Para hacer dicha solicitud, contáctanos directamente en la barbería o a través de nuestro sitio web.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Cambios a Esta Política
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos actualizar esta política de privacidad de vez en cuando. Cualquier cambio se reflejará en esta página
              con la fecha de actualización a continuación.
            </p>
          </div>

          <p className="text-slate-500 text-sm italic">Última actualización: Febrero 2026</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-slate-900 to-black text-white py-12 border-t-2 border-amber-500/50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={logoImg} alt="Grandes Ligas" className="h-6 w-auto object-contain" />
            <span className="font-bold italic text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Grandes Ligas</span>
          </div>
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Enlaces Rápidos</h3>
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/es" className="text-slate-300 hover:text-amber-400 transition-colors">Inicio</Link>
            <Link to="/es#services" className="text-slate-300 hover:text-amber-400 transition-colors">Servicios</Link>
            <Link to="/es#team" className="text-slate-300 hover:text-amber-400 transition-colors">Equipo</Link>
            <Link to="/es#schedule" className="text-slate-300 hover:text-amber-400 transition-colors">Horario</Link>
            <Link to="/es#booking" className="text-slate-300 hover:text-amber-400 transition-colors">Reservar</Link>
            <Link to="/es#contact" className="text-slate-300 hover:text-amber-400 transition-colors">Contacto</Link>
            <Link to="/es/acerca-de" className="text-slate-300 hover:text-amber-400 transition-colors">Acerca De</Link>
          </nav>
          <p className="text-amber-200">
            &copy; 2026 Grandes Ligas Barbería. Todos los derechos reservados.
          </p>
          <p className="text-slate-400 text-sm mt-3">Powered by GDI Digital Solutions</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
