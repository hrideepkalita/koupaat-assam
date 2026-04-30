import momo from "@/assets/gallery-momo.jpg";
import chicken from "@/assets/gallery-chicken.jpg";
import rice from "@/assets/gallery-rice.jpg";
import interior from "@/assets/gallery-interior.jpg";
import hero from "@/assets/hero-thali.jpg";

const images = [
  { src: hero, alt: "Traditional thali" },
  { src: momo, alt: "Steaming momos" },
  { src: chicken, alt: "Chicken thali" },
  { src: rice, alt: "Fried rice" },
  { src: interior, alt: "Restaurant interior" },
];

export const Gallery = () => (
  <section className="py-16 md:py-24 bg-brand-cream">
    <div className="container">
      <div className="text-center mb-10">
        <p className="font-assamese text-brand-red text-2xl mb-2">গেলেৰী</p>
        <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink">
          From Our Kitchen
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-3xl shadow-soft group ${
              i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
