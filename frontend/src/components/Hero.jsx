function Hero() {
  return (
    <div className="relative bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Overlay: dark + gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-black/40" />
      {/* Content */}
      <div className="w-full relative z-10 container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center">
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
    </div>
  );
}

export default Hero; 