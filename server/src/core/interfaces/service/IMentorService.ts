import { IMentor } from "../../../models/Mentor";








export interface IMentorService{
    getAllMentors( page: number, limit: number,search?: string,filters?: {rating?: number; technicalSkills?: string[]; priceRange?: [number, number];}):Promise<{mentors:IMentor[],total:number}>
    getMentorProfile(username: string): Promise<Partial<IMentor> | null>
}