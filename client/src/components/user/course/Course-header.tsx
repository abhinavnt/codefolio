import { Star } from "lucide-react"

interface CourseHeaderProps {
  course: any
}

export default function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{course.title}</h1>
      <p className="mt-2 text-gray-600">{course.subtitle||"N/A"}</p>

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < course.rating ? "fill-emerald-500 text-emerald-500" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({course.reviewCount||"N/A"} reviews)</span>
        </div>

        <span className="text-sm text-gray-600">{course.enrolledStudents.length} students</span>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img src="/placeholder.svg?height=32&width=32" alt="Instructor" className="object-cover w-full h-full" />
            </div>
          </div>
          <span className="text-sm text-gray-600">
            {/* Created by <span className="font-medium">{course.instructor.name}</span> */}
          </span>
        </div>

        <span className="text-sm text-gray-600">Last updated {course.updatedAt}</span>
      </div>
    </div>
  )
}

