"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  Home,
  PlusCircle,
  LayoutDashboard,
  FileText,
  Share2,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"

import { HeroHeader } from "@/components/navbar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/context/AuthContext"

// Custom sidebar toggle button component that uses useSidebar hook
function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="absolute right-0 top-4 z-30 translate-x-1/2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full border border-gray-200 bg-white shadow-md"
        onClick={toggleSidebar}
      >
        <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-data-[state=collapsed]/sidebar:rotate-180" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect is handled in the Dashboard component
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Get the current event ID from the path if available
  const eventIdMatch = pathname.match(/\/dashboard\/([^/]+)/)
  const currentEventId = eventIdMatch ? eventIdMatch[1] : null

  // Check if we're on an event-specific page
  const isEventPage = currentEventId && currentEventId !== "create"

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroHeader />
      <div className="pt-0">
        {" "}
        {/* Add padding to account for fixed navbar */}
        <SidebarProvider>
          <Sidebar className="border-r pt-16 border-gray-200 group/sidebar" collapsible="icon">
            <SidebarHeader className="py-4">
              <div className="flex items-center px-4 group-data-[collapsible=icon]:justify-center">
                <Calendar className="h-6 w-6 text-primary mr-2 group-data-[collapsible=icon]:mr-0" />
                <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">Event Planner</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                        <Link href="/dashboard">
                          <Home className="h-4 w-4 mr-2" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/create"} tooltip="Create Event">
                        <Link href="/dashboard/create">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          <span>Create Event</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {isEventPage && (
                <SidebarGroup>
                  <SidebarGroupLabel>Current Event</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/dashboard/${currentEventId}`}
                          tooltip="Overview"
                        >
                          <Link href={`/dashboard/${currentEventId}`}>
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            <span>Overview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            pathname.includes(`/dashboard/${currentEventId}`) && pathname.includes("?tab=documents")
                          }
                          tooltip="Documents"
                        >
                          <Link href={`/dashboard/${currentEventId}?tab=documents`}>
                            <FileText className="h-4 w-4 mr-2" />
                            <span>Documents</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            pathname.includes(`/dashboard/${currentEventId}`) && pathname.includes("?tab=social")
                          }
                          tooltip="Social Media"
                        >
                          <Link href={`/dashboard/${currentEventId}?tab=social`}>
                            <Share2 className="h-4 w-4 mr-2" />
                            <span>Social Media</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              <SidebarGroup>
                <SidebarGroupLabel>Account</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"} tooltip="Settings">
                        <Link href="/dashboard/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser?.photoURL || ""} alt={currentUser?.displayName || "User"} />
                    <AvatarFallback>{currentUser?.displayName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{currentUser?.displayName || "User"}</span>
                    <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 mr-2 group-data-[collapsible=icon]:mr-0" />
                  <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </Button>
              </div>
            </SidebarFooter>
            <SidebarRail />
            {/* Render the custom toggle button component inside the SidebarProvider context */}
            <SidebarToggleButton />
          </Sidebar>
          <SidebarInset>
            <main className="p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
