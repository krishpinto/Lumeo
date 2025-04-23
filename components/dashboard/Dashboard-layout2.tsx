"use client";

import type React from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/app/context/AuthContext";

// Import our separated sidebar components
import { SidebarToggleButton } from "@/components/dashboard/SidebarToggleButton";
import { AppSidebarHeader } from "@/components/dashboard/SidebarHeader";
import { MainNavItems } from "@/components/dashboard/MainNavItems";
import { EventNavItems } from "@/components/dashboard/EventNavItems";
import { SidebarUserFooter } from "@/components/dashboard/SidebarUserFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect is handled in the Dashboard component
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get the current event ID from the path if available
  const eventIdMatch = pathname.match(/\/dashboard\/([^/]+)/);
  const currentEventId = eventIdMatch ? eventIdMatch[1] : null;

  // Check if we're on an event-specific page
  const isEventPage = currentEventId && currentEventId !== "create";

  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <Sidebar
          className="border-r group/sidebar flex flex-col h-screen max-h-screen"
          collapsible="icon"
        >
          {/* Header component */}
          <AppSidebarHeader />

          {/* Content with navigation items */}
          <SidebarContent className="flex-grow overflow-auto py-2">
            {/* Main navigation */}
            <MainNavItems pathname={pathname} />

            {/* Event-specific navigation */}
            {isEventPage && (
              <EventNavItems
                pathname={pathname}
                currentEventId={currentEventId}
              />
            )}
          </SidebarContent>

          {/* User profile and logout */}
          <SidebarUserFooter
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Rail and toggle button */}
          <SidebarRail />
          <SidebarToggleButton />
        </Sidebar>

        {/* Main content area */}
        <SidebarInset className="flex-grow">
          <main className="p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
