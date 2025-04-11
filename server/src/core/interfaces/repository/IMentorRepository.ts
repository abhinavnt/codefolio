import { IMentor, ISpecificDateAvailability, IWeeklyAvailability } from "../../../models/Mentor";
import { IMentorRequest } from "../../../models/MentorRequest";







export interface IMentorRepository{
    findByUserId(userId:string):Promise<IMentor|null>
    getAllMentors(page:number,limit:number,search?:string,filters?:{rating?:number;technicalSkills?:string[]; priceRange?: [number, number]}):Promise<{mentors:IMentor[];total:number }>
    findByUsername(username: string): Promise<IMentor | null>
    updateMentor(userId: string, mentorData: Partial<IMentor>):Promise<IMentor|null>
    updateAvailability(mentorId: string,specificDateAvailability: ISpecificDateAvailability[],weeklyAvailability: IWeeklyAvailability[]):Promise<IMentor | null>
    getAvailability(mentorId: string): Promise<IMentor | null>
    findByMentorID(mentorId:string):Promise<IMentor|null>
    getAvailableSlots(mentorId: string,from: Date,to: Date): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string }[] }[]>
    createMentorFromRequest(mentorRequest: IMentorRequest): Promise<IMentor | null> 
    updateMentorStatus(userId:string,status:"active"|"inactive"):Promise<IMentor|null>
    getAllMentorsAdmin(page:number,limit:number):Promise<{allMentors:IMentor[],total:number}>
}










