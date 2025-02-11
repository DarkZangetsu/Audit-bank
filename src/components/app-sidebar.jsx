"use client"

import * as React from "react"
import {
  Users,
  History,
  Shield,
  BanknoteIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@banque.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Gestion des Comptes",
      url: "/accounts",
      icon: BanknoteIcon,
      isActive: true,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/accounts",
        },
      ],
    },
    {
      title: "Audit",
      url: "/audit",
      icon: History,
      items: [
        {
          title: "Journal des Opérations",
          url: "/audit/log",
        },
      ],
    },
    {
      title: "Utilisateurs",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Liste",
          url: "/users/list",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <Shield className="h-6 w-6" />
          <span className="font-bold">Admin Bancaire</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar;