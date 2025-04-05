import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { IMentor, ISpecificDateAvailability, IWeeklyAvailability, Mentor } from "../models/Mentor";







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


    async update(userId: string, mentorData: Partial<IMentor>): Promise<IMentor | null> {

      // const {
      //   profileImage,
      //   name,
      //   username,
      //   email,
      //   phoneNumber,
      //   dateOfBirth,
      //   yearsOfExperience,
      //   currentCompany,
      //   currentRole,
      //   durationAtCompany,
      //   resume,
      //   technicalSkills,
      //   primaryLanguage,
      //   bio,
      //   linkedin,
      //   github,
      //   twitter,
      //   instagram,
      //   status,
      //   availableTimeSlots,
      //   title,
      //   reviewTakenCount,
      //   phone,
      //   location,
      // } = mentorData;
  
      // // Build the update object dynamically, only including fields that are provided (not undefined/null)
      // const updateData: Partial<IMentor> = {};
      // if (profileImage !== undefined) updateData.profileImage = profileImage;
      // if (name !== undefined) updateData.name = name;
      // if (username !== undefined) updateData.username = username;
      // if (email !== undefined) updateData.email = email;
      // if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      // if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
      // if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
      // if (currentCompany !== undefined) updateData.currentCompany = currentCompany;
      // if (currentRole !== undefined) updateData.currentRole = currentRole;
      // if (durationAtCompany !== undefined) updateData.durationAtCompany = durationAtCompany;
      // if (resume !== undefined) updateData.resume = resume;
      // if (technicalSkills !== undefined) updateData.technicalSkills = technicalSkills;
      // if (primaryLanguage !== undefined) updateData.primaryLanguage = primaryLanguage;
      // if (bio !== undefined) updateData.bio = bio;
      // if (linkedin !== undefined) updateData.linkedin = linkedin;
      // if (github !== undefined) updateData.github = github;
      // if (twitter !== undefined) updateData.twitter = twitter;
      // if (instagram !== undefined) updateData.instagram = instagram;
      // if (status !== undefined) updateData.status = status;
      // if (availableTimeSlots !== undefined) updateData.availableTimeSlots = availableTimeSlots;
      // if (title !== undefined) updateData.title = title;
      // if (reviewTakenCount !== undefined) updateData.reviewTakenCount = reviewTakenCount;
      // if (phone !== undefined) updateData.phone = phone;
      // if (location !== undefined) updateData.location = location;


       const mentor=await Mentor.findOne({userId:userId})
       
       if(!mentor) {
        throw new Error("mentornot found")
       }
      
        const updatedMentor = await Mentor.findByIdAndUpdate(mentor._id,{ $set: mentorData }, { new: true, runValidators: true }
    );
        console.log(updatedMentor,"updated mentor");
        
        if (!updatedMentor) throw new Error("Failed to update mentor")
          return updatedMentor
    }


    async updateAvailability(mentorId: string, specificDateAvailability: ISpecificDateAvailability[], weeklyAvailability: IWeeklyAvailability[]): Promise<IMentor | null> {
        
        const response= await Mentor.findByIdAndUpdate(mentorId,{specificDateAvailability,weeklyAvailability},{new:true})
        console.log(response);
        
        return response
    }



    async getAvailability(mentorId: string): Promise<IMentor | null> {
        return await Mentor.findById(mentorId).select("specificDateAvailability weeklyAvailability")
    }

}








