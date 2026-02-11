import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./ui/button";

const testimonials = [
  {
    id: 1,
    name: "Marcus Johnson",
    rating: 5,
    text: "Best barber shop in town! Carlos gave me the cleanest fade I've ever had. The attention to detail is unmatched. I've been coming here for 6 months and every visit is consistent.",
    service: "Classic Haircut",
    barber: "Carlos Martinez",
  },
  {
    id: 2,
    name: "David Thompson",
    rating: 5,
    text: "Miguel is a true artist. He understood exactly what I wanted and delivered a modern style that gets me compliments everywhere I go. The shop has a great vibe too.",
    service: "Premium Cut & Style",
    barber: "Miguel Rodriguez",
  },
  {
    id: 3,
    name: "James Rivera",
    rating: 5,
    text: "Juan transformed my beard from a mess into a masterpiece. His sculpting skills are incredible. I now get my beard done here every two weeks — wouldn't trust anyone else.",
    service: "Beard Trim & Shape",
    barber: "Juan Hernandez",
  },
  {
    id: 4,
    name: "Anthony Garcia",
    rating: 4,
    text: "Got the full grooming package with Diego and it was worth every penny. Haircut, beard trim, hot towel — the whole experience was premium. Felt like a new man walking out.",
    service: "Full Grooming Package",
    barber: "Diego Santos",
  },
  {
    id: 5,
    name: "Robert Williams",
    rating: 5,
    text: "I've tried many barber shops but Grandes Ligas is on another level. The skill, the atmosphere, the customer service — everything is top tier. This is my go-to spot now.",
    service: "Classic Haircut",
    barber: "Carlos Martinez",
  },
  {
    id: 6,
    name: "Chris Martinez",
    rating: 5,
    text: "Brought my son here for his first real haircut and Miguel was so patient and skilled. My kid actually enjoyed it! We're both regulars now. Highly recommend for all ages.",
    service: "Premium Cut & Style",
    barber: "Miguel Rodriguez",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, maxIndex]);

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  };

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  };

  const visible = testimonials.slice(current, current + visibleCount);
  const displayed = visible.length < visibleCount
    ? [...visible, ...testimonials.slice(0, visibleCount - visible.length)]
    : visible;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Don't just take our word for it — hear from our satisfied customers
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black shadow-lg"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black shadow-lg"
          >
            <ChevronRight className="size-5" />
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
            {displayed.map((review) => (
              <Card
                key={review.id}
                className="border-2 border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  <Quote className="size-8 text-amber-500/30" />
                  <p className="text-slate-300 leading-relaxed text-sm italic">
                    "{review.text}"
                  </p>
                  <div className="pt-4 border-t border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-400">{review.name}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{review.service}</span>
                      <span>with {review.barber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrent(i);
                }}
                className={`rounded-full transition-all ${
                  i === current
                    ? "w-8 h-2.5 bg-amber-500"
                    : "w-2.5 h-2.5 bg-slate-400/30 hover:bg-slate-400/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
