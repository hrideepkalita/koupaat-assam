import { Utensils } from "lucide-react";

export const Logo = ({ size = 56 }: { size?: number }) => (
  <div
    className="relative rounded-full bg-brand-cream border-[3px] border-brand-ink flex items-center justify-center shadow-soft"
    style={{ width: size, height: size }}
    aria-label="Koupaat logo"
  >
    {/* leaf accent */}
    <span
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "conic-gradient(from 220deg, hsl(140 60% 35% / 0.18), transparent 40%)",
      }}
    />
    <Utensils
      className="relative text-brand-red-deep"
      style={{ width: size * 0.5, height: size * 0.5 }}
      strokeWidth={2.4}
    />
  </div>
);
