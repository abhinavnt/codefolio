
import { ArrowLeft, BookOpen, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import CourseHeader from "./Course-header"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useCallback, useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import type { Course } from "@/types/course"
import CourseFeedback from "./Course-feedback"
import { toast } from "sonner"

interface Review {
  _id: string
  userId: {
    name: string
    profileImageUrl?: string
  }
  rating: number
  feedback: string
  createdAt: string
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [checkCourse, setCourses] = useState<Course[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { courses } = useSelector((state: RootState) => state.courses)

  const course = courses.find((c) => c._id === id)

//fetch alredy enrolled course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/course/enrolled-courses")
        setCourses(response.data)
        console.log(response.data, "respponse from the enrolled course")
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }
    fetchCourses()
  }, [])

//fetch reviews
  const fetchReviews = useCallback(async () => {
    if (id) {
      try {
        const response = await axiosInstance.get(`/api/feedback/course/${id}`)
        setReviews(response.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }
  }, [id])

  useEffect(() => {
    fetchReviews()
  }, [id, fetchReviews])

  // Fetch initial wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!id) return;
      try {
        const response = await axiosInstance.get(`/api/wishlist/${id}`);
        setIsWishlisted(response.data.isWishlisted);
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };
    fetchWishlistStatus();
  }, [id]);

  //if no course 
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <div className="rounded-full bg-emerald-100 p-4 mb-6">
          <BookOpen className="h-12 w-12 text-emerald-500" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight mb-2">Course not found</h2>

        <p className="text-muted-foreground mb-8 max-w-md">
          We couldn't find the course you're looking for. It may have been removed or doesn't exist.
        </p>

        <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
          <Link to={"/courses"}>Browse Courses</Link>
        </Button>
      </div>
    )
  }

  const handleEnrollNow = () => {
    navigate(`/checkout/${course._id}`)
  }

  const handleWishlist = async () => {
    if (!id) return;
    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/api/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await axiosInstance.post(`/api/wishlist/${id}`);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("too many request in 5 sec")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate("/courses")}>
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseHeader course={course} />

          <div className="relative mt-6 rounded-lg overflow-hidden">
            <img
              src={course.image || "/placeholder.svg"}
              alt="Course thumbnail"
              width={800}
              height={400}
              className="w-full object-cover rounded-lg"
            />
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <div className="space-y-4 text-gray-700">
                <p>{course.description}</p>
              </div>

              <h3 className="text-xl font-bold mt-8 mb-4">What you will learn in this course</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learningPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p>{point}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mt-8 mb-4">Who this course is for</h3>
              <div className="space-y-4">
                {course.targetedAudience.map((audience, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p>{audience}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mt-8 mb-4">Course requirements</h3>
              <div className="space-y-4">
                {course.courseRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p>{requirement}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Student Reviews</h3>

                {checkCourse.some((enrolledCourse) => enrolledCourse.courseId === course._id) && (
                  <div className="mb-8">
                    <CourseFeedback courseId={course._id} />
                  </div>
                )}

                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b pb-6">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={review.userId?.profileImageUrl ? review.userId.profileImageUrl : "https://cdn.vectorstock.com/i/500p/45/59/profile-photo-placeholder-icon-design-in-gray-vector-37114559.jpg"}
                            alt={review.userId?.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{review.userId?.name ?review.userId?.name :"Unknown User" }</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-emerald-500 text-emerald-500" : "fill-gray-200 text-gray-200"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.feedback}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 ">
          <div className="lg:sticky lg:top-8 lg:max-h-screen lg:overflow-y-auto pb-8 flex flex-col gap-8">
            <Card>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₹{course.price}</span>
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">10% off</Badge>
                </div>

                {checkCourse.some((enrolledCourse) => enrolledCourse.courseId === course._id) ? (
                  <Button disabled className="w-full mb-4 bg-gray-400">
                    Already Enrolled
                  </Button>
                ) : (
                  <Button onClick={handleEnrollNow} className="w-full mb-4 bg-emerald-500 hover:bg-emerald-600">
                    Enroll Now
                  </Button>
                )}

                <p className="text-sm text-gray-500 text-center mb-6">30-day money-back guarantee</p>

                <Separator className="my-6" />

                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlist}
                    className={isWishlisted ? "text-red-500 border-red-500 hover:bg-red-50" : ""}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </Button>

                  <Button variant="outline" size="sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M8 3.5V12.5M8 3.5L4.5 7M8 3.5L11.5 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}