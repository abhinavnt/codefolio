import { Clock, Star, Trash2 } from "lucide-react"

export function Wishlist() {
  const wishlistItems = [
    {
      id: 1,
      title: "Complete React Developer in 2023",
      instructor: "Andrew Miller",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviews: 2345,
      duration: "28h 30m",
      price: 89.99,
      salePrice: 14.99,
    },
    {
      id: 2,
      title: "Advanced CSS and Sass: Flexbox, Grid, Animations",
      instructor: "Jonas Schmedtmann",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      reviews: 3456,
      duration: "21h 15m",
      price: 94.99,
      salePrice: 16.99,
    },
    {
      id: 3,
      title: "The Complete JavaScript Course 2023",
      instructor: "Jonas Schmedtmann",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      reviews: 4567,
      duration: "69h 30m",
      price: 99.99,
      salePrice: 17.99,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">My Wishlist</h1>
        <p className="text-sm text-gray-500">{wishlistItems.length} courses</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border bg-secondary rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-40 sm:h-auto relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">by {item.instructor}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{item.rating}</span>
                        <span className="text-sm text-gray-500">({item.reviews.toLocaleString()} reviews)</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{item.duration}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="mt-auto">
                        <p className="text-sm line-through text-gray-500">${item.price}</p>
                        <p className="text-lg font-bold">${item.salePrice}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Add to Cart</button>
                    <p className="text-sm text-green-600">83% off! Sale ends in 2 days</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <p className="font-medium">
              Total:{" "}
              <span className="text-lg">
                ${wishlistItems.reduce((sum, item) => sum + item.salePrice, 0).toFixed(2)}
              </span>
            </p>
            <button className="bg-green-500 text-white px-6 py-2 rounded-md text-sm">Add All to Cart</button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Browse Courses</button>
        </div>
      )}
    </div>
  )
}

