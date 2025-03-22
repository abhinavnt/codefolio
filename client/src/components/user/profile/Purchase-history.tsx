import { Download, FileText } from "lucide-react"

export function PurchaseHistory() {
  const purchases = [
    {
      id: "INV-2023-001",
      date: "Mar 15, 2023",
      course: "The Complete Web Developer Bootcamp",
      image: "/placeholder.svg?height=80&width=120",
      price: 14.99,
      status: "Completed",
    },
    {
      id: "INV-2023-002",
      date: "Feb 28, 2023",
      course: "Advanced JavaScript Concepts",
      image: "/placeholder.svg?height=80&width=120",
      price: 12.99,
      status: "Completed",
    },
    {
      id: "INV-2023-003",
      date: "Jan 10, 2023",
      course: "UI/UX Design Fundamentals",
      image: "/placeholder.svg?height=80&width=120",
      price: 16.99,
      status: "Completed",
    },
  ]

  return (
    <div className="max-w-4xl  mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Purchase History</h1>
        <select className="border rounded-md px-3 py-1.5 text-sm">
          <option>All Time</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {purchases.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Invoice
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-16 flex-shrink-0">
                        <img
                          src={purchase.image || "/placeholder.svg"}
                          alt={purchase.course}
                          width={64}
                          height={40}
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{purchase.course}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${purchase.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-gray-500 hover:text-gray-700" title="Download Invoice">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700" title="View Receipt">
                        <FileText className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't made any purchases yet.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Browse Courses</button>
        </div>
      )}
    </div>
  )
}

