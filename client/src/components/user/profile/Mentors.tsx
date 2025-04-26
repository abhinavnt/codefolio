"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, StarIcon, X, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axiosInstance from "@/utils/axiosInstance"
import { useNavigate } from "react-router-dom"

interface Booking {
  _id: string
  mentorId: {
    _id: string
    name: string
    profileImage?: string
    specialty?: string
  }
  userId: string
  date: string
  startTime: string
  endTime: string
  paymentStatus: "pending" | "completed" | "failed"
  status: "pending" | "completed" | "cancelled"
  totalPrice: number
  feedback?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

interface IMentorFeedback {
  _id: string
  mentorId: {
    _id: string
    name: string
    profileImage?: string
  }
  userId: string
  rating: number
  feedback: string
  createdAt: string
  updatedAt: string
}

export function Mentors() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [userFeedbacks, setUserFeedbacks] = useState<IMentorFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [userFeedback, setUserFeedback] = useState("")
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "cancelled">("pending")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsRes, feedbacksRes] = await Promise.all([
        axiosInstance.get("/api/booking/user-bookings"),
        axiosInstance.get("/api/feedback/user-feedbacks"),
      ])
      setBookings(bookingsRes.data)
      setUserFeedbacks(feedbacksRes.data)
    } catch (err) {
      setError("Failed to fetch data")
      toast.error("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const mentorFeedbackMap = useMemo(() => {
    return userFeedbacks.reduce(
      (map, feedback) => {
        map[feedback.mentorId._id] = feedback
        return map
      },
      {} as { [mentorId: string]: IMentorFeedback },
    )
  }, [userFeedbacks])

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsOpen(true)
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!cancellationReason.trim()) return

    setIsSubmitting(true)
    const originalBookings = [...bookings]
    try {
      const updatedBookings = bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, status: "cancelled" as const, cancellationReason } : booking,
      )
      setBookings(updatedBookings)
      setIsCancelDialogOpen(false)
      setIsDetailsOpen(false)

      throw new Error("not done")

      toast.success("Booking cancelled successfully")
    } catch (err) {
      setBookings(originalBookings)
      setError("Failed to cancel booking. Please try again later.")
      toast.error("Failed to cancel booking. Please try again.")
      console.error("Error cancelling booking:", err)
    } finally {
      setIsSubmitting(false)
      setCancellationReason("")
    }
  }

  const handleJoinMeeting = (bookingId: string) => {
    navigate(`/video-call/${bookingId}`)
  }

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancellationReason(booking.cancellationReason || "")
    setIsCancelDialogOpen(true)
  }

  const openFeedbackDialog = (booking: Booking, existingFeedback?: IMentorFeedback) => {
    setSelectedBooking(booking)
    if (existingFeedback) {
      setUserFeedback(existingFeedback.feedback)
      setUserRating(existingFeedback.rating)
    } else {
      setUserFeedback("")
      setUserRating(0)
    }
    setIsFeedbackDialogOpen(true)
  }

  const handleSubmitFeedback = async () => {
    if (!userFeedback.trim() || userRating === 0) {
      toast.error("Please provide both feedback and rating")
      return
    }
    if (!selectedBooking) return

    setIsSubmitting(true)
    try {
      const feedbackData = {
        mentorId: selectedBooking.mentorId._id,
        userId: selectedBooking.userId,
        rating: userRating,
        feedback: userFeedback,
      }
      const response = await axiosInstance.post("/api/feedback/mentor", feedbackData)
      const updatedFeedback = response.data

      const formattedFeedback = {
        ...updatedFeedback,
        mentorId:
          typeof updatedFeedback.mentorId === "string"
            ? {
              _id: updatedFeedback.mentorId,
              name: selectedBooking.mentorId.name,
              profileImage: selectedBooking.mentorId.profileImage,
            }
            : updatedFeedback.mentorId,
      }

      // Update the userFeedbacks state with the new feedback
      setUserFeedbacks((prev) => {
        const existingIndex = prev.findIndex((f) => f.mentorId._id === selectedBooking.mentorId._id)
        if (existingIndex >= 0) {
         
          const newFeedbacks = [...prev]
          newFeedbacks[existingIndex] = formattedFeedback
          return newFeedbacks
        } else {
         
          return [...prev, formattedFeedback]
        }
      })

      toast.success("Feedback submitted successfully")
    } catch (err) {
      toast.error("Failed to submit feedback. Please try again.")
      console.error("Error submitting feedback:", err)
    } finally {
      setIsSubmitting(false)
      setIsFeedbackDialogOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter((booking) => booking.status === activeTab)
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  //star component
  const StarRating = ({
    rating,
    hoverRating,
    onRatingChange,
    onHoverChange,
    onMouseLeave,
    size = "w-6 h-6",
    interactive = true,
  }: {
    rating: number
    hoverRating?: number
    onRatingChange?: (rating: number) => void
    onHoverChange?: (rating: number) => void
    onMouseLeave?: () => void
    size?: string
    interactive?: boolean
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && onHoverChange && onHoverChange(star)}
            onMouseLeave={() => interactive && onMouseLeave && onMouseLeave()}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} p-0.5 focus:outline-none`}
            aria-label={`Rate ${star} stars out of 5`}
          >
            <StarIcon
              className={`${size} ${star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-54" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
        <div className="border rounded-lg p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
          <CardDescription>upcoming and past mentoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => {
                    const feedback = mentorFeedbackMap[booking.mentorId._id]
                    return (
                      <div
                        key={booking._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <Avatar>
                            <AvatarImage
                              src={booking.mentorId.profileImage || "/placeholder.svg"}
                              alt={booking.mentorId.name}
                            />
                            <AvatarFallback>{booking.mentorId.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Mentor: {booking.mentorId.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-primary">
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                            </div>
                            {booking.status === "completed" && feedback && (
                              <div className="mt-1">
                                <div className="flex items-center gap-2">
                                  <StarRating rating={feedback.rating} size="w-4 h-4" interactive={false} />
                                  <span className="text-sm text-gray-500">Your rating</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                          {booking.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-50"
                              onClick={() => openCancelDialog(booking)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                          {booking.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                              onClick={() => handleJoinMeeting(booking._id)}
                            >
                              Join Meeting
                            </Button>
                          )}
                          {booking.status === "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-500 border-amber-500 hover:bg-amber-50"
                              onClick={() => openFeedbackDialog(booking, feedback)}
                            >
                              <StarIcon className="h-4 w-4 mr-1" />
                              {feedback ? "Edit Rating" : "Rate Mentor"}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No {activeTab} bookings found.</p>
                  </div>
                )}

                {filteredBookings.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                      >
                        <span className="sr-only">Previous Page</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => paginate(page)}
                          className="h-8 w-8"
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                      >
                        <span className="sr-only">Next Page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={selectedBooking.mentorId.profileImage || "/placeholder.svg?height=100&width=100"}
                      alt={selectedBooking.mentorId.name}
                    />
                    <AvatarFallback className="text-lg">{selectedBooking.mentorId.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedBooking.mentorId.name}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.mentorId.specialty}</p>
                  <Badge className={getStatusColor(selectedBooking.paymentStatus)}>
                    Payment:{" "}
                    {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b py-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{format(new Date(selectedBooking.date), "MMMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {selectedBooking.startTime} - {selectedBooking.endTime}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium text-xs">{selectedBooking._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${selectedBooking.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Booked on</p>
                <p className="font-medium">{format(new Date(selectedBooking.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
              </div>

              {selectedBooking.status === "completed" && selectedBooking.feedback && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Mentor's Feedback</p>
                    <p className="text-sm text-gray-500">{selectedBooking.feedback}</p>
                  </div>
                </div>
              )}

              {selectedBooking.status === "completed" && mentorFeedbackMap[selectedBooking.mentorId._id] && (
                <div className="flex items-start gap-2">
                  <StarIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Your Feedback</p>
                    <div className="mb-1">
                      <StarRating
                        rating={mentorFeedbackMap[selectedBooking.mentorId._id].rating}
                        size="w-4 h-4"
                        interactive={false}
                      />
                    </div>
                    <p className="text-sm text-gray-500">{mentorFeedbackMap[selectedBooking.mentorId._id].feedback}</p>
                  </div>
                </div>
              )}

              {selectedBooking.status === "cancelled" && selectedBooking.cancellationReason && (
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Cancellation Reason</p>
                    <p className="text-sm text-gray-500">{selectedBooking.cancellationReason}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedBooking && selectedBooking.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsOpen(false)
                    openCancelDialog(selectedBooking)
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
                <Button
                  onClick={() => handleJoinMeeting(selectedBooking._id)}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Join Meeting
                </Button>
              </>
            )}
            {selectedBooking && selectedBooking.status === "completed" && (
              <Button
                onClick={() => {
                  setIsDetailsOpen(false)
                  openFeedbackDialog(selectedBooking, mentorFeedbackMap[selectedBooking.mentorId._id])
                }}
                className={
                  mentorFeedbackMap[selectedBooking.mentorId._id]
                    ? "bg-white hover:bg-gray-100"
                    : "bg-amber-500 hover:bg-amber-600"
                }
                variant={mentorFeedbackMap[selectedBooking.mentorId._id] ? "outline" : "default"}
              >
                <StarIcon className="w-4 h-4 mr-2" />
                {mentorFeedbackMap[selectedBooking.mentorId._id] ? "Edit Rating" : "Rate Mentor"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Textarea
                id="cancellationReason"
                placeholder="Please explain why you're cancelling this session..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[100px]"
              />
              {cancellationReason.trim() === "" && (
                <p className="text-sm text-red-500">Cancellation reason is required</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedBooking && handleCancelBooking(selectedBooking._id)}
              disabled={isSubmitting || cancellationReason.trim() === ""}
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedBooking && mentorFeedbackMap[selectedBooking.mentorId._id]
                ? "Edit Your Feedback"
                : "Rate Your Mentor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedBooking && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage
                      src={selectedBooking.mentorId.profileImage || "/placeholder.svg"}
                      alt={selectedBooking.mentorId.name}
                    />
                    <AvatarFallback>{selectedBooking.mentorId.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedBooking.mentorId.name}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(selectedBooking.date), "MMMM d, yyyy")} • {selectedBooking.startTime} -{" "}
                      {selectedBooking.endTime}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating" className="block text-sm font-medium">
                    Rating
                  </Label>
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={userRating}
                      hoverRating={hoverRating}
                      onRatingChange={setUserRating}
                      onHoverChange={setHoverRating}
                      onMouseLeave={() => setHoverRating(0)}
                      size="w-8 h-8"
                    />
                    <span className="text-sm text-gray-500 ml-2">
                      {userRating > 0 ? `${userRating} out of 5 stars` : "Select a rating"}
                    </span>
                  </div>
                  {userRating === 0 && <p className="text-sm text-red-500">Please select a rating</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userFeedback" className="block text-sm font-medium">
                    Your Feedback
                  </Label>
                  <Textarea
                    id="userFeedback"
                    placeholder="Share your experience with this mentor..."
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    className="min-h-[120px]"
                  />
                  {userFeedback.trim() === "" && <p className="text-sm text-red-500">Feedback is required</p>}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || userFeedback.trim() === "" || userRating === 0}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isSubmitting
                ? "Submitting..."
                : selectedBooking && mentorFeedbackMap[selectedBooking.mentorId._id]
                  ? "Update Feedback"
                  : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
