"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Menu, X, Home, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-indigo-800 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">EventCy</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/home">
              <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-purple-700 hover:text-white"
                  onClick={() => router.push("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-purple-700 hover:text-white"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <Button variant="ghost" className="text-white" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/home">
              <Button variant="ghost" className="w-full text-left text-white hover:bg-purple-700 hover:text-white">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full text-left text-white hover:bg-purple-700 hover:text-white"
                  onClick={() => router.push("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left text-white hover:bg-purple-700 hover:text-white"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="w-full text-left text-white hover:bg-purple-700 hover:text-white">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
