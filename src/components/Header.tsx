import { ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/store/cart";

export const Header = () => {
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 bg-gradient-yellow border-b-2 border-brand-ink/10 shadow-soft">
      <div className="container flex items-center justify-between py-3 gap-3">
        <div className="flex items-center gap-3">
          <Logo size={52} />
          <div className="hidden sm:block leading-tight">
            <p className="font-assamese text-brand-ink text-xl">কৌপাত</p>
            <p className="text-[11px] font-semibold tracking-wider text-brand-ink/70 uppercase">
              An Ethnic Cuisine Restaurant
            </p>
          </div>
        </div>

        <h1 className="font-assamese text-brand-ink text-2xl sm:text-3xl md:text-4xl absolute left-1/2 -translate-x-1/2 hidden md:block">
          কৌপাত
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2 bg-brand-ink text-brand-yellow px-4 py-2.5 rounded-full font-semibold hover:scale-105 transition-smooth shadow-soft"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm">Cart</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-yellow">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
