"use client";

import { Calendar } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link"; // Import Link from next/link

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="flex items-center px-4 py-4 border-b">
      <div className="flex items-center justify-center w-full transition-all duration-200 ease-in-out">
        {/* Wrap the logo and text in a Link */}
        <Link href="/" className="flex items-center">
          <Calendar className="h-6 w-6 text-primary flex-shrink-0 transition-all duration-200" />
          <h1 className="text-xl font-bold ml-2 whitespace-nowrap transition-all duration-200 ease-in-out overflow-hidden group-data-[state=collapsed]/sidebar:w-0 group-data-[state=collapsed]/sidebar:ml-0">
            Event Planner
          </h1>
        </Link>
      </div>
    </SidebarHeader>
  );
}
