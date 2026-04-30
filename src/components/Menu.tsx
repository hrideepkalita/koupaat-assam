import { useMemo, useState } from "react";
import { Plus, Search, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";
import { useMenuData, type DbMenuItem, type DbCategory } from "@/hooks/useMenuData";

export const Menu = () => {
  const { categories, items, loading } = useMenuData();
  const [activeCat, setActiveCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const add = useCart((s) => s.add);

  const filtered = useMemo(
    () =>
      items
        .filter((i) => i.available)
        .filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))
        .filter((i) => activeCat === "all" || i.category_id === activeCat),
    [items, q, activeCat]
  );

  const grouped = useMemo(() => {
    return categories
      .map((c) => ({ cat: c, list: filtered.filter((i) => i.category_id === c.id) }))
      .filter((g) => g.list.length > 0);
  }, [categories, filtered]);

  const handleAdd = (it: DbMenuItem) => {
    add({ id: it.id, name: it.name, price: it.price, image_url: it.image_url });
    toast.success(`${it.name} added`);
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-10 animate-fade-up">
          <p className="font-assamese text-brand-red text-2xl mb-2">আমাৰ মেনু</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink">
            Our Menu
          </h2>
          <p className="text-muted-foreground mt-2">Freshly prepared • Made to order</p>
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
            <CatPill active={activeCat === "all"} onClick={() => setActiveCat("all")}>
              All
            </CatPill>
            {categories.map((c) => (
              <CatPill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
                {c.name}
              </CatPill>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground py-12">Loading menu...</div>
        )}

        {!loading && grouped.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No dishes found.</p>
        )}

        <div className="space-y-12">
          {grouped.map(({ cat, list }) => (
            <CategorySection key={cat.id} cat={cat} list={list} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CatPill = ({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-smooth ${
      active ? "bg-brand-ink text-brand-yellow" : "bg-muted text-foreground hover:bg-muted/70"
    }`}
  >
    {children}
  </button>
);

const CategorySection = ({
  cat, list, onAdd,
}: { cat: DbCategory; list: DbMenuItem[]; onAdd: (i: DbMenuItem) => void }) => (
  <section>
    <div className="flex items-end justify-between mb-5 pb-3 border-b-2 border-brand-red/20">
      <div>
        <h3 className="font-display text-3xl md:text-4xl font-black text-brand-ink">
          {cat.name}
        </h3>
        <p className="text-xs uppercase tracking-widest text-brand-red font-semibold mt-1">
          {list.length} {list.length === 1 ? "dish" : "dishes"}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {list.map((it, i) => (
        <DishCard key={it.id} it={it} onAdd={() => onAdd(it)} delay={i * 40} />
      ))}
    </div>
  </section>
);

const DishCard = ({
  it, onAdd, delay,
}: { it: DbMenuItem; onAdd: () => void; delay: number }) => (
  <article
    className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-smooth hover:-translate-y-1 flex flex-col animate-fade-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="aspect-[4/3] bg-gradient-to-br from-brand-yellow/30 to-brand-red/10 relative overflow-hidden">
      {it.image_url ? (
        <img
          src={it.image_url}
          alt={it.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-brand-red/40">
          <ImageIcon className="w-10 h-10" />
        </div>
      )}
    </div>
    <div className="p-3 md:p-4 flex-1 flex flex-col gap-2">
      <h4 className="font-bold text-brand-ink text-sm md:text-base leading-tight line-clamp-2">
        {it.name}
      </h4>
      {it.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-display text-xl md:text-2xl font-black text-brand-red">
          ₹{it.price}
        </span>
        <button
          onClick={onAdd}
          aria-label={`Add ${it.name}`}
          className="bg-brand-ink text-brand-yellow w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-90 transition-smooth shadow-soft"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  </article>
);
