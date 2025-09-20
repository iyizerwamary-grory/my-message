
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Settings, Users, ChevronLeftSquare, GalleryHorizontal, FolderArchive } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth
import { MessageSquare } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth(); // Get current user state

  const adminEmail = "jeandedieuishimwe109@gmail.com";

  const navItems = [
    { href: "/chat", label: "Chats", icon: MessageSquare, show: true },
    { href: "/story", label: "Story", icon: GalleryHorizontal, show: true },
    { href: "/files", label: "Files", icon: FolderArchive, show: !!user && user.email === adminEmail },
    { href: "/settings", label: "Settings", icon: Settings, show: !!user },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 justify-between items-center">
          <Link href="/chat" className="flex items-center gap-2 text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xl font-bold text-primary-foreground">R</div>
            <span>RippleChat</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="group-data-[collapsible=icon]:hidden">
            <ChevronLeftSquare />
          </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.filter(item => item.show).map((item) => ( // Filter items based on show condition
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label, side:"right" }}
                  aria-label={item.label}
                >
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
