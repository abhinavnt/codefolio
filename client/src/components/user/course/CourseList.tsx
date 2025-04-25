"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RootState, AppDispatch } from "@/redux/store"
import CourseCard from "./Course-card"
import FilterSidebar from "./Filter-slide"
import { setPage, setLimit } from "@/redux/features/CourseSlice"
import { setSearchQuery, applyFilters } from "@/redux/features/FilterSlice"

export default function CourseList() {
  const dispatch = useDispatch<AppDispatch>()
  const { courses, loading, error, total, page, limit } = useSelector((state: RootState) => state.courses)
  const { searchQuery } = useSelector((state: RootState) => state.filters)
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Initial fetch of courses
  useEffect(() => {

    dispatch(applyFilters())

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
    dispatch(applyFilters())
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
    dispatch(applyFilters())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit))
    dispatch(setPage(1))
    dispatch(applyFilters())
  }

  // Calculate total pages
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex flex-col md:flex-row gap-6">
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
              onChange={handleSearchInputChange}
              className="flex-1"
            />
            <Button className="bg-emerald-500 hover:bg-emerald-600" type="submit">
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Error loading courses: {error}</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No courses found. Try adjusting your filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course._id || index} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} courses
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="border rounded p-1 text-sm"
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                >
                  <option value="9">9 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>

                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <span className="mx-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
