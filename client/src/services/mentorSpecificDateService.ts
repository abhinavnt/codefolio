import axiosInstance from "@/utils/axiosInstance";

export const fetchMentorSpecificDateAvailability = async (mentorId: string) => {
  try {
    const response = await axiosInstance.get('/api/mentor-availability/', { params: { mentorId } });
    return response.data;
  } catch (error) {
    console.error("Error fetching specific date availability:", error);
    throw error;
  }
};

export const addMentorSpecificDateAvailability = async (
  mentorId: string,
  specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }[]
) => {
  try {
    const response = await axiosInstance.post('/api/mentor-availability/', { mentorId, specificDateAvailability });
    return response.data;
  } catch (error) {
    console.error("Error adding specific date availability:", error);
    throw error;
  }
};


export const editMentorSpecificDateAvailability = async (
    id: string,
    specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
  ) => {
    try {
      const response = await axiosInstance.put(`/api/mentor-availability/${id}`, { specificDateAvailability });
      return response.data;
    } catch (error) {
      console.error("Error editing specific date availability:", error);
      throw error;
    }
  };