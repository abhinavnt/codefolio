import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner"





export const findMentorByUsername=async(username:string)=>{
    try {
        console.log('iam from fetchmentor service');
        
        const response= await axiosInstance.get(`/api/mentor/${username}`)
        return response
    } catch (error) {
        toast.error("something went wrong while fetching on mentor")
    }
}