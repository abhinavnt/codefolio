import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"
import RelatedCourses from "./Related-course" 
import { courseData } from "@/data/dummy-data" 
import CourseHeader from "./Course-header"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate();
    const { courses, loading, error } = useSelector((state: RootState) => state.courses) // Access courses from Redux
    const course = courses.find((c) => c._id === id);
    console.log(course,"course");
    
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
              <Link to={'/courses'}>Browse Courses</Link>
            </Button>
          </div>
        )
      }

      const handleEnrollNow = () => {
        navigate(`/checkout/${course._id}`); 
      };

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
              src={course.image}
              alt="Course thumbnail"
              width={800}
              height={400}
              className="w-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* <div className="rounded-full bg-white/90 p-4 shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="#10b981" />
                </svg>
              </div> */}
            </div>
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="curriculum">Curriculum</TabsTrigger> */}
              {/* <TabsTrigger value="instructor">Instructor</TabsTrigger> */}
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                 {course.description}
                </p>
                <p>By the end of this course, you'll be able to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create beautiful, responsive designs in Figma</li>
                  <li>Build fully-functional websites using Webflow without coding</li>
                  <li>Understand responsive design principles and best practices</li>
                  <li>Convert designs into custom websites</li>
                  <li>Optimize websites for different devices and screen sizes</li>
                </ul>
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

            {/* <TabsContent value="curriculum">
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-bold mb-4">Curriculum</h3>

                {courseData.curriculum.map((section, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden mb-4">
                    <div className="flex items-center justify-between bg-gray-50 p-4">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 12L3 7L4.4 5.55L8 9.15L11.6 5.55L13 7L8 12Z" fill="#64748b" />
                        </svg>
                        <h4 className="font-medium">{section.title}</h4>
                      </div>
                      <div className="text-sm text-gray-500">
                        {section.lessons.length} lessons • {section.duration}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.5 11.5L11 8L6.5 4.5V11.5Z" fill="#10b981" />
                            </svg>
                            <span>{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent> */}
{/* 
            <TabsContent value="instructor">
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Meet Your Instructor</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=150&width=150"
                      alt="Instructor"
                      width={150}
                      height={150}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{courseData.instructor.name}</h4>
                    <p className="text-gray-500 mb-3">{courseData.instructor.title}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">Instructor Rating</span>
                    </div>
                    <p className="text-gray-700">{courseData.instructor.bio}</p>
                  </div>
                </div>
              </div>
            </TabsContent> */}


            <TabsContent value="reviews">
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Student Reviews</h3>
                <div className="space-y-6">
                  {courseData.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src="/placeholder.svg?height=50&width=50"
                          alt={review.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{review.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-emerald-500 text-emerald-500" : "fill-gray-200 text-gray-200"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
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
                    {/* <span className="text-lg text-gray-500 line-through">₹{course.price||"N/A"}</span> */}
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">10% off</Badge>
                </div>

                <Button onClick={handleEnrollNow} className="w-full mb-4 bg-emerald-500 hover:bg-emerald-600">Enroll Now</Button>

                <p className="text-sm text-gray-500 text-center mb-6">30-day money-back guarantee</p>

                <div className="space-y-4">
                  <h4 className="font-bold">This course includes:</h4>
                  {/* {courseData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">{feature.icon}</div>
                      <p className="text-sm">{feature.text}</p>
                    </div>
                  ))} */}
                </div>

                <Separator className="my-6" />

                <div className="flex justify-center space-x-4">
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
                        d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path d="M6 6.5L10 9.5L6 12.5V6.5Z" fill="currentColor" />
                    </svg>
                    Preview
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
                        d="M8 3.5C8 2.11929 9.11929 1 10.5 1C11.8807 1 13 2.11929 13 3.5C13 4.88071 11.8807 6 10.5 6C9.11929 6 8 4.88071 8 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 12.5C8 11.1193 6.88071 10 5.5 10C4.11929 10 3 11.1193 3 12.5C3 13.8807 4.11929 15 5.5 15C6.88071 15 8 13.8807 8 12.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M13 3.5C13 2.11929 14.1193 1 15.5 1C16.8807 1 18 2.11929 18 3.5C18 4.88071 16.8807 6 15.5 6C14.1193 6 13 4.88071 13 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10.5 6L5.5 10M5.5 10L10.5 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Gift
                  </Button>
                </div>
              </div>
            </Card>

            <div className="sticky">
              {/* <RelatedCourses /> */}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

