
import { useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { ArrowLeft, Clock, FileText, Play, Star, X, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

interface Task {
  _id: string
  title: string
  description: string
  video: string
  lessons: string[]
  order: number
  duration: string
  status: "active" | "inactive"
  reviewStatus: "PASS" | "FAIL"
  resources: string[]
  completed: boolean
  reviewScheduled: boolean
  attempts: {
    submissionDate: Date
    review?: {
      mentorId: string
      theoryMarks: number
      practicalMarks: number
      result: "pass" | "fail"
      reviewDate: Date
    }
  }[]
  meetId?: string
}

interface CourseData {
  _id: string
  title: string
  description: string
  category: string
  level: string
  duration: string
  image: string
  price: string
}

interface UserData {
  name: string
  email: string
}

interface TimeSlot {
  mentorId: string
  mentorName: string
  date: string
  startTime: string
  endTime: string
}

export function UserCourseTasks() {
  const params = useParams()
  const userId = params?.userId as string
  const courseId = params?.courseId as string
  const [tasks, setTasks] = useState<Task[]>([])
  const [course, setCourse] = useState<CourseData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 9
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [filteredSlots, setFilteredSlots] = useState<TimeSlot[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [slotsCurrentPage, setSlotsCurrentPage] = useState(1)
  const slotsPerPage = 6
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [uniqueDates, setUniqueDates] = useState<string[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [slotToBook, setSlotToBook] = useState<TimeSlot | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosInstance.get(`/api/course/enrolled-courses/${userId}/${courseId}/tasks`)
        const sortedTasks = tasksResponse.data.sort((a: Task, b: Task) => a.order - b.order)
        setTasks(sortedTasks)

        const courseResponse = await axiosInstance.get(`/api/course/enrolled-courses/${courseId}/${userId}/admin`)
        



        setCourse(courseResponse.data.courseData)
        setUser({ name: courseResponse.data.userId.name, email: courseResponse.data.userId.email })


        const completedCount = sortedTasks.filter((task: Task) => task.completed).length
        const percentage = sortedTasks.length > 0 ? Math.round((completedCount / sortedTasks.length) * 100) : 0
        setCompletionPercentage(percentage)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, courseId])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleScheduleReview = async (taskId: string) => {
    setSelectedTaskId(taskId)
    try {
      const response = await axiosInstance.get(`/api/mentor-availability/available-slots`)
      const now = new Date()
      const futureSlots = response.data
        .map((slot: TimeSlot) => {
          // Normalize the slot date to YYYY-MM-DD format (UTC midnight)
          const normalizedDate = new Date(slot.date).toISOString().split("T")[0]
          return {
            ...slot,
            date: normalizedDate,
          }
        })
        .filter((slot: TimeSlot) => {
          const slotDate = new Date(slot.date)
          const [hours, minutes] = slot.startTime.split(":").map(Number)
          slotDate.setHours(hours, minutes, 0, 0)
          return slotDate > now
        })

      setAvailableSlots(futureSlots)

      const datesSet = new Set<string>()
      futureSlots.forEach((slot: TimeSlot) => {
        datesSet.add(slot.date)
      })

      const datesArray = Array.from(datesSet).sort() as string[]
      setUniqueDates(datesArray)

      if (datesArray.length > 0) {
        setSelectedDate(datesArray[0])
        setFilteredSlots(futureSlots.filter((slot: TimeSlot) => slot.date === datesArray[0]))
      } else {
        setFilteredSlots([])
      }

      setSlotsCurrentPage(1)
      setIsScheduleModalOpen(true)
    } catch (error) {
      console.error("Error fetching available slots:", error)
    }
  }

  const handleBookSlot = (slot: TimeSlot) => {
    setSlotToBook(slot)
    setIsConfirmDialogOpen(true)
  }

  const confirmBookSlot = async () => {
    if (!slotToBook) return
    try {
      const formattedDate = slotToBook.date
      const payload = {
        mentorId: slotToBook.mentorId,
        userId,
        taskId: selectedTaskId,
        date: formattedDate,
        startTime: slotToBook.startTime,
        endTime: slotToBook.endTime,
      }
      
      await axiosInstance.post(`/api/mentor-availability/book`, payload)
      setTasks(tasks.map((task) => (task._id === selectedTaskId ? { ...task, reviewScheduled: true } : task)))
      setIsScheduleModalOpen(false)
      setIsConfirmDialogOpen(false)
      setSlotToBook(null)
    } catch (error) {
      console.error("Error booking slot:", error)
    }
  }

  const cancelBookSlot = () => {
    setIsConfirmDialogOpen(false)
    setSlotToBook(null)
  }

  const handleDateFilter = (date: string) => {
    setSelectedDate(date)
    const filtered = availableSlots.filter((slot: TimeSlot) => slot.date === date)
    setFilteredSlots(filtered)
    setSlotsCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }
    return new Date(`${dateString}T00:00:00.000Z`).toLocaleDateString("en-US", options)
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(tasks.length / tasksPerPage)

  const indexOfLastSlot = slotsCurrentPage * slotsPerPage
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage
  const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot)
  const totalSlotsPages = Math.ceil(filteredSlots.length / slotsPerPage)

  const paginateTasks = (pageNumber: number) => setCurrentPage(pageNumber)
  const paginateSlots = (pageNumber: number) => setSlotsCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4">
      <Link to="/admin/enrolled-users" className="text-green-500 hover:underline flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Enrolled Users
      </Link>

      {course && user && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={course.image || "/placeholder.svg?height=300&width=400"}
                alt={course.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3 lg:w-3/4">
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                <strong>User:</strong> {user.name} ({user.email})
              </p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{course.duration} weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Level:</span>
                  <span className="text-sm text-gray-500">{course.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm text-gray-500">{course.category}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentTasks.map((task) => {
          const weekNumber = task.order

          return (
            <div
              key={task._id}
              onClick={() => handleTaskClick(task)}
              className={`
                bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300
                hover:shadow-lg transform hover:-translate-y-1 cursor-pointer
                ${task.reviewStatus === "PASS" ? "border-l-4 border-green-500" : task.completed ? "border-l-4 border-blue-500" : "border-l-4 border-gray-300"}
              `}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg">Week {weekNumber}</h3>
                  <div className="flex gap-2">
                    {task.completed && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    )}
                    {task.reviewStatus === "PASS" && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Passed</span>
                    )}
                  </div>
                </div>

                <h4 className="font-medium mb-2 text-gray-800">{task.title}</h4>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{task.duration}</span>
                  </div>

                  {task.completed && !task.reviewScheduled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleScheduleReview(task._id)
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule Review
                    </Button>
                  )}
                </div>

                <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                  {task.lessons && task.lessons.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      {task.lessons.length} {task.lessons.length === 1 ? "Lesson" : "Lessons"}
                    </div>
                  )}
                  {task.resources && task.resources.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      {task.resources.length} {task.resources.length === 1 ? "Resource" : "Resources"}
                    </div>
                  )}
                  {task.video && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Play className="w-3 h-3" />
                      Video
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && paginateTasks(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
                  return (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => paginateTasks(number)}
                        isActive={currentPage === number}
                        className="cursor-pointer"
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                if (number === 2 && currentPage > 3) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                if (number === totalPages - 1 && currentPage < totalPages - 2) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && paginateTasks(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isModalOpen && selectedTask && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-medium">{selectedTask.title}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">{selectedTask.description}</p>

              {selectedTask.video && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Video Lesson</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Video URL: {selectedTask.video}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask.lessons && selectedTask.lessons.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Lessons</h3>
                  <ul className="space-y-2">
                    {selectedTask.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTask.resources && selectedTask.resources.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Resources</h3>
                  <ul className="space-y-2">
                    {selectedTask.resources.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {resource.split("/").pop() || `Resource ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTask.attempts && selectedTask.attempts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Submission History</h3>
                  <ul className="space-y-2">
                    {selectedTask.attempts.map((attempt, index) => (
                      <li key={index} className="border-l-2 border-gray-200 pl-4 py-2">
                        <p className="text-sm">
                          <strong>Submitted:</strong> {new Date(attempt.submissionDate).toLocaleDateString()}
                        </p>
                        {attempt.review && (
                          <>
                            <p className="text-sm">
                              <strong>Reviewed:</strong> {new Date(attempt.review.reviewDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              <strong>Theory Marks:</strong> {attempt.review.theoryMarks}
                            </p>
                            <p className="text-sm">
                              <strong>Practical Marks:</strong> {attempt.review.practicalMarks}
                            </p>
                            <p className="text-sm">
                              <strong>Result:</strong>{" "}
                              <span className={attempt.review.result === "pass" ? "text-green-500" : "text-red-500"}>
                                {attempt.review.result.toUpperCase()}
                              </span>
                            </p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-medium">Schedule Review</h2>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">No available slots</p>
                  <p className="text-gray-500">There are no future time slots available for scheduling.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">SELECT DATE</h3>
                    <div className="flex overflow-x-auto pb-2 gap-2">
                      {uniqueDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => handleDateFilter(date)}
                          className={`px-4 py-2 rounded-md whitespace-nowrap text-sm ${selectedDate === date
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentSlots.length > 0 ? (
                      currentSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Clock className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </p>
                                <p className="text-sm text-gray-500">{formatDate(slot.date)}</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm mb-3">
                            <span className="text-gray-500">Mentor:</span> {slot.mentorName}
                          </p>
                          <Button
                            onClick={() => handleBookSlot(slot)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                          >
                            Book Slot
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-6">
                        <p className="text-gray-500">No time slots available for this date.</p>
                      </div>
                    )}
                  </div>

                  {totalSlotsPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => slotsCurrentPage > 1 && paginateSlots(slotsCurrentPage - 1)}
                          disabled={slotsCurrentPage === 1}
                          className={`p-2 rounded-full ${slotsCurrentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalSlotsPages }, (_, i) => i + 1).map((number) => (
                            <button
                              key={number}
                              onClick={() => paginateSlots(number)}
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${slotsCurrentPage === number
                                ? "bg-green-500 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              {number}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => slotsCurrentPage < totalSlotsPages && paginateSlots(slotsCurrentPage + 1)}
                          disabled={slotsCurrentPage === totalSlotsPages}
                          className={`p-2 rounded-full ${slotsCurrentPage === totalSlotsPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isConfirmDialogOpen && slotToBook && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-medium mb-4">Confirm Booking</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to book the slot with {slotToBook.mentorName} on {formatDate(slotToBook.date)} from{" "}
              {formatTime(slotToBook.startTime)} to {formatTime(slotToBook.endTime)}?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelBookSlot}
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button onClick={confirmBookSlot} className="bg-green-500 hover:bg-green-600 text-white">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}