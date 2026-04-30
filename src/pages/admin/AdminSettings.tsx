import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const AdminSettings = () => {
  const [id, setId] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setId(data.id);
          setWhatsapp(data.whatsapp_number);
          setTemplate(data.message_template);
        }
        setLoading(false);
      });
  }, []);

  const save = async () => {
    if (!/^\d{10,15}$/.test(whatsapp)) {
      return toast.error("WhatsApp number must be 10–15 digits, country code first, no +");
    }
    setSaving(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ whatsapp_number: whatsapp, message_template: template })
      .eq("id", id!);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
    setSaving(false);
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin" />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-3xl font-black">Order Settings</h2>
        <p className="text-sm text-muted-foreground">
          Where customers' WhatsApp orders are sent
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-soft space-y-4">
        <div>
          <label className="text-sm font-semibold text-brand-ink">
            WhatsApp Number
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Country code first, no +, no spaces. E.g. <code>918822821202</code>
          </p>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
            placeholder="918822821202"
            className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow font-mono"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-ink">
            Order Message Greeting
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Appears at the top of the WhatsApp order message
          </p>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={2}
            className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-brand-ink text-brand-yellow font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01] transition-smooth"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
