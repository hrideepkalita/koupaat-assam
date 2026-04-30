import { useState } from "react";
import { Minus, Plus, Trash2, X, MessageCircle } from "lucide-react";
import { useCart } from "@/store/cart";
import { WHATSAPP_NUMBER } from "@/data/menu";
import { toast } from "sonner";

export const CartDrawer = () => {
  const { items, open, setOpen, inc, dec, remove, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const sendOrder = () => {
    if (items.length === 0) return;
    if (!name || !phone || !address) {
      toast.error("Please fill name, phone & address");
      return;
    }
    const lines = items.map((i) => `${i.qty}x ${i.name} — ₹${i.price * i.qty}`).join("%0A");
    const msg =
      `Hello Koupaat, I want to order:%0A%0A${lines}%0A%0A` +
      `Total: ₹${total()}%0A%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Phone: ${encodeURIComponent(phone)}%0A` +
      `Address: ${encodeURIComponent(address)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    toast.success("Opening WhatsApp...");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-brand-ink/60 backdrop-blur-sm z-50 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-50 shadow-card transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b bg-gradient-yellow">
          <div>
            <h3 className="font-display text-2xl font-black text-brand-ink">
              Your Cart
            </h3>
            <p className="text-xs text-brand-ink/70">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-brand-ink/10 rounded-full transition-smooth"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="font-assamese text-3xl text-brand-red mb-2">খালী</p>
              <p>Your cart is empty</p>
            </div>
          )}

          {items.map((i) => (
            <div
              key={i.id}
              className="flex items-center gap-3 bg-card border rounded-2xl p-3 shadow-soft"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{i.name}</p>
                <p className="text-brand-red font-bold text-sm">
                  ₹{i.price * i.qty}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                <button
                  onClick={() => dec(i.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background transition-smooth"
                  aria-label="Decrease"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                <button
                  onClick={() => inc(i.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background transition-smooth"
                  aria-label="Increase"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => remove(i.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-smooth"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {items.length > 0 && (
            <div className="space-y-2 pt-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-card border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full bg-card border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                rows={2}
                className="w-full bg-card border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none"
              />
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-5 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-black text-brand-ink">
                ₹{total()}
              </span>
            </div>
            <button
              onClick={sendOrder}
              className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-smooth shadow-card hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </button>
            <button
              onClick={clear}
              className="w-full text-xs text-muted-foreground hover:text-destructive transition-smooth"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
