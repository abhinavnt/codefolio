"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
// import Image from "next/image"
import { relatedCoursesData } from "@/data/dummy-data" 
import { useRef } from "react"

export default function RelatedCourses() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Related Courses</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 p-0 border-emerald-200 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 p-0 border-emerald-200 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {relatedCoursesData.map((course, index) => (
          <Card key={index} className="flex-shrink-0 w-[280px] snap-start overflow-hidden">
            <div className="flex flex-col">
              <div className="relative h-36 w-full">
                <img src={course.image || "/placeholder.svg"} alt={course.title} className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-bold line-clamp-2 h-12">{course.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{course.instructor}</p>
                <div className="flex items-center mt-2">
                  <span className="font-bold text-emerald-500">{course.rating}</span>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(course.rating) ? "fill-emerald-500 text-emerald-500" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">({course.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold">${course.price}</span>
                    {course.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">${course.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom scrollbar styling */}
     
    </div>
  )
}

