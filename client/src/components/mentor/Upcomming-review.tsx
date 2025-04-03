"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink, MessageSquare, User, Video } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Student {
  id: string
  name: string
  email: string
  avatar: string
  jobTitle: string
  company: string
}

interface UpcomingReview {
  id: string
  student: Student
  date: string
  time: string
  duration: string
  topic: string
  type: "resume" | "interview" | "portfolio" | "career"
  meetingLink?: string
  notes?: string
  status: "scheduled" | "confirmed" | "pending"
}

// Dummy data for upcoming reviews
const dummyUpcomingReviews: UpcomingReview[] = [
  {
    id: "ur1",
    student: {
      id: "s1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Frontend Developer",
      company: "Tech Innovations",
    },
    date: "Today",
    time: "14:30",
    duration: "45 min",
    topic: "React Performance Optimization",
    type: "portfolio",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "confirmed",
  },
  {
    id: "ur2",
    student: {
      id: "s2",
      name: "Samantha Lee",
      email: "samantha.lee@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "UX Designer",
      company: "Creative Solutions",
    },
    date: "Tomorrow",
    time: "10:00",
    duration: "60 min",
    topic: "Portfolio Review for Senior UX Position",
    type: "portfolio",
    meetingLink: "https://zoom.us/j/123456789",
    status: "confirmed",
  },
  {
    id: "ur3",
    student: {
      id: "s3",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Software Engineer",
      company: "Global Tech",
    },
    date: "Oct 25",
    time: "15:45",
    duration: "30 min",
    topic: "Resume Review for FAANG Applications",
    type: "resume",
    status: "scheduled",
  },
  {
    id: "ur4",
    student: {
      id: "s4",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Product Manager",
      company: "Startup Inc.",
    },
    date: "Oct 26",
    time: "11:30",
    duration: "45 min",
    topic: "Mock Interview for Senior PM Role",
    type: "interview",
    status: "pending",
  },
  {
    id: "ur5",
    student: {
      id: "s5",
      name: "David Kim",
      email: "david.kim@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Backend Developer",
      company: "Data Systems",
    },
    date: "Oct 27",
    time: "09:15",
    duration: "60 min",
    topic: "System Design Interview Preparation",
    type: "interview",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123",
    status: "confirmed",
  },
]

export function UpcomingReviews() {
  const [selectedReview, setSelectedReview] = useState<UpcomingReview | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getTypeIcon = (type: UpcomingReview["type"]) => {
    switch (type) {
      case "resume":
        return <User className="h-4 w-4" />
      case "interview":
        return <Video className="h-4 w-4" />
      case "portfolio":
        return <ExternalLink className="h-4 w-4" />
      case "career":
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: UpcomingReview["type"]) => {
    switch (type) {
      case "resume":
        return "Resume Review"
      case "interview":
        return "Mock Interview"
      case "portfolio":
        return "Portfolio Review"
      case "career":
        return "Career Advice"
    }
  }

  const getStatusBadge = (status: UpcomingReview["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500">Confirmed</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
    }
  }

  const handleViewDetails = (review: UpcomingReview) => {
    setSelectedReview(review)
    setIsDetailsOpen(true)
  }

  const handleConnect = (review: UpcomingReview) => {
    // In a real app, this would open the meeting link
    window.open(review.meetingLink, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reviews</CardTitle>
        <CardDescription>Your scheduled mentoring sessions and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyUpcomingReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.student.avatar} alt={review.student.name} />
                  <AvatarFallback>{review.student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{review.student.name}</h3>
                    {getStatusBadge(review.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {review.student.jobTitle} at {review.student.company}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{review.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {review.time} ({review.duration})
                      </span>
                    </div>
                    <div className="flex items-center">
                      {getTypeIcon(review.type)}
                      <span className="ml-1">{getTypeLabel(review.type)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(review)}>
                  Details
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={!review.meetingLink || review.status === "pending"}
                  onClick={() => handleConnect(review)}
                >
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Review Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>Information about the upcoming review session</DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedReview.student.avatar} alt={selectedReview.student.name} />
                  <AvatarFallback>{selectedReview.student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedReview.student.name}</h3>
                  <p className="text-sm text-gray-500">{selectedReview.student.email}</p>
                  <p className="text-sm text-gray-500">
                    {selectedReview.student.jobTitle} at {selectedReview.student.company}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date & Time:</span>
                  <span className="text-sm">
                    {selectedReview.date} at {selectedReview.time} ({selectedReview.duration})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Review Type:</span>
                  <span className="text-sm">{getTypeLabel(selectedReview.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm">
                    {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Topic:</span>
                  <p className="text-sm mt-1">{selectedReview.topic}</p>
                </div>
                {selectedReview.notes && (
                  <div className="pt-2">
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm mt-1">{selectedReview.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {selectedReview.status !== "pending" && (
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                    Cancel Session
                  </Button>
                )}
                {selectedReview.meetingLink && selectedReview.status === "confirmed" && (
                  <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleConnect(selectedReview)}>
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

