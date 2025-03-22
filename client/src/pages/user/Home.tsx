import Footer from "@/components/user/common/Footer"
import Navbar from "@/components/user/common/Navbar"
import FeaturesSection from "@/components/user/home/FeaturesSection"
import Hero from "@/components/user/home/Hero"
import MentorsSection from "@/components/user/home/MentorsSection"
import MostPopular from "@/components/user/home/MostPopular"

const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <FeaturesSection/>
      <MostPopular/>
      <MentorsSection/>
      <Footer/>
    </>
  )
}

export default Home
