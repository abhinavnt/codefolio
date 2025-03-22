import { Search, Send } from "lucide-react"

export function Message() {
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=50&width=50",
      lastMessage: "Thanks for your question about the course...",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "/placeholder.svg?height=50&width=50",
      lastMessage: "I've reviewed your assignment and...",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      image: "/placeholder.svg?height=50&width=50",
      lastMessage: "The next design workshop will be on...",
      time: "Mar 15",
      unread: 0,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <h1 className="text-xl font-medium mb-6">Messages</h1>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Conversation List */}
          <div className="border-r">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer ${
                    convo.id === 1 ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={convo.image || "/placeholder.svg"}
                        alt={convo.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    {convo.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{convo.unread}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{convo.name}</h3>
                      <span className="text-xs text-gray-500">{convo.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="col-span-2 flex flex-col h-[500px]">
            <div className="p-3 border-b flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Sarah Johnson"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">Sarah Johnson</h3>
                <p className="text-xs text-gray-500">Web Development Instructor</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hi there! How can I help you with the course material?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:15 AM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    I'm having trouble understanding the JavaScript closures concept. Could you explain it again?
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">10:20 AM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    Of course! Closures are functions that remember the environment in which they were created. This
                    means they can access variables from their parent function even after the parent function has
                    finished executing.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">10:25 AM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Would you like me to provide an example to make it clearer?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full pr-10 pl-3 py-2 border rounded-md"
                />
                <button className="absolute right-3 top-2 text-green-500">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

