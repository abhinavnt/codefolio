import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react";



interface Feature {
  id: number;
  title: string;
  description: string;
  iconColor: string;
  iconStroke: string;
}


const dummyData = [
  {
    id: 1,
    title: "Gamified Design",
    description: "Master the principles of gamification to create engaging experiences for users.",
    iconColor: "bg-green-100",
    iconStroke: "text-green-500",
  },
  {
    id: 2,
    title: "UI Design Game",
    description: "Master the principles of UI design through interactive game-based learning.",
    iconColor: "bg-blue-100",
    iconStroke: "text-blue-500",
  },
  {
    id: 3,
    title: "User Interface Design",
    description: "Learn interface design principles and create beautiful, functional interfaces.",
    iconColor: "bg-purple-100",
    iconStroke: "text-purple-500",
  },
];

const FeaturesSection = () => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFeatures(dummyData);
      setLoading(false);
    }, 2000); 
  }, []);

  return (
    <section className="py-16 px-10 top-0">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold mb-4">Fostering a playful & engaging learning environment</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? dummyData.map((_, index) => (
                <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
              ))
            : features.map((feature) => (
                <Card key={feature.id} className="border-green-100 bg-background hover:bg-secondary hover:border-[#20B486] transition-colors">
                  <CardHeader className="pb-2">
                    <div
                      className={`w-7 h-7 ${feature.iconColor} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`h-6 w-6 ${feature.iconStroke}`}
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                      </svg>
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="text-[#20B486] p-0">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
