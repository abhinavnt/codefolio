import { updateUser } from "@/redux/features/auth/AuthSlice";
import { AppDispatch } from "@/redux/store";

import axiosInstance from "@/utils/axiosInstance";



export const getUserProfile=async ()=>{
    try {
        const response=await axiosInstance.get('/api/auth/user',{withCredentials:true})
        return response
    } catch (error:any) {
        console.log(error)
        return error.response
    }
}


export const updateProfile = async (formData: FormData, dispatch: AppDispatch) => {
    try {
        console.log('profile update service', formData);

        const response = await axiosInstance.put('/api/user/profile', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('response from update user', response);

        dispatch(updateUser({ user: response.data.user }));
        
    } catch (error) {
        console.log(error);
    }
};



export const mentorReq=async(formData:FormData)=>{
try {
     console.log('going the request to backend');
     
    const response = await axiosInstance.post('/api/user/mentor-request', formData, {
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


export const getNotifications=async()=>{
    try {
        const response=await axiosInstance.get('/api/user/notifications')
        
        if(response.status===200){
            return response
        }else{
            console.log('some error when fetching notifications');
            
        }

    } catch (error) {
        console.log(error);
        
    }
}