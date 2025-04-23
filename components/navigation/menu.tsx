// components/navigation/Menu.tsx
"use client"

import Link from 'next/link';
import { cn } from "@/lib/utils";

// Define the main navigation items
const navigationItems = [
  { name: "How it works", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  // Add more navigation items as needed
];

interface MenuProps {
  orientation?: 'horizontal' | 'vertical';
}

const Menu = ({ orientation = 'horizontal' }: MenuProps) => {
  return (
    <nav className={cn(
      "flex gap-1",
      orientation === 'horizontal' ? "flex-row" : "flex-col w-full"
    )}>
      {navigationItems.map((item) => (
        <Link 
          key={item.name}
          href={item.href} 
          className={cn(
            "text-sm font-normal rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
            orientation === 'horizontal' 
              ? "px-4 py-2"
              : "px-2 py-3 w-full"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Menu;