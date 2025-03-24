
import { useState } from "react"
import { Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Dummy data for courses
const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    category: "Web Development",
    instructor: "Dr. James Wilson",
    price: 49.99,
    status: "Published",
    enrollments: 245,
    rating: 4.7,
    createdAt: "2023-05-15",
    thumbnail: "/placeholder.svg",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    category: "Web Development",
    instructor: "Prof. Sarah Martinez",
    price: 79.99,
    status: "Published",
    enrollments: 189,
    rating: 4.9,
    createdAt: "2023-06-10",
    thumbnail: "/placeholder.svg",
    description: "Master advanced React patterns and techniques for building scalable applications.",
    duration: "6 weeks",
    level: "Advanced",
  },
  {
    id: 3,
    title: "Data Science Essentials",
    category: "Data Science",
    instructor: "Dr. Robert Chen",
    price: 59.99,
    status: "Published",
    enrollments: 312,
    rating: 4.8,
    createdAt: "2023-04-20",
    thumbnail: "/placeholder.svg",
    description: "Learn the fundamentals of data science including statistics, Python, and data visualization.",
    duration: "10 weeks",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    category: "Design",
    instructor: "Prof. Lisa Johnson",
    price: 69.99,
    status: "Published",
    enrollments: 178,
    rating: 4.6,
    createdAt: "2023-07-05",
    thumbnail: "/placeholder.svg",
    description: "Master the principles of UI/UX design and create user-centered interfaces.",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    id: 5,
    title: "Mobile App Development",
    category: "Mobile Development",
    instructor: "Dr. Michael Park",
    price: 89.99,
    status: "Draft",
    enrollments: 0,
    rating: 0,
    createdAt: "2023-08-01",
    thumbnail: "/placeholder.svg",
    description: "Learn to build mobile applications for iOS and Android using React Native.",
    duration: "12 weeks",
    level: "Intermediate",
  },
  {
    id: 6,
    title: "DevOps for Beginners",
    category: "DevOps",
    instructor: "Prof. Emily Rodriguez",
    price: 54.99,
    status: "Published",
    enrollments: 156,
    rating: 4.5,
    createdAt: "2023-06-25",
    thumbnail: "/placeholder.svg",
    description: "Learn the fundamentals of DevOps including CI/CD, Docker, and Kubernetes.",
    duration: "6 weeks",
    level: "Beginner",
  },
  {
    id: 7,
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    instructor: "Dr. Thomas Wright",
    price: 64.99,
    status: "Published",
    enrollments: 201,
    rating: 4.7,
    createdAt: "2023-05-30",
    thumbnail: "/placeholder.svg",
    description: "Learn the fundamentals of cybersecurity including network security and ethical hacking.",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    id: 8,
    title: "Game Development with Unity",
    category: "Game Development",
    instructor: "Prof. Olivia Kim",
    price: 74.99,
    status: "Published",
    enrollments: 167,
    rating: 4.8,
    createdAt: "2023-07-15",
    thumbnail: "/placeholder.svg",
    description: "Learn to build 2D and 3D games using Unity and C#.",
    duration: "10 weeks",
    level: "Intermediate",
  },
  {
    id: 9,
    title: "Blockchain Development",
    category: "Blockchain",
    instructor: "Dr. Benjamin Taylor",
    price: 84.99,
    status: "Draft",
    enrollments: 0,
    rating: 0,
    createdAt: "2023-08-10",
    thumbnail: "/placeholder.svg",
    description: "Learn to build decentralized applications using Ethereum and Solidity.",
    duration: "8 weeks",
    level: "Advanced",
  },
  {
    id: 10,
    title: "Cloud Computing Essentials",
    category: "Cloud Computing",
    instructor: "Prof. Sophia Chen",
    price: 59.99,
    status: "Published",
    enrollments: 189,
    rating: 4.6,
    createdAt: "2023-06-05",
    thumbnail: "/placeholder.svg",
    description: "Learn the fundamentals of cloud computing including AWS, Azure, and GCP.",
    duration: "6 weeks",
    level: "Beginner",
  },
]

export function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState<(typeof courses)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || course.category.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem)

  const handleViewDetails = (course: (typeof courses)[0]) => {
    setSelectedCourse(course)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Course Management</h2>
        <Button>Add New Course</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Courses</CardTitle>
          <CardDescription>View and manage all courses on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Label htmlFor="category-filter">Category:</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter" className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="cyber">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Instructor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Enrollments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No courses found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex h-10 w-10 rounded">
                            <AvatarImage src={course.thumbnail} alt={course.title} />
                            <AvatarFallback>{course.title.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {course.level} • {course.duration}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{course.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{course.instructor}</TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>
                        <Badge variant={course.status === "Published" ? "default" : "secondary"}>{course.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{course.enrollments}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(course)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCourses.length)} of{" "}
            {filteredCourses.length} courses
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

