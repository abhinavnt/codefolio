import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface Course {
    id: number;
    title: string;
    description: string;
    instructor: string;
    role: string;
    price: string;
    badge: string;
    rating: number;
    thumbNail: string;
}

const dummyData = [
    {
        id: 1,
        title: "Figma UI UX Design...",
        description: "Learn how to use Figma to design beautiful user interfaces",
        instructor: "Jeff Davis",
        role: "UI Designer",
        price: "12.84",
        badge: "BESTSELLER",
        rating: 5,
        thumbNail: 'https://img.freepik.com/free-vector/realistic-podium-horizontal-banner_52683-145739.jpg'
    },
    {
        id: 2,
        title: "Learn With Blender",
        description: "Master 3D modeling and animation with Blender",
        instructor: "Jane Wilson",
        role: "3D Artist",
        price: "8.99",
        badge: "POPULAR",
        rating: 4,
        thumbNail: 'https://img.freepik.com/free-vector/realistic-podium-horizontal-banner_52683-145739.jpg'
    },
    {
        id: 3,
        title: "Building User Interface...",
        description: "Create responsive and accessible user interfaces",
        instructor: "David Howard",
        role: "Frontend Dev",
        price: "11.70",
        badge: "NEW",
        rating: 5,
        thumbNail: 'https://img.freepik.com/free-vector/realistic-podium-horizontal-banner_52683-145739.jpg'
    },
];

const MostPopular = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setCourses(dummyData);
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <section className="py-12 bg-white px-16">
            <div className="container">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Our Most Popular Class</h2>
                    <p className="text-muted-foreground text-sm">
                        We pick the most popular courses that will definitely be useful for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
                        ))
                        : courses.map((course) => (
                            <Card key={course.id} className="overflow-hidden shadow-md rounded-lg">
                                <div className="relative">
                                    <img
                                        src={course.thumbNail}
                                        alt="Course thumbnail"
                                        className="w-full object-cover h-36"
                                    />
                                    <Badge className="absolute top-2 right-2 text-xs px-2 py-1 bg-[#20B486]">
                                        {course.badge}
                                    </Badge>
                                </div>
                                <CardHeader className="pb-2 px-4 pt-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base">{course.title}</CardTitle>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardDescription className="text-sm line-clamp-2">{course.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pb-2 px-4">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`h-3 w-3 ${index < course.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"}`}
                                            />
                                        ))}
                                        <span className="text-xs text-muted-foreground ml-1">{course.rating}.0</span>
                                    </div>
                                    <p className="font-bold text-[#20B486] text-sm">{course.price}</p>
                                </CardContent>

                            </Card>
                        ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Button className=" py-1 text-sm" variant="outline">Explore All Programs</Button>
                </div>

            </div>
        </section>
    );
};

export default MostPopular;
