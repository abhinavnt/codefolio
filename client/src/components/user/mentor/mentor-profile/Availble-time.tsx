"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format, addDays, isAfter, isSameDay, parseISO } from "date-fns"
import { fetchAvailbilitySlots } from "@/services/bookService"
import { toast } from "sonner"
import axiosInstance from "@/utils/axiosInstance"
// Assuming you have an axios instance configured

interface TimeSlot {
  startTime: string
  endTime: string
  isBooked:boolean
}

interface Availability {
  date: string 
  day: string 
  timeSlots: TimeSlot[]
}

export function AvailableTime({ mentorusername }: { mentorusername: string }) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true)
      try {
        const from = format(new Date(), "yyyy-MM-dd")
        const to = format(addDays(new Date(), 7), "yyyy-MM-dd")
        const response = await fetchAvailbilitySlots(mentorusername, from, to)
        if (!response) return
        const data = response.data 
        console.log(data,"response data");
        
        const rawAvailability = data.availability || data

        const now = new Date()
        const filteredAvailability = rawAvailability
          .filter((avail: Availability) => {
            const availDate = parseISO(avail.date)
            return isAfter(availDate, now) || isSameDay(availDate, now)
          })
          .map((avail: Availability) => {
            if (isSameDay(parseISO(avail.date), now)) {
              const filteredTimeSlots = avail.timeSlots.filter((slot) => {
                const [hours, minutes] = slot.startTime.split(":").map(Number)
                const slotTime = new Date()
                slotTime.setHours(hours, minutes, 0, 0)
                return isAfter(slotTime, now)
              })
              return { ...avail, timeSlots: filteredTimeSlots }
            }
            return avail
          })
          .filter((avail: Availability) => avail.timeSlots.length > 0)

        setAvailability(filteredAvailability)
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAvailability()
  }, [mentorusername])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleBookNow = async () => {
    if (!selectedDate || !selectedSlot) return
    setPaymentLoading(true)
    try {
      const response = await axiosInstance.post("/api/booking/create-checkout-session", {
        mentorusername,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }, { withCredentials: true })

      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error: any) {
      console.error("Error initiating Stripe payment:", error)
      toast.error(error.response?.data?.message || "Failed to initiate payment")
    } finally {
      setPaymentLoading(false)
      
    }
  }

  if (loading) return <p>Loading availability...</p>

  const selectedAvailability = availability.find((a) => a.date === selectedDate)

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-medium mb-3">Date</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {availability.length > 0 ? (
            availability.map((avail) => {
              const formattedDate = format(new Date(avail.date), "dd MMM")
              return (
                <Button
                  key={avail.date}
                  variant="outline"
                  className={cn(
                    "flex flex-col h-auto py-3",
                    selectedDate === avail.date &&
                      "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:hover:bg-emerald-700",
                  )}
                  onClick={() => handleDateSelect(avail.date)}
                >
                  <span>{formattedDate}</span>
                  <span>{avail.day}</span>
                </Button>
              )
            })
          ) : (
            <p className="col-span-6 text-sm text-muted-foreground">No available time slots found</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Time</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {selectedDate && selectedAvailability ? (
            selectedAvailability.timeSlots.map((slot) => (
              <Button
                key={slot.startTime}
                variant="outline"
                className={cn(
                  selectedSlot?.startTime === slot.startTime &&
                    "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:border-emerald-600",
                )}
                onClick={() => setSelectedSlot(slot)}
                disabled={slot.isBooked}
              >
                {slot.startTime} 
              </Button>
            ))
          ) : (
            <p className="col-span-4 text-sm text-muted-foreground">Please select a date to see available times</p>
          )}
        </div>
      </div>

      {selectedDate && selectedSlot && (
        <Button  onClick={handleBookNow} disabled={paymentLoading}>
          {paymentLoading ? "Processing..." : "Book Now"}
        </Button>
      )}
    </div>
  )
}