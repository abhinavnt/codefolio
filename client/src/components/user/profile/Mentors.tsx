import { Star } from "lucide-react"

export function Mentors() {
  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Web Development",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      courses: 12,
      students: "10k+",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      specialty: "JavaScript & React",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      courses: 8,
      students: "15k+",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      specialty: "UI/UX Design",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      courses: 6,
      students: "8k+",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Teachers You Follow</h1>
        <div>
          <input type="text" placeholder="Search teachers..." className="border rounded-md px-3 py-1.5 text-sm" />
        </div>
      </div>

      {teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="border rounded-lg overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={teacher.image || "/placeholder.svg"}
                    alt={teacher.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium mb-1">{teacher.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{teacher.specialty}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{teacher.rating}</span>
                </div>
                <div className="flex justify-between w-full text-sm text-gray-500">
                  <span>{teacher.courses} Courses</span>
                  <span>{teacher.students} Students</span>
                </div>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md text-sm w-full">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You're not following any teachers yet.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Discover Teachers</button>
        </div>
      )}
    </div>
  )
}

