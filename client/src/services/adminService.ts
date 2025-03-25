import axiosInstance from "@/utils/axiosInstance"





//all mentorApplication
export const getMentorApplicationRequest = async (page:number,limit:number)=>{
    try {
        const response= await axiosInstance.get(`/api/admin/mentor-application?page=${page}&limit=${limit}`)
        
        return response.data
    } catch (error) {
        console.error("Error fetching mentor applications:", error);
      throw error;
    }
}


//update application status
export const updateMentorApplicationStatus= async (requestId:string,status:string)=>{
    try {
        const response= await axiosInstance.patch(`/api/admin/mentor-applications/${requestId}/status`,{status})
        return response.data
    } catch (error) {
        console.error("Error updating mentor application status:", error);
      throw error;
    }
}