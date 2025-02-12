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

// Fonction pour décoder le token JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Fonction pour obtenir le rôle depuis les cookies
const getUserRole = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  if (!tokenCookie) return null;
  
  const token = tokenCookie.split('=')[1];
  const decodedToken = parseJwt(token);
  
  return decodedToken?.role || null;
};

export function AppSidebar({ ...props }) {
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  // Définition des éléments de navigation en fonction du rôle
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

    // Ajouter les éléments réservés à l'admin
    if (userRole === 'ADMIN') {
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
    if (userRole === 'ADMIN') {
      return {
        name: "Admin",
        email: "admin@banque.com",
        avatar: "/avatars/admin.jpg",
      };
    }
    return {
      name: "Utilisateur",
      email: "user@banque.com",
      avatar: "/avatars/user.jpg",
    };
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <Shield className="h-6 w-6" />
          <span className="font-bold">
            {userRole === 'ADMIN' ? 'Admin Bancaire' : 'Espace Client'}
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