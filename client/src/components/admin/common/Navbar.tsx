"use client"
import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userLogout } from "@/services/authService"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { LogoutConfirmationDialog } from "@/components/user/common/LogoutConformation"
import { useState } from "react"
import { ModeToggle } from "@/components/theme/mode-toggle"

interface NavbarProps {
  onMenuButtonClick: () => void
}

export function Navbar({ onMenuButtonClick }: NavbarProps) {

  const dispatch=useDispatch()
const [isOpen, setIsOpen] = useState<boolean>(false)
 const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false)

 const handleLogoutClick = () => {
  setShowLogoutConfirmation(true)
}

const handleLogout= async ()=>{

  const response= await userLogout(dispatch)
  if (response.status === 200) {
    localStorage.clear()
    toast.success('logout sucess')
  }
  setShowLogoutConfirmation(false)
}
 


  return (
    <header className="border-b ">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuButtonClick} className="mr-2 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold ">Good Morning</h1>
            <p className="text-sm ">Welcome to Codefolio Admin</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search..." className="w-64 pl-8" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle/>
        </div>
      </div>
       {/* Logout Confirmation Dialog */}
            <LogoutConfirmationDialog
              isOpen={showLogoutConfirmation}
              onClose={() => setShowLogoutConfirmation(false)}
              onConfirm={handleLogout}
            />
    </header>
  )
}

