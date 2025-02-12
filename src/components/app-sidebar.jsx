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

export function AppSidebar({ ...props }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Erreur de vérification:', err);
      }
    };

    verifyUser();
  }, []);

  const getNavItems = () => {
    const baseItems = [
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
    ];

    if (user?.role === 'ADMIN') {
      baseItems.push({
        title: "Utilisateurs",
        url: "/users",
        icon: Users,
        items: [
          {
            title: "Liste",
            url: "/users/list",
          },
        ],
      });
    }

    return baseItems;
  };

  const getUserData = () => {
    return {
      name: user?.name || 'Utilisateur',
      email: user?.email || '',
      avatar: user?.avatar || '/avatars/default.jpg',
    };
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <Shield className="h-6 w-6" />
          <span className="font-bold">
            {user?.role === 'ADMIN' ? 'Admin Bancaire' : 'Espace Client'}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={getUserData()} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;