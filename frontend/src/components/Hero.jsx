import { useState, useEffect } from 'react';
import RippleButton from './RippleButton';

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
    <div className="relative text-white min-h-[420px] sm:min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden rounded-b-3xl shadow-lg">
      {/* Slideshow Background */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${idx === current ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          style={{ backgroundImage: `url('${img}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
      {/* Arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-3 rounded-full shadow-lg"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-3 rounded-full shadow-lg"
        onClick={goNext}
        aria-label="Next slide"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      {/* Content */}
      <div className="w-full relative z-10 container mx-auto px-4 py-16 sm:py-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-xl text-center tracking-tight">
          Sunrise Gadgets Store
        </h1>
        <p className="text-lg sm:text-2xl md:text-3xl mb-8 opacity-90 leading-relaxed drop-shadow text-center max-w-2xl">
          Unbeatable Projector Prices in Sri Lanka Await You! Whether you're looking for high-performance projectors to elevate your entertainment experience.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center w-full max-w-xs sm:max-w-none">
          <RippleButton className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
            Browse Products
          </RippleButton>
          <RippleButton className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-white hover:text-blue-700 transition-colors w-full sm:w-auto">
            Latest Arrivals
          </RippleButton>
        </div>
      </div>
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            className={`w-4 h-4 rounded-full border-2 ${idx === current ? 'bg-white border-white' : 'bg-transparent border-white/60'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero; 