"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Dummy data for available dates and times
const availableDates = [
  { date: "22 Oct", day: "Mon" },
  { date: "23 Oct", day: "Tue" },
  { date: "24 Oct", day: "Wed" },
  { date: "25 Oct", day: "Thu" },
  { date: "26 Oct", day: "Fri" },
  { date: "27 Oct", day: "Sat" },
]

// Different time slots for each day
const timeSlotsByDate = {
  "22 Oct": ["09:00", "11:00", "13:00", "15:00"],
  "23 Oct": ["10:00", "12:00", "14:00", "16:00"],
  "24 Oct": ["09:30", "11:30", "13:30", "15:30"],
  "25 Oct": ["10:30", "12:30", "14:30", "16:30"],
  "26 Oct": ["08:00", "10:00", "14:00", "17:00"],
  "27 Oct": ["11:00", "13:00", "15:00", "17:00"],
}

export function AvailableTime() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time selection when date changes
  }

  // Get available times for the selected date
  const availableTimes = selectedDate ? timeSlotsByDate[selectedDate as keyof typeof timeSlotsByDate] : []

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-medium mb-3">Date</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {availableDates.map((date) => (
            <Button
              key={date.date}
              variant="outline"
              className={cn(
                "flex flex-col h-auto py-3",
                selectedDate === date.date &&
                  "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:hover:bg-emerald-700",
              )}
              onClick={() => handleDateSelect(date.date)}
            >
              <span>{date.date}</span>
              <span>{date.day}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Time</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {selectedDate ? (
            availableTimes.map((time) => (
              <Button
                key={time}
                variant="outline"
                className={cn(
                  selectedTime === time &&
                    "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:border-emerald-600",
                )}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))
          ) : (
            <p className="col-span-4 text-sm text-muted-foreground">Please select a date to see available times</p>
          )}
        </div>
      </div>
    </div>
  )
}

