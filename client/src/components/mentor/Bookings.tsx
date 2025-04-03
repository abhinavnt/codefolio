"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, User } from "lucide-react"

interface Booking {
  id: string
  studentName: string
  studentEmail: string
  studentImage: string
  date: string
  time: string
  purpose: string
  status: "upcoming" | "completed" | "cancelled"
}

// Dummy data for bookings
const dummyBookings: Booking[] = [
  {
    id: "b1",
    studentName: "John Doe",
    studentEmail: "john.doe@example.com",
    studentImage: "/placeholder.svg?height=40&width=40",
    date: "22 Oct",
    time: "09:00",
    purpose: "Resume review and career advice for transitioning to a senior role",
    status: "upcoming",
  },
  {
    id: "b2",
    studentName: "Sarah Williams",
    studentEmail: "sarah.williams@example.com",
    studentImage: "/placeholder.svg?height=40&width=40",
    date: "23 Oct",
    time: "14:00",
    purpose: "Technical interview preparation for frontend developer position",
    status: "upcoming",
  },
  {
    id: "b3",
    studentName: "Michael Brown",
    studentEmail: "michael.brown@example.com",
    studentImage: "/placeholder.svg?height=40&width=40",
    date: "24 Oct",
    time: "11:30",
    purpose: "Code review for a React project and best practices discussion",
    status: "upcoming",
  },
  {
    id: "b4",
    studentName: "Emily Johnson",
    studentEmail: "emily.johnson@example.com",
    studentImage: "/placeholder.svg?height=40&width=40",
    date: "20 Oct",
    time: "10:00",
    purpose: "Career transition advice from backend to fullstack development",
    status: "completed",
  },
  {
    id: "b5",
    studentName: "David Wilson",
    studentEmail: "david.wilson@example.com",
    studentImage: "/placeholder.svg?height=40&width=40",
    date: "19 Oct",
    time: "15:30",
    purpose: "Portfolio review and improvement suggestions",
    status: "completed",
  },
  {
    id: "b6",
    studentName: "Jessica Martinez",
    studentEmail: "jessica.martinez@example.com",
    studentImage: "/placeholder.svg?height=40&width=40",
    date: "18 Oct",
    time: "13:00",
    purpose: "Discussion about transitioning to a tech lead role",
    status: "cancelled",
  },
]

export function Bookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")

  const filteredBookings = dummyBookings.filter((booking) => booking.status === activeTab)

  return (
    <div className="bg-secondary space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Manage your upcoming and past mentoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Avatar>
                          <AvatarImage src={booking.studentImage} alt={booking.studentName} />
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
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>Session information and student details</DialogDescription>
                          </DialogHeader>

                          {selectedBooking && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={selectedBooking.studentImage} alt={selectedBooking.studentName} />
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
                                      {selectedBooking.date} at {selectedBooking.time}
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
                                    <p className="text-sm text-gray-500">Virtual (Zoom Meeting)</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                {selectedBooking.status === "upcoming" && (
                                  <>
                                    <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                                      Cancel Session
                                    </Button>
                                    <Button className="bg-emerald-500 hover:bg-emerald-600">Join Meeting</Button>
                                  </>
                                )}
                                {selectedBooking.status === "completed" && (
                                  <Button className="bg-emerald-500 hover:bg-emerald-600">View Notes</Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No {activeTab} bookings found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

