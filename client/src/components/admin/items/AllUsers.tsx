"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
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
import { getAllUsers, toggleUserStatus } from "@/services/adminService"
import { toast } from "sonner"

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  profileImageUrl: string
  status: string
  role: string
  title: string
  createdAt: Date
  updatedAt: Date
  wishlist: string[]
  savedMentors: string[]
  skills: string[]
  DOB: Date
  googleId: string
  reviewerRequestStatus: ("pending" | "approved" | "rejected")[]
}


export function AllUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<IUser[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 5
  
  useEffect(() => {
    const fetchMentorRequests = async () => {
      try {
        const { UserData, total, totalPages } = await getAllUsers(currentPage, itemsPerPage)
        console.log(UserData, "all users")

        setUsers(UserData)
        setTotalPages(totalPages)
        setTotalItems(total)
      } catch (error) {
        toast.error("Something went wrong")
      }
    }
    fetchMentorRequests()
  }, [currentPage])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesRole
  })

  // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastItem = (currentPage - 1) * itemsPerPage + 1
  const indexOfFirstItem = Math.min(currentPage * itemsPerPage, totalItems)
  // const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  const handleViewDetails = (user: IUser): void => {
    setSelectedUser(user)
  }

  const handleStatusChange = async (userId: string, newStatus: string): Promise<void> => {
    try {
      const response = await toggleUserStatus(userId)

      if (response.status == 200) {
        setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))
        toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`)
      }

      // Update selected user if it's the one being modified
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus })
      }
    } catch (error) {
      toast.error("Failed to update user status")
      console.error(error)
    }
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
                  {/* <TableHead className="hidden md:table-cell">Role</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  {/* <TableHead className="hidden md:table-cell">Courses</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={user.profileImageUrl} alt={user.name} />
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
                      {/* <TableCell className="hidden md:table-cell">{user.role}</TableCell> */}
                      <TableCell>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : user.status === "blocked"
                                ? "bg-red-500 hover:bg-red-600"
                                : ""
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(user.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata",
                        })}
                      </TableCell>

                      {/* <TableCell className="hidden md:table-cell">{user.coursesEnrolled |"N/A"}</TableCell> */}
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
                                    <AvatarImage src={selectedUser.profileImageUrl} alt={selectedUser.name} />
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
                                        className={
                                          selectedUser.status === "active"
                                            ? "bg-emerald-500 hover:bg-emerald-600"
                                            : selectedUser.status === "blocked"
                                              ? "bg-red-500 hover:bg-red-600"
                                              : ""
                                        }
                                      >
                                        {selectedUser.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Join Date</Label>
                                    <p className="text-sm">
                                      {selectedUser?.createdAt
                                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Courses Enrolled</Label>
                                    <p className="text-sm">
                                      {selectedUser?.createdAt
                                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    {/* <p className="text-sm">{selectedUser.}</p> */}
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    {/* <p className="text-sm">{selectedUser.phone}</p> */}
                                  </div>
                                </div>

                                <div>
                                  <Label>Bio</Label>
                                  <p className="text-sm">{selectedUser.title}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline">
                                        {selectedUser.status === "blocked" ? "Unblock User" : "Block User"}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Confirm Action</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to{" "}
                                          {selectedUser.status === "blocked" ? "unblock" : "block"} this user?
                                          {selectedUser.status !== "blocked" &&
                                            " The user will no longer be able to access the platform."}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="flex justify-end gap-2 pt-4">
                                        <DialogClose asChild>
                                          <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                          <Button
                                            className={
                                              selectedUser.status === "blocked"
                                                ? "bg-emerald-500 hover:bg-emerald-600"
                                                : "bg-red-500 hover:bg-red-600"
                                            }
                                            onClick={() => {
                                              handleStatusChange(
                                                selectedUser._id,
                                                selectedUser.status === "blocked" ? "active" : "blocked",
                                              )
                                            }}
                                          >
                                            {selectedUser.status === "blocked" ? "Unblock" : "blocked"} User
                                          </Button>
                                        </DialogClose>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
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
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

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

