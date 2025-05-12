

import ScrollReveal from "@/components/common/animations/ScrollReveal"
import Footer from "@/components/user/common/Footer"
import Navbar from "@/components/user/common/Navbar"
import FeaturesSection from "@/components/user/home/FeaturesSection"
import Hero from "@/components/user/home/Hero"
import MentorsSection from "@/components/user/home/MentorsSection"
import MostPopular from "@/components/user/home/MostPopular"


const Home = () => {
  return (
    <>
      <Navbar />

      <ScrollReveal>
        <Hero />
      </ScrollReveal>

      <ScrollReveal delay={0.3} direction="up">
        <FeaturesSection />
      </ScrollReveal>

      <ScrollReveal delay={0.4} direction="up">
        <MostPopular />
      </ScrollReveal>

      <ScrollReveal delay={0.5} direction="up">
        <MentorsSection />
      </ScrollReveal>

      <Footer />
    </>
  )
}

export default Home
