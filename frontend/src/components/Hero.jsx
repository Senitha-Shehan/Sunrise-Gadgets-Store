import { useState, useEffect } from 'react';
import RippleButton from './RippleButton';

const heroImages = [
  '/hero-bg.jpg',
  '/hero-bg-2.jpg',
  '/hero-bg.jpg'
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
    <div className="relative text-white min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Slideshow Background */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          style={{ backgroundImage: `url('${img}')` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
      
      
      {/* Content - More minimalist */}
      <div className="w-full relative z-10 px-6 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Sunrise Gadgets
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
          Premium projectors at unbeatable prices in Sri Lanka
        </p>
       
      </div>
      
      {/* Dots - More subtle */}
      
    </div>
  );
}

export default Hero;