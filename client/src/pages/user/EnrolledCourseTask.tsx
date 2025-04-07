
import Footer from '@/components/user/common/Footer'
import Navbar from '@/components/user/common/Navbar'
import { CourseTasks } from '@/components/user/profile/CourseTask'

const EnrolledCourseTask = () => {
  return (
    <div >
      <Navbar/>
      <div className="container mx-auto px-10 top-0 py-25">

      <CourseTasks/>
      </div>
      <Footer/>
    </div>
  )
}

export default EnrolledCourseTask
