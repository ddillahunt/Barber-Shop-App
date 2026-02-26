const galleryItems = [
  {
    id: 1,
    label: "Precision Fade",
    image: "https://images.unsplash.com/photo-1544215897-e4a5eeae9cc1?w=600&h=600&fit=crop",
  },
  {
    id: 2,
    label: "Beard Sculpting",
    image: "https://plus.unsplash.com/premium_photo-1661427581253-1b850ec1b788?w=600&h=600&fit=crop",
  },
  {
    id: 3,
    label: "Classic Cut",
    image: "https://images.unsplash.com/photo-1759408174071-f2971472dc73?w=600&h=600&fit=crop",
  },
  {
    id: 4,
    label: "Hot Towel Shave",
    image: "https://plus.unsplash.com/premium_photo-1661392827793-d8543c341ea3?w=600&h=600&fit=crop",
  },
  {
    id: 5,
    label: "Beard Trim & Lineup",
    image: "https://plus.unsplash.com/premium_photo-1661382196658-9f835c21d6e9?w=600&h=600&fit=crop",
  },
  {
    id: 6,
    label: "Fresh Lineup",
    image: "https://plus.unsplash.com/premium_photo-1661542987765-f39368ff358d?w=600&h=600&fit=crop",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
            Our Work
          </h2>
          <p className="text-amber-200 text-lg max-w-2xl mx-auto">
            Check out some of our freshest cuts and styles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-500/20"
            >
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 text-amber-400 font-bold text-lg">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/50"
          >
            Like What You See? Get This Look - Book Now!
          </button>
        </div>
      </div>
    </section>
  );
}
