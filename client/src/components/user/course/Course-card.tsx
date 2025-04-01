import { Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {

  const navigate = useNavigate(); // Hook for navigation

  const handleViewDetails = () => {
    navigate(`/courses/${course._id}`); // Navigate to details page with course ID
  };
  return (
    <div className="group border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 left-2 bg-emerald-500 text-white">
          {course.category}
        </Badge>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-lg line-clamp-2 mb-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({course.enrolledStudents.length})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            {/* <span className="text-xs text-muted-foreground">
              {course.description}
            </span> */}
          </div>
        </div>

        <div className="mt-3 font-bold text-primary">${course.price}</div>
        <Button className="mt-4 w-full hover:bg-emerald-500" variant="outline" onClick={handleViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
}
