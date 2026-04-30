import { useState } from "react";
import { useMenuData } from "@/hooks/useMenuData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

const AdminCategories = () => {
  const { categories, loading } = useMenuData();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("menu_categories").insert({
      name: name.trim(),
      sort_order: categories.length + 1,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Category added");
      setName("");
    }
    setBusy(false);
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Dishes in it will become uncategorized.`)) return;
    const { error } = await supabase.from("menu_categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Deleted");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black">Categories</h2>
        <p className="text-sm text-muted-foreground">Group dishes on your menu</p>
      </div>

      <form onSubmit={add} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name (e.g. Desserts)"
          className="flex-1 bg-card border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-brand-ink text-brand-yellow px-5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      {loading && <Loader2 className="w-6 h-6 animate-spin" />}

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="bg-card border rounded-xl px-4 py-3 flex items-center justify-between shadow-soft">
            <span className="font-semibold">{c.name}</span>
            <button
              onClick={() => del(c.id, c.name)}
              className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-smooth"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
