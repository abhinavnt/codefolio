import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner";






export const StripePayment=async (courseId:string,amount:number,couponCode:string)=>{
  try {
    const response=await axiosInstance.post('/api/payment/create-checkout-session',{courseId,amount,couponCode},{withCredentials:true})
    return response
  } catch (error) {
    console.error('Error initiating Stripe payment:', error);
    
      
      toast.error("some thing went wrong",{ position: "top-right"})
  }
}   