"use client"

import { useState } from "react"
import { Menu, X, Bell, ChevronDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import type { IMentor } from "@/types/mentor"
import { ModeToggle } from "../theme/mode-toggle"
import { RootState, useAppSelector } from "@/redux/store"
import { useNavigate } from "react-router-dom"

// interface NavbarProps {
//   mentor: IMentor
// }

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

 const { mentor } = useAppSelector((state: RootState) => state.mentor);

 const navigate=useNavigate()

 if(!mentor){
  return <div>no mentor found</div>
 }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-secondary shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-emerald-500">Codefolio</h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-emerald-500 rounded-full"></span>
            </Button>
            <ModeToggle/>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mentor.profileImage} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{mentor.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>navigate('/')} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span >Go to User</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="justify-start">
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start">
                Profile
              </Button>
              <Button variant="ghost" className="justify-start">
                Availability
              </Button>
              <Button variant="ghost" className="justify-start">
                Bookings
              </Button>
              <Button variant="ghost" className="justify-start">
                Wallet
              </Button>
              <Button variant="ghost" className="justify-start">
                Settings
              </Button>
              <Button variant="ghost" className="justify-start text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

