import { ICourse } from "../../../models/Course";

export interface ICourseService {
  addCourse(courseData: any): Promise<ICourse>;
  getCourseById(courseId:string):Promise<ICourse|null>
}