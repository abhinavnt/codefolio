import { ICourse } from "../../../models/Course";

export interface ICourseService {
  addCourse(courseData: any): Promise<ICourse>;
}