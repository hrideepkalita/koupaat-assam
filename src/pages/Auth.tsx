import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin · Koupaat";
    if (!loading && session) navigate("/admin");
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — you can sign in now.");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-yellow p-6">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-card p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center"><Logo size={64} /></div>
          <h1 className="font-display text-3xl font-black text-brand-ink">
            {mode === "signin" ? "Admin Login" : "Create Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to manage your menu"
              : "First account becomes the owner / admin"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="w-full bg-background border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brand-ink text-brand-yellow font-bold py-3.5 rounded-xl hover:scale-[1.01] transition-smooth flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-brand-red font-semibold hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>

        <a href="/" className="block text-center text-xs text-muted-foreground hover:text-brand-ink transition-smooth">
          ← Back to website
        </a>
      </div>
    </div>
  );
};

export default Auth;
