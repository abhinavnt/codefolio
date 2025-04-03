"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format, addDays, isSameDay } from "date-fns"
import { CalendarIcon, Clock, Edit, InfoIcon, Plus, Trash2, X } from "lucide-react"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface AvailabilityDay {
  date: Date
  timeSlots: TimeSlot[]
}

// Generate some initial data
const generateInitialData = (): AvailabilityDay[] => {
  const today = new Date()
  return [
    {
      date: addDays(today, 1),
      timeSlots: [
        { id: "1", startTime: "09:00", endTime: "10:00" },
        { id: "2", startTime: "11:00", endTime: "12:00" },
      ],
    },
    {
      date: addDays(today, 2),
      timeSlots: [
        { id: "3", startTime: "13:00", endTime: "14:00" },
        { id: "4", startTime: "15:00", endTime: "16:00" },
      ],
    },
    {
      date: addDays(today, 3),
      timeSlots: [{ id: "5", startTime: "10:00", endTime: "11:00" }],
    },
  ]
}

// Weekly schedule template
const initialWeeklySchedule = {
  Monday: [
    { id: "w1", startTime: "09:00", endTime: "10:00" },
    { id: "w2", startTime: "14:00", endTime: "15:00" },
  ],
  Tuesday: [{ id: "w3", startTime: "10:00", endTime: "11:00" }],
  Wednesday: [
    { id: "w4", startTime: "13:00", endTime: "14:00" },
    { id: "w5", startTime: "16:00", endTime: "17:00" },
  ],
  Thursday: [{ id: "w6", startTime: "11:00", endTime: "12:00" }],
  Friday: [{ id: "w7", startTime: "14:00", endTime: "15:00" }],
  Saturday: [],
  Sunday: [],
}

// Time options for dropdowns
const timeOptions = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
]

export function Availability() {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityDay[]>(generateInitialData)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [weeklySchedule, setWeeklySchedule] = useState(initialWeeklySchedule)

  // For the time slot dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null)
  const [newStartTime, setNewStartTime] = useState("09:00")
  const [newEndTime, setNewEndTime] = useState("10:00")

  // Find time slots for the selected date
  const selectedDayData = selectedDate ? availabilityData.find((day) => isSameDay(day.date, selectedDate)) : null

  // Handle adding a new time slot
  const handleAddTimeSlot = () => {
    if (!selectedDate) return

    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: newStartTime,
      endTime: newEndTime,
    }

    // Check if the day already exists in our data
    const existingDayIndex = availabilityData.findIndex((day) => isSameDay(day.date, selectedDate))

    if (existingDayIndex >= 0) {
      // Add to existing day
      const updatedData = [...availabilityData]
      updatedData[existingDayIndex] = {
        ...updatedData[existingDayIndex],
        timeSlots: [...updatedData[existingDayIndex].timeSlots, newTimeSlot],
      }
      setAvailabilityData(updatedData)
    } else {
      // Create a new day
      setAvailabilityData([
        ...availabilityData,
        {
          date: selectedDate,
          timeSlots: [newTimeSlot],
        },
      ])
    }

    setIsDialogOpen(false)
  }

  // Handle editing a time slot
  const handleEditTimeSlot = () => {
    if (!selectedDate || !editingTimeSlot) return

    const dayIndex = availabilityData.findIndex((day) => isSameDay(day.date, selectedDate))

    if (dayIndex >= 0) {
      const updatedData = [...availabilityData]
      const timeSlotIndex = updatedData[dayIndex].timeSlots.findIndex((slot) => slot.id === editingTimeSlot.id)

      if (timeSlotIndex >= 0) {
        updatedData[dayIndex].timeSlots[timeSlotIndex] = {
          ...editingTimeSlot,
          startTime: newStartTime,
          endTime: newEndTime,
        }
        setAvailabilityData(updatedData)
      }
    }

    setIsDialogOpen(false)
    setEditingTimeSlot(null)
  }

  // Handle deleting a time slot
  const handleDeleteTimeSlot = (timeSlotId: string) => {
    if (!selectedDate) return

    const dayIndex = availabilityData.findIndex((day) => isSameDay(day.date, selectedDate))

    if (dayIndex >= 0) {
      const updatedData = [...availabilityData]
      updatedData[dayIndex] = {
        ...updatedData[dayIndex],
        timeSlots: updatedData[dayIndex].timeSlots.filter((slot) => slot.id !== timeSlotId),
      }

      // If no time slots left, remove the day
      if (updatedData[dayIndex].timeSlots.length === 0) {
        updatedData.splice(dayIndex, 1)
      }

      setAvailabilityData(updatedData)
    }
  }

  // Handle opening the dialog for adding a new time slot
  const openAddDialog = () => {
    setEditingTimeSlot(null)
    setNewStartTime("09:00")
    setNewEndTime("10:00")
    setIsDialogOpen(true)
  }

  // Handle opening the dialog for editing a time slot
  const openEditDialog = (timeSlot: TimeSlot) => {
    setEditingTimeSlot(timeSlot)
    setNewStartTime(timeSlot.startTime)
    setNewEndTime(timeSlot.endTime)
    setIsDialogOpen(true)
  }

  // Handle adding a time slot to the weekly schedule
  const handleAddWeeklyTimeSlot = (day: string) => {
    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "10:00",
    }

    setWeeklySchedule({
      ...weeklySchedule,
      [day]: [...weeklySchedule[day as keyof typeof weeklySchedule], newTimeSlot],
    })
  }

  // Handle removing a time slot from the weekly schedule
  const handleRemoveWeeklyTimeSlot = (day: string, timeSlotId: string) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: weeklySchedule[day as keyof typeof weeklySchedule].filter((slot) => slot.id !== timeSlotId),
    })
  }

  // Handle updating a weekly time slot
  const handleUpdateWeeklyTimeSlot = (
    day: string,
    timeSlotId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: weeklySchedule[day as keyof typeof weeklySchedule].map((slot) =>
        slot.id === timeSlotId ? { ...slot, [field]: value } : slot,
      ),
    })
  }

  // Handle saving all availability
  const handleSaveAvailability = () => {
    console.log("Saving availability:", { availabilityData, weeklySchedule })
    // Here you would typically send this data to your backend
    // Show success message or notification
  }

  // Render date cell with indicator if it has time slots
  const renderDateCell = (date: Date) => {
    const hasTimeSlots = availabilityData.some((day) => isSameDay(day.date, date))

    return hasTimeSlots ? (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute bottom-1 right-1">
          <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-emerald-500 p-0" />
        </div>
      </div>
    ) : null
  }

  return (
    <div className="bg-secondary space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Your Availability</CardTitle>
          <CardDescription>
            Choose specific dates and time slots when you're available for mentoring sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="specific-dates" className="space-y-4">
            <TabsList>
              <TabsTrigger value="specific-dates">Specific Dates</TabsTrigger>
              <TabsTrigger value="weekly-schedule">Weekly Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="specific-dates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md"
                        components={{
                          DayContent: ({ date }) => renderDateCell(date),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">
                      {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
                    </Label>
                    <Button
                      onClick={openAddDialog}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600"
                      disabled={!selectedDate}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Time Slot
                    </Button>
                  </div>

                  {selectedDayData && selectedDayData.timeSlots.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDayData.timeSlots.map((timeSlot) => (
                        <div
                          key={timeSlot.id}
                          className="flex items-center justify-between p-3 border rounded-md "
                        >
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span>
                              {timeSlot.startTime} - {timeSlot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(timeSlot)}
                              className="h-8 w-8 text-gray-500 hover:text-emerald-500"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md ">
                      <Clock className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500">No time slots added for this date</p>
                      <Button variant="outline" size="sm" onClick={openAddDialog} className="mt-2">
                        Add Time Slot
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md ">
                      <CalendarIcon className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500">Select a date to manage time slots</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly-schedule" className="space-y-4">
              <div className="space-y-6">
                {Object.entries(weeklySchedule).map(([day, timeSlots]) => (
                  <Card key={day}>
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{day}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddWeeklyTimeSlot(day)}
                          className="h-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Slot
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      {timeSlots.length > 0 ? (
                        <div className="space-y-3">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex flex-wrap items-center gap-3 p-3 border rounded-md "
                            >
                              <div className="flex items-center gap-2 flex-grow">
                                <Select
                                  value={slot.startTime}
                                  onValueChange={(value) =>
                                    handleUpdateWeeklyTimeSlot(day, slot.id, "startTime", value)
                                  }
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Start" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((time) => (
                                      <SelectItem key={`start-${time}`} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span>to</span>
                                <Select
                                  value={slot.endTime}
                                  onValueChange={(value) => handleUpdateWeeklyTimeSlot(day, slot.id, "endTime", value)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="End" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((time) => (
                                      <SelectItem key={`end-${time}`} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveWeeklyTimeSlot(day, slot.id)}
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-gray-500">No time slots set for {day}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Alert className="bg-blue-50 border-blue-200 mt-6">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Admins can edit this availability later if needed.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveAvailability} className="bg-emerald-500 hover:bg-emerald-600">
              Save Availability
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTimeSlot ? "Edit Time Slot" : "Add Time Slot"}</DialogTitle>
            <DialogDescription>{selectedDate && `For ${format(selectedDate, "EEEE, MMMM d, yyyy")}`}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={newStartTime} onValueChange={setNewStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`dialog-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={newEndTime} onValueChange={setNewEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`dialog-end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={editingTimeSlot ? handleEditTimeSlot : handleAddTimeSlot}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {editingTimeSlot ? "Save Changes" : "Add Time Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

