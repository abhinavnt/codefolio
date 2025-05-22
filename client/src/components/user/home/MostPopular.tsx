import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";


interface Course {
    id: string;
    title: string;
    description: string;
    image: string;
    price: string;
    rating: number;
    badge?: string;
}

const MostPopular = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get("/api/course/top-courses");
                

                const data = response.data;
                // Add a fallback badge based on index
                const coursesWithBadge = data.map((course: any, index: number) => ({
                    ...course,
                    id: course._id,
                    badge: index === 0 ? "BESTSELLER" : index === 1 ? "POPULAR" : "NEW",
                }));
                setCourses(coursesWithBadge);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <section className="py-12 bg-background px-16">
            <div className="container">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Our Most Popular Courses</h2>
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
                            <Card key={course.id} className="overflow-hidden bg-background hover:bg-secondary shadow-md rounded-lg">
                                <div className="relative">
                                    <img
                                        src={course.image}
                                        alt="Course thumbnail"
                                        className="w-full object-cover h-36"
                                    />
                                    {course.badge && (
                                        <Badge className="absolute top-2 right-2 text-xs px-2 py-1 bg-[#20B486]">
                                            {course.badge}
                                        </Badge>
                                    )}
                                </div>
                                <CardHeader className="pb-2 px-4 pt-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base">{course.title}</CardTitle>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
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
                    <Button onClick={() => navigate('/courses')} className="py-1 text-sm hover:cursor-pointer" variant="outline">Explore All Programs</Button>
                </div>
            </div>
        </section>
    );
};

export default MostPopular;