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


export const addNewCourse= async (formData:FormData)=>{
    try {
        console.log('going the request to backend');
        
       const response = await axiosInstance.post('/api/admin/addCourse', formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
       });
   
       console.log(response,'from the userService mentor request');
       return response
   
   } catch (error) {
       console.log(error);
       
   }
}


//get all users
export const getAllUsers = async (page:number,limit:number)=>{
    try {
        const response= await axiosInstance.get(`/api/admin/allUsers?page=${page}&limit=${limit}`)
        console.log(response.data,"user data from the getAllUsers");
        
        return response.data
    } catch (error) {
        console.error("Error fetching mentor applications:", error);
      throw error;
    }
}
