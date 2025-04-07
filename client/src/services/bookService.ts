import axiosInstance from "@/utils/axiosInstance"










export const fetchAvailbilitySlots=async(mentorusername:string,from:string,to:string)=>{
    try {
        const response=await axiosInstance.get(`/api/booking/${mentorusername}/availability?from=${from}&to=${to}`)
        return response
    } catch (error) {
        console.log(error);
        
    }
}