import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RootState, AppDispatch } from "@/redux/store"
import CourseCard from "./Course-card"
import FilterSidebar from "./Filter-slide"
import { fetchCourses, searchCourses } from "@/redux/features/CourseSlice"

export default function CourseList() {
  const dispatch = useDispatch<AppDispatch>()
  const { courses, loading, error } = useSelector((state: RootState) => state.courses)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    dispatch(fetchCourses())

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowFilters(true)
      } else {
        setShowFilters(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [dispatch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(searchCourses(searchQuery))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="flex  flex-col md:flex-row gap-6">
      <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 lg:w-72 flex-shrink-0`}>
        <FilterSidebar />
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Courses</h1>
            <Button variant="outline" size="icon" className="md:hidden" onClick={toggleFilters}>
              <Filter className="h-4 w-4" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </div>

          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-emerald-500 hover:bg-emerald-600" type="submit">Search</Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Error loading courses: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course,index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}