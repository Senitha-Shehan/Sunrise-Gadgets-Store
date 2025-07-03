import { useState, useEffect } from 'react';

const heroImages = [
  '/hero-bg.jpg',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80'
];

function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % heroImages.length);

  return (
    <div className="relative text-white min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Slideshow Background */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${idx === current ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          style={{ backgroundImage: `url('${img}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
      {/* Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 p-2 rounded-full"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 p-2 rounded-full"
        onClick={goNext}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      {/* Content */}
      <div className="w-full relative z-10 container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            Sunrise Gadgets Store
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 leading-relaxed drop-shadow">
            Unbeatable Projector Prices in Sri Lanka Await You! Whether you're looking for high- performance projectors to elevate your entertainment experience.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base shadow-md">
              Browse Products
            </button>
            <button className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-base shadow-md">
              Latest Arrivals
            </button>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border-2 ${idx === current ? 'bg-white border-white' : 'bg-transparent border-white/60'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero; 