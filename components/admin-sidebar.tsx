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
import { LogOut, Newspaper, List, Users, Settings } from "lucide-react";

export default function AdminSidebar({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <SidebarProvider>
      <Sidebar className={className}>
        <SidebarHeader>
          <span className="text-xl font-bold tracking-tight">RSN Admin</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin")}
                  isActive={false}>
                  <Newspaper className="mr-2" /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/news")}
                  isActive={false}>
                  <List className="mr-2" /> News Posts
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/categories")}
                  isActive={false}>
                  <List className="mr-2" /> Categories
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/users")}
                  isActive={false}>
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
                <SidebarMenuButton onClick={() => router.push("/admin/settings")}
                  isActive={false}>
                  <Settings className="mr-2" /> Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push("/admin/logout")}
                isActive={false}>
                <LogOut className="mr-2" /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
