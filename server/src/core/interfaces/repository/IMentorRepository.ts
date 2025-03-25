import { IMentor } from "../../../models/Mentor";







export interface IMentorRepository{
    findByUserId(userId:string):Promise<IMentor|null>
}










