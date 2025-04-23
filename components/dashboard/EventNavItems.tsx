"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  Share2,
  GitBranch,
  FileOutput,
  Clock,
  DollarSign,
  CheckSquare,
  PlusCircle
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

interface EventNavItemsProps {
  pathname: string;
  currentEventId: string;
}

export function EventNavItems({ pathname, currentEventId }: EventNavItemsProps) {
  return (
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
          
          {/* Event Data Menu Item with sub-items */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={
                pathname.includes(`/dashboard/${currentEventId}`) && 
                (pathname.includes("?tab=details") || 
                 pathname.includes("?tab=schedule") || 
                 pathname.includes("?tab=budget") || 
                 pathname.includes("?tab=tasks"))
              }
              tooltip="Event Data"
            >
              <Link href={`/dashboard/${currentEventId}?tab=details`}>
                <FileOutput className="h-4 w-4 mr-2" />
                <span>Event Data</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Schedule sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=schedule`)}
              tooltip="Schedule"
              className="pl-8"
            >
              <Link href={`/dashboard/${currentEventId}?tab=schedule`}>
                <Clock className="h-4 w-4 mr-2" />
                <span>Schedule</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Budget sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=budget`)}
              tooltip="Budget"
              className="pl-8"
            >
              <Link href={`/dashboard/${currentEventId}?tab=budget`}>
                <DollarSign className="h-4 w-4 mr-2" />
                <span>Budget</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Tasks sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=tasks`)}
              tooltip="Tasks"
              className="pl-8"
            >
              <Link href={`/dashboard/${currentEventId}?tab=tasks`}>
                <CheckSquare className="h-4 w-4 mr-2" />
                <span>Tasks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Event Flow Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=flow`)}
              tooltip="Event Flow"
            >
              <Link href={`/dashboard/${currentEventId}?tab=flow`}>
                <GitBranch className="h-4 w-4 mr-2" />
                <span>Event Flow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Documents Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={
                pathname.includes(`/dashboard/${currentEventId}`) && 
                (pathname.includes("?tab=documents") || 
                 pathname.includes("?tab=view-documents"))
              }
              tooltip="Documents"
            >
              <Link href={`/dashboard/${currentEventId}?tab=documents`}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Documents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Create Documents sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=documents`)}
              tooltip="Create Documents"
              className="pl-8"
            >
              <Link href={`/dashboard/${currentEventId}?tab=documents`}>
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Create Documents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* View Documents sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=view-documents`)}
              tooltip="View Documents"
              className="pl-8"
            >
              <Link href={`/dashboard/${currentEventId}?tab=view-documents`}>
                <FileText className="h-4 w-4 mr-2" />
                <span>View Documents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Social Media Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=social`)}
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
  )
}