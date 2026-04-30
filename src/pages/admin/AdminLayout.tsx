import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Utensils, FolderTree, Settings, LogOut, Home, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

const items = [
  { title: "Menu Items", url: "/admin", icon: Utensils, end: true },
  { title: "Categories", url: "/admin/categories", icon: FolderTree },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate("/auth");
  }, [session, loading, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-4">
          <ShieldAlert className="w-12 h-12 mx-auto text-brand-red" />
          <h2 className="font-display text-2xl font-black">Not an admin</h2>
          <p className="text-muted-foreground">
            Your account doesn't have admin access. Ask the owner to grant you the
            admin role.
          </p>
          <button onClick={signOut} className="text-brand-red font-semibold hover:underline">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <div className="leading-tight group-data-[collapsible=icon]:hidden">
                <p className="font-assamese text-brand-ink text-lg">কৌপাত</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Admin
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.end}
                          className={({ isActive }) =>
                            `flex items-center gap-2 ${
                              isActive ? "bg-brand-yellow/30 text-brand-ink font-semibold" : ""
                            }`
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t space-y-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" /> <span>View site</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut}>
                  <LogOut className="h-4 w-4" /> <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b bg-card px-4 sticky top-0 z-30">
            <SidebarTrigger />
            <h1 className="font-display text-lg font-bold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
