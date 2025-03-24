
import { useState } from "react"
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

// Expanded dummy data for mentors
const mentors = [
  {
    id: 1,
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    expertise: "Web Development",
    status: "Active",
    joinDate: "2023-01-10",
    studentsCount: 45,
    coursesCount: 3,
    avatar: "/placeholder.svg",
    bio: "Senior web developer with 10+ years of experience in React, Angular, and Vue.",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Prof. Sarah Martinez",
    email: "sarah.martinez@example.com",
    expertise: "Data Science",
    status: "Active",
    joinDate: "2023-02-15",
    studentsCount: 38,
    coursesCount: 2,
    avatar: "/placeholder.svg",
    bio: "Data scientist with expertise in machine learning and statistical analysis.",
    location: "New York, NY",
    phone: "+1 (555) 234-5678",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Dr. Robert Chen",
    email: "robert.chen@example.com",
    expertise: "Mobile Development",
    status: "Inactive",
    joinDate: "2023-03-05",
    studentsCount: 27,
    coursesCount: 2,
    avatar: "/placeholder.svg",
    bio: "Mobile app developer specializing in React Native and Flutter.",
    location: "Boston, MA",
    phone: "+1 (555) 345-6789",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Prof. Lisa Johnson",
    email: "lisa.johnson@example.com",
    expertise: "UI/UX Design",
    status: "Active",
    joinDate: "2023-04-20",
    studentsCount: 52,
    coursesCount: 4,
    avatar: "/placeholder.svg",
    bio: "UI/UX designer with a background in psychology and human-computer interaction.",
    location: "Austin, TX",
    phone: "+1 (555) 456-7890",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Dr. Michael Park",
    email: "michael.park@example.com",
    expertise: "DevOps",
    status: "Blocked",
    joinDate: "2023-05-08",
    studentsCount: 19,
    coursesCount: 1,
    avatar: "/placeholder.svg",
    bio: "DevOps engineer with expertise in AWS, Docker, and Kubernetes.",
    location: "Seattle, WA",
    phone: "+1 (555) 567-8901",
    rating: 4.2,
  },
  {
    id: 6,
    name: "Prof. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    expertise: "Cybersecurity",
    status: "Active",
    joinDate: "2023-06-12",
    studentsCount: 33,
    coursesCount: 2,
    avatar: "/placeholder.svg",
    bio: "Cybersecurity expert with experience in penetration testing and security audits.",
    location: "Chicago, IL",
    phone: "+1 (555) 678-9012",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Dr. Thomas Wright",
    email: "thomas.wright@example.com",
    expertise: "Blockchain",
    status: "Active",
    joinDate: "2023-07-05",
    studentsCount: 21,
    coursesCount: 1,
    avatar: "/placeholder.svg",
    bio: "Blockchain developer and researcher with expertise in smart contracts and DeFi.",
    location: "Toronto, Canada",
    phone: "+1 (555) 789-0123",
    rating: 4.5,
  },
  {
    id: 8,
    name: "Prof. Olivia Kim",
    email: "olivia.kim@example.com",
    expertise: "Game Development",
    status: "Active",
    joinDate: "2023-07-18",
    studentsCount: 40,
    coursesCount: 3,
    avatar: "/placeholder.svg",
    bio: "Game developer with experience in Unity, Unreal Engine, and game design principles.",
    location: "Vancouver, Canada",
    phone: "+1 (555) 890-1234",
    rating: 4.9,
  },
  {
    id: 9,
    name: "Dr. Benjamin Taylor",
    email: "benjamin.taylor@example.com",
    expertise: "AI & Machine Learning",
    status: "Inactive",
    joinDate: "2023-08-01",
    studentsCount: 35,
    coursesCount: 2,
    avatar: "/placeholder.svg",
    bio: "AI researcher with focus on deep learning and computer vision applications.",
    location: "London, UK",
    phone: "+44 (20) 1234-5678",
    rating: 4.7,
  },
  {
    id: 10,
    name: "Prof. Sophia Chen",
    email: "sophia.chen@example.com",
    expertise: "Cloud Computing",
    status: "Active",
    joinDate: "2023-08-15",
    studentsCount: 28,
    coursesCount: 2,
    avatar: "/placeholder.svg",
    bio: "Cloud architect with expertise in multi-cloud strategies and serverless architectures.",
    location: "Singapore",
    phone: "+65 1234-5678",
    rating: 4.8,
  },
  {
    id: 11,
    name: "Dr. William Johnson",
    email: "william.johnson@example.com",
    expertise: "IoT Development",
    status: "Active",
    joinDate: "2023-09-01",
    studentsCount: 22,
    coursesCount: 1,
    avatar: "/placeholder.svg",
    bio: "IoT specialist with experience in embedded systems and connected devices.",
    location: "Berlin, Germany",
    phone: "+49 (30) 1234-5678",
    rating: 4.6,
  },
  {
    id: 12,
    name: "Prof. Emma Davis",
    email: "emma.davis@example.com",
    expertise: "Data Engineering",
    status: "Blocked",
    joinDate: "2023-09-10",
    studentsCount: 15,
    coursesCount: 1,
    avatar: "/placeholder.svg",
    bio: "Data engineer specializing in big data technologies and data pipelines.",
    location: "Sydney, Australia",
    phone: "+61 (2) 1234-5678",
    rating: 4.3,
  },
]

export function AllMentors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expertiseFilter, setExpertiseFilter] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState<(typeof mentors)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter mentors based on search term and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || mentor.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesExpertise =
      expertiseFilter === "all" || mentor.expertise.toLowerCase().includes(expertiseFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesExpertise
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredMentors.slice(indexOfFirstItem, indexOfLastItem)

  const handleViewDetails = (mentor: (typeof mentors)[0]) => {
    setSelectedMentor(mentor)
  }

  const handleStatusChange = (mentorId: number, newStatus: string) => {
    // In a real app, you would update the mentor status in your database
    console.log(`Changing mentor ${mentorId} status to ${newStatus}`)
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
                  <TableHead className="hidden md:table-cell">Students</TableHead>
                  <TableHead className="hidden md:table-cell">Courses</TableHead>
                  <TableHead className="hidden md:table-cell">Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No mentors found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((mentor) => (
                    <TableRow key={mentor.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={mentor.avatar} alt={mentor.name} />
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
                      <TableCell className="hidden md:table-cell">{mentor.expertise}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            mentor.status === "Active"
                              ? "default"
                              : mentor.status === "Inactive"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {mentor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{mentor.studentsCount}</TableCell>
                      <TableCell className="hidden md:table-cell">{mentor.coursesCount}</TableCell>
                      <TableCell className="hidden md:table-cell">{mentor.rating}/5.0</TableCell>
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
                                    <AvatarImage src={selectedMentor.avatar} alt={selectedMentor.name} />
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
                                    <Label>Expertise</Label>
                                    <p className="text-sm">{selectedMentor.expertise}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p className="text-sm">
                                      <Badge
                                        variant={
                                          selectedMentor.status === "Active"
                                            ? "default"
                                            : selectedMentor.status === "Inactive"
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
                                    <p className="text-sm">{selectedMentor.joinDate}</p>
                                  </div>
                                  <div>
                                    <Label>Rating</Label>
                                    <p className="text-sm">{selectedMentor.rating}/5.0</p>
                                  </div>
                                  <div>
                                    <Label>Students</Label>
                                    <p className="text-sm">{selectedMentor.studentsCount}</p>
                                  </div>
                                  <div>
                                    <Label>Courses</Label>
                                    <p className="text-sm">{selectedMentor.coursesCount}</p>
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <p className="text-sm">{selectedMentor.location}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm">{selectedMentor.phone}</p>
                                  </div>
                                </div>

                                <div>
                                  <Label>Bio</Label>
                                  <p className="text-sm">{selectedMentor.bio}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusChange(
                                        selectedMentor.id,
                                        selectedMentor.status === "Blocked" ? "Active" : "Blocked",
                                      )
                                    }
                                  >
                                    {selectedMentor.status === "Blocked" ? "Unblock Mentor" : "Block Mentor"}
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMentors.length)} of{" "}
            {filteredMentors.length} mentors
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

