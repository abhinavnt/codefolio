import Footer from "@/components/user/common/Footer"
import Navbar from "@/components/user/common/Navbar"
import MentorListing from "@/components/user/mentor/MentorList"
// import { MentorListing } 

export default function Mentors() {
  return (
    <div className="min-h-screen bg-">
        <Navbar/>
        <div className="container mx-auto px-10 top-0 py-25">
      <MentorListing />
      </div>
      <Footer/>
    </div>
  )
}
