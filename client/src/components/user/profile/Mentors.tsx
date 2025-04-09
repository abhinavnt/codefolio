"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "@/utils/axiosInstance"

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
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export function Mentors() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(6)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/api/booking/user-bookings")
        console.log(response.data,"response data from bookings")
        
        setBookings(response.data)
        console.log(bookings);
        
      } catch (err) {
        setError("Failed to fetch bookings")
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 2000)
      }
    }
    fetchBookings()
  }, [])

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      console.log(bookingId, "hai booking id is here loging")
      // setCancellingId(bookingId);
      // await axios.delete(`/api/bookings/${bookingId}`);
      // setBookings(bookings.filter((booking) => booking._id !== bookingId));
      // if (selectedBooking && selectedBooking._id === bookingId) {
      setIsDialogOpen(false)
      // }
    } catch (err) {
      setError("Failed to cancel booking. Please try again later.")
      console.error("Error cancelling booking:", err)
    } finally {
      setCancellingId(null)
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(bookings.length / bookingsPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Your Bookings</h1>
        <div>
          <input type="text" placeholder="Search bookings..." className="border rounded-md px-3 py-1.5 text-sm" />
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg overflow-hidden">
              <div className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm">Mentor: {booking.mentorId.name}</h3>
                  <Badge className={getStatusColor(booking.paymentStatus)}>
                    Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <Button onClick={() => handleViewDetails(booking)} className="mt-auto w-full" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
          <Button>Find Mentors</Button>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => paginate(i + 1)}
                className="w-10"
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedBooking && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  {/* <img
                    src={selectedBooking.mentorId.profileImage || "/placeholder.svg?height=100&width=100"}
                    alt={selectedBooking.mentorId.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  /> */}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedBooking.mentorId.name}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.mentorId.specialty}</p>
                  <Badge className={getStatusColor(selectedBooking.paymentStatus)}>
                    {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{format(new Date(selectedBooking.date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
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
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(selectedBooking._id)}
                disabled={cancellingId === selectedBooking._id || selectedBooking.paymentStatus === "failed"}
              >
                {cancellingId === selectedBooking._id ? (
                  <>
                    <span className="mr-2">Cancelling...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
