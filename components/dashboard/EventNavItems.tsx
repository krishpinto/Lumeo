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
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          
          {/* Event Data as a section header */}
          <div className="mt-6 mb-2">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <FileOutput className="h-4 w-4 mr-2 text-gray-500" />
                <span>Event Data</span>
              </div>
            </h3>
          </div>
          
          {/* Schedule sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=schedule`)}
              tooltip="Schedule"
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
          
          {/* Documents as a section header */}
          <div className="mt-6 mb-2">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span>Documents</span>
              </div>
            </h3>
          </div>
          
          {/* Create Documents sub-item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(`/dashboard/${currentEventId}?tab=documents`)}
              tooltip="Create Documents"
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
            >
              <Link href={`/dashboard/${currentEventId}?tab=view-documents`}>
                <FileText className="h-4 w-4 mr-2" />
                <span>View Documents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}