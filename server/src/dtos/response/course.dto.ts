import { ICourse } from "../../models/Course";


export class CourseDTO {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  price: string;
  rating: number;
  enrolledStudents: string[];
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  learningPoints: string[];
  targetedAudience: string[];
  courseRequirements: string[];
  createdAt: string;
  updatedAt: string;

  constructor(course: ICourse) {
    this._id = course._id as string
    this.title = course.title;
    this.description = course.description;
    this.category = course.category;
    this.level = course.level;
    this.duration = course.duration;
    this.image = course.image;
    this.price = course.price;
    this.rating = course.rating;
    this.enrolledStudents = course.enrolledStudents.map(id => id.toString());
    this.status = course.status;
    this.tags = course.tags;
    this.learningPoints = course.learningPoints;
    this.targetedAudience = course.targetedAudience;
    this.courseRequirements = course.courseRequirements;
    this.createdAt = course.createdAt.toISOString();
    this.updatedAt = course.updatedAt.toISOString();
  }

  static fromCourses(courses: ICourse[]): CourseDTO[] {
    return courses.map(course => new CourseDTO(course));
  }
}

export interface CoursesResponseDTO {
  courses: CourseDTO[];
  total: number;
  page: number;
  limit: number;
}