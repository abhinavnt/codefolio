import { inject, injectable } from "inversify";
import { IMentorService } from "../../core/interfaces/service/IMentorService";
import { IMentor } from "../../models/Mentor";
import { TYPES } from "../../di/types";
import { IMentorRepository } from "../../core/interfaces/repository/IMentorRepository";







@injectable()
export class MentorService implements IMentorService{

 constructor(@inject(TYPES.MentorRepository) private mentorRepository:IMentorRepository){}

    getAllMentors(page: number, limit: number, search?: string, filters?: { rating?: number; technicalSkills?: string[]; priceRange?: [number, number]; }): Promise<{ mentors: IMentor[]; total: number; }> {
        return this.mentorRepository.getAllMentors(page,limit,search,filters)
    }

    async getMentorProfile(username: string): Promise<Partial<IMentor> | null> {
        try {
            const mentor=await this.mentorRepository.findByUsername(username)
            return mentor
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }



}



