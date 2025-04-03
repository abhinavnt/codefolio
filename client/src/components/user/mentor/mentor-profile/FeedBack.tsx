
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dummy data for feedback
const feedbackData = [
  {
    id: 1,
    name: "Sarah M.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    time: "1 week ago",
    comment: "Alex is an amazing mentor! His teaching style is clear and engaging. Highly recommend!",
  },
  {
    id: 2,
    name: "John D.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    time: "2 weeks ago",
    comment: "Great course, but I wish there were more practical examples.",
  },
  {
    id: 3,
    name: "Emily R.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    time: "3 weeks ago",
    comment: "Best instructor I've ever had. Learned so much in just a few weeks!",
  },
  {
    id: 4,
    name: "Michael T.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 3,
    time: "1 month ago",
    comment: "Good content, but the pace was a bit fast for beginners.",
  },
]

export function Feedback() {
  const [filter, setFilter] = useState("all")

  const filteredFeedback =
    filter === "all" ? feedbackData : feedbackData.filter((item) => item.rating === Number.parseInt(filter))

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Students Feedback</h3>
          <Select defaultValue="all" onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Star Rating</SelectItem>
              <SelectItem value="4">4 Star Rating</SelectItem>
              <SelectItem value="3">3 Star Rating</SelectItem>
              <SelectItem value="2">2 Star Rating</SelectItem>
              <SelectItem value="1">1 Star Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={feedback.avatar} alt={feedback.name} />
                  <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feedback.name}</span>
                    <span className="text-xs text-muted-foreground">{feedback.time}</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < feedback.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-400"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm">{feedback.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No reviews match the selected filter.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

