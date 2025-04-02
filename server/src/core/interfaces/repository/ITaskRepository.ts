import { ITask } from "../../../models/Tasks";





export interface ITaskRepository{
    getCourseTasks(courseId:string):Promise<ITask[]|null>
}