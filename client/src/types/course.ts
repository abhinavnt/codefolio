export interface Course {
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
  createdAt: Date;
  updatedAt: Date;
  }
  