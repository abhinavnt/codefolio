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


export const fetchMentorAvailbilty=async()=>{
    try {
        const response= await axiosInstance.get('/api/mentor/getAvailability')

        return response
    } catch (error) {
        console.log(error);
        
    }
}



export const addMentorAvailbilty=async(specificDateAvailability:any,weeklyAvailability:any)=>{
    try {
        const response=await axiosInstance.put('/api/mentor/availability',{specificDateAvailability,weeklyAvailability})
        return response
    } catch (error) {
        console.log(error);
        
    }
}