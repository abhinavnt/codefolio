
import { DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay, isBefore, parse } from "date-fns"
import { AlertCircle, CalendarIcon, Clock, Edit, InfoIcon, Plus, Trash2, X } from "lucide-react"
import { addMentorAvailbilty, fetchMentorAvailbilty } from "@/services/mentorService"
import { toast } from "sonner"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  booked: boolean
}

interface AvailabilityDay {
  date: Date
  timeSlots: TimeSlot[]
}

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
  const [availabilityData, setAvailabilityData] = useState<AvailabilityDay[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, TimeSlot[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null)
  const [newStartTime, setNewStartTime] = useState("09:00")
  const [newEndTime, setNewEndTime] = useState("10:00")

  const [startTimeError, setStartTimeError] = useState<string | null>(null)
  const [endTimeError, setEndTimeError] = useState<string | null>(null)
  const [timeSlotError, setTimeSlotError] = useState<string | null>(null)

  // Confirmation dialogs
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showEditConfirmation, setShowEditConfirmation] = useState(false)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [timeSlotToDelete, setTimeSlotToDelete] = useState<{ id: string; day?: string } | null>(null)


  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetchMentorAvailbilty()
        if (!response) return

        const { specificDateAvailability, weeklyAvailability } = response.data

        const specificDates = specificDateAvailability.map((day: any) => ({
          date: new Date(day.date),
          timeSlots: day.timeSlots.map((slot: any) => ({
            id: Date.now().toString() + Math.random(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            booked: slot.booked,
          })),
        }))
        setAvailabilityData(specificDates)

        const weekly = weeklyAvailability.reduce(
          (acc: any, item: any) => {
            acc[item.day] = item.timeSlots.map((slot: any) => ({
              id: Date.now().toString() + Math.random(),
              startTime: slot.startTime,
              endTime: slot.endTime,
              booked: slot.booked,
            }))
            return acc
          },
          { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] },
        )
        setWeeklySchedule(weekly)
      } catch (error) {
        console.error("Error fetching availability:", error)
      }
    }
    fetchAvailability()
  }, [])

  const selectedDayData = selectedDate ? availabilityData.find((day) => isSameDay(day.date, selectedDate)) : null

  // isTimeInPast function to properly handle today's future times
  const isTimeInPast = (timeString: string, date: Date) => {
  
    if (!isSameDay(date, new Date())) return false

    const now = new Date()
    const [hours, minutes] = timeString.split(":").map(Number)
    const timeToCheck = new Date(date)
    timeToCheck.setHours(hours, minutes, 0, 0)

    
    const bufferTime = new Date(now)
    bufferTime.setMinutes(now.getMinutes() + 5)

    return isBefore(timeToCheck, bufferTime)
  }

  const getValidTimeOptionsForToday = () => {
    if (!selectedDate || !isSameDay(selectedDate, new Date())) {
      return timeOptions 
    }

    // For today, filter out past times with buffer
    return timeOptions.filter((time) => !isTimeInPast(time, new Date()))
  }

  // check for overlapping time slots
  const hasOverlappingSlots = (startTime: string, endTime: string, date: Date, excludeId?: string) => {
    const dayData = availabilityData.find((day) => isSameDay(day.date, date))
    if (!dayData) return false

    const start = parse(startTime, "HH:mm", new Date())
    const end = parse(endTime, "HH:mm", new Date())

    return dayData.timeSlots.some((slot) => {
      if (excludeId && slot.id === excludeId) return false

      const slotStart = parse(slot.startTime, "HH:mm", new Date())
      const slotEnd = parse(slot.endTime, "HH:mm", new Date())

      // Check if the new slot overlaps with an existing slot
      return (
        (slotStart <= start && start < slotEnd) ||
        (slotStart < end && end <= slotEnd) ||
        (start <= slotStart && slotEnd <= end)
      )
    })
  }

  // check for overlapping time slots in weekly schedule
  const hasOverlappingWeeklySlots = (day: string, startTime: string, endTime: string, excludeId?: string) => {
    const start = parse(startTime, "HH:mm", new Date())
    const end = parse(endTime, "HH:mm", new Date())

    return weeklySchedule[day].some((slot) => {
      if (excludeId && slot.id === excludeId) return false

      const slotStart = parse(slot.startTime, "HH:mm", new Date())
      const slotEnd = parse(slot.endTime, "HH:mm", new Date())

      return (
        (slotStart <= start && start < slotEnd) || 
        (slotStart < end && end <= slotEnd) || 
        (start <= slotStart && slotEnd <= end) 
      )
    })
  }

  //  validate the weekly schedule before saving
  const validateWeeklySchedule = () => {
    const errors: { day: string; message: string }[] = []

    Object.entries(weeklySchedule).forEach(([day, slots]) => {
      
      slots.forEach((slot) => {
        const start = parse(slot.startTime, "HH:mm", new Date())
        const end = parse(slot.endTime, "HH:mm", new Date())

        if (start >= end) {
          errors.push({
            day,
            message: `Invalid time slot on ${day}: End time must be after start time (${slot.startTime} - ${slot.endTime})`,
          })
        }
      })

      // Check for overlapping slots
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const slot1 = slots[i]
          const slot2 = slots[j]

          const start1 = parse(slot1.startTime, "HH:mm", new Date())
          const end1 = parse(slot1.endTime, "HH:mm", new Date())
          const start2 = parse(slot2.startTime, "HH:mm", new Date())
          const end2 = parse(slot2.endTime, "HH:mm", new Date())

          if (
            (start1 <= start2 && start2 < end1) ||
            (start1 < end2 && end2 <= end1) ||
            (start2 <= start1 && start1 < end2)
          ) {
            errors.push({
              day,
              message: `Overlapping time slots on ${day}: ${slot1.startTime}-${slot1.endTime} and ${slot2.startTime}-${slot2.endTime}`,
            })
          }
        }
      }
    })

    return errors
  }

  //  function to validate weekly time slots when adding a new slot
  const validateWeeklyTimeSlot = (day: string, startTime: string, endTime: string, excludeId?: string) => {
   
    const start = parse(startTime, "HH:mm", new Date())
    const end = parse(endTime, "HH:mm", new Date())

    if (start >= end) {
      toast.error("End time must be after start time")
      return false
    }

   
    if (hasOverlappingWeeklySlots(day, startTime, endTime, excludeId)) {
      toast.error("This time slot overlaps with an existing slot")
      return false
    }

    return true
  }

  //  function to set error messages 
  const validateTimeSelection = (startTime: string, endTime: string, date: Date, excludeId?: string) => {
   
    setStartTimeError(null)
    setEndTimeError(null)
    setTimeSlotError(null)

    const start = parse(startTime, "HH:mm", new Date())
    const end = parse(endTime, "HH:mm", new Date())

    if (start >= end) {
      setEndTimeError("End time must be after start time")
      return false
    }

    
    if (isTimeInPast(startTime, date)) {
      setStartTimeError("Cannot select a time in the past")
      return false
    }

   
    if (hasOverlappingSlots(startTime, endTime, date, excludeId)) {
      setTimeSlotError("This time slot overlaps with an existing slot")
      return false
    }

    return true
  }

  const handleAddTimeSlot = () => {
    if (!selectedDate || isBefore(selectedDate, new Date())) {
      toast.error("Cannot add time slots for past dates")
      return
    }

    if (!validateTimeSelection(newStartTime, newEndTime, selectedDate)) {
      return
    }

    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: newStartTime,
      endTime: newEndTime,
      booked: false,
    }

    const existingDayIndex = availabilityData.findIndex((day) => isSameDay(day.date, selectedDate))
    if (existingDayIndex >= 0) {
      const updatedData = [...availabilityData]
      updatedData[existingDayIndex] = {
        ...updatedData[existingDayIndex],
        timeSlots: [...updatedData[existingDayIndex].timeSlots, newTimeSlot],
      }
      setAvailabilityData(updatedData)
    } else {
      setAvailabilityData([...availabilityData, { date: selectedDate, timeSlots: [newTimeSlot] }])
    }
    setIsDialogOpen(false)
  }


  // handleEditTimeSlot function to properly validate and close dialogs
  const handleEditTimeSlot = () => {
    if (!selectedDate || !editingTimeSlot || editingTimeSlot.booked) {
      toast.error("Cannot edit booked time slots")
      return
    }

    if (!validateTimeSelection(newStartTime, newEndTime, selectedDate, editingTimeSlot.id)) {
      setShowEditConfirmation(false)
      return
    }

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
    setShowEditConfirmation(false)
  }


  const openEditDialog = (timeSlot: TimeSlot) => {
    if (timeSlot.booked) {
      toast.error("Cannot edit booked time slots")
      return
    }
    setEditingTimeSlot(timeSlot)
    setNewStartTime(timeSlot.startTime)
    setNewEndTime(timeSlot.endTime)
    setStartTimeError(null)
    setEndTimeError(null)
    setTimeSlotError(null)
    setIsDialogOpen(true)
  }

  const confirmDeleteTimeSlot = () => {
    if (!selectedDate || !timeSlotToDelete) return

    const dayIndex = availabilityData.findIndex((day) => isSameDay(day.date, selectedDate))
    if (dayIndex >= 0) {
      const timeSlot = availabilityData[dayIndex].timeSlots.find((slot) => slot.id === timeSlotToDelete.id)
      if (timeSlot?.booked) {
        toast.error("Cannot delete booked time slots")
        return
      }

      const updatedData = [...availabilityData]
      updatedData[dayIndex] = {
        ...updatedData[dayIndex],
        timeSlots: updatedData[dayIndex].timeSlots.filter((slot) => slot.id !== timeSlotToDelete.id),
      }
      if (updatedData[dayIndex].timeSlots.length === 0) {
        updatedData.splice(dayIndex, 1)
      }
      setAvailabilityData(updatedData)
    }
    setShowDeleteConfirmation(false)
    setTimeSlotToDelete(null)
  }

  const openAddDialog = () => {
    if (!selectedDate) {
      toast.error("Please select a date first")
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDay = new Date(selectedDate)
    selectedDay.setHours(0, 0, 0, 0)

    if (isBefore(selectedDay, today)) {
      toast.error("Cannot add time slots for past dates")
      return
    }

    setEditingTimeSlot(null)

    if (isSameDay(selectedDate, new Date())) {
      const validTimeOptions = getValidTimeOptionsForToday()

      if (validTimeOptions.length === 0) {
        toast.error("No available time slots for today")
        return
      }

      const startTime = validTimeOptions[0]

      const startIndex = timeOptions.indexOf(startTime)
      const endIndex = startIndex + 2 < timeOptions.length ? startIndex + 2 : timeOptions.length - 1
      const endTime = timeOptions[endIndex]

      setNewStartTime(startTime)
      setNewEndTime(endTime)
    } else {
      setNewStartTime("09:00")
      setNewEndTime("10:00")
    }

    setStartTimeError(null)
    setEndTimeError(null)
    setTimeSlotError(null)
    setIsDialogOpen(true)
  }

  const handleStartTimeChange = (value: string) => {
    setStartTimeError(null)
    setTimeSlotError(null)
    setNewStartTime(value)
  }

  const handleEndTimeChange = (value: string) => {
    setEndTimeError(null)
    setTimeSlotError(null)
    setNewEndTime(value)
  }

  const openDeleteConfirmation = (timeSlotId: string) => {
    const dayIndex = availabilityData.findIndex((day) => isSameDay(day.date, selectedDate!))
    if (dayIndex >= 0) {
      const timeSlot = availabilityData[dayIndex].timeSlots.find((slot) => slot.id === timeSlotId)
      if (timeSlot?.booked) {
        toast.error("Cannot delete booked time slots")
        return
      }
    }

    setTimeSlotToDelete({ id: timeSlotId })
    setShowDeleteConfirmation(true)
  }

  // handleAddWeeklyTimeSlot function to validate before adding
  const handleAddWeeklyTimeSlot = (day: string) => {
    let startHour = 9 
    let found = false
    let defaultStartTime = "09:00"
    let defaultEndTime = "10:00"

    while (startHour < 19 && !found) {
      defaultStartTime = `${String(startHour).padStart(2, "0")}:00`
      defaultEndTime = `${String(startHour + 1).padStart(2, "0")}:00`

      if (!hasOverlappingWeeklySlots(day, defaultStartTime, defaultEndTime)) {
        found = true
        break
      }

      startHour++
    }

    if (!found) {
      toast.error(`No available time slots for ${day}. Please adjust existing slots.`)
      return
    }

    if (!validateWeeklyTimeSlot(day, defaultStartTime, defaultEndTime)) {
      return
    }

    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      booked: false,
    }

    setWeeklySchedule({
      ...weeklySchedule,
      [day]: [...weeklySchedule[day], newTimeSlot],
    })

    toast.success(`Time slot added to ${day}`)
  }

  const confirmRemoveWeeklyTimeSlot = () => {
    if (!timeSlotToDelete || !timeSlotToDelete.day) return

    const { id, day } = timeSlotToDelete
    const timeSlot = weeklySchedule[day].find((slot) => slot.id === id)
    if (timeSlot?.booked) {
      toast.error("Cannot delete booked time slots")
      return
    }

    setWeeklySchedule({
      ...weeklySchedule,
      [day]: weeklySchedule[day].filter((slot) => slot.id !== id),
    })

    setShowDeleteConfirmation(false)
    setTimeSlotToDelete(null)
  }

  const openWeeklyDeleteConfirmation = (day: string, timeSlotId: string) => {
    const timeSlot = weeklySchedule[day].find((slot) => slot.id === timeSlotId)
    if (timeSlot?.booked) {
      toast.error("Cannot delete booked time slots")
      return
    }

    setTimeSlotToDelete({ id: timeSlotId, day })
    setShowDeleteConfirmation(true)
  }

  //  handleUpdateWeeklyTimeSlot function to validate overlapping slots
  const handleUpdateWeeklyTimeSlot = (
    day: string,
    timeSlotId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const timeSlot = weeklySchedule[day].find((slot) => slot.id === timeSlotId)
    if (timeSlot?.booked) {
      toast.error("Cannot edit booked time slots")
      return
    }

    const currentSlot = weeklySchedule[day].find((slot) => slot.id === timeSlotId)
    if (!currentSlot) return

    const startTime = field === "startTime" ? value : currentSlot.startTime
    const endTime = field === "endTime" ? value : currentSlot.endTime

    const start = parse(startTime, "HH:mm", new Date())
    const end = parse(endTime, "HH:mm", new Date())

    if (start >= end) {
      toast.error("End time must be after start time")
      return
    }

    if (hasOverlappingWeeklySlots(day, startTime, endTime, timeSlotId)) {
      toast.error(`This time slot overlaps with another slot on ${day}`)
      return
    }

    // Update the time slot
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: weeklySchedule[day].map((slot) => (slot.id === timeSlotId ? { ...slot, [field]: value } : slot)),
    })

    // Show success message
    toast.success("Time slot updated successfully")
  }

  //  handleSaveAvailability function to use the new validation function
  const handleSaveAvailability = async () => {
    try {
    
      const weeklyErrors = validateWeeklySchedule()

      if (weeklyErrors.length > 0) {
        
        toast.error(weeklyErrors[0].message, {
          duration: 5000,
          position: "top-center",
        })

        
        if (weeklyErrors.length > 1) {
          toast.error(`${weeklyErrors.length - 1} more validation errors found. Please fix all issues.`, {
            duration: 5000,
            position: "top-center",
          })
        }

        setShowSaveConfirmation(false)
        return
      }

      // Continue with saving...
      const specificDateAvailability = availabilityData.map((day) => ({
        date: day.date,
        timeSlots: day.timeSlots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          booked: slot.booked,
        })),
      }))

      const weeklyAvailability = Object.entries(weeklySchedule).map(([day, timeSlots]) => ({
        day,
        timeSlots: timeSlots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          booked: slot.booked,
        })),
      }))

      const response = await addMentorAvailbilty(specificDateAvailability, weeklyAvailability)
      if (response) {
        toast.success("Available Slot Updated successfully")
        setShowSaveConfirmation(false)
      } else {
        toast.error("Failed to save availability. Please try again.")
        setShowSaveConfirmation(false)
      }
    } catch (error) {
      console.error("Error saving availability:", error)
      toast.error("Error saving availability. Please check your connection and try again.")
      setShowSaveConfirmation(false)
    }
  }




  // function to display available dates in the calendar view
  const getAvailableDates = () => {
    return availabilityData.map((day) => format(day.date, "yyyy-MM-dd"))
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

                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="date-picker">Select Date</Label>
                        <div className="text-sm text-gray-500">
                          {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </div>
                      </div>

                      <input
                        type="date"
                        id="date-picker"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined
                          if (date) {
                            date.setHours(12, 0, 0, 0)
                          }
                          setSelectedDate(date)
                        }}
                      />

                      <div className="grid grid-cols-7 gap-1 mt-4">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Badge variant="outline" className="h-2 w-2 rounded-full bg-emerald-500 p-0 mr-2" />
                          Dates with available time slots
                        </p>
                      </div>
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
                      disabled={!selectedDate || isBefore(selectedDate, new Date())}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Time Slot
                    </Button>
                  </div>

                  {selectedDayData && selectedDayData.timeSlots.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDayData.timeSlots.map((timeSlot) => (
                        <div key={timeSlot.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span>
                              {timeSlot.startTime} - {timeSlot.endTime} {timeSlot.booked && "(Booked)"}
                            </span>
                          </div>
                          {!timeSlot.booked && (
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
                                onClick={() => openDeleteConfirmation(timeSlot.id)}
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
                      <Clock className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500">No time slots added for this date</p>
                      <Button variant="outline" size="sm" onClick={openAddDialog} className="mt-2">
                        Add Time Slot
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
                      <CalendarIcon className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500">Select a date to manage time slots</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* //weekly */}
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
                              className={`flex flex-wrap items-center gap-3 p-3 border rounded-md ${
                                slot.booked ? "bg-red-50 border-red-100" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-grow">
                                <Select
                                  value={slot.startTime}
                                  onValueChange={(value) =>
                                    handleUpdateWeeklyTimeSlot(day, slot.id, "startTime", value)
                                  }
                                  disabled={slot.booked}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Start" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((time) => (
                                      <SelectItem
                                        key={`start-${time}`}
                                        value={time}
                                        disabled={
                                          // Disable start times that would make end time invalid
                                          parse(time, "HH:mm", new Date()) >= parse(slot.endTime, "HH:mm", new Date())
                                        }
                                      >
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span>to</span>
                                <Select
                                  value={slot.endTime}
                                  onValueChange={(value) => handleUpdateWeeklyTimeSlot(day, slot.id, "endTime", value)}
                                  disabled={slot.booked}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="End" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((time) => (
                                      <SelectItem
                                        key={`end-${time}`}
                                        value={time}
                                        disabled={
                                          // Disable end times that are earlier than or equal to start time
                                          parse(time, "HH:mm", new Date()) <= parse(slot.startTime, "HH:mm", new Date())
                                        }
                                      >
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {slot.booked && <span className="text-red-500 text-sm font-medium">(Booked)</span>}
                              </div>
                              {!slot.booked && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openWeeklyDeleteConfirmation(day, slot.id)}
                                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
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
            <Button onClick={() => setShowSaveConfirmation(true)} className="bg-emerald-500 hover:bg-emerald-600">
              Save Availability
            </Button>
          </div>
        </CardContent>
      </Card>


      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Available Dates:</h3>
        <div className="flex flex-wrap gap-2">
          {getAvailableDates().map((date) => (
            <Badge key={date} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {format(new Date(date), "MMM d")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Add/Edit Time Slot Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
        
            setStartTimeError(null)
            setEndTimeError(null)
            setTimeSlotError(null)
            if (!showEditConfirmation) {
              setEditingTimeSlot(null)
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTimeSlot ? "Edit Time Slot" : "Add Time Slot"}</DialogTitle>
            <DialogDescription>{selectedDate && `For ${format(selectedDate, "EEEE, MMMM d, yyyy")}`}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={newStartTime} onValueChange={handleStartTimeChange}>
                  <SelectTrigger id="start-time" className={startTimeError ? "border-red-500" : ""}>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getValidTimeOptionsForToday().map((time) => (
                      <SelectItem key={`dialog-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {startTimeError && <p className="text-sm text-red-500 mt-1">{startTimeError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={newEndTime} onValueChange={handleEndTimeChange}>
                  <SelectTrigger id="end-time" className={endTimeError ? "border-red-500" : ""}>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem
                        key={`dialog-end-${time}`}
                        value={time}
                        disabled={
                          // Disable end times that are earlier than or equal to start time
                          parse(time, "HH:mm", new Date()) <= parse(newStartTime, "HH:mm", new Date())
                        }
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {endTimeError && <p className="text-sm text-red-500 mt-1">{endTimeError}</p>}
              </div>
            </div>

         
            {timeSlotError && (
              <div className="col-span-2">
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-600">{timeSlotError}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/*  message about time slot validation */}
          <div className="mt-2 text-sm text-gray-500">
            {selectedDate && isSameDay(selectedDate, new Date()) && (
              <div className="flex items-center">
                <InfoIcon className="h-4 w-4 mr-1 text-blue-500" />
                <span>Only future time slots are available for today</span>
              </div>
            )}
            <div className="flex items-center mt-1">
              <InfoIcon className="h-4 w-4 mr-1 text-blue-500" />
              <span>Time slots must not overlap with existing slots</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setEditingTimeSlot(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingTimeSlot ? () => setShowEditConfirmation(true) : handleAddTimeSlot}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {editingTimeSlot ? "Save Changes" : "Add Time Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Confirmation Dialog */}
      <Dialog
        open={showEditConfirmation}
        onOpenChange={(open) => {
          setShowEditConfirmation(open)

          if (!open && !isDialogOpen) {
            setEditingTimeSlot(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>Are you sure you want to update this time slot?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditConfirmation(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTimeSlot} className="bg-emerald-500 hover:bg-emerald-600">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={(open) => {
          setShowDeleteConfirmation(open)
       
          if (!open) {
            setTimeSlotToDelete(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this time slot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmation(false)
                setTimeSlotToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={timeSlotToDelete?.day ? confirmRemoveWeeklyTimeSlot : confirmDeleteTimeSlot}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Save Confirmation Dialog */}
      <Dialog
        open={showSaveConfirmation}
        onOpenChange={(open) => {
          setShowSaveConfirmation(open)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Availability</DialogTitle>
            <DialogDescription>Are you sure you want to save your availability settings?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveConfirmation(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAvailability} className="bg-emerald-500 hover:bg-emerald-600">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

