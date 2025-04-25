"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon, LogOut, XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "../ui/button";
import Menu from "./menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import the SVG logo
import Logo from "@/public/image 4.svg"; // Adjust the path based on where you place the SVG file

const Navbar = () => {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Don't render navbar on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Determine authentication directly from currentUser
  const isAuthenticated = !!currentUser;

  console.log("Auth state in Navbar:", { isAuthenticated, currentUser });

  return (
    <>
      <div className="relative w-full h-full">
        <header
          className={cn(
            "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-[100]",
            isOpen ? "h-auto" : "h-12"
          )}
        >
          <div className="backdrop-blur-lg rounded-xl lg:rounded-2xl border border-[rgba(124,124,124,0.2)] px-4 flex flex-col">
            {/* Main Navbar Row */}
            <div className="flex items-center justify-between w-full py-2">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <img src={Logo.src} alt="Logo" className="h-8 w-auto" />{" "}
                  {/* Adjust height/width as needed */}
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex ml-4">
                  <Menu orientation="horizontal" />
                </div>
              </div>

              {/* Auth Section */}
              <div className="flex items-center gap-2 lg:gap-4">
                {isAuthenticated ? (
                  <>
                    {/* User is logged in */}
                    <Button
                      size="sm"
                      variant="default"
                      asChild
                      className="hidden sm:flex"
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={currentUser?.photoURL || ""}
                          alt={currentUser?.displayName || "User"}
                        />
                        <AvatarFallback>
                          {currentUser?.displayName?.[0] ||
                            currentUser?.email?.[0]?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MenuIcon className="h-4 w-4" />
                            <span className="sr-only">User menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mt-2 w-56">
                          <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {currentUser?.displayName || "User"}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {currentUser?.email}
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard">Dashboard</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      asChild
                      className="hidden sm:flex"
                    >
                      <Link href="/auth/login">
                      Login
                        <ArrowRightIcon className="w-4 h-4 ml-2 hidden lg:block" />
                      </Link>
                    </Button>
                  </>
                )}

                {/* Mobile menu toggle */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="lg:hidden p-2 w-8 h-8"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? (
                    <XIcon className="w-4 h-4" />
                  ) : (
                    <MenuIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
              <div className="lg:hidden py-4 border-t border-border/30 animate-in fade-in slide-in-from-top duration-300">
                {/* Mobile Navigation Links */}
                <div className="mb-4">
                  <Menu orientation="vertical" />
                </div>

                {/* Auth Actions for Mobile */}
                <div className="space-y-2 pt-2 border-t border-border/30">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={currentUser?.photoURL || ""}
                            alt={currentUser?.displayName || "User"}
                          />
                          <AvatarFallback>
                            {currentUser?.displayName?.[0] ||
                              currentUser?.email?.[0]?.toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate">
                            {currentUser?.displayName || "User"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {currentUser?.email}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="w-full"
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="w-full"
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="w-full"
                      >
                        <Link href="/auth/signup">
                          Start for free
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
