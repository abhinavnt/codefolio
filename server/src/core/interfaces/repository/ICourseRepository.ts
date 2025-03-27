import { ICourse } from "../../../models/Course";
import { ITask } from "../../../models/Tasks";


export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse>;
  createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]>;
}