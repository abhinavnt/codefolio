import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface Instructor {
    id?: number;
    name: string;
    role: string;
    bio: string;
    experince: number;
    courses: number;
    profileImage?: string;
}

const dummyData: Instructor[] = [
    {
        id: 1,
        name: "Thomas Nolan",
        role: "UI/UX Designer",
        bio: "10+ years of experience in UI/UX design. Worked with Fortune 500 brands.",
        experince: 1,
        courses: 12,
        profileImage: "https://img.freepik.com/free-photo/side-view-attractive-hispanic-software-developer-programming-using-computer-while-working-from-home_662251-958.jpg?uid=R192112823&ga=GA1.1.408912713.1742273440&semt=ais_hybrid",
    },
    {
        id: 2,
        name: "Courtney Henry",
        role: "Product Designer",
        bio: "Passionate about creating intuitive and beautiful product experiences.",
        experince: 2,
        courses: 8,
        profileImage: "https://img.freepik.com/free-photo/side-view-attractive-hispanic-software-developer-programming-using-computer-while-working-from-home_662251-958.jpg?uid=R192112823&ga=GA1.1.408912713.1742273440&semt=ais_hybrid",
    },
    {
        id: 3,
        name: "Albert Simon",
        role: "Frontend Developer",
        bio: "Specializes in React and modern JavaScript frameworks.",
        experince: 3,
        courses: 15,
        profileImage: "https://img.freepik.com/free-photo/side-view-attractive-hispanic-software-developer-programming-using-computer-while-working-from-home_662251-958.jpg?uid=R192112823&ga=GA1.1.408912713.1742273440&semt=ais_hybrid",
    },
    {
        id: 4,
        name: "Marvin McKinney",
        role: "3D Artist & Animator",
        bio: "Award-winning 3D artist with experience in film and game development.",
        experince: 1,
        courses: 10,
        profileImage: "https://img.freepik.com/free-photo/side-view-attractive-hispanic-software-developer-programming-using-computer-while-working-from-home_662251-958.jpg?uid=R192112823&ga=GA1.1.408912713.1742273440&semt=ais_hybrid",
    },
];

const MentorsSection = () => {
    const [mentors, setMentors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setMentors(dummyData);
            setLoading(false);
        }, 2000); // Simulated network delay
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
                        : mentors.map((instructor, index) => (
                            <Card
                                key={index}
                                className="border-0 shadow-md p-3 h-[280px] flex flex-col justify-between"
                            >
                                <CardHeader className="text-center pb-1">
                                    <div className="mx-auto mb-2">
                                        <img
                                            src={instructor.profileImage}
                                            alt={instructor.name}
                                            className="rounded-full w-20 h-20 mx-auto"
                                        />
                                    </div>
                                    <CardTitle className="text-base">{instructor.name}</CardTitle>
                                    <CardDescription className="text-[#20B486] font-medium">
                                        {instructor.role}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="text-center">
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                        {instructor.bio}
                                    </p>

                                    <div className="flex justify-center items-center gap-6">
                                        <div className="text-center">
                                            <p className="font-bold">{instructor.experince.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Experience</p>
                                        </div>
                                        <Button
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
                    <Button className=" py-1 text-sm" variant="outline">Explore All Menotrs</Button>
                </div>
            </div>
        </section>
    );
};

export default MentorsSection;
