"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarFooter } from "@/components/ui/sidebar"
import { User } from "firebase/auth"

interface SidebarUserFooterProps {
  currentUser: User | null;
  onLogout: () => Promise<void>;
}

export function SidebarUserFooter({ currentUser, onLogout }: SidebarUserFooterProps) {
  return (
    <SidebarFooter>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4 group-data-[state=collapsed]/sidebar:justify-center">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={currentUser?.photoURL || ""} alt={currentUser?.displayName || "User"} />
            <AvatarFallback>{currentUser?.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden group-data-[state=collapsed]/sidebar:hidden">
            <span className="text-sm font-medium truncate">{currentUser?.displayName || "User"}</span>
            <span className="text-xs text-muted-foreground truncate">{currentUser?.email}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:p-2"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut className="h-4 w-4 mr-2 group-data-[state=collapsed]/sidebar:mr-0" />
          <span className="group-data-[state=collapsed]/sidebar:hidden">Logout</span>
        </Button>
      </div>
    </SidebarFooter>
  )
}