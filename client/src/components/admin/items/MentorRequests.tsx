
import { useState } from "react"
import { Search, Calendar } from "lucide-react"
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

// Expanded dummy data for mentor requests
const mentorRequests = [
  {
    id: 1,
    name: "Jennifer Adams",
    email: "jennifer.adams@example.com",
    submissionDate: "2023-07-15",
    status: "Pending",
    avatar: "/placeholder.svg",
    experience: "5 years",
    skills: ["React", "Node.js", "MongoDB"],
    bio: "Full-stack developer with 5 years of experience in building web applications. I have worked with various technologies including React, Node.js, and MongoDB. I am passionate about teaching and helping others learn programming.",
    currentRole: "Senior Developer at TechCorp",
    education: "M.S. in Computer Science, Stanford University",
    portfolio: "https://jenniferadams.dev",
    github: "https://github.com/jenniferadams",
    linkedin: "https://linkedin.com/in/jenniferadams",
    motivation:
      "I want to share my knowledge and experience with aspiring developers and help them grow in their careers.",
  },
  {
    id: 2,
    name: "Daniel Kim",
    email: "daniel.kim@example.com",
    submissionDate: "2023-07-18",
    status: "Approved",
    avatar: "/placeholder.svg",
    experience: "8 years",
    skills: ["Python", "Machine Learning", "Data Science"],
    bio: "Data scientist with 8 years of experience in machine learning and AI. I have worked on various projects involving natural language processing, computer vision, and predictive analytics.",
    currentRole: "Lead Data Scientist at AI Solutions",
    education: "Ph.D. in Computer Science, MIT",
    portfolio: "https://danielkim.dev",
    github: "https://github.com/danielkim",
    linkedin: "https://linkedin.com/in/danielkim",
    motivation:
      "I believe in democratizing AI education and want to help students understand complex concepts in a simple way.",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    submissionDate: "2023-07-20",
    status: "Rejected",
    avatar: "/placeholder.svg",
    experience: "3 years",
    skills: ["UI/UX Design", "Figma", "Adobe XD"],
    bio: "UI/UX designer with 3 years of experience in creating user-centered designs. I have worked on various projects involving web and mobile applications.",
    currentRole: "UI/UX Designer at DesignHub",
    education: "B.A. in Graphic Design, RISD",
    portfolio: "https://sophiamartinez.design",
    github: "https://github.com/sophiamartinez",
    linkedin: "https://linkedin.com/in/sophiamartinez",
    motivation:
      "I want to help students understand the importance of user-centered design and how to create intuitive interfaces.",
  },
  {
    id: 4,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    submissionDate: "2023-07-22",
    status: "Pending",
    avatar: "/placeholder.svg",
    experience: "6 years",
    skills: ["DevOps", "AWS", "Docker", "Kubernetes"],
    bio: "DevOps engineer with 6 years of experience in cloud infrastructure and CI/CD pipelines. I have worked with various cloud providers including AWS, Azure, and GCP.",
    currentRole: "DevOps Engineer at CloudTech",
    education: "B.S. in Computer Engineering, Georgia Tech",
    portfolio: "https://michaeljohnson.dev",
    github: "https://github.com/michaeljohnson",
    linkedin: "https://linkedin.com/in/michaeljohnson",
    motivation:
      "I want to help students understand the importance of DevOps practices and how to implement them in their projects.",
  },
  {
    id: 5,
    name: "Emily Chen",
    email: "emily.chen@example.com",
    submissionDate: "2023-07-25",
    status: "Pending",
    avatar: "/placeholder.svg",
    experience: "4 years",
    skills: ["Mobile Development", "React Native", "Flutter"],
    bio: "Mobile developer with 4 years of experience in building cross-platform applications. I have worked with various technologies including React Native and Flutter.",
    currentRole: "Mobile Developer at AppWorks",
    education: "B.S. in Computer Science, UC Berkeley",
    portfolio: "https://emilychen.dev",
    github: "https://github.com/emilychen",
    linkedin: "https://linkedin.com/in/emilychen",
    motivation:
      "I want to help students understand the nuances of mobile development and how to create performant applications.",
  },
  {
    id: 6,
    name: "David Wilson",
    email: "david.wilson@example.com",
    submissionDate: "2023-08-02",
    status: "Pending",
    avatar: "/placeholder.svg",
    experience: "7 years",
    skills: ["Blockchain", "Solidity", "Web3"],
    bio: "Blockchain developer with 7 years of experience in building decentralized applications. I have worked with various blockchain platforms including Ethereum, Solana, and Polkadot.",
    currentRole: "Blockchain Developer at CryptoTech",
    education: "M.S. in Computer Science, Cornell University",
    portfolio: "https://davidwilson.dev",
    github: "https://github.com/davidwilson",
    linkedin: "https://linkedin.com/in/davidwilson",
    motivation: "I want to help students understand blockchain technology and how to build decentralized applications.",
  },
  {
    id: 7,
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    submissionDate: "2023-08-10",
    status: "Approved",
    avatar: "/placeholder.svg",
    experience: "9 years",
    skills: ["Game Development", "Unity", "C#"],
    bio: "Game developer with 9 years of experience in building 2D and 3D games. I have worked with various game engines including Unity and Unreal Engine.",
    currentRole: "Senior Game Developer at GameStudio",
    education: "B.S. in Computer Science, USC",
    portfolio: "https://sarahthompson.dev",
    github: "https://github.com/sarahthompson",
    linkedin: "https://linkedin.com/in/sarahthompson",
    motivation: "I want to help students understand game development principles and how to create engaging games.",
  },
  {
    id: 8,
    name: "Robert Lee",
    email: "robert.lee@example.com",
    submissionDate: "2023-08-15",
    status: "Rejected",
    avatar: "/placeholder.svg",
    experience: "2 years",
    skills: ["Frontend Development", "React", "Vue"],
    bio: "Frontend developer with 2 years of experience in building responsive web applications. I have worked with various frontend frameworks including React and Vue.",
    currentRole: "Frontend Developer at WebTech",
    education: "B.S. in Information Technology, NYU",
    portfolio: "https://robertlee.dev",
    github: "https://github.com/robertlee",
    linkedin: "https://linkedin.com/in/robertlee",
    motivation:
      "I want to help students understand frontend development principles and how to create responsive web applications.",
  },
  {
    id: 9,
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    submissionDate: "2023-08-20",
    status: "Pending",
    avatar: "/placeholder.svg",
    experience: "5 years",
    skills: ["Cloud Computing", "AWS", "Azure", "GCP"],
    bio: "Cloud architect with 5 years of experience in designing and implementing cloud solutions. I have worked with various cloud providers including AWS, Azure, and GCP.",
    currentRole: "Cloud Architect at CloudSolutions",
    education: "M.S. in Cloud Computing, University of Washington",
    portfolio: "https://jessicabrown.dev",
    github: "https://github.com/jessicabrown",
    linkedin: "https://linkedin.com/in/jessicabrown",
    motivation:
      "I want to help students understand cloud computing principles and how to design scalable cloud solutions.",
  },
  {
    id: 10,
    name: "Thomas Davis",
    email: "thomas.davis@example.com",
    submissionDate: "2023-08-25",
    status: "Pending",
    avatar: "/placeholder.svg",
    experience: "6 years",
    skills: ["IoT", "Embedded Systems", "Arduino", "Raspberry Pi"],
    bio: "IoT developer with 6 years of experience in building connected devices. I have worked with various IoT platforms including Arduino, Raspberry Pi, and ESP32.",
    currentRole: "IoT Developer at ConnectedTech",
    education: "B.S. in Electrical Engineering, Purdue University",
    portfolio: "https://thomasdavis.dev",
    github: "https://github.com/thomasdavis",
    linkedin: "https://linkedin.com/in/thomasdavis",
    motivation: "I want to help students understand IoT principles and how to build connected devices.",
  },
]

export function MentorRequests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<(typeof mentorRequests)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter requests based on search term and status filter
  const filteredRequests = mentorRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)

  const handleViewDetails = (request: (typeof mentorRequests)[0]) => {
    setSelectedRequest(request)
  }

  const handleStatusChange = (requestId: number, newStatus: string) => {
    // In a real app, you would update the request status in your database
    console.log(`Changing request ${requestId} status to ${newStatus}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Mentor Requests</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Application Management</CardTitle>
          <CardDescription>Review and manage mentor applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status-filter">Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden md:table-cell">Submission Date</TableHead>
                  <TableHead className="hidden md:table-cell">Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No applications found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={request.avatar} alt={request.name} />
                            <AvatarFallback>
                              {request.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-sm text-muted-foreground">{request.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {request.submissionDate}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{request.experience}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "Approved"
                              ? "default"
                              : request.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Mentor Application Details</DialogTitle>
                              <DialogDescription>Review the mentor application.</DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="grid gap-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedRequest.avatar} alt={selectedRequest.name} />
                                    <AvatarFallback>
                                      {selectedRequest.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-bold">{selectedRequest.name}</h3>
                                    <p className="text-muted-foreground">{selectedRequest.email}</p>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label>Submission Date</Label>
                                    <p className="text-sm">{selectedRequest.submissionDate}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p className="text-sm">
                                      <Badge
                                        variant={
                                          selectedRequest.status === "Approved"
                                            ? "default"
                                            : selectedRequest.status === "Pending"
                                              ? "secondary"
                                              : "destructive"
                                        }
                                      >
                                        {selectedRequest.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Experience</Label>
                                    <p className="text-sm">{selectedRequest.experience}</p>
                                  </div>
                                  <div>
                                    <Label>Current Role</Label>
                                    <p className="text-sm">{selectedRequest.currentRole}</p>
                                  </div>
                                  <div>
                                    <Label>Education</Label>
                                    <p className="text-sm">{selectedRequest.education}</p>
                                  </div>
                                </div>

                                <div>
                                  <Label>Skills</Label>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {selectedRequest.skills.map((skill) => (
                                      <Badge key={skill} variant="outline">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <Label>Bio</Label>
                                  <p className="text-sm">{selectedRequest.bio}</p>
                                </div>

                                <div>
                                  <Label>Motivation</Label>
                                  <p className="text-sm">{selectedRequest.motivation}</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                  <div>
                                    <Label>Portfolio</Label>
                                    <p className="text-sm">
                                      <a
                                        href={selectedRequest.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-500 hover:underline"
                                      >
                                        View Portfolio
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>GitHub</Label>
                                    <p className="text-sm">
                                      <a
                                        href={selectedRequest.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-500 hover:underline"
                                      >
                                        View GitHub
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>LinkedIn</Label>
                                    <p className="text-sm">
                                      <a
                                        href={selectedRequest.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-500 hover:underline"
                                      >
                                        View LinkedIn
                                      </a>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
                                  {selectedRequest.status === "Pending" && (
                                    <>
                                      <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange(selectedRequest.id, "Rejected")}
                                      >
                                        Reject
                                      </Button>
                                      <Button
                                        variant="default"
                                        onClick={() => handleStatusChange(selectedRequest.id, "Approved")}
                                      >
                                        Approve
                                      </Button>
                                    </>
                                  )}
                                  {selectedRequest.status !== "Pending" && (
                                    <Button
                                      variant="outline"
                                      onClick={() => handleStatusChange(selectedRequest.id, "Pending")}
                                    >
                                      Reset to Pending
                                    </Button>
                                  )}
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of{" "}
            {filteredRequests.length} applications
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

