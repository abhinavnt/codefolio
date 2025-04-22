export interface Course {
  _id:string;
  courseId:string
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  price: string;
  rating: number; 
  enrolledStudents: string[] 
  status: "draft" | "published" | "archived"; 
  tags: string[]; 
  learningPoints:string[];
  targetedAudience:string[];
  courseRequirements:string[];
  createdAt: Date;
  updatedAt: Date;
  }
  