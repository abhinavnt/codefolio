"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  MapPin,
  User,
  XCircle,
  Repeat,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import axiosInstance from "@/utils/axiosInstance"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Booking {
  id: string
  mentorId: string
  userId: string
  studentName: string
  studentEmail: string
  studentImage: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  status: "pending" | "completed" | "cancelled"
  paymentStatus: "pending" | "completed" | "failed"
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
}

export function Bookings({ mentorId }: { mentorId?: string }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "cancelled">("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isEditFeedbackDialogOpen, setIsEditFeedbackDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [isRespondRescheduleDialogOpen, setIsRespondRescheduleDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [rescheduleReason, setRescheduleReason] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newEndTime, setNewEndTime] = useState("")
  const [selectedRequestIndex, setSelectedRequestIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    fetchBookings()
  }, [mentorId])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get(`/api/booking/bookings`)
      setBookings(response.data)
    } catch (error) {
      setError("Failed to fetch bookings")
      toast.error("Failed to fetch bookings. Please try again.")
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleJoinMeeting = (bookingId: string) => {
    navigate(`/video-call/${bookingId}`)
  }

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancellationReason.trim()) return

    setIsSubmitting(true)
    setError(null)
    const originalBookings = [...bookings]
    try {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, status: "cancelled" as const, cancellationReason } : booking,
      )
      setBookings(updatedBookings)
      setIsCancelDialogOpen(false)
      setIsDetailsOpen(false)

      const response = await axiosInstance.patch(`/api/booking/bookings/${selectedBooking.id}/cancel`, {
        cancellationReason,
      })

      toast.success(response.data.message || "Booking cancelled successfully")
    } catch (error: any) {
      setBookings(originalBookings)
      setError(error.response?.data?.error || "Failed to cancel booking")
      toast.error(error.response?.data?.error || "Failed to cancel booking. Please try again.")
      console.error("Error cancelling booking:", error)
    } finally {
      setIsSubmitting(false)
      setCancellationReason("")
    }
  }

  const handleCompleteBooking = async () => {
    if (!selectedBooking || !feedback.trim()) return

    setIsSubmitting(true)
    setError(null)
    const originalBookings = [...bookings]
    try {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, status: "completed" as const, feedback } : booking,
      )
      setBookings(updatedBookings)
      setIsCompleteDialogOpen(false)
      setIsDetailsOpen(false)

      const response = await axiosInstance.patch(`/api/booking/bookings/${selectedBooking.id}/complete`, {
        feedback,
      })

      toast.success(response.data.message || "Booking marked as completed")
    } catch (error: any) {
      setBookings(originalBookings)
      setError(error.response?.data?.error || "Failed to complete booking")
      toast.error(error.response?.data?.error || "Failed to mark booking as completed. Please try again.")
      console.error("Error completing booking:", error)
    } finally {
      setIsSubmitting(false)
      setFeedback("")
    }
  }

  const handleEditFeedback = async () => {
    if (!selectedBooking || !feedback.trim()) return

    setIsSubmitting(true)
    setError(null)
    const originalBookings = [...bookings]
    try {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, feedback } : booking,
      )
      setBookings(updatedBookings)
      setIsEditFeedbackDialogOpen(false)

      const response = await axiosInstance.patch(`/api/booking/bookings/${selectedBooking.id}/feedback`, {
        feedback,
      })

      toast.success(response.data.message || "Feedback updated successfully")
    } catch (error: any) {
      setBookings(originalBookings)
      setError(error.response?.data?.error || "Failed to update feedback")
      toast.error(error.response?.data?.error || "Failed to update feedback. Please try again.")
      console.error("Error updating feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRescheduleBooking = async () => {
    if (!selectedBooking || !rescheduleReason.trim() || !newDate || !newStartTime || !newEndTime) return

    setIsSubmitting(true)
    setError(null)
    const originalBookings = [...bookings]
    try {
      const response = await axiosInstance.post(`/api/booking/bookings/${selectedBooking.id}/reschedule`, {
        requester: "mentor",
        newDate,
        newStartTime,
        newEndTime,
        reason: rescheduleReason,
      })
      const updatedBooking = response.data.booking
      setBookings((prev) => prev.map((booking) => (booking.id === selectedBooking.id ? updatedBooking : booking)))
      setIsRescheduleDialogOpen(false)
      setIsDetailsOpen(false)
      toast.success("Reschedule request sent successfully")
      setRescheduleReason("")
      setNewDate("")
      setNewStartTime("")
      setNewEndTime("")
    } catch (err: any) {
      setBookings(originalBookings)
      setError(err.response?.data?.error || "Failed to send reschedule request")
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
        `/api/booking/bookings/${selectedBooking.id}/reschedule/${selectedRequestIndex}/respond`,
        { status },
      )
      const updatedBooking = response.data.booking
      setBookings((prev) => prev.map((booking) => (booking.id === selectedBooking.id ? updatedBooking : booking)))
      setIsRespondRescheduleDialogOpen(false)
      toast.success(`Reschedule request ${status} successfully`)
    } catch (err: any) {
      setBookings(originalBookings)
      setError(err.response?.data?.error || `Failed to ${status} reschedule request`)
      toast.error(err.response?.data?.error || `Failed to ${status} reschedule request. Please try again.`)
      console.error("Error responding to reschedule request:", err)
    } finally {
      setIsSubmitting(false)
      setSelectedRequestIndex(null)
    }
  }

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancellationReason("")
    setIsCancelDialogOpen(true)
  }

  const openCompleteDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setFeedback(booking.feedback || "")
    setIsCompleteDialogOpen(true)
  }

  const openEditFeedbackDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setFeedback(booking.feedback || "")
    setIsEditFeedbackDialogOpen(true)
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

  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsOpen(true)
  }

  const filteredBookings = bookings.filter((booking) => booking.status === activeTab)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

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
          <Button onClick={() => fetchBookings()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Manage your upcoming and past mentoring sessions</CardDescription>
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
                    const pendingRescheduleRequest = booking.rescheduleRequests?.find(
                      (req) => req.requester === "user" && req.status === "pending",
                    )
                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <Avatar>
                            <AvatarImage src={booking.studentImage || "/placeholder.svg"} alt={booking.studentName} />
                            <AvatarFallback>{booking.studentName}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{booking.studentName}</h3>
                              {booking.isRescheduled && <Badge variant="secondary">Rescheduled</Badge>}
                            </div>
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
                            {pendingRescheduleRequest && (
                              <div className="mt-2">
                                <p className="text-sm text-yellow-600">
                                  Reschedule Request:{" "}
                                  {format(new Date(pendingRescheduleRequest.newDate), "MMMM d, yyyy")} at{" "}
                                  {pendingRescheduleRequest.newStartTime} - {pendingRescheduleRequest.newEndTime}
                                </p>
                                <p className="text-sm text-gray-500">Reason: {pendingRescheduleRequest.reason}</p>
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                                onClick={() => openCompleteDialog(booking)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              {pendingRescheduleRequest && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                  onClick={() =>
                                    openRespondRescheduleDialog(
                                      booking,
                                      booking.rescheduleRequests!.indexOf(pendingRescheduleRequest),
                                    )
                                  }
                                >
                                  <Repeat className="h-4 w-4 mr-1" />
                                  Respond to Reschedule
                                </Button>
                              )}
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                            onClick={() => openDetailsDialog(booking)}
                          >
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
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                          onClick={() => handlePageChange(page)}
                          className="h-8 w-8"
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
            <DialogDescription>Session information and student details</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedBooking.studentImage || "/placeholder.svg"}
                    alt={selectedBooking.studentName}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedBooking.studentName}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.studentEmail}</p>
                  {selectedBooking.isRescheduled && (
                    <Badge variant="secondary" className="mt-1">
                      Rescheduled
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(selectedBooking.date), "MMMM d, yyyy")} at {selectedBooking.startTime} -{" "}
                      {selectedBooking.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Purpose</p>
                    <p className="text-sm text-gray-500">{selectedBooking.purpose}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-500">Virtual (Video Call)</p>
                  </div>
                </div>

                {selectedBooking.status === "completed" && selectedBooking.feedback && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Feedback</p>
                      <p className="text-sm text-gray-500">{selectedBooking.feedback}</p>
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
                          {req.requester === "mentor" ? "You" : "Student"} requested to reschedule to{" "}
                          {format(new Date(req.newDate), "MMMM d, yyyy")} at {req.newStartTime} - {req.newEndTime}.
                          Reason: {req.reason}. Status: {req.status}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                {selectedBooking.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={() => {
                        setIsDetailsOpen(false)
                        openCancelDialog(selectedBooking)
                      }}
                    >
                      Cancel Session
                    </Button>
                    <Button
                      variant="outline"
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                      onClick={() => {
                        setIsDetailsOpen(false)
                        openRescheduleDialog(selectedBooking)
                      }}
                    >
                      <Repeat className="h-4 w-4 mr-1" />
                      Reschedule
                    </Button>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => handleJoinMeeting(selectedBooking.id)}
                    >
                      Join Meeting
                    </Button>
                  </>
                )}
                {selectedBooking.status === "completed" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                      onClick={() => {
                        setIsDetailsOpen(false)
                        openEditFeedbackDialog(selectedBooking)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Feedback
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600">View Notes</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>Please provide a reason for cancelling this booking.</DialogDescription>
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
              onClick={handleCancelBooking}
              disabled={isSubmitting || cancellationReason.trim() === ""}
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Booking as Completed</DialogTitle>
            <DialogDescription>Please provide feedback for this mentoring session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Session Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about this mentoring session..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
              {feedback.trim() === "" && <p className="text-sm text-red-500">Feedback is required</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={handleCompleteBooking}
              disabled={isSubmitting || feedback.trim() === ""}
            >
              {isSubmitting ? "Completing..." : "Mark as Completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditFeedbackDialogOpen} onOpenChange={setIsEditFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>Update your feedback for this mentoring session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Session Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about this mentoring session..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
              {feedback.trim() === "" && <p className="text-sm text-red-500">Feedback is required</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFeedbackDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={handleEditFeedback}
              disabled={isSubmitting || feedback.trim() === ""}
            >
              {isSubmitting ? "Updating..." : "Update Feedback"}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Reschedule Request</DialogTitle>
            <DialogDescription>Review and respond to the student's reschedule request.</DialogDescription>
          </DialogHeader>
          {selectedBooking && selectedRequestIndex !== null && (
            <div className="space-y-4 py-4">
              <p className="text-sm">
                Student requested to reschedule to{" "}
                {format(new Date(selectedBooking.rescheduleRequests![selectedRequestIndex].newDate), "MMMM d, yyyy")} at{" "}
                {selectedBooking.rescheduleRequests![selectedRequestIndex].newStartTime} -{" "}
                {selectedBooking.rescheduleRequests![selectedRequestIndex].newEndTime}
              </p>
              <p className="text-sm">Reason: {selectedBooking.rescheduleRequests![selectedRequestIndex].reason}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRespondRescheduleDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleRespondReschedule("rejected")} disabled={isSubmitting}>
              {isSubmitting ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => handleRespondReschedule("accepted")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Accepting..." : "Accept"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
