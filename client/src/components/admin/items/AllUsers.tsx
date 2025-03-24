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

// Expanded dummy data for users
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-01-15",
    coursesEnrolled: 3,
    avatar: "/placeholder.svg",
    bio: "Frontend developer passionate about React and UI/UX design.",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-02-20",
    coursesEnrolled: 5,
    avatar: "/placeholder.svg",
    bio: "Full-stack developer with 3 years of experience in MERN stack.",
    location: "New York, NY",
    phone: "+1 (555) 234-5678",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Student",
    status: "Inactive",
    joinDate: "2023-03-10",
    coursesEnrolled: 2,
    avatar: "/placeholder.svg",
    bio: "Data scientist specializing in machine learning and AI.",
    location: "Boston, MA",
    phone: "+1 (555) 345-6789",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-04-05",
    coursesEnrolled: 4,
    avatar: "/placeholder.svg",
    bio: "Backend developer with expertise in Node.js and Python.",
    location: "Austin, TX",
    phone: "+1 (555) 456-7890",
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Student",
    status: "Blocked",
    joinDate: "2023-05-12",
    coursesEnrolled: 1,
    avatar: "/placeholder.svg",
    bio: "Mobile app developer focusing on React Native and Flutter.",
    location: "Seattle, WA",
    phone: "+1 (555) 567-8901",
  },
  {
    id: 6,
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-06-18",
    coursesEnrolled: 6,
    avatar: "/placeholder.svg",
    bio: "DevOps engineer with experience in AWS and Docker.",
    location: "Chicago, IL",
    phone: "+1 (555) 678-9012",
  },
  {
    id: 7,
    name: "Ryan Patel",
    email: "ryan.patel@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-07-22",
    coursesEnrolled: 2,
    avatar: "/placeholder.svg",
    bio: "Game developer passionate about Unity and C#.",
    location: "Los Angeles, CA",
    phone: "+1 (555) 789-0123",
  },
  {
    id: 8,
    name: "Olivia Wilson",
    email: "olivia.wilson@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-08-05",
    coursesEnrolled: 3,
    avatar: "/placeholder.svg",
    bio: "UX designer with a focus on user research and prototyping.",
    location: "Portland, OR",
    phone: "+1 (555) 890-1234",
  },
  {
    id: 9,
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    role: "Student",
    status: "Inactive",
    joinDate: "2023-08-15",
    coursesEnrolled: 1,
    avatar: "/placeholder.svg",
    bio: "Cybersecurity specialist with experience in penetration testing.",
    location: "Denver, CO",
    phone: "+1 (555) 901-2345",
  },
  {
    id: 10,
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-09-01",
    coursesEnrolled: 4,
    avatar: "/placeholder.svg",
    bio: "Cloud architect specializing in AWS and Azure solutions.",
    location: "Miami, FL",
    phone: "+1 (555) 012-3456",
  },
  {
    id: 11,
    name: "William Martinez",
    email: "william.martinez@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2023-09-10",
    coursesEnrolled: 2,
    avatar: "/placeholder.svg",
    bio: "Blockchain developer with experience in Ethereum and Solidity.",
    location: "Atlanta, GA",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 12,
    name: "Ava Thompson",
    email: "ava.thompson@example.com",
    role: "Student",
    status: "Blocked",
    joinDate: "2023-09-20",
    coursesEnrolled: 1,
    avatar: "/placeholder.svg",
    bio: "Data engineer with expertise in big data technologies.",
    location: "Dallas, TX",
    phone: "+1 (555) 234-5678",
  },
  {
    id: 13,
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2023-01-05",
    coursesEnrolled: 0,
    avatar: "/placeholder.svg",
    bio: "System administrator with 10+ years of experience.",
    location: "San Diego, CA",
    phone: "+1 (555) 345-6789",
  },
  {
    id: 14,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "Mentor",
    status: "Active",
    joinDate: "2023-02-10",
    coursesEnrolled: 0,
    avatar: "/placeholder.svg",
    bio: "Senior software engineer with expertise in Java and Spring Boot.",
    location: "Philadelphia, PA",
    phone: "+1 (555) 456-7890",
  },
  {
    id: 15,
    name: "Noah Johnson",
    email: "noah.johnson@example.com",
    role: "Mentor",
    status: "Active",
    joinDate: "2023-03-15",
    coursesEnrolled: 0,
    avatar: "/placeholder.svg",
    bio: "Machine learning engineer with experience in TensorFlow and PyTorch.",
    location: "Phoenix, AZ",
    phone: "+1 (555) 567-8901",
  },
]

export function AllUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesRole
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  const handleViewDetails = (user: (typeof users)[0]) => {
    setSelectedUser(user)
  }

  const handleStatusChange = (userId: number, newStatus: string) => {
    // In a real app, you would update the user status in your database
    console.log(`Changing user ${userId} status to ${newStatus}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">All Users</h2>
        <Button>Add New User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage all users registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users..."
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
                <Label htmlFor="role-filter">Role:</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role-filter" className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="hidden md:table-cell">Courses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "Active"
                              ? "default"
                              : user.status === "Inactive"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.coursesEnrolled}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>Detailed information about the user.</DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="grid gap-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                    <AvatarFallback>
                                      {selectedUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label>Role</Label>
                                    <p className="text-sm">{selectedUser.role}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p className="text-sm">
                                      <Badge
                                        variant={
                                          selectedUser.status === "Active"
                                            ? "default"
                                            : selectedUser.status === "Inactive"
                                              ? "secondary"
                                              : "destructive"
                                        }
                                      >
                                        {selectedUser.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Join Date</Label>
                                    <p className="text-sm">{selectedUser.joinDate}</p>
                                  </div>
                                  <div>
                                    <Label>Courses Enrolled</Label>
                                    <p className="text-sm">{selectedUser.coursesEnrolled}</p>
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <p className="text-sm">{selectedUser.location}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm">{selectedUser.phone}</p>
                                  </div>
                                </div>

                                <div>
                                  <Label>Bio</Label>
                                  <p className="text-sm">{selectedUser.bio}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusChange(
                                        selectedUser.id,
                                        selectedUser.status === "Blocked" ? "Active" : "Blocked",
                                      )
                                    }
                                  >
                                    {selectedUser.status === "Blocked" ? "Unblock User" : "Block User"}
                                  </Button>
                                  <Button variant="default">Edit User</Button>
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
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

