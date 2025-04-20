"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Calendar, Home, PlusCircle, LayoutDashboard, FileText, Share2, Settings, LogOut } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/context/AuthContext"

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
      <div className="pt-16">
        {" "}
        {/* Add padding to account for fixed navbar */}
        <SidebarProvider>
          <Sidebar className="border-r border-gray-200">
            <SidebarHeader className="py-4">
              <div className="flex items-center px-4">
                <Calendar className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-xl font-bold">Event Planner</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                        <Link href="/dashboard">
                          <Home className="h-4 w-4 mr-2" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/create"}>
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
                        <SidebarMenuButton asChild isActive={pathname === `/dashboard/${currentEventId}`}>
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
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
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
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser?.photoURL || ""} alt={currentUser?.displayName || "User"} />
                    <AvatarFallback>{currentUser?.displayName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{currentUser?.displayName || "User"}</span>
                    <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <main className="p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
