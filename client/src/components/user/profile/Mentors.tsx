
import { useState, useEffect, useMemo } from "react"
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, StarIcon, X, XCircle, Repeat } from "lucide-react"
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

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
  rescheduleRequests?: {
    requester: "user" | "mentor"
    newDate: string
    newStartTime: string
    newEndTime: string
    reason: string
    status: "pending" | "accepted" | "rejected"
    requestedAt: string
  }[]
  isRescheduled?: boolean
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
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [isRespondRescheduleDialogOpen, setIsRespondRescheduleDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [rescheduleReason, setRescheduleReason] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newEndTime, setNewEndTime] = useState("")
  const [selectedRequestIndex, setSelectedRequestIndex] = useState<number | null>(null)
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
      setError(null)
    } catch (err) {
      setError("Failed to fetch data")
      toast.error("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const mentorFeedbackMap = useMemo(() => {
    return userFeedbacks?.reduce(
      (map, feedback) => {
        map[feedback.mentorId?._id] = feedback
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

      await axiosInstance.post(`/api/booking/bookings/${bookingId}/cancel`, { cancellationReason })
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

  const handleRescheduleBooking = async () => {
    if (!selectedBooking || !rescheduleReason.trim() || !newDate || !newStartTime || !newEndTime) return

    setIsSubmitting(true)
    setError(null) 
    const originalBookings = [...bookings]
    try {
      const response = await axiosInstance.post(`/api/booking/bookings/${selectedBooking._id}/reschedule`, {
        requester: "user",
        newDate,
        newStartTime,
        newEndTime,
        reason: rescheduleReason,
      })
      const updatedBooking = response.data.booking
      setBookings((prev) => prev.map((booking) => (booking._id === selectedBooking._id ? updatedBooking : booking)))
      setIsRescheduleDialogOpen(false)
      setIsDetailsOpen(false)
      toast.success("Reschedule request sent successfully")
      setRescheduleReason("")
      setNewDate("")
      setNewStartTime("")
      setNewEndTime("")
    } catch (err: any) {
      setBookings(originalBookings)
      toast.error(err.response?.data?.error || "Failed to send reschedule request. Please try again.")
      console.error("Error sending reschedule request:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRespondReschedule = async (status: "accepted" | "rejected") => {
    if (!selectedBooking || selectedRequestIndex === null) return

    setIsSubmitting(true)
    setError(null)
    const originalBookings = [...bookings]
    try {
      const response = await axiosInstance.post(
        `/api/booking/bookings/${selectedBooking._id}/reschedule/${selectedRequestIndex}/respond`,
        { status },
      )
      const updatedBooking = response.data.booking
      setBookings((prev) => prev.map((booking) => (booking._id === selectedBooking._id ? updatedBooking : booking)))
      setIsRespondRescheduleDialogOpen(false)
      toast.success(`Reschedule request ${status} successfully`)
    } catch (err: any) {
      setBookings(originalBookings)
      toast.error(`Failed to ${status} reschedule request. Please try again.`)
      console.error("Error responding to reschedule request:", err)
    } finally {
      setIsSubmitting(false)
      setSelectedRequestIndex(null)
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

  const openRescheduleDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setRescheduleReason("")
    setNewDate("")
    setNewStartTime("")
    setNewEndTime("")
    setIsRescheduleDialogOpen(true)
  }

  const openRespondRescheduleDialog = (booking: Booking, requestIndex: number) => {
    setSelectedBooking(booking)
    setSelectedRequestIndex(requestIndex)
    setIsRespondRescheduleDialogOpen(true)
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
      console.log("selectedbooing",selectedBooking.mentorId._id," ",selectedBooking.userId);
      
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
              className={`${size} ${star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
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
                  currentBookings?.map((booking) => {
                    const pendingRescheduleRequest = booking.rescheduleRequests?.find(
                      (req) => req.requester === "mentor" && req.status === "pending",
                    )
                    return (
                      <div
                        key={booking._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <Avatar>
                            <AvatarImage
                              src={booking.mentorId?.profileImage || "/placeholder.svg"}
                              alt={booking.mentorId?.name}
                            />
                            <AvatarFallback>{booking.mentorId?.name}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Mentor: {booking.mentorId?.name}</h3>
                              {booking.isRescheduled && <Badge variant="secondary">Rescheduled</Badge>}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-primary">
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{format(new Date(booking?.date), "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>
                                  {booking.startTime} - {booking?.endTime}
                                </span>
                              </div>
                            </div>
                            {booking.status === "completed" && mentorFeedbackMap[booking.mentorId?._id] && (
                              <div className="mt-1">
                                <div className="flex items-center gap-2">
                                  <StarRating
                                    rating={mentorFeedbackMap[booking.mentorId?._id].rating}
                                    size="w-4 h-4"
                                    interactive={false}
                                  />
                                  <span className="text-sm text-gray-500">Your rating</span>
                                </div>
                              </div>
                            )}
                            {pendingRescheduleRequest && (
                              <div className="mt-1">
                                <p className="text-sm text-yellow-600">
                                  Mentor requested to reschedule to{" "}
                                  {format(new Date(pendingRescheduleRequest?.newDate), "MMMM d, yyyy")} at{" "}
                                  {pendingRescheduleRequest?.newStartTime} - {pendingRescheduleRequest?.newEndTime}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => openCancelDialog(booking)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-500 border-blue-500 hover:bg-blue-50"
                                onClick={() => openRescheduleDialog(booking)}
                              >
                                <Repeat className="h-4 w-4 mr-1" />
                                Reschedule
                              </Button>
                            </>
                          )}
                          {booking.status === "pending" && pendingRescheduleRequest && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-yellow-500 border-yellow-500 hover:bg-yellow-50"
                              onClick={() =>
                                openRespondRescheduleDialog(
                                  booking,
                                  booking.rescheduleRequests!.indexOf(pendingRescheduleRequest),
                                )
                              }
                            >
                              Respond to Reschedule
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
                              onClick={() => openFeedbackDialog(booking, mentorFeedbackMap[booking.mentorId._id])}
                            >
                              <StarIcon className="h-4 w-4 mr-1" />
                              {mentorFeedbackMap[booking.mentorId?._id] ? "Edit Rating" : "Rate Mentor"}
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-3 overflow-y-auto">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      src={selectedBooking.mentorId.profileImage || "/placeholder.svg?height=100&width=100"}
                      alt={selectedBooking.mentorId.name}
                    />
                    <AvatarFallback className="text-lg">{selectedBooking.mentorId.name}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedBooking.mentorId.name}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.mentorId.specialty}</p>
                  <Badge className={getStatusColor(selectedBooking.paymentStatus)}>
                    Payment: {selectedBooking.paymentStatus.toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </Badge>
                  {selectedBooking.isRescheduled && (
                    <Badge variant="secondary" className="ml-2">
                      Rescheduled
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-b py-3">
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
                  <p className="font-medium">₹{selectedBooking.totalPrice.toFixed(2)}</p>
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

              {selectedBooking.rescheduleRequests && selectedBooking.rescheduleRequests.length > 0 && (
                <div className="flex items-start gap-2">
                  <Repeat className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Reschedule Requests</p>
                    {selectedBooking.rescheduleRequests.map((req, index) => (
                      <p key={index} className="text-sm text-gray-500">
                        {req.requester === "user" ? "You" : "Mentor"} requested to reschedule to{" "}
                        {format(new Date(req.newDate), "MMMM d, yyyy")} at {req.newStartTime} - {req.newEndTime}.
                        Reason: {req.reason}. Status: {req.status}
                      </p>
                    ))}
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
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false)
                    openRescheduleDialog(selectedBooking)
                  }}
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                  size="sm"
                >
                  <Repeat className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
                <Button
                  onClick={() => handleJoinMeeting(selectedBooking._id)}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  size="sm"
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
                size="sm"
              >
                <StarIcon className="w-4 h-4 mr-2" />
                {mentorFeedbackMap[selectedBooking.mentorId._id] ? "Edit Rating" : "Rate Mentor"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Textarea
                id="cancellationReason"
                placeholder="Please explain why you're cancelling this session..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              {cancellationReason.trim() === "" && (
                <p className="text-xs text-red-500">Cancellation reason is required</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isSubmitting} size="sm">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedBooking && handleCancelBooking(selectedBooking._id)}
              disabled={isSubmitting || cancellationReason.trim() === ""}
              size="sm"
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="newDate">New Date</Label>
              <div className="border rounded-md p-2">
                <CalendarComponent
                  mode="single"
                  selected={newDate ? new Date(newDate) : undefined}
                  onSelect={(date) => date && setNewDate(format(date, "yyyy-MM-dd"))}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="mx-auto"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>New Time Slot</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                ].map((startTime) => {
                  // Calculate end time (1 hour later)
                  const [hours, minutes] = startTime.split(":").map(Number)
                  const endHours = hours + 1
                  const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

                  const isSelected = newStartTime === startTime && newEndTime === endTime

                  return (
                    <Button
                      key={startTime}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={`text-xs py-1.5 ${isSelected ? "bg-primary" : ""}`}
                      onClick={() => {
                        setNewStartTime(startTime)
                        setNewEndTime(endTime)
                      }}
                    >
                      {startTime} - {endTime}
                    </Button>
                  )
                })}
              </div>
              {(!newStartTime || !newEndTime) && <p className="text-xs text-red-500">Please select a time slot</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="rescheduleReason">Reschedule Reason</Label>
              <Textarea
                id="rescheduleReason"
                placeholder="Please explain why you want to reschedule this session..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              {rescheduleReason.trim() === "" && <p className="text-xs text-red-500">Reschedule reason is required</p>}
            </div>

            {newDate && newStartTime && newEndTime && (
              <div className="bg-secondary p-2 rounded-md">
                <p className="font-medium text-sm">Selected New Schedule:</p>
                <p className="text-xs">
                  {newDate ? format(new Date(newDate), "MMMM d, yyyy") : "No date selected"} at{" "}
                  {newStartTime || "--:--"} - {newEndTime || "--:--"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRescheduleDialogOpen(false)}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleRescheduleBooking}
              disabled={isSubmitting || rescheduleReason.trim() === "" || !newDate || !newStartTime || !newEndTime}
              size="sm"
            >
              {isSubmitting ? "Submitting..." : "Request Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRespondRescheduleDialogOpen} onOpenChange={setIsRespondRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Respond to Reschedule Request</DialogTitle>
          </DialogHeader>
          {selectedBooking && selectedRequestIndex !== null && (
            <div className="space-y-3 py-2">
              <p className="text-sm">
                Mentor requested to reschedule to{" "}
                {format(new Date(selectedBooking.rescheduleRequests![selectedRequestIndex].newDate), "MMMM d, yyyy")} at{" "}
                {selectedBooking.rescheduleRequests![selectedRequestIndex].newStartTime} -{" "}
                {selectedBooking.rescheduleRequests![selectedRequestIndex].newEndTime}
              </p>
              <p className="text-sm">Reason: {selectedBooking.rescheduleRequests![selectedRequestIndex].reason}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRespondRescheduleDialogOpen(false)}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRespondReschedule("rejected")}
              disabled={isSubmitting}
              size="sm"
            >
              {isSubmitting ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => handleRespondReschedule("accepted")}
              disabled={isSubmitting}
              size="sm"
            >
              {isSubmitting ? "Accepting..." : "Accept"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBooking && mentorFeedbackMap[selectedBooking.mentorId._id]
                ? "Edit Your Feedback"
                : "Rate Your Mentor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            {selectedBooking && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage
                      src={selectedBooking.mentorId.profileImage || "/placeholder.svg"}
                      alt={selectedBooking.mentorId.name}
                    />
                    <AvatarFallback>{selectedBooking.mentorId.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedBooking.mentorId.name}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(selectedBooking.date), "MMMM d, yyyy")} • {selectedBooking.startTime} -{" "}
                      {selectedBooking.endTime}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
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
                      size="w-7 h-7"
                    />
                    <span className="text-sm text-gray-500 ml-2">
                      {userRating > 0 ? `${userRating} out of 5 stars` : "Select a rating"}
                    </span>
                  </div>
                  {userRating === 0 && <p className="text-xs text-red-500">Please select a rating</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="userFeedback" className="block text-sm font-medium">
                    Your Feedback
                  </Label>
                  <Textarea
                    id="userFeedback"
                    placeholder="Share your experience with this mentor..."
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  {userFeedback.trim() === "" && <p className="text-xs text-red-500">Feedback is required</p>}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)} disabled={isSubmitting} size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || userFeedback.trim() === "" || userRating === 0}
              className="bg-amber-500 hover:bg-amber-600"
              size="sm"
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
