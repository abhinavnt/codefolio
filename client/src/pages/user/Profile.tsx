"use client"

import { Courses } from "@/components/user/profile/Courses"
import { Dashboard } from "@/components/user/profile/DashBoard"
import { ProfileHeader } from "@/components/user/profile/Profile-header"
import { ProfileMenu } from "@/components/user/profile/Profile-menu"
import { Mentors } from "@/components/user/profile/Mentors"
import { useState } from "react"
import { Message } from "@/components/user/profile/Message"
import { Wishlist } from "@/components/user/profile/Wishlist"
import { PurchaseHistory } from "@/components/user/profile/Purchase-history"
import { Settings } from "@/components/user/profile/Settings"
import Navbar from "@/components/user/common/Navbar"
import Footer from "@/components/user/common/Footer"

// Dummy data that will be replaced with backend data
const dummyUser = {
  id: "user123",
  firstName: "Kevin",
  lastName: "Gilbert",
  fullName: "Kevin Gilbert",
  username: "kevingilbert",
  email: "kevin.gilbert@example.com",
  title: "Web Designer & Best-Selling Instructor",
  bio: "Creating beautiful web experiences",
  profileImage: "/placeholder.svg?height=300&width=300",
  isInstructor: false,
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("Settings")

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Navbar />
      </div>

      {/* Main Content with padding for fixed navbar */}
      <div className="flex-1 pt-30">
        {" "}
        {/* Adjust this padding based on your navbar height */}
        {/* Header Section */}
        <ProfileHeader/>
        {/* Navigation Tabs */}
        <ProfileMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Main Content */}
        <div className="container mx-auto px-4">
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab === "Courses" && <Courses />}
          {activeTab === "Teachers" && <Mentors />}
          {activeTab === "Message" && <Message />}
          {activeTab === "Wishlist" && <Wishlist />}
          {activeTab === "Purchase History" && <PurchaseHistory />}
          {activeTab === "Settings" && <Settings/>}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

