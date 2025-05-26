
import { useEffect, useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { getAllMentors, toggleMentorStatus } from "@/services/adminService"
import { UserDetailDialog } from "../re-usable/user-detail-dialog"
import { DataTable } from "../re-usable/data-table"

export interface IMentorData {
  _id: string
  userId: string
  profileImage?: string
  name: string
  username: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  yearsOfExperience: number
  currentCompany: string
  currentRole: string
  durationAtCompany: string
  resume: string
  technicalSkills: string[]
  primaryLanguage: string
  bio: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  status: "active" | "inactive"
  submittedAt: Date
  updatedAt?: Date
  title?: string
  reviewTakenCount?: number
  phone?: string
  location?: string
  createdAt: Date
}

export function AllMentors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expertiseFilter, setExpertiseFilter] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState<IMentorData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [mentors, setMentors] = useState<IMentorData[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 5
 

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { MentorData, total, totalPages } = await getAllMentors(currentPage, itemsPerPage)
        setMentors(MentorData)
        setTotalPages(totalPages)
        setTotalItems(total)
      } catch (error) {
        console.error("Error fetching mentors:", error)
        setMentors([])
        setTotalPages(0)
        setTotalItems(0)
      }
    }
    fetchMentors()
  }, [currentPage])

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || mentor.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesExpertise = expertiseFilter === "all" || mentor.technicalSkills.includes(expertiseFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesExpertise
  })

  const handleViewDetails = (mentor: IMentorData) => {
    setSelectedMentor(mentor)
  }

  const handleStatusChange = async (mentorId: string, newStatus: "active" | "inactive") => {
    try {
      const response = await toggleMentorStatus(mentorId, newStatus)
      if (response?.status == 200) {
        setMentors(mentors.map((mentor) => (mentor._id === mentorId ? { ...mentor, status: newStatus } : mentor)))
        toast.success(`Mentor ${newStatus === "inactive" ? "blocked" : "unblocked"} successfully`)
      } else {
        toast.error("Failed to update mentor status")
      }

      // Update selected mentor if its the one modified
      if (selectedMentor && selectedMentor._id === mentorId) {
        setSelectedMentor({ ...selectedMentor, status: newStatus })
      }
    } catch (error) {
      console.error("Failed to update mentor status:", error)
      toast.error("Failed to update mentor status")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "status") {
      setStatusFilter(value)
    } else if (filterId === "expertise") {
      setExpertiseFilter(value)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-emerald-500 hover:bg-emerald-600"
      : status === "inactive"
        ? "bg-red-500 hover:bg-red-600"
        : "bg-gray-500"
  }

  const columns = [
    { key: "user", title: "Mentor" },
    {
      key: "title",
      title: "Expertise",
      hidden: true,
      render: (mentor: IMentorData) => mentor.title || "Not Available",
    },
    { key: "status", title: "Status" },
    {
      key: "reviewTakenCount",
      title: "Review Taken",
      hidden: true,
      render: (mentor: IMentorData) => mentor.reviewTakenCount || "0",
    },
    { key: "primaryLanguage", title: "Language", hidden: true },
  ]

  const filters = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
      ],
      defaultValue: "all",
    },
    {
      id: "expertise",
      label: "Expertise",
      options: [
        { value: "all", label: "All" },
        { value: "web", label: "Web Development" },
        { value: "data", label: "Data Science" },
        { value: "mobile", label: "Mobile Development" },
        { value: "ui", label: "UI/UX Design" },
        { value: "devops", label: "DevOps" },
        { value: "cyber", label: "Cybersecurity" },
        { value: "blockchain", label: "Blockchain" },
        { value: "game", label: "Game Development" },
        { value: "ai", label: "AI & Machine Learning" },
        { value: "cloud", label: "Cloud Computing" },
      ],
      defaultValue: "all",
    },
  ]

  const renderActions = (mentor: IMentorData) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(mentor)}>
          View Details
        </Button>
      </DialogTrigger>
      <UserDetailDialog
        user={selectedMentor}
        onStatusChange={(id, status) => handleStatusChange(id, status as "active" | "inactive")}
        getStatusColor={getStatusColor}
      />
    </Dialog>
  )

  return (
    <DataTable
      title="All Mentors"
      description="Manage all mentors registered on the platform."
      data={filteredMentors}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search mentors..."
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      renderActions={renderActions}
      getItemIdentifier={(mentor) => mentor._id}
      getItemName={(mentor) => mentor.name}
      getItemEmail={(mentor) => mentor.email}
      getItemImage={(mentor) => mentor.profileImage || ""}
      getItemStatus={(mentor) => mentor.status}
    />
  )
}
