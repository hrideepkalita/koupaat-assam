import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useSettings } from "@/hooks/useMenuData";

export const Footer = () => {
  const { whatsapp } = useSettings();
  return (
  <footer className="bg-brand-ink text-brand-cream pt-14 pb-6">
    <div className="container grid md:grid-cols-3 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Logo size={48} />
          <div>
            <p className="font-assamese text-brand-yellow text-2xl leading-none">কৌপাত</p>
            <p className="text-xs tracking-widest text-brand-cream/60 uppercase">
              Koupaat
            </p>
          </div>
        </div>
        <p className="text-sm text-brand-cream/70 max-w-xs">
          An ethnic cuisine restaurant — celebrating the flavors of Assam, one
          plate at a time.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-3 text-brand-yellow">Visit Us</h4>
        <ul className="space-y-2 text-sm text-brand-cream/80">
          <li className="flex gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            Near Kalabari, Guwahati, Assam
          </li>
          <li className="flex gap-2">
            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
            +91 88228 21202
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-3 text-brand-yellow">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#menu" className="hover:text-brand-yellow transition-smooth">Menu</a></li>
          <li><a href="#about" className="hover:text-brand-yellow transition-smooth">About</a></li>
        </ul>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-4 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-smooth"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Us
        </a>
      </div>
    </div>

    <div className="container mt-10 pt-6 border-t border-brand-cream/10 text-center text-xs text-brand-cream/50">
      © {new Date().getFullYear()} Koupaat. Crafted with love in Guwahati.
    </div>
  </footer>
);
