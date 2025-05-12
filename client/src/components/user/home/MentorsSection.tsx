import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";


interface Instructor {
    id: string;
    name: string;
    username:string
    currentRole: string;
    bio: string;
    yearsOfExperience: number;
    profileImage?: string;
}

const MentorsSection = () => {
    const [mentors, setMentors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axiosInstance.get("/api/mentor/top-mentors");
                const data = response.data;
                const mentorsWithId = data.map((mentor: any) => ({
                    ...mentor,
                    id: mentor._id,
                }));
                setMentors(mentorsWithId);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching mentors:", error);
                setLoading(false);
            }
        };

        fetchMentors();
    }, []);

    return (
        <section className="py-10 px-13">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-10">Meet the Heroes</h2>
                <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto mb-10">
                    Our dedicated instructors are over 250+ world-class instructors of students. They're industry professionals and experts.
                </p>
                <div className="grid md:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-48 w-full rounded-lg" />
                        ))
                        : mentors.map((instructor) => (
                            <Card
                                key={instructor.id}
                                className="border-1 bg-background hover:bg-secondary shadow-md p-3 h-[280px] flex flex-col justify-between"
                            >
                                <CardHeader className="text-center pb-1">
                                    <div className="mx-auto mb-2">
                                        <img
                                            src={instructor.profileImage || "https://via.placeholder.com/80"} // Fallback image
                                            alt={instructor.name}
                                            className="rounded-full w-20 h-20 mx-auto"
                                        />
                                    </div>
                                    <CardTitle className="text-base">{instructor.name}</CardTitle>
                                    <CardDescription className="text-[#20B486] font-medium">
                                        {instructor.currentRole}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="text-center">
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                        {instructor.bio}
                                    </p>

                                    <div className="flex justify-center items-center gap-6">
                                        <div className="text-center">
                                            <p className="font-bold">{instructor.yearsOfExperience.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Experience</p>
                                        </div>
                                        <Button onClick={()=>navigate(`/mentor/${instructor.username}`)}
                                            variant="outline"
                                            className="h-8 text-sm hover:bg-[#20B486] hover:text-white"
                                        >
                                            Show Profile
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Button onClick={() => navigate('/mentors')} className="py-1 text-sm" variant="outline">Explore All Mentors</Button>
                </div>
            </div>
        </section>
    );
};

export default MentorsSection;