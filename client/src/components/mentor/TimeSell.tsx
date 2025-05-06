"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay, isBefore, parse, addDays, startOfWeek } from "date-fns"
import {
    AlertCircle,
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    InfoIcon,
    Plus,
    Save,
    Trash2,
} from "lucide-react"
import { toast } from "sonner"
import {
    addMentorSpecificDateAvailability,
    editMentorSpecificDateAvailability,
    fetchMentorSpecificDateAvailability,
} from "@/services/mentorSpecificDateService"
import { type RootState, useAppSelector } from "@/redux/store"

interface TimeSlot {
    id: string
    startTime: string
    endTime: string
    booked: boolean
}

interface SpecificDateAvailability {
    _id?: string
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

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function SpecificDateAvailabilityScheduler() {
    const [availabilityData, setAvailabilityData] = useState<SpecificDateAvailability[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null)
    const [newStartTime, setNewStartTime] = useState("09:00")
    const [newEndTime, setNewEndTime] = useState("10:00")
    const [startTimeError, setStartTimeError] = useState<string | null>(null)
    const [endTimeError, setEndTimeError] = useState<string | null>(null)
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
    const [timeSlotToDelete, setTimeSlotToDelete] = useState<string | null>(null)
    const [mentorId, setMentorId] = useState<string | null>(null)
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date()))
    const [isLoading, setIsLoading] = useState(false)

    const { mentor } = useAppSelector((state: RootState) => state.mentor)

    useEffect(() => {
        setMentorId(mentor?._id || null)
    }, [mentor])

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!mentorId) {
                return
            }
            setIsLoading(true)
            try {
                const response = await fetchMentorSpecificDateAvailability(mentorId)
                if (!response) return

                const specificDates = response.data.map((entry: any) => {
                    // Normalize the date to UTC midnight
                    const normalizedDate = new Date(
                        new Date(entry.specificDateAvailability.date).toISOString().split("T")[0] + "T00:00:00.000Z"
                    );
                    return {
                        _id: entry._id,
                        date: normalizedDate,
                        timeSlots: entry.specificDateAvailability.timeSlots.map((slot: any) => ({
                            id: Date.now().toString() + Math.random(),
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            booked: slot.booked,
                        })),
                    }
                })
                setAvailabilityData(specificDates)
            } catch (error) {
                console.error("Error fetching specific date availability:", error)
                toast.error("Failed to load availability data.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchAvailability()
    }, [mentorId])

    const selectedDayData = selectedDate ? availabilityData.find((day) => isSameDay(day.date, selectedDate)) : null

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
        return timeOptions.filter((time) => !isTimeInPast(time, new Date()))
    }

    const hasOverlappingSlots = (startTime: string, endTime: string, date: Date, excludeId?: string) => {
        const dayData = availabilityData.find((day) => isSameDay(day.date, date))
        if (!dayData) return false

        const start = parse(startTime, "HH:mm", new Date())
        const end = parse(endTime, "HH:mm", new Date())

        return dayData.timeSlots.some((slot) => {
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
            // Normalize the selectedDate to UTC midnight before adding to availabilityData
            const normalizedDate = new Date(selectedDate.toISOString().split("T")[0] + "T00:00:00.000Z");
            setAvailabilityData([...availabilityData, { date: normalizedDate, timeSlots: [newTimeSlot] }])
        }
        setIsDialogOpen(false)
    }

    const handleEditTimeSlot = () => {
        if (!selectedDate || !editingTimeSlot || editingTimeSlot.booked) {
            toast.error("Cannot edit booked time slots")
            return
        }

        if (!validateTimeSelection(newStartTime, newEndTime, selectedDate, editingTimeSlot.id)) {
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
            const timeSlot = availabilityData[dayIndex].timeSlots.find((slot) => slot.id === timeSlotToDelete)
            if (timeSlot?.booked) {
                toast.error("Cannot delete booked time slots")
                return
            }

            const updatedData = [...availabilityData]
            updatedData[dayIndex] = {
                ...updatedData[dayIndex],
                timeSlots: updatedData[dayIndex].timeSlots.filter((slot) => slot.id !== timeSlotToDelete),
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

        setTimeSlotToDelete(timeSlotId)
        setShowDeleteConfirmation(true)
    }

    const handleSaveAvailability = async () => {
        if (!mentorId) {
            toast.error("Mentor ID is missing. Please try again later.")
            return
        }

        setIsLoading(true)
        try {
            const specificDateAvailability = availabilityData.map((day) => {
                // Normalize the date to UTC midnight (YYYY-MM-DD 00:00:00.000Z)
                const normalizedDate = new Date(day.date.toISOString().split("T")[0] + "T00:00:00.000Z")
                return {
                    _id: day._id,
                    date: normalizedDate,
                    timeSlots: day.timeSlots.map((slot) => ({
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        booked: slot.booked,
                    })),
                }
            })

            // Log the data being sent to the backend for debugging
            console.log("Saving availability:", specificDateAvailability)

            // Separate new and existing entries
            const newEntries = specificDateAvailability.filter((day) => !day._id)
            const existingEntries = specificDateAvailability.filter((day) => day._id)

            // Handle new entries
            if (newEntries.length > 0) {
                await addMentorSpecificDateAvailability(mentorId, newEntries)
            }

            // Handle existing entries
            for (const entry of existingEntries) {
                await editMentorSpecificDateAvailability(entry._id!, {
                    date: entry.date,
                    timeSlots: entry.timeSlots,
                })
            }

            toast.success("Specific date availability updated successfully")
            setShowSaveConfirmation(false)
        } catch (error) {
            console.error("Error saving specific date availability:", error)
            toast.error("Error saving availability. Please check your connection and try again.")
            setShowSaveConfirmation(false)
        } finally {
            setIsLoading(false)
        }
    }

    const getAvailableDates = () => {
        return availabilityData.map((day) => format(day.date, "yyyy-MM-dd"))
    }

    const hasAvailabilityOnDate = (date: Date) => {
        return availabilityData.some((day) => isSameDay(day.date, date))
    }

    const getWeekDates = () => {
        const dates = []
        for (let i = 0; i < 7; i++) {
            dates.push(addDays(currentWeekStart, i))
        }
        return dates
    }

    const goToPreviousWeek = () => {
        setCurrentWeekStart(addDays(currentWeekStart, -7))
    }

    const goToNextWeek = () => {
        setCurrentWeekStart(addDays(currentWeekStart, 7))
    }

    const goToCurrentWeek = () => {
        setCurrentWeekStart(startOfWeek(new Date()))
    }

    const weekDates = getWeekDates()

    const groupTimeSlotsByHour = (timeSlots: TimeSlot[]) => {
        const grouped: { [key: string]: TimeSlot[] } = {}

        timeSlots.forEach((slot) => {
            const hour = slot.startTime.split(":")[0]
            if (!grouped[hour]) {
                grouped[hour] = []
            }
            grouped[hour].push(slot)
        })

        return grouped
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Availability Schedule for Official Reviews</h1>
                        <p className="text-gray-600 mt-2">Manage your mentoring session time slots</p>
                    </div>
                    <Button
                        onClick={() => setShowSaveConfirmation(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-md shadow-sm flex items-center gap-2 transition-all duration-200"
                        disabled={availabilityData.length === 0 || isLoading}
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                        {isLoading && <span className="ml-2 animate-spin">⏳</span>}
                    </Button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Calendar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            {/* Calendar Navigation */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-emerald-50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={goToPreviousWeek}
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="text-center">
                                    <h2 className="text-lg font-medium text-gray-800">{format(currentWeekStart, "MMMM yyyy")}</h2>
                                    <p className="text-sm text-gray-500">
                                        {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d")}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={goToNextWeek}
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Today Button */}
                            <div className="px-4 py-3 border-b border-gray-200">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToCurrentWeek}
                                    className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-2"
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    Today
                                </Button>
                            </div>

                            {/* Days of Week */}
                            <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 bg-gray-50">
                                {DAYS_OF_WEEK.map((day, index) => (
                                    <div key={index} className="text-xs font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1 p-4">
                                {weekDates.map((date, index) => {
                                    const isToday = isSameDay(date, new Date())
                                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                                    const isPast = isBefore(date, new Date()) && !isToday
                                    const hasAvailability = hasAvailabilityOnDate(date)

                                    return (
                                        <div
                                            key={index}
                                            className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all ${isSelected
                                                    ? "bg-emerald-500 text-white"
                                                    : isToday
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : isPast
                                                            ? "opacity-50 bg-gray-100 text-gray-400"
                                                            : "hover:bg-emerald-50 text-gray-700"
                                                }`}
                                            onClick={() => {
                                                if (!isPast || isToday) {
                                                    // Normalize the selected date to UTC midnight
                                                    const normalizedSelectedDate = new Date(date.toISOString().split("T")[0] + "T00:00:00.000Z");
                                                    setSelectedDate(normalizedSelectedDate)
                                                } else {
                                                    toast.error("Cannot select dates in the past")
                                                }
                                            }}
                                        >
                                            <span className={`text-lg font-medium ${isSelected ? "text-white" : ""}`}>
                                                {format(date, "d")}
                                            </span>
                                            {hasAvailability && (
                                                <div className="mt-1">
                                                    <div
                                                        className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Legend */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-600">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-emerald-100"></div>
                                        <span className="text-gray-600">Today</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                        <span className="text-gray-600">Past</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <InfoIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">About Availability</h3>
                                    <p className="text-sm text-gray-600">
                                        Set your available time slots for mentoring sessions. Students will be able to book these slots.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Time Slots */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            {/* Selected Date Header */}
                            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-full">
                                        <Clock className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
                                        </h2>
                                        {selectedDayData && (
                                            <p className="text-sm text-gray-500">
                                                {selectedDayData.timeSlots.length} time slot{selectedDayData.timeSlots.length !== 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={openAddDialog}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow-sm flex items-center gap-1.5"
                                    disabled={
                                        !selectedDate ||
                                        (isBefore(selectedDate, new Date()) && !isSameDay(selectedDate, new Date())) ||
                                        isLoading
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Slot
                                </Button>
                            </div>

                            {/* Time Slots Content */}
                            <div className="p-5">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                                    </div>
                                ) : selectedDayData && selectedDayData.timeSlots.length > 0 ? (
                                    <div className="space-y-8">
                                        {Object.entries(groupTimeSlotsByHour(selectedDayData.timeSlots))
                                            .sort(([hourA], [hourB]) => Number.parseInt(hourA) - Number.parseInt(hourB))
                                            .map(([hour, slots]) => (
                                                <div key={hour} className="relative">
                                                    {/* Hour Label */}
                                                    <div className="flex items-center mb-3">
                                                        <div className="flex-shrink-0 w-16 text-right">
                                                            <span className="inline-block bg-emerald-500 text-white text-sm font-medium px-2.5 py-1 rounded">
                                                                {hour}:00
                                                            </span>
                                                        </div>
                                                        <div className="ml-4 h-px flex-grow bg-gray-200"></div>
                                                    </div>

                                                    {/* Time Slots */}
                                                    <div className="ml-20">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {slots
                                                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                                                .map((timeSlot) => (
                                                                    <div
                                                                        key={timeSlot.id}
                                                                        className={`relative group p-4 rounded-lg border ${timeSlot.booked
                                                                                ? "bg-amber-50 border-amber-200"
                                                                                : "bg-white border-gray-200 hover:border-emerald-300"
                                                                            } transition-all duration-200 shadow-sm`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-3">
                                                                                <div
                                                                                    className={`p-2 rounded-full ${timeSlot.booked ? "bg-amber-100" : "bg-emerald-100"}`}
                                                                                >
                                                                                    <Clock
                                                                                        className={`h-4 w-4 ${timeSlot.booked ? "text-amber-600" : "text-emerald-600"}`}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        className={`font-medium ${timeSlot.booked ? "text-amber-800" : "text-gray-800"}`}
                                                                                    >
                                                                                        {timeSlot.startTime} - {timeSlot.endTime}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {Number.parseInt(timeSlot.endTime.split(":")[0]) -
                                                                                            Number.parseInt(timeSlot.startTime.split(":")[0])}{" "}
                                                                                        hour
                                                                                        {Number.parseInt(timeSlot.endTime.split(":")[0]) -
                                                                                            Number.parseInt(timeSlot.startTime.split(":")[0]) !==
                                                                                            1
                                                                                            ? "s"
                                                                                            : ""}
                                                                                        {timeSlot.endTime.split(":")[1] !== timeSlot.startTime.split(":")[1] &&
                                                                                            " 30 min"}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {timeSlot.booked ? (
                                                                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Booked</Badge>
                                                                            ) : (
                                                                                <div className="flex gap-1">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => openEditDialog(timeSlot)}
                                                                                        className="h-8 w-8 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                                                    >
                                                                                        <Edit className="h-4 w-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => openDeleteConfirmation(timeSlot.id)}
                                                                                        className="h-8 w-8 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : selectedDate ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                                            <CalendarIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Time Slots</h3>
                                        <p className="text-gray-500 mb-6 max-w-md">
                                            You haven't added any time slots for this date yet. Add your first time slot to make yourself
                                            available for mentoring.
                                        </p>
                                        <Button
                                            onClick={openAddDialog}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Your First Time Slot
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                                            <CalendarIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Date</h3>
                                        <p className="text-gray-500 max-w-md">
                                            Please select a date from the calendar to view or manage your availability time slots.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
                        setEditingTimeSlot(null)
                    }
                }}
            >
                <DialogContent className="sm:max-w-[450px] rounded-lg">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl font-semibold">
                            {editingTimeSlot ? "Edit Time Slot" : "Add Time Slot"}
                        </DialogTitle>
                        <DialogDescription>{selectedDate && `For ${format(selectedDate, "EEEE, MMMM d, yyyy")}`}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-time" className="text-gray-700">
                                    Start Time
                                </Label>
                                <Select value={newStartTime} onValueChange={handleStartTimeChange}>
                                    <SelectTrigger
                                        id="start-time"
                                        className={`border ${startTimeError ? "border-red-500" : "border-gray-300"} focus:ring-emerald-500`}
                                    >
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
                                <Label htmlFor="end-time" className="text-gray-700">
                                    End Time
                                </Label>
                                <Select value={newEndTime} onValueChange={handleEndTimeChange}>
                                    <SelectTrigger
                                        id="end-time"
                                        className={`border ${endTimeError ? "border-red-500" : "border-gray-300"} focus:ring-emerald-500`}
                                    >
                                        <SelectValue placeholder="End time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map((time) => (
                                            <SelectItem
                                                key={`dialog-end-${time}`}
                                                value={time}
                                                disabled={parse(time, "HH:mm", new Date()) <= parse(newStartTime, "HH:mm", new Date())}
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
                                <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <AlertDescription className="text-red-600 ml-2">{timeSlotError}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                    <div className="mt-2 space-y-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        {selectedDate && isSameDay(selectedDate, new Date()) && (
                            <div className="flex items-center">
                                <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm text-blue-700">Only future time slots are available for today</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm text-blue-700">Time slots must not overlap with existing slots</span>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false)
                                setEditingTimeSlot(null)
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editingTimeSlot ? handleEditTimeSlot : handleAddTimeSlot}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            {editingTimeSlot ? "Save Changes" : "Add Time Slot"}
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
                <DialogContent className="sm:max-w-[425px] rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-red-600">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Are you sure you want to delete this time slot? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 my-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">This will permanently remove the selected time slot.</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteConfirmation(false)
                                setTimeSlotToDelete(null)
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteTimeSlot} className="bg-red-600 hover:bg-red-700">
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
                <DialogContent className="sm:max-w-[425px] rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-emerald-700">Save Availability</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Are you sure you want to save your availability settings?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 my-4">
                        <div className="flex items-center">
                            <InfoIcon className="h-5 w-5 text-emerald-600 mr-2" />
                            <p className="text-emerald-700">This will update your availability for the selected dates.</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowSaveConfirmation(false)
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAvailability} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}