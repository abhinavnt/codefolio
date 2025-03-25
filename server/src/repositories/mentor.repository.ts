import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { IMentor, Mentor } from "../models/Mentor";







export class mentorRepository implements IMentorRepository{

    async findByUserId(userId: string): Promise<IMentor | null> {
        return await Mentor.findOne({userId})
    }
}








