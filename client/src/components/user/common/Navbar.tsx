"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AuthModal from "../Auth/AuthModal"
import { useSelector, useDispatch } from "react-redux"
import { userLogout } from "@/services/authService"
import { LogoutConfirmationDialog } from "./LogoutConformation"
import { toast } from "sonner"

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signup")
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const user = useSelector((state: any) => state.auth.user)
  const dispatch = useDispatch()
  
  const isAdmin=localStorage.getItem('adminLoggedIn')

  const openAuthModal = (tab: "signin" | "signup") => {
    setAuthModalTab(tab)
    setShowAuthModal(true)
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogout = async () => {
    const response = await userLogout(dispatch)
    if (response.status === 200) {
      localStorage.clear()
      toast.success('logout sucess')
    }
    setShowDropdown(false)
    setShowLogoutConfirmation(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <header className="w-full px-5 fixed top-0 z-40 border-b-2 border-gray-100 bg-white">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center text-[#20B486]">
              <span className="text-3xl font-bold">&lt;/&gt;</span>
              <span className="ml-1 text-lg font-bold uppercase">CODEFOLIO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link to="/" className="text-1xl font-medium text-gray-900 transition-colors hover:text-[#20B486]">
              Home
            </Link>
            <Link to="/about" className="text-1xl font-medium text-gray-900 transition-colors hover:text-[#20B486]">
              About us
            </Link>
            <Link to="/courses" className="text-1xl font-medium text-gray-900 transition-colors hover:text-[#20B486]">
              Courses
            </Link>
            <Link to="/mentors" className="text-1xl font-medium text-gray-900 transition-colors hover:text-[#20B486]">
              Mentors
            </Link>
            <Link to="/faqs" className="text-1xl font-medium text-gray-900 transition-colors hover:text-[#20B486]">
              FAQ's
            </Link>
          </nav>

          {/* Desktop Auth/Profile Section */}
          <div className="hidden items-center space-x-3 md:flex mr-20">
            {user && !isAdmin ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={
                        user.profileImageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                      }
                      alt="Profile"
                      className="object-cover w-full h-full"
                      width={30}
                      height={30}
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                  </div>
                  <h1 className="flex items-center">Hi,{user.name}</h1>
                </div>

                {/* <h1>{user}</h1> */}

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-38 rounded-md shadow-xs bg-white ring-1  ring-opacity-1 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#20B486]"
                        role="menuitem"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#20B486]"
                        role="menuitem"
                        onClick={handleLogoutClick}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal("signin")}
                  className="text-1xl font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                >
                  Sign in
                </button>
                <Button
                  className="rounded-md w-[150px] h-[50px] bg-[#20B486] text-sm text-white hover:bg-[#1a9d75]"
                  onClick={() => openAuthModal("signup")}
                >
                  Create account
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col space-y-4 pt-6">
                <Link
                  to="/"
                  className="text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                  onClick={() => setIsOpen(false)}
                >
                  About us
                </Link>
                <Link
                  to="/courses"
                  className="text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                  onClick={() => setIsOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/mentors"
                  className="text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                  onClick={() => setIsOpen(false)}
                >
                  Mentors
                </Link>
                <Link
                  to="/faqs"
                  className="text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ's
                </Link>

                <div className="pt-4">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block py-2 text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="block py-2 text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                        onClick={() => {
                          setIsOpen(false)
                          handleLogoutClick()
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="block py-2 text-base font-medium text-gray-900 transition-colors hover:text-[#20B486]"
                        onClick={() => {
                          setIsOpen(false)
                          openAuthModal("signin")
                        }}
                      >
                        Sign in
                      </button>
                      <Button
                        className="mt-2 w-full rounded-md bg-[#20B486] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a9d75]"
                        onClick={() => {
                          setIsOpen(false)
                          openAuthModal("signup")
                        }}
                      >
                        Create free account
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}

export default Navbar

