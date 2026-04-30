import { Snowflake, Leaf, MapPin } from "lucide-react";

export const About = () => (
  <section id="about" className="py-16 md:py-24 bg-background">
    <div className="container max-w-4xl text-center">
      <p className="font-assamese text-brand-red text-2xl mb-2">আমাৰ বিষয়ে</p>
      <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink">
        About Koupaat
      </h2>
      <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
        Koupaat — meaning the gentle banana-leaf platter of Assam — brings you
        ethnic, soul-warming cuisine in a comfortable AC setting in the heart of
        Guwahati. Every thali is a quiet celebration of our roots.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          { icon: Leaf, title: "Ethnic Cuisine", desc: "Authentic Assamese flavors" },
          { icon: Snowflake, title: "Fully AC", desc: "Comfort with every meal" },
          { icon: MapPin, title: "Guwahati", desc: "In the heart of the city" },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-card border rounded-2xl p-6 shadow-soft hover:shadow-card transition-smooth hover:-translate-y-1"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-yellow flex items-center justify-center mb-3">
              <f.icon className="w-6 h-6 text-brand-ink" />
            </div>
            <h3 className="font-bold text-brand-ink">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
