"use client";

import { Calendar } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link"; // Import Link from next/link
import { Logo } from "../logo";

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="flex items-center px-4 py-3 border-b">
      <div className="flex items-center justify-center w-full transition-all duration-200 ease-in-out">
        {/* Wrap the logo and text in a Link */}
        <Link href="/" className="flex items-center">
                  <img src="/image 4.svg" alt="Logo" className="h-8  w-auto" />{" "}
                  <img src="/image 5.svg" alt="Logo" className="h-8  w-auto" />{" "}
                  {/* Adjust height/width as needed */}
                </Link>
      </div>
    </SidebarHeader>
  );
}
