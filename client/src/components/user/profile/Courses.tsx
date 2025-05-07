"use client"

import axiosInstance from "@/utils/axiosInstance"
import { Clock, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Course {
  _id: string
  courseId: string
  courseData: {
    title: string
    description: string
    category: string
    level: string
    duration: string
    image: string
    price: string
  }
}

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(3)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/course/enrolled-courses")
        setCourses(response.data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-tasks/${courseId}`)
  }

  // Pagination logic
  const totalPages = Math.ceil(courses.length / coursesPerPage)
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">My Courses</h1>
        <div className="flex gap-2">
          {/* <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>All Courses</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>Sort by: Recent</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Name</option>
          </select> */}
        </div>
      </div>

      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <div
                key={course._id}
                className="border bg-secondary rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCourseClick(course.courseId)}
              >
                <div className="relative h-40">
                  <img
                    src={course.courseData.image || "/placeholder.svg"}
                    alt={course.courseData.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{course.courseData.title}</h3>
                  <p className="text-sm font-bold text-gray-500 mb-2">₹ {course.courseData.price}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">5</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{course.courseData.duration} weeks</span>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === index + 1 ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Browse Courses</button>
        </div>
      )}
    </div>
  )
}
