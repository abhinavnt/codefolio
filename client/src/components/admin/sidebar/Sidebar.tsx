"use client"

import { Link } from "react-router-dom"
import {
  BarChart3,
  Users,
  GraduationCap,
  FileQuestion,
  PlusCircle,
  BookOpen,
  // Settings,
  X,
  type LucideIcon,
} from "lucide-react"

// Define types
interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  activePath?: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "All Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "All Mentors",
    href: "/admin/mentors",
    icon: GraduationCap,
  },
  {
    title: "Mentor Requests",
    href: "/admin/mentor-requests",
    icon: FileQuestion,
  },
  {
    title: "Add Courses",
    href: "/admin/add-course",
    icon: PlusCircle,
  },
  {
    title: "Course Enrolled Users",
    href: "/admin/enrolled-users",
    icon: Users,
  },
  {
    title: "Course Management",
    href: "/admin/course-management",
    icon: BookOpen,
  },
  // {
  //   title: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
]

// Simple utility function to combine class names
const cn = (...classes: (string | undefined | boolean)[]): string => classes.filter(Boolean).join(" ")

export function Sidebar({ open, setOpen, activePath = "/" }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/admin" className="flex items-center">
          <span className="text-xl font-bold text-white">Codefolio</span>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                activePath === item.href
                  ? "bg-emerald-500 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

