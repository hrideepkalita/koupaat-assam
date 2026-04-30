import heroThali from "@/assets/hero-thali.jpg";

export const Hero = () => {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-yellow">
      <div className="container grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
        <div className="animate-fade-up space-y-6 relative z-10">
          <span className="inline-block bg-brand-ink text-brand-yellow text-xs font-bold tracking-widest px-3 py-1.5 rounded-full uppercase">
            Guwahati • Since Today
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-brand-ink leading-[1.05]">
            A taste of <span className="italic text-brand-red-deep">Assam</span>,
            served with soul.
          </h2>
          <p className="text-brand-ink/80 text-lg max-w-md">
            Authentic ethnic cuisine — handcrafted thalis, smoky momos and warm
            chai in the heart of Guwahati.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToMenu}
              className="bg-brand-red text-white px-7 py-3.5 rounded-full font-bold hover:bg-brand-red-deep transition-smooth shadow-card hover:scale-105"
            >
              Order Now →
            </button>
            <a
              href="#about"
              className="bg-brand-ink/10 text-brand-ink px-7 py-3.5 rounded-full font-semibold hover:bg-brand-ink/20 transition-smooth"
            >
              Our Story
            </a>
          </div>
        </div>

        <div className="relative animate-float">
          <div className="absolute inset-0 bg-brand-red-deep rounded-full blur-3xl opacity-30 scale-90" />
          <img
            src={heroThali}
            alt="Traditional Assamese thali on banana leaf"
            width={1536}
            height={1536}
            className="relative w-full max-w-md mx-auto rounded-full shadow-card object-cover aspect-square border-[6px] border-brand-cream"
          />
        </div>
      </div>

      {/* decorative wave */}
      <svg
        className="block w-full text-background"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,16 1440,40 L1440,60 L0,60 Z"
        />
      </svg>
    </section>
  );
};
