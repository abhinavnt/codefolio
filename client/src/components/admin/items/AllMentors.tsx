"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getAllMentors } from "@/services/adminService"

export interface IMentorData {
  _id: string
  userId: string;
  profileImage?: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  yearsOfExperience: number;
  currentCompany: string;
  currentRole: string;
  durationAtCompany: string;
  resume: string;
  technicalSkills: string[];
  primaryLanguage: string;
  bio: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  status: "active" | "inactive";
  submittedAt: Date;
  updatedAt?: Date;
  // availableTimeSlots?: IAvailableTimeSlot[];
  title?: string;
  reviewTakenCount?: number;
  phone?: string;
  location?: string;
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
        console.log(MentorData, "mentor data")
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

  // Filter mentors based on search term and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || mentor.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesExpertise = expertiseFilter === "all" || mentor.technicalSkills.includes(expertiseFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesExpertise
  })

  // Calculate pagination
  // const totalPages = Math.ceil(filteredMentors.length / itemsPerPage)
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)
  // const currentItems = filteredMentors.slice(indexOfFirstItem, indexOfLastItem)

  const handleViewDetails = (mentor: IMentorData) => {
    setSelectedMentor(mentor)
  }

  const handleStatusChange = async (mentorId: string, newStatus: "active" | "inactive") => {
    try {
      // Replace with your actual API call to update mentor status
      // const response = await toggleMentorStatus(mentorId);

      // For now, just update the local state
      setMentors(mentors.map((mentor) => (mentor._id === mentorId ? { ...mentor, status: newStatus } : mentor)))

      // Update selected mentor if it's the one being modified
      if (selectedMentor && selectedMentor._id === mentorId) {
        setSelectedMentor({ ...selectedMentor, status: newStatus })
      }

      // Show success message
      // toast.success(`Mentor ${newStatus === "inactive" ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      console.error("Failed to update mentor status:", error)
      // toast.error("Failed to update mentor status");
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">All Mentors</h2>
        <Button>Add New Mentor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Management</CardTitle>
          <CardDescription>Manage all mentors registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search mentors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="expertise-filter">Expertise:</Label>
                <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                  <SelectTrigger id="expertise-filter" className="w-40">
                    <SelectValue placeholder="Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="ui">UI/UX Design</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="cyber">Cybersecurity</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="game">Game Development</SelectItem>
                    <SelectItem value="ai">AI & Machine Learning</SelectItem>
                    <SelectItem value="cloud">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead className="hidden md:table-cell">Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Review Taken</TableHead>
                  {/* <TableHead className="hidden md:table-cell">Courses</TableHead> */}
                  <TableHead className="hidden md:table-cell">Language</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMentors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No mentors found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMentors.map((mentor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={mentor.profileImage} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{mentor.name}</div>
                            <div className="text-sm text-muted-foreground">{mentor.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{mentor.title || "Not Available"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            mentor.status === "active"
                              ? "default"
                              : mentor.status === "inactive"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {mentor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{mentor.reviewTakenCount || "0"}</TableCell>
                      {/* <TableCell className="hidden md:table-cell">0</TableCell> */}
                      <TableCell className="hidden md:table-cell">{mentor.primaryLanguage}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(mentor)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Mentor Details</DialogTitle>
                              <DialogDescription>Detailed information about the mentor.</DialogDescription>
                            </DialogHeader>
                            {selectedMentor && (
                              <div className="grid gap-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedMentor.profileImage} alt={selectedMentor.name} />
                                    <AvatarFallback>
                                      {selectedMentor.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-bold">{selectedMentor.name}</h3>
                                    <p className="text-muted-foreground">{selectedMentor.email}</p>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label>Title</Label>
                                    <p className="text-sm">{selectedMentor.title||"no title"}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p className="text-sm">
                                      <Badge
                                        variant={
                                          selectedMentor.status === "active"
                                            ? "default"
                                            : selectedMentor.status === "inactive"
                                              ? "secondary"
                                              : "destructive"
                                        }
                                      >
                                        {selectedMentor.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Join Date</Label>
                                    <p className="text-sm">
                                      {new Date(selectedMentor.createdAt).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                        timeZone: "Asia/Kolkata",
                                      })}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Language</Label>
                                    <p className="text-sm">{selectedMentor.primaryLanguage}</p>
                                  </div>
                                  <div>
                                    <Label>Review Taken</Label>
                                    <p className="text-sm">{mentor.reviewTakenCount}</p>
                                  </div>
                                 
                                  <div>
                                    <Label>Location</Label>
                                    <p className="text-sm">india</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm">7012474579</p>
                                  </div>
                                  <div>
                                    <Label>skills</Label>
                                    <ul className="list-disc list-inside text-sm">
                                      {mentor.technicalSkills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                <div>
                                    <Label>bio</Label>
                                    <p className="text-sm" style={{ maxWidth: '150px', wordWrap: 'break-word' }}>
                                      {selectedMentor.bio}
                                    </p>
                                  </div>
                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusChange(
                                        selectedMentor._id,
                                        selectedMentor.status === "inactive" ? "active" : "inactive",
                                      )
                                    }
                                  >
                                    {selectedMentor.status === "inactive" ? "Unblock Mentor" : "Block Mentor"}
                                  </Button>
                                  <Button variant="default">Edit Mentor</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} mentors
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, and pages around current page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                // Show ellipsis for gaps
                if (page === 2 && currentPage > 3) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                if (page === totalPages - 1 && currentPage < totalPages - 2) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}

