import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  studentImage: string;
  date: string;
  time: string;
  purpose: string;
  status: "upcoming" | "completed" | "cancelled";
}

export function Bookings({ mentorId }: { mentorId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(`/api/booking/bookings`);
        const data = await response.data;
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [mentorId]);

  const handleJoinMeeting = (bookingId: string) => {
    navigate(`/video-call/${bookingId}`);
  };

  const filteredBookings = bookings.filter((booking) => booking.status === activeTab);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="bg-secondary space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Manage your upcoming and past mentoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
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
                                    <p className="text-sm text-gray-500">Virtual (Video Call)</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                {selectedBooking.status === "upcoming" && (
                                  <>
                                    <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
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
  );
}