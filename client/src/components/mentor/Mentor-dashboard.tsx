"use client"

import { useState } from "react"
import { Navbar } from "./NavBar" 
import { ProfileSettings } from "./Profile-setting" 
import { Availability } from "./Availability" 
// import { MainDashboa } 
import { Bookings } from "./Bookings" 
import { Wallet } from "./Wallet" 
import { UpcomingReviews } from "./Upcomming-review" 
import { ConductedReviews } from "./Conducted-reviews" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { IMentor } from "@/types/mentor"
import { MainDashboard } from "./Main-dashboard"

// Dummy mentor data
const dummyMentor = {
  userId: "m123456",
  profileImage: "/placeholder.svg?height=200&width=200",
  name: "Jane Smith",
  username: "janesmith",
  email: "jane.smith@example.com",
  phoneNumber: "+1 (555) 123-4567",
  dateOfBirth: new Date("1985-05-15"),
  yearsOfExperience: 8,
  currentCompany: "Tech Innovations Inc.",
  currentRole: "Senior Software Engineer",
  durationAtCompany: "3 years",
  resume: "jane-smith-resume.pdf",
  technicalSkills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL"],
  primaryLanguage: "English",
  bio: "Experienced software engineer with a passion for mentoring junior developers. Specialized in frontend development with React and TypeScript.",
  linkedin: "https://linkedin.com/in/janesmith",
  github: "https://github.com/janesmith",
  twitter: "https://twitter.com/janesmith",
  instagram: "https://instagram.com/janesmith",
  status: "active",
  title: "Senior Software Engineer & Mentor",
  reviewTakenCount: 42,
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
}

export function MentorDashboard() {
  const [mentor, setMentor] = useState<any>(dummyMentor)
  const [activeTab, setActiveTab] = useState("dashboard")

  const updateMentor = (updatedMentor: IMentor) => {
    setMentor(updatedMentor)
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar  />
      <div className="container mx-auto px-4 pt-20 pb-10">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-8 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="conducted">Conducted</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <MainDashboard mentor={mentor} />
          </TabsContent>
          <TabsContent value="upcoming">
            <UpcomingReviews />
          </TabsContent>
          <TabsContent value="conducted">
            <ConductedReviews />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="availability">
            <Availability />
          </TabsContent>
          <TabsContent value="bookings">
            <Bookings />
          </TabsContent>
          <TabsContent value="wallet">
            <Wallet />
          </TabsContent>
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-500">Account settings will be available soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

