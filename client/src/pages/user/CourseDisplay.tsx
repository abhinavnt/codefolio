
import Footer from "@/components/user/common/Footer"
import Navbar from "@/components/user/common/Navbar"
import CourseList from "@/components/user/course/CourseList"


export default function CourseDisplay() {
  return (
    <>
    <Navbar/>
      <div className="container mx-auto px-10 top-0 py-25">
        <CourseList />
      </div>
      <Footer/>
    </>

  )
}
