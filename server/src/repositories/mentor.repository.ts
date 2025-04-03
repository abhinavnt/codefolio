import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { IMentor, Mentor } from "../models/Mentor";







export class mentorRepository implements IMentorRepository{

    async findByUserId(userId: string): Promise<IMentor | null> {
        return await Mentor.findOne({userId})
    }

    async getAllMentors(page: number, limit: number, search?: string, filters?: { rating?: number; technicalSkills?: string[]; priceRange?: [number, number]; }): Promise<{ mentors: IMentor[]; total: number; }> {
        const query:any={status:'active'};

        if(search){
            query.name = { $regex: search, $options: 'i' };
        }

        if(filters){
            if (filters.rating) {
                query.reviewTakenCount = { $gte: filters.rating };
              }
              if (filters.technicalSkills && filters.technicalSkills.length > 0) {
                query.technicalSkills = { $in: filters.technicalSkills };
              }
              if (filters.priceRange) {
                // Assuming we add a price field to mentor schema later
                query.price = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] };
              }
        }

       const [mentors,total]=await Promise.all([Mentor.find(query).skip((page-1)*limit).limit(limit).lean(),Mentor.countDocuments(query)])

      return {mentors,total}

    }


    async findByUsername(username: string): Promise<IMentor | null> {
        return await Mentor.findOne({username}).lean()
    }



}








