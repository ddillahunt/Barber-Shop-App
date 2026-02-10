import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { servicesEs } from "../../data/services-es";

export function ServicesEs() {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Nuestros Servicios</h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Servicios de cuidado personal expertos adaptados a tu estilo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesEs.map((service) => (
            <Card 
              key={service.title} 
              className={`hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2 border-2 border-amber-500/20 bg-gradient-to-br ${service.bgGradient} flex flex-col cursor-pointer`}
              onClick={() => navigate(`/es/servicios/${service.id}`)}
            >
              <CardHeader className="flex-grow">
                <div className={`inline-flex p-3 bg-gradient-to-br ${service.gradient} rounded-xl mb-4 w-fit shadow-lg shadow-amber-500/50`}>
                  <service.icon className="size-8 text-black" />
                </div>
                <CardTitle className="text-xl text-amber-400">{service.title}</CardTitle>
                <CardDescription className="text-base text-slate-300">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className={`text-3xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>{service.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
