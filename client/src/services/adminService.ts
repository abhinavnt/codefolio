import axiosInstance from "@/utils/axiosInstance"
import { an } from "node_modules/framer-motion/dist/types.d-B50aGbjN";





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
export const updateMentorApplicationStatus= async (requestId:string,status:string,message?:string)=>{
    try {
        const response= await axiosInstance.patch(`/api/admin/mentor-applications/${requestId}/status`,{status,message})
        return response.data
    } catch (error) {
        console.error("Error updating mentor application status:", error);
      throw error;
    }
}

//add new course
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


//toggle user status
export const toggleUserStatus=async(userId:string)=>{
    try {
        const response=await axiosInstance.patch(`/api/admin/user/${userId}/status`,{},{withCredentials:true})
        return response
    } catch (error:any) {
        return error.response
    }
}


//get all mentors
export const getAllMentors=async (page:number,limit:number)=>{
    try {
        const response=await axiosInstance.get(`/api/admin/allMentors?page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        
    }
}

//toggle mentor status
export const toggleMentorStatus=async (userId:string,status:string)=>{
try {
    const response=await axiosInstance.patch(`/api/admin/mentor/${userId}/status?status=${status}`,{},{withCredentials:true})
    return response
} catch (error:any) {
    return error.response
}
}