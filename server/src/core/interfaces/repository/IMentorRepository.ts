import { IMentor, ISpecificDateAvailability, IWeeklyAvailability } from "../../../models/Mentor";







export interface IMentorRepository{
    findByUserId(userId:string):Promise<IMentor|null>
    getAllMentors(page:number,limit:number,search?:string,filters?:{rating?:number;technicalSkills?:string[]; priceRange?: [number, number]}):Promise<{mentors:IMentor[];total:number }>
    findByUsername(username: string): Promise<IMentor | null>
    update(userId: string, mentorData: Partial<IMentor>):Promise<IMentor|null>
    updateAvailability(mentorId: string,specificDateAvailability: ISpecificDateAvailability[],weeklyAvailability: IWeeklyAvailability[]):Promise<IMentor | null>
    getAvailability(mentorId: string): Promise<IMentor | null>
    findById(mentorId:string):Promise<IMentor|null>
}










