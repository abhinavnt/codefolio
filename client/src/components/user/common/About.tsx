"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Code, Compass, Lightbulb, Users, BookOpen, Award, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            id="visual"
            viewBox="0 0 900 600"
            width="900"
            height="600"
          >
            <path
              d="M0 96L21.5 93.2C43 90.3 86 84.7 128.8 90.3C171.7 96 214.3 113 257.2 122.5C300 132 343 134 385.8 129.2C428.7 124.3 471.3 112.7 514.2 104.7C557 96.7 600 92.3 642.8 93.2C685.7 94 728.3 100 771.2 104.7C814 109.3 857 112.7 878.5 114.3L900 116L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z"
              fill="#10b981"
              className="opacity-20"
            ></path>
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
            >
              <Compass className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            >
              Guiding the Next Generation of <span className="text-emerald-500">Software Engineers</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground"
            >
              Connecting aspiring developers with industry experts through structured mentorship and personalized
              roadmaps.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                Find Your Mentor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Our <span className="text-emerald-500">Mission</span>
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                We believe that personalized mentorship is the key to accelerating your growth as a software engineer.
                Our platform connects you with industry experts who have walked the path you're on and can guide you
                through the challenges ahead.
              </p>
              <p className="text-lg text-muted-foreground">
                Through structured roadmaps, one-on-one sessions, and continuous feedback, we help you navigate the
                complex landscape of software development and build the skills that matter in today's industry.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 z-0 rounded-3xl bg-emerald-500/10"></div>
              <div className="relative z-10 grid grid-cols-2 gap-4 p-6">
                {[
                  { icon: <Code className="h-8 w-8 text-emerald-500" />, title: "Technical Excellence" },
                  { icon: <Lightbulb className="h-8 w-8 text-emerald-500" />, title: "Innovative Learning" },
                  { icon: <Users className="h-8 w-8 text-emerald-500" />, title: "Community Support" },
                  { icon: <BookOpen className="h-8 w-8 text-emerald-500" />, title: "Structured Growth" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center rounded-xl bg-card p-6 text-center shadow-lg"
                  >
                    {item.icon}
                    <h3 className="mt-4 font-medium">{item.title}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              How <span className="text-emerald-500">It Works</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our platform simplifies the mentorship process, making it easy to find the right mentor and start your
              journey toward mastery.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Find Your Mentor",
                description:
                  "Browse profiles of industry experts and find someone who specializes in your area of interest.",
              },
              {
                step: "02",
                title: "Get a Personalized Roadmap",
                description:
                  "Receive a structured learning path tailored to your goals, skill level, and available time.",
              },
              {
                step: "03",
                title: "Regular Mentorship Sessions",
                description: "Schedule one-on-one sessions to get feedback, ask questions, and overcome challenges.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full overflow-hidden border-none bg-background shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-bold text-emerald-500">
                      {item.step}
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose <span className="text-emerald-500">Our Platform</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We've designed our mentorship program to provide maximum value and accelerate your growth as a software
              engineer.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Award className="h-10 w-10 text-emerald-500" />,
                title: "Industry Experts",
                description: "Learn from professionals with real-world experience at top tech companies.",
              },
              {
                icon: <Compass className="h-10 w-10 text-emerald-500" />,
                title: "Structured Roadmaps",
                description: "Follow clear, step-by-step paths designed to build your skills efficiently.",
              },
              {
                icon: <Users className="h-10 w-10 text-emerald-500" />,
                title: "Community Access",
                description: "Connect with peers and build your professional network in tech.",
              },
              {
                icon: <Code className="h-10 w-10 text-emerald-500" />,
                title: "Practical Projects",
                description: "Work on real-world projects that demonstrate your abilities to employers.",
              },
              {
                icon: <Lightbulb className="h-10 w-10 text-emerald-500" />,
                title: "Personalized Feedback",
                description: "Receive detailed code reviews and actionable improvement suggestions.",
              },
              {
                icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
                title: "Resource Library",
                description: "Access curated learning materials selected by industry professionals.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-none bg-background shadow-lg transition-all duration-300 hover:shadow-emerald-500/10 hover:ring-1 hover:ring-emerald-500/20">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="mb-4"
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="mb-3 text-xl font-bold group-hover:text-emerald-500">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden w-full py-20 md:py-32">
        <div className="absolute inset-0 z-0 overflow-hidden w-full">
          <div className="absolute bottom-0 left-0 right-0">
            {/* First wave layer */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -100, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 10,
                ease: "easeInOut",
              }}
              className="relative w-full"
            >
              <svg
                className="w-[200%] h-40 md:h-56 fill-emerald-500/20"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
                width="100%"
              >
                <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z"></path>
              </svg>
            </motion.div>

            {/* Second wave layer - slightly different speed and opacity */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 100, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 15,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 left-0 right-0 w-full"
            >
              <svg
                className="w-[200%] h-32 md:h-48 fill-emerald-500/15"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
                width="100%"
              >
                <path d="M0,40 C200,80 300,20 500,40 C700,60 800,10 1000,40 L1000,100 L0,100 Z"></path>
              </svg>
            </motion.div>

            {/* Third wave layer - fastest and most transparent */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [-100, 0, -100] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 left-0 right-0 w-full"
            >
              <svg
                className="w-[200%] h-24 md:h-40 fill-emerald-500/10"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
                width="100%"
              >
                <path d="M0,60 C100,90 400,10 500,60 C600,110 900,30 1000,60 L1000,100 L0,100 Z"></path>
              </svg>
            </motion.div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-2xl bg-card p-8 shadow-xl md:p-12"
          >
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Accelerate Your <span className="text-emerald-500">Software Engineering Career</span>?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join our platform today and get matched with a mentor who can help you reach your full potential.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                  Start Your Journey Today
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
