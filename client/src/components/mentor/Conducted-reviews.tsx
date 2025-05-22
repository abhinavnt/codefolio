"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, Star, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: string
  name: string
  email: string
  avatar: string
  jobTitle: string
  company: string
}

interface ConductedReview {
  id: string
  student: Student
  date: string
  time: string
  duration: string
  topic: string
  type: "resume" | "interview" | "portfolio" | "career"
  score?: number
  feedback?: string
  status: "completed" | "no-show" | "cancelled"
}

// Dummy data for conducted reviews
const dummyConductedReviews: ConductedReview[] = [
  {
    id: "cr1",
    student: {
      id: "s6",
      name: "James Wilson",
      email: "james.wilson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Frontend Developer",
      company: "Web Solutions",
    },
    date: "Oct 20",
    time: "13:00",
    duration: "45 min",
    topic: "React Component Architecture",
    type: "portfolio",
    score: 4,
    feedback:
      "James has a solid understanding of React fundamentals. We discussed component architecture and state management. He should focus more on performance optimization techniques.",
    status: "completed",
  },
  {
    id: "cr2",
    student: {
      id: "s7",
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "UX/UI Designer",
      company: "Design Studio",
    },
    date: "Oct 18",
    time: "11:30",
    duration: "60 min",
    topic: "Portfolio Review for Senior Design Position",
    type: "portfolio",
    score: 5,
    feedback:
      "Olivia's portfolio is exceptional. Her case studies are well-documented and showcase her design process clearly. She's ready for senior positions.",
    status: "completed",
  },
  {
    id: "cr3",
    student: {
      id: "s8",
      name: "Daniel Brown",
      email: "daniel.brown@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Software Engineer",
      company: "Tech Innovations",
    },
    date: "Oct 15",
    time: "09:45",
    duration: "30 min",
    topic: "Resume Review for Mid-level Positions",
    type: "resume",
    status: "no-show",
  },
  {
    id: "cr4",
    student: {
      id: "s9",
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Product Manager",
      company: "Product Labs",
    },
    date: "Oct 12",
    time: "14:15",
    duration: "45 min",
    topic: "Mock Interview for Product Leadership",
    type: "interview",
    score: 3,
    feedback:
      "Sophia has good product knowledge but needs to work on her communication of technical concepts to non-technical stakeholders. We practiced some scenarios.",
    status: "completed",
  },
  {
    id: "cr5",
    student: {
      id: "s10",
      name: "Ethan Taylor",
      email: "ethan.taylor@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "DevOps Engineer",
      company: "Cloud Systems",
    },
    date: "Oct 10",
    time: "10:00",
    duration: "60 min",
    topic: "Career Transition to Cloud Architecture",
    type: "career",
    status: "cancelled",
  },
]

export function ConductedReviews() {
  const [selectedReview, setSelectedReview] = useState<ConductedReview | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // For editing feedback
  const [editScore, setEditScore] = useState<number>(0)
  const [editFeedback, setEditFeedback] = useState<string>("")

  const getTypeIcon = (type: ConductedReview["type"]) => {
    switch (type) {
      case "resume":
        return <User className="h-4 w-4" />
      case "interview":
        return <User className="h-4 w-4" />
      case "portfolio":
        return <User className="h-4 w-4" />
      case "career":
        return <User className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: ConductedReview["type"]) => {
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

  const getStatusBadge = (status: ConductedReview["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500">Completed</Badge>
      case "no-show":
        return <Badge className="bg-red-500">No Show</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Cancelled
          </Badge>
        )
    }
  }

  const handleViewDetails = (review: ConductedReview) => {
    setSelectedReview(review)
    setIsDetailsOpen(true)
  }

  const handleEditFeedback = (review: ConductedReview) => {
    setSelectedReview(review)
    setEditScore(review.score || 0)
    setEditFeedback(review.feedback || "")
    setIsFeedbackOpen(true)
  }

  const handleSaveFeedback = () => {
    // In a real app, this would update the feedback in the database
    

    // Update the local state for demo purposes
    const updatedReviews = dummyConductedReviews.map((review) =>
      review.id === selectedReview?.id ? { ...review, score: editScore, feedback: editFeedback } : review,
    )

    // Close the dialog
    setIsFeedbackOpen(false)
  }

  const filteredReviews =
    activeTab === "all" ? dummyConductedReviews : dummyConductedReviews.filter((review) => review.status === activeTab)

  return (
    <div>comming soon</div>
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Conducted Reviews</CardTitle>
    //     <CardDescription>Past mentoring sessions and student feedback</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
    //       <TabsList>
    //         <TabsTrigger value="all">All</TabsTrigger>
    //         <TabsTrigger value="completed">Completed</TabsTrigger>
    //         <TabsTrigger value="no-show">No Show</TabsTrigger>
    //         <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
    //       </TabsList>
    //     </Tabs>

    //     <div className="space-y-4">
    //       {filteredReviews.map((review) => (
    //         <div
    //           key={review.id}
    //           className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    //         >
    //           <div className="flex items-start gap-4 mb-4 md:mb-0">
    //             <Avatar className="h-10 w-10">
    //               <AvatarImage src={review.student.avatar} alt={review.student.name} />
    //               <AvatarFallback>{review.student.name.charAt(0)}</AvatarFallback>
    //             </Avatar>
    //             <div>
    //               <div className="flex items-center gap-2">
    //                 <h3 className="font-medium">{review.student.name}</h3>
    //                 {getStatusBadge(review.status)}
    //               </div>
    //               <p className="text-sm text-gray-500">
    //                 {review.student.jobTitle} at {review.student.company}
    //               </p>
    //               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
    //                 <div className="flex items-center">
    //                   <Calendar className="h-3 w-3 mr-1" />
    //                   <span>{review.date}</span>
    //                 </div>
    //                 <div className="flex items-center">
    //                   <Clock className="h-3 w-3 mr-1" />
    //                   <span>
    //                     {review.time} ({review.duration})
    //                   </span>
    //                 </div>
    //                 {review.score && (
    //                   <div className="flex items-center">
    //                     <Star className="h-3 w-3 mr-1 text-amber-500 fill-amber-500" />
    //                     <span>{review.score}/5</span>
    //                   </div>
    //                 )}
    //               </div>
    //             </div>
    //           </div>

    //           <div className="flex items-center gap-2 self-end md:self-auto">
    //             <Button variant="outline" size="sm" onClick={() => handleViewDetails(review)}>
    //               Details
    //             </Button>
    //             {review.status === "completed" && (
    //               <Button
    //                 size="sm"
    //                 className="bg-emerald-500 hover:bg-emerald-600"
    //                 onClick={() => handleEditFeedback(review)}
    //               >
    //                 <Edit className="h-4 w-4 mr-1" />
    //                 {review.feedback ? "Edit Feedback" : "Add Feedback"}
    //               </Button>
    //             )}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </CardContent>

    //   {/* Review Details Dialog */}
    //   <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
    //     <DialogContent className="sm:max-w-md">
    //       <DialogHeader>
    //         <DialogTitle>Review Details</DialogTitle>
    //         <DialogDescription>Information about the conducted review session</DialogDescription>
    //       </DialogHeader>

    //       {selectedReview && (
    //         <div className="space-y-4">
    //           <div className="flex items-center gap-4">
    //             <Avatar className="h-12 w-12">
    //               <AvatarImage src={selectedReview.student.avatar} alt={selectedReview.student.name} />
    //               <AvatarFallback>{selectedReview.student.name.charAt(0)}</AvatarFallback>
    //             </Avatar>
    //             <div>
    //               <h3 className="font-medium">{selectedReview.student.name}</h3>
    //               <p className="text-sm text-gray-500">{selectedReview.student.email}</p>
    //               <p className="text-sm text-gray-500">
    //                 {selectedReview.student.jobTitle} at {selectedReview.student.company}
    //               </p>
    //             </div>
    //           </div>

    //           <div className="space-y-2 border-t pt-4">
    //             <div className="flex justify-between">
    //               <span className="text-sm font-medium">Date & Time:</span>
    //               <span className="text-sm">
    //                 {selectedReview.date} at {selectedReview.time} ({selectedReview.duration})
    //               </span>
    //             </div>
    //             <div className="flex justify-between">
    //               <span className="text-sm font-medium">Review Type:</span>
    //               <span className="text-sm">{getTypeLabel(selectedReview.type)}</span>
    //             </div>
    //             <div className="flex justify-between">
    //               <span className="text-sm font-medium">Status:</span>
    //               <span className="text-sm">
    //                 {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
    //               </span>
    //             </div>
    //             <div className="pt-2">
    //               <span className="text-sm font-medium">Topic:</span>
    //               <p className="text-sm mt-1">{selectedReview.topic}</p>
    //             </div>

    //             {selectedReview.status === "completed" && (
    //               <>
    //                 <div className="flex justify-between pt-2">
    //                   <span className="text-sm font-medium">Score:</span>
    //                   <span className="text-sm flex items-center">
    //                     {selectedReview.score ? (
    //                       <>
    //                         {selectedReview.score}/5
    //                         <Star className="h-3 w-3 ml-1 text-amber-500 fill-amber-500" />
    //                       </>
    //                     ) : (
    //                       "Not rated"
    //                     )}
    //                   </span>
    //                 </div>

    //                 {selectedReview.feedback && (
    //                   <div className="pt-2">
    //                     <span className="text-sm font-medium">Feedback:</span>
    //                     <p className="text-sm mt-1 bg-gray-50 p-3 rounded-md">{selectedReview.feedback}</p>
    //                   </div>
    //                 )}
    //               </>
    //             )}
    //           </div>

    //           <div className="flex justify-end gap-2 pt-2">
    //             {selectedReview.status === "completed" && (
    //               <Button
    //                 className="bg-emerald-500 hover:bg-emerald-600"
    //                 onClick={() => {
    //                   setIsDetailsOpen(false)
    //                   handleEditFeedback(selectedReview)
    //                 }}
    //               >
    //                 <Edit className="h-4 w-4 mr-1" />
    //                 {selectedReview.feedback ? "Edit Feedback" : "Add Feedback"}
    //               </Button>
    //             )}
    //           </div>
    //         </div>
    //       )}
    //     </DialogContent>
    //   </Dialog>

    //   {/* Feedback Dialog */}
    //   <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
    //     <DialogContent className="sm:max-w-md">
    //       <DialogHeader>
    //         <DialogTitle>{selectedReview?.feedback ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
    //         <DialogDescription>
    //           {selectedReview &&
    //             `For ${selectedReview.student.name}'s ${getTypeLabel(selectedReview.type).toLowerCase()} on ${selectedReview.date}`}
    //         </DialogDescription>
    //       </DialogHeader>

    //       <div className="space-y-4 py-2">
    //         <div className="space-y-2">
    //           <Label htmlFor="score">Score (1-5)</Label>
    //           <div className="flex items-center gap-2">
    //             {[1, 2, 3, 4, 5].map((score) => (
    //               <Button
    //                 key={score}
    //                 type="button"
    //                 variant={editScore === score ? "default" : "outline"}
    //                 size="sm"
    //                 className={editScore === score ? "bg-emerald-500 hover:bg-emerald-600" : ""}
    //                 onClick={() => setEditScore(score)}
    //               >
    //                 {score}
    //               </Button>
    //             ))}
    //           </div>
    //         </div>

    //         <div className="space-y-2">
    //           <Label htmlFor="feedback">Feedback</Label>
    //           <Textarea
    //             id="feedback"
    //             value={editFeedback}
    //             onChange={(e) => setEditFeedback(e.target.value)}
    //             placeholder="Provide detailed feedback about the session..."
    //             rows={6}
    //           />
    //         </div>
    //       </div>

    //       <DialogFooter>
    //         <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
    //           Cancel
    //         </Button>
    //         <Button onClick={handleSaveFeedback} className="bg-emerald-500 hover:bg-emerald-600">
    //           Save Feedback
    //         </Button>
    //       </DialogFooter>
    //     </DialogContent>
    //   </Dialog>
    // </Card>
  )
}

