

import Footer from '@/components/user/common/Footer'
import Navbar from '@/components/user/common/Navbar'
import MentorProfile from '@/components/user/mentor/mentor-profile/MentorProfile'

const MentorProfilePage = () => {
  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-10 top-0 py-25">
       <MentorProfile/>
       </div>
      <Footer/>
    </div>
  )
}

export default MentorProfilePage
