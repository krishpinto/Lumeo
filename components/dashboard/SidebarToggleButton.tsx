"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarToggleButton() {
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