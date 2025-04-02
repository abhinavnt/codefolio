import Footer from "@/components/user/common/Footer"
import Navbar from "@/components/user/common/Navbar"
import CourseDetail from "@/components/user/course/CourseDetails"





const CourseDetails = () => {
  return (
    <div>
        <Navbar/>
        <div className="container mx-auto px-10 top-0 py-15">
        <CourseDetail/>
        </div>
        <Footer/>
    </div>
  )
}

export default CourseDetails
