import axiosInstance from "@/utils/axiosInstance";
import { Clock, Star } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



interface Course {
  _id: string;
  courseId:string
  courseData: {
    title: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    image: string;
    price: string;
    
  };
}

// const courses = [
//   {
//     id: 1,
//     title: "Introduction to Web Development",
//     instructor: "Sarah Johnson",
//     image: "/placeholder.svg?height=200&width=300",
//     rating: 4.8,
//     duration: "12h 30m",
//     progress: 75,
//   },
//   {
//     id: 2,
//     title: "Advanced JavaScript Concepts",
//     instructor: "Michael Chen",
//     image: "/placeholder.svg?height=200&width=300",
//     rating: 4.9,
//     duration: "15h 45m",
//     progress: 30,
//   },
//   {
//     id: 3,
//     title: "UI/UX Design Fundamentals",
//     instructor: "Emma Rodriguez",
//     image: "/placeholder.svg?height=200&width=300",
//     rating: 4.7,
//     duration: "10h 15m",
//     progress: 50,
//   },
// ]

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(()=>{
    const fetchCourses= async ()=>{
         try {
          const response=await axiosInstance.get('/api/course/enrolled-courses')
          setCourses(response.data)
         } catch (error) {
          console.error('Error fetching courses:', error);
         }finally{
          setLoading(false);
         }
    }
    fetchCourses()
  },[])

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-tasks/${courseId}`);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">My Courses</h1>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>All Courses</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>Sort by: Recent</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Name</option>
          </select>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="border bg-secondary rounded-lg overflow-hidden"
            onClick={() => handleCourseClick(course.courseId)}
            >
              <div className="relative h-40">
              <img src={course.courseData.image || "/placeholder.svg"} alt={course.courseData.title} className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{course.courseData.title}</h3>
                <p className="text-sm font-bold text-gray-500 mb-2">₹ {course.courseData.price}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">5</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{course.courseData.duration}weeks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `10%` }}></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">{10}% complete</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Browse Courses</button>
        </div>
      )}
    </div>
  )
}

