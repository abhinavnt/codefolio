import { IMentor } from "../../../models/Mentor";







export interface IMentorRepository{
    findByUserId(userId:string):Promise<IMentor|null>
    getAllMentors(page:number,limit:number,search?:string,filters?:{rating?:number;technicalSkills?:string[]; priceRange?: [number, number]}):Promise<{mentors:IMentor[];total:number }>
    findByUsername(username: string): Promise<IMentor | null>
}










