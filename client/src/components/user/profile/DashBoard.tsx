import { BarChart, BookOpen, Users } from "lucide-react"

export function Dashboard() {
  const stats = [
    { label: "Courses Enrolled", value: 4, icon: BookOpen, color: "bg-blue-100 text-blue-600" },
    { label: "Completed Courses", value: 2, icon: BookOpen, color: "bg-green-100 text-green-600" },
    { label: "Hours Spent", value: "24h", icon: BarChart, color: "bg-purple-100 text-purple-600" },
    { label: "Instructors Following", value: 3, icon: Users, color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <h1 className="text-xl font-medium mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="border rounded-lg p-4 flex items-center">
            <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">No recent activity to display</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Recommended Courses</h2>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">No recommended courses available</p>
        </div>
      </div>
    </div>
  )
}

