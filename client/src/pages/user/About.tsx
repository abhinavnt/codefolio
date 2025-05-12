import AboutPage from '@/components/user/common/About'
import Footer from '@/components/user/common/Footer'
import Navbar from '@/components/user/common/Navbar'


const About = () => {
  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-10 top-0 py-15">

    <AboutPage/>
    </div>
    <Footer/>
    </>
  )
}

export default About
