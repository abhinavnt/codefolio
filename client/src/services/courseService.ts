import axiosInstance from "@/utils/axiosInstance"






export const findCourseById=async(courseId:string)=>{
    try {
   
        const response = axiosInstance.get(`/api/user/course/${courseId}`)

        return response

    } catch (error) {
        console.log(error);
    }
}