import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { Gallery } from "@/components/Gallery";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Koupaat — An Ethnic Cuisine Restaurant | Guwahati";
    const desc =
      "Koupaat (কৌপাত) — authentic Assamese thalis, momos, fried rice & more. Order via WhatsApp from our AC restaurant in Guwahati.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Gallery />
        <About />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
