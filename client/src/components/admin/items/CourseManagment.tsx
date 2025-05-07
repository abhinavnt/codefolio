"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Trash2, Eye, MoreHorizontal, Star, Edit } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import axiosInstance from "@/utils/axiosInstance"

interface Course {
  _id: string
  title: string
  category: string
  level: string
  duration: string
  price: string
  status: string
  enrolledStudents: string[]
  rating: number
  image: string
  createdAt: string
  description: string
  tags: string[]
  learningPoints: string[]
  targetedAudience: string[]
  courseRequirements: string[]
}

export function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [courses, setCourses] = useState<Course[]>([])
  const [totalCourses, setTotalCourses] = useState(0)
  const [search, setSearch] = useState("")
  const [viewCourse, setViewCourse] = useState<Course | null>(null)
  const navigate = useNavigate()
  const itemsPerPage = 5

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/course/courses?search=${encodeURIComponent(searchTerm)}&category=${categoryFilter}&status=${statusFilter}&page=${currentPage}&limit=${itemsPerPage}`
        )
        setCourses(response.data.courses || [])
        setTotalCourses(response.data.total || 0)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setCourses([])
        setTotalCourses(0)
      }
    }
    fetchCourses()
  }, [searchTerm, categoryFilter, statusFilter, currentPage])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(search)
    }, 500)
    return () => clearTimeout(timeout)
  }, [search])

  const totalPages = Math.ceil(totalCourses / itemsPerPage)

  const handleEditCourse = (courseId: string) => {
    navigate(`/admin/courses/edit/${courseId}`)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Course Management</h2>
        {/* <Button onClick={() => navigate("/admin/courses/add")}>Add New Course</Button> */}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              {/* <div className="flex items-center space-x-2">
                <Label htmlFor="category-filter">Category:</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter" className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
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
                    <SelectItem value="archived">Archived</SelectItem>
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
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Enrollments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No courses found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex h-10 w-10 rounded">
                            <AvatarImage src={course.image} alt={course.title} />
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
                      <TableCell>₹{course.price}</TableCell>
                      <TableCell>
                        <Badge variant={course.status === "published" ? "default" : "secondary"}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{course.enrolledStudents.length}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditCourse(course._id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewCourse(course)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCourses)} of{" "}
            {totalCourses} courses
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                      >
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      {viewCourse && (
        <Dialog open={!!viewCourse} onOpenChange={() => setViewCourse(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Course Details</DialogTitle>
              <DialogDescription>Detailed information about this course</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewCourse.image} alt={viewCourse.title} />
                  <AvatarFallback>{viewCourse.title.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{viewCourse.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={viewCourse.status === "published" ? "default" : "secondary"}>
                      {viewCourse.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Created: {new Date(viewCourse.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Category</p>
                  <p>{viewCourse.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Level</p>
                  <p>{viewCourse.level}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Duration</p>
                  <p>{viewCourse.duration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Price</p>
                  <p>₹{viewCourse.price}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Enrolled Students</p>
                  <p>{viewCourse.enrolledStudents.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rating</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < viewCourse.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                      />
                    ))}
                    <span className="ml-2">{viewCourse.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{viewCourse.description}</p>
              </div>

              {viewCourse.tags && viewCourse.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {viewCourse.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewCourse.learningPoints && viewCourse.learningPoints.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Learning Points</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {viewCourse.learningPoints.map((point, index) => (
                      <li key={index} className="text-sm">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewCourse.targetedAudience && viewCourse.targetedAudience.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Targeted Audience</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {viewCourse.targetedAudience.map((audience, index) => (
                      <li key={index} className="text-sm">
                        {audience}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewCourse.courseRequirements && viewCourse.courseRequirements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Course Requirements</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {viewCourse.courseRequirements.map((requirement, index) => (
                      <li key={index} className="text-sm">
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewCourse(null)}>
                Close
              </Button>
              <Button onClick={() => { setViewCourse(null); handleEditCourse(viewCourse._id); }}>
                Edit Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}