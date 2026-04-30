import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { menuItems, categories } from "@/data/menu";
import { useCart } from "@/store/cart";

export const Menu = () => {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const add = useCart((s) => s.add);

  const filtered = useMemo(
    () =>
      menuItems.filter(
        (m) =>
          (cat === "All" || m.category === cat) &&
          m.name.toLowerCase().includes(q.toLowerCase())
      ),
    [cat, q]
  );

  const handleAdd = (item: (typeof menuItems)[number]) => {
    add(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-10 animate-fade-up">
          <p className="font-assamese text-brand-red text-2xl mb-2">আমাৰ মেনু</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink">
            Our Menu
          </h2>
          <p className="text-muted-foreground mt-2">
            Freshly prepared • Made to order
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-card border border-border rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-smooth"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-smooth ${
                  cat === c
                    ? "bg-brand-ink text-brand-yellow"
                    : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Red banner card */}
        <div className="menu-banner rounded-3xl p-6 md:p-10 shadow-card relative overflow-hidden">
          <div className="absolute top-4 right-6 text-white/10 font-assamese text-7xl select-none">
            কৌপাত
          </div>

          <div className="relative grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 py-3 border-b border-white/15 animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-base md:text-lg truncate">
                    {item.name}
                  </h3>
                  <p className="text-white/60 text-xs uppercase tracking-wider">
                    {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-brand-yellow font-bold text-lg">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => handleAdd(item)}
                    aria-label={`Add ${item.name}`}
                    className="bg-brand-yellow text-brand-ink w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-90 transition-smooth shadow-soft"
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-white/70 text-center py-8">No dishes found.</p>
          )}
        </div>
      </div>
    </section>
  );
};
