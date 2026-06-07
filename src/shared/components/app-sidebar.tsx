"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  TrendingUp,
  Cloud,
  Flame,
  LayoutDashboard,
  BookOpen,
  Wrench,
  FileText,
  Rss,
  Coins,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "News", href: "/news", icon: Newspaper },
  { title: "Stock", href: "/stock", icon: TrendingUp },
  { title: "GitHub", href: "/github", icon: Flame },
  { title: "arXiv", href: "/arxiv", icon: FileText },
  { title: "Dev.to", href: "/devto", icon: Rss },
  { title: "Crypto", href: "/crypto", icon: Coins },
  { title: "Hacker News", href: "/hacker-news", icon: Zap },
  { title: "Weather", href: "/weather", icon: Cloud },
  { title: "System", href: "/system", icon: Wrench },
  { title: "Swagger Docs", href: "/docs", icon: BookOpen, external: true },
];

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            S
          </div>
          <span className="text-lg font-semibold">ScoopHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                {item.external ? (
                  <SidebarMenuButton
                    render={<a href={item.href} target="_blank" rel="noopener noreferrer" />}
                    className="cursor-pointer transition-colors duration-200"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                    className="cursor-pointer transition-colors duration-200"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function Header() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="cursor-pointer transition-colors duration-200" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
