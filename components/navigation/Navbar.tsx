"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon, LogOut, XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "../ui/button";
import Menu from "./menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import the SVG logo
import Logo from "@/public/image 4.svg"; // Adjust the path based on where you place the SVG file

const Navbar = () => {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Don't render navbar on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Determine authentication directly from currentUser
  const isAuthenticated = !!currentUser;

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
                  <img src={Logo.src} alt="Logo" className="h-8 w-auto" />
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

                      {/* Manual dropdown implementation with dark theme */}
                      <div className="relative" ref={dropdownRef}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 focus:ring-0 focus:ring-offset-0"
                          onClick={toggleDropdown}
                          aria-expanded={isDropdownOpen}
                          aria-haspopup="true"
                        >
                          <MenuIcon className="h-4 w-4" />
                          <span className="sr-only">User menu</span>
                        </Button>
                        
                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-56 rounded-md bg-black/80 backdrop-blur-lg border border-gray-700 shadow-lg ring-1 ring-gray-700 focus:outline-none z-50">
                            <div className="px-4 py-3">
                              <p className="text-sm font-medium text-white">
                                {currentUser?.displayName || "User"}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {currentUser?.email}
                              </p>
                            </div>
                            <div className="border-t border-gray-700"></div>
                            <div className="py-1">
                              <Link 
                                href="/dashboard" 
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 w-full text-left"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                Dashboard
                              </Link>
                            </div>
                            <div className="border-t border-gray-700"></div>
                            <div className="py-1">
                              <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-800 w-full text-left flex items-center"
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* User is not logged in */}
                    
                    <Button
                      size="sm"
                      variant="default"
                      asChild
                      className="hidden sm:flex"
                    >
                      <Link href="/auth/login">
                        Start for free
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
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
                        className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-gray-800"
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
                        variant="default"
                        asChild
                        className="w-full"
                      >
                        <Link href="/auth/login">
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