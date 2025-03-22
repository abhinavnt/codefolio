import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LightbulbIcon, BookOpen, Users,BrainCircuit } from "lucide-react";
import img from '../../../../public/business-woman-holding-laptop-isolated-portrait-Photoroom.png'

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white py-12 px-10 md:py-16 lg:py-20">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
        {/* Left column - Text content */}
        <div className="space-y-8 z-10 order-2 md:order-1">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
              Up Your <span className="text-emerald-500">Skills</span> <br />
              To <span className="text-emerald-500">Advance</span> Your <br />
              <span className="text-emerald-500">Career</span> Path
            </h1>
            <p className="mt-6 max-w-lg text-base text-slate-600">
              Learn UI-UX Design skills with weekend UX. The latest online learning system and material that help your
              knowledge growing.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 h-12 rounded-md">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 px-6 py-2 h-12 rounded-md"
            >
              Get free trial
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <LightbulbIcon className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-slate-700">Public Speaking</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <BookOpen className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium text-slate-700">Career-Oriented</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <BrainCircuit className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm font-medium text-slate-700">Creative Thinking</span>
            </div>
          </div>
        </div>

        {/* Right column - Image and stats */}
        <div className="relative  h-[400px] md:h-[500px] lg:h-[550px] order-1 md:order-2">
          {/* Green background circle */}
          <div className="absolute right-0  top-1/2 transform -translate-y-1/2 h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px] rounded-full bg-[#20B486]"></div>

          {/* Decorative dots */}
          <div className="absolute left-1/4 bottom-10 h-3 w-3 rounded-full bg-emerald-500"></div>
          <div className="absolute right-1/4 bottom-5 h-3 w-3 rounded-full bg-emerald-500"></div>
          <div className="absolute right-1/3 top-1/4 h-3 w-3 rounded-full bg-emerald-500"></div>

          {/* Student image */}
          <div className="absolute bottom-12 right-1 h-[320px] w-[240px] md:h-[400px] md:w-[300px] lg:h-[450px] lg:w-[340px] z-10">
            <img src={img || "/placeholder.svg"} alt="Student with laptop" className="w-full h-full object-contain" />
          </div>

          {/* Stat cards with better positioning */}
          <Card className="absolute  left-[30%] top-[25%] flex items-center gap-3 p-3 shadow-lg z-20 bg-white rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100">
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-bold">2K+</div>
              <div className="text-xs text-slate-500">Video Courses</div>
            </div>
          </Card>

          <Card className="absolute right-[2%] top-[20%] p-3 shadow-lg z-20 bg-white rounded-lg">
            <div className="mb-1 text-center text-sm font-bold">5K+</div>
            <div className="text-center text-xs text-slate-500">Online Courses</div>
          </Card>

          <Card className="absolute right-[45%] bottom-[8%] flex items-center gap-3 p-3 shadow-lg z-20 bg-white rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-bold">250+</div>
              <div className="text-xs text-slate-500">Tutors</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Hero;
