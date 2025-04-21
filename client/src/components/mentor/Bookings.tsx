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
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, Edit, MapPin, User, XCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axiosInstance from "@/utils/axiosInstance"
import { useNavigate } from "react-router-dom"

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
}

export function Bookings({ mentorId }: { mentorId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "cancelled">("pending")
  const [loading, setLoading] = useState(true)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isEditFeedbackDialogOpen, setIsEditFeedbackDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [feedback, setFeedback] = useState("")
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
      const response = await axiosInstance.get(`/api/booking/bookings`)
      const data = await response.data
      console.log("data from the backend", data)

      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to fetch bookings. Please try again.")
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
      console.error("Error cancelling booking:", error)
      setBookings(originalBookings)
      toast.error(error.response?.data?.error || "Failed to cancel booking. Please try again.")
    } finally {
      setIsSubmitting(false)
      setCancellationReason("")
    }
  }

  const handleCompleteBooking = async () => {
    if (!selectedBooking || !feedback.trim()) return

    setIsSubmitting(true)
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
      console.error("Error completing booking:", error)
      setBookings(originalBookings)
      toast.error(error.response?.data?.error || "Failed to mark booking as completed. Please try again.")
    } finally {
      setIsSubmitting(false)
      setFeedback("")
    }
  }

  const handleEditFeedback = async () => {
    if (!selectedBooking || !feedback.trim()) return

    setIsSubmitting(true)
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
      console.error("Error updating feedback:", error)
      setBookings(originalBookings)
      toast.error(error.response?.data?.error || "Failed to update feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
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

  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsOpen(true)
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => booking.status === activeTab)

  // Calculate pagination indexes
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

  if (loading) {
    return <div>Loading bookings...</div>
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
                  currentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Avatar>
                          <AvatarImage src={booking.studentImage || "/placeholder.svg"} alt={booking.studentName} />
                          <AvatarFallback>{booking.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{booking.studentName}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-primary">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
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
                              className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                              onClick={() => openCompleteDialog(booking)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
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
                  ))
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

      {/* Booking Details Dialog */}
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
                  <AvatarFallback>{selectedBooking.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedBooking.studentName}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.studentEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-gray-500">
                      {selectedBooking.date} at {selectedBooking.startTime} - {selectedBooking.endTime}
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

      {/* Cancel Booking Dialog */}
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

      {/* Complete Booking Dialog */}
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
              {isSubmitting ? "Submitting..." : "Mark as Completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Feedback Dialog */}
      <Dialog open={isEditFeedbackDialogOpen} onOpenChange={setIsEditFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>Update your feedback for this completed mentoring session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editFeedback">Session Feedback</Label>
              <Textarea
                id="editFeedback"
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
    </div>
  )
}
