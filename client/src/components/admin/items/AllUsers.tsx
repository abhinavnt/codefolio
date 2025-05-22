
import { useEffect, useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { getAllUsers, toggleUserStatus } from "@/services/adminService"
import { UserDetailDialog } from "../re-usable/user-detail-dialog"
import { DataTable } from "../re-usable/data-table"

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
    const fetchUsers = async () => {
      try {
        const { UserData, total, totalPages } = await getAllUsers(currentPage, itemsPerPage)
        setUsers(UserData)
        setTotalPages(totalPages)
        setTotalItems(total)
      } catch (error) {
        toast.error("Something went wrong")
      }
    }
    fetchUsers()
  }, [currentPage])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleViewDetails = (user: IUser): void => {
    setSelectedUser(user)
  }

  const handleStatusChange = async (userId: string, newStatus: string): Promise<void> => {
    try {
      const response = await toggleUserStatus(userId)

      if (response?.status == 200) {
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

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "status") {
      setStatusFilter(value)
    } else if (filterId === "role") {
      setRoleFilter(value)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-emerald-500 hover:bg-emerald-600"
      : status === "blocked"
        ? "bg-red-500 hover:bg-red-600"
        : ""
  }

  const columns = [
    { key: "user", title: "User" },
    { key: "status", title: "Status" },
    {
      key: "createdAt",
      title: "Joined",
      hidden: true,
      render: (user: IUser) =>
        new Date(user.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }),
    },
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
      id: "role",
      label: "Role",
      options: [
        { value: "all", label: "All" },
        { value: "student", label: "Student" },
        { value: "mentor", label: "Mentor" },
        { value: "admin", label: "Admin" },
      ],
      defaultValue: "all",
    },
  ]

  const renderActions = (user: IUser) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
          View Details
        </Button>
      </DialogTrigger>
      <UserDetailDialog user={selectedUser} onStatusChange={handleStatusChange} getStatusColor={getStatusColor} />
    </Dialog>
  )

  return (
    <DataTable
      title="All Users"
      description="Manage all users registered on the platform."
      data={filteredUsers}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search users..."
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      renderActions={renderActions}
      addButtonText="Add New User"
      onAddButtonClick={() => console.log("Add new user")}
      getItemIdentifier={(user) => user._id}
      getItemName={(user) => user.name}
      getItemEmail={(user) => user.email}
      getItemImage={(user) => user.profileImageUrl}
      getItemStatus={(user) => user.status}
    />
  )
}
