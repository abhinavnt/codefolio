"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { format, parseISO } from "date-fns"
import { Calendar, CheckCircle, Clock, User, AlertCircle, ArrowLeft, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"

interface Booking {
  mentorId: { name: string; email?: string }
  date: string
  startTime: string
  endTime: string
  topic?: string
}

export function BookingSuccess() {
  const navigate=useNavigate()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const sessionId = queryParams.get("session_id")

    if (!sessionId) {
      setErrorMessage("No payment session found. Please try booking again.")
      setIsVerifying(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await axiosInstance.get(`/api/booking/verify-payment?session_id=${sessionId}`, {
          withCredentials: true,
        })

        if (response.data.message === "Booking successful") {
          setVerificationSuccess(true)
          setBooking(response.data.booking)
        } else {
          setErrorMessage("Payment verification failed. Please contact support.")
        }
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "Failed to verify payment. Please try again later.")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [])

  const addToCalendar = () => {
    if (!booking) return

    const startDateTime = `${booking.date}T${booking.startTime}:00`
    const endDateTime = `${booking.date}T${booking.endTime}:00`
    const title = `Mentoring Session with ${booking.mentorId.name}`
    const description = booking.topic ? `Topic: ${booking.topic}` : "Mentoring Session"

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${encodeURIComponent(startDateTime.replace(/[-:]/g, ""))}/${encodeURIComponent(endDateTime.replace(/[-:]/g, ""))}&details=${encodeURIComponent(description)}`

    window.open(googleCalendarUrl, "_blank")
  }

  return (
    <div className="max-w-md mx-auto p-4 md:p-6">
      <Button variant="ghost" className="mb-4 pl-0 flex items-center gap-1" onClick={() => navigate("/")}>
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Button>

      {isVerifying ? (
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Verifying Payment</CardTitle>
            <CardDescription>Please wait while we confirm your booking</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      ) : verificationSuccess && booking ? (
        <Card className="w-full">
          <CardHeader className="pb-2 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your mentoring session has been successfully booked</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Mentor</p>
                  <p className="text-muted-foreground">{booking.mentorId.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{format(parseISO(booking.date), "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>

              {booking.topic && (
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                    <span className="text-lg font-semibold">T</span>
                  </div>
                  <div>
                    <p className="font-medium">Topic</p>
                    <p className="text-muted-foreground">{booking.topic}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col gap-3 pt-4">
            <Button className="w-full" onClick={addToCalendar}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              You will receive a confirmation email with all the details.
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Verification Failed</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate("/booking")}>
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

