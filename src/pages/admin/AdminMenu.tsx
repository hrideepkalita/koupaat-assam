import { useState } from "react";
import { useMenuData, type DbMenuItem } from "@/hooks/useMenuData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, X, ImageIcon } from "lucide-react";

const empty = {
  id: "",
  name: "",
  description: "",
  price: 0,
  category_id: "" as string | null,
  image_url: "" as string | null,
  available: true,
  sort_order: 0,
};

const AdminMenu = () => {
  const { items, categories, loading } = useMenuData();
  const [editing, setEditing] = useState<typeof empty | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const open = (it?: DbMenuItem) => {
    setEditing(
      it
        ? {
            id: it.id,
            name: it.name,
            description: it.description ?? "",
            price: it.price,
            category_id: it.category_id,
            image_url: it.image_url,
            available: it.available,
            sort_order: it.sort_order,
          }
        : { ...empty, category_id: categories[0]?.id ?? null }
    );
  };

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("menu-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      setEditing((e) => (e ? { ...e, image_url: data.publicUrl } : e));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Name required");
    setSaving(true);
    try {
      const payload = {
        name: editing.name.trim(),
        description: editing.description?.trim() || null,
        price: Number(editing.price),
        category_id: editing.category_id,
        image_url: editing.image_url || null,
        available: editing.available,
        sort_order: editing.sort_order,
      };
      const { error } = editing.id
        ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
        : await supabase.from("menu_items").insert(payload);
      if (error) throw error;
      toast.success(editing.id ? "Updated" : "Added");
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this dish?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Deleted");
  };

  const toggleAvail = async (it: DbMenuItem) => {
    await supabase.from("menu_items").update({ available: !it.available }).eq("id", it.id);
  };

  const grouped = categories.map((c) => ({
    cat: c,
    list: items.filter((i) => i.category_id === c.id),
  }));
  const uncategorized = items.filter((i) => !i.category_id);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl font-black">Menu Items</h2>
          <p className="text-sm text-muted-foreground">{items.length} dishes</p>
        </div>
        <button
          onClick={() => open()}
          className="bg-brand-red text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-brand-red-deep transition-smooth shadow-soft"
        >
          <Plus className="w-4 h-4" /> Add Dish
        </button>
      </div>

      {loading && <Loader2 className="w-6 h-6 animate-spin" />}

      {grouped.map(({ cat, list }) => (
        <section key={cat.id} className="space-y-3">
          <h3 className="font-bold text-brand-ink text-lg flex items-center gap-2">
            {cat.name}
            <span className="text-xs text-muted-foreground font-normal">
              {list.length} items
            </span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((it) => (
              <DishRow key={it.id} it={it} onEdit={() => open(it)} onDelete={() => del(it.id)} onToggle={() => toggleAvail(it)} />
            ))}
            {list.length === 0 && (
              <p className="text-sm text-muted-foreground italic col-span-full">No dishes yet</p>
            )}
          </div>
        </section>
      ))}

      {uncategorized.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold text-brand-ink text-lg">Uncategorized</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uncategorized.map((it) => (
              <DishRow key={it.id} it={it} onEdit={() => open(it)} onDelete={() => del(it.id)} onToggle={() => toggleAvail(it)} />
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-brand-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl shadow-card max-w-lg w-full p-6 my-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-black">
                {editing.id ? "Edit Dish" : "Add Dish"}
              </h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="space-y-2">
              {editing.image_url ? (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                  <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setEditing({ ...editing, image_url: null })}
                    className="absolute top-2 right-2 bg-brand-ink/80 text-white p-1.5 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video bg-muted rounded-xl cursor-pointer hover:bg-muted/70 transition-smooth border-2 border-dashed">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="Dish name"
              className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <textarea
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              placeholder="Short description (optional)"
              rows={2}
              className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <select
                  value={editing.category_id ?? ""}
                  onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                  className="w-full bg-background border rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.available}
                onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
                className="w-4 h-4 accent-brand-red"
              />
              Available for ordering
            </label>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-xl border font-semibold hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-brand-ink text-brand-yellow font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DishRow = ({
  it, onEdit, onDelete, onToggle,
}: {
  it: DbMenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) => (
  <div className={`bg-card rounded-2xl border shadow-soft overflow-hidden flex flex-col ${!it.available && "opacity-60"}`}>
    <div className="aspect-video bg-muted relative">
      {it.image_url ? (
        <img src={it.image_url} alt={it.name} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <ImageIcon className="w-8 h-8" />
        </div>
      )}
      {!it.available && (
        <span className="absolute top-2 left-2 bg-brand-ink text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
          Unavailable
        </span>
      )}
    </div>
    <div className="p-3 flex-1 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-brand-ink truncate">{it.name}</h4>
        <span className="text-brand-red font-bold shrink-0">₹{it.price}</span>
      </div>
      {it.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{it.description}</p>
      )}
      <div className="flex gap-1 mt-3 pt-2 border-t">
        <button onClick={onEdit} className="flex-1 text-xs py-1.5 rounded-lg hover:bg-muted flex items-center justify-center gap-1 transition-smooth">
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button onClick={onToggle} className="flex-1 text-xs py-1.5 rounded-lg hover:bg-muted transition-smooth">
          {it.available ? "Hide" : "Show"}
        </button>
        <button onClick={onDelete} className="flex-1 text-xs py-1.5 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center gap-1 transition-smooth">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default AdminMenu;
