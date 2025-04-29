"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ArrowLeft, CheckCircle, Clock, FileText, Play, Star, X, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface Task {
  _id: string;
  title: string;
  description: string;
  video: string;
  lessons: string[];
  order: number;
  duration: string;
  status: "active" | "inactive";
  reviewStatus: "PASS" | "FAIL";
  resources: string[];
  completed: boolean;
  reviewScheduled: boolean;
  attempts: {
    submissionDate: Date;
    review?: {
      mentorId: string;
      theoryMarks: number;
      practicalMarks: number;
      result: "pass" | "fail";
      reviewDate: Date;
    };
  }[];
  meetId?: string;
}

interface CourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  price: string;
}

interface UserData {
  name: string;
  email: string;
}

export function UserCourseTasks() {
  const params = useParams();
  const userId = params?.userId as string;
  const courseId = params?.courseId as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await axiosInstance.get(`/api/course/enrolled-courses/${userId}/${courseId}/tasks`);
        const sortedTasks = tasksResponse.data.sort((a: Task, b: Task) => a.order - b.order);
        setTasks(sortedTasks);

        // Fetch course and user details
        const courseResponse = await axiosInstance.get(`/api/course/enrolled-courses/admin`, {
          params: { userId, courseId },
        });
        if (courseResponse.data.courses.length > 0) {
          const courseData = courseResponse.data.courses[0];
          setCourse(courseData.courseData);
          setUser({ name: courseData.userId.name, email: courseData.userId.email });
        }

        // Calculate completion percentage based on completed tasks
        const completedCount = sortedTasks.filter((task: Task) => task.completed).length;
        const percentage = sortedTasks.length > 0 ? Math.round((completedCount / sortedTasks.length) * 100) : 0;
        setCompletionPercentage(percentage);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, courseId]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleScheduleReview = async (taskId: string) => {
    try {
      await axiosInstance.post(`/api/course/schedule-review/${taskId}`);
      setTasks(tasks.map(task => task._id === taskId ? { ...task, reviewScheduled: true } : task));
    } catch (error) {
      console.error("Error scheduling review:", error);
    }
  };

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
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
              <p className="text-sm text-gray-500 mb-2"><strong>User:</strong> {user.name} ({user.email})</p>

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
          const weekNumber = task.order;

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
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                    {task.reviewStatus === "PASS" && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Passed
                      </span>
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
                        e.stopPropagation();
                        handleScheduleReview(task._id);
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
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                if (
                  number === 1 ||
                  number === totalPages ||
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => paginate(number)}
                        isActive={currentPage === number}
                        className="cursor-pointer"
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (number === 2 && currentPage > 3) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                if (number === totalPages - 1 && currentPage < totalPages - 2) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
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
                          <strong>Submitted:</strong>{" "}
                          {new Date(attempt.submissionDate).toLocaleDateString()}
                        </p>
                        {attempt.review && (
                          <>
                            <p className="text-sm">
                              <strong>Reviewed:</strong>{" "}
                              {new Date(attempt.review.reviewDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              <strong>Theory Marks:</strong> {attempt.review.theoryMarks}
                            </p>
                            <p className="text-sm">
                              <strong>Practical Marks:</strong> {attempt.review.practicalMarks}
                            </p>
                            <p className="text-sm">
                              <strong>Result:</strong>{" "}
                              <span
                                className={
                                  attempt.review.result === "pass"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
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
    </div>
  );
}