"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
  SidebarProvider,
} from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { LogOut, Newspaper, List, Users, Settings, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function AdminSidebar({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar className={className}>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="/RSN NEWS.jpg" alt="RSN News Logo" width={40} height={40} className="rounded-full bg-white p-1 shadow-sm" />
            <span className="text-xl font-bold tracking-tight">RSN Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin")} isActive={false}>
                  <Newspaper className="mr-2" /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/news")} isActive={false}>
                  <List className="mr-2" /> News Posts
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/categories")} isActive={false}>
                  <List className="mr-2" /> Categories
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/users")} isActive={false}>
                  <Users className="mr-2" /> Admins
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/settings")} isActive={false}>
                  <Settings className="mr-2" /> Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View site as visitor"
                className="flex items-center px-3 py-2 rounded text-indigo-700 border border-indigo-600 bg-white hover:bg-indigo-50 hover:text-indigo-900 font-semibold transition"
              >
                <ExternalLink className="mr-2" /> View Site
              </a>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("admin_session");
                    await fetch("/api/admin/logout", { method: "POST" });
                    window.location.href = "/admin-login?logout=1";
                  }
                }}
                isActive={false}
              >
                <LogOut className="mr-2" /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
