import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";






export interface IAvailableTimeSlot {
    date: Date;
    day: string;
    availableTimes: string[];
  }
  

interface IMentor{
    userId: string;
    profileImage?: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    yearsOfExperience: number;
    currentCompany: string;
    currentRole: string;
    durationAtCompany: string;
    resume: string;
    technicalSkills: string[];
    primaryLanguage: string;
    bio: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    status: "active" | "inactive";
    // submittedAt: Date;
    // updatedAt?: Date;
    availableTimeSlots?: IAvailableTimeSlot[];
    title?: string;
    reviewTakenCount?: number;
    phone?: string;
    location?: string;
}

export interface MentorState {
    mentor: IMentor | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }


  export const verifyMentor = createAsyncThunk(
    'mentor/verify',
    async (_, { rejectWithValue }) => {
      try {
        console.log('mentor verification slice from redux');
        
        const response = await axiosInstance.post(`api/mentor/verify`, {}, {withCredentials: true,});
        return response.data.data; // Assuming this returns the mentor object
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to verify mentor'
        );
      }
    }
  );

  export const updateMentorProfile = createAsyncThunk(
    "mentor/updateProfile",
    async (mentorData: FormData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(`api/mentor/profile`, mentorData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        })
        return response.data.data
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update mentor profile")
      }
    },
  )




  const initialState: MentorState = {
    mentor: null,
    status: 'idle',
    error: null,
  };
  
  const mentorSlice = createSlice({
    name: 'mentor',
    initialState,
    reducers: {
      clearMentor: (state) => {
        state.mentor = null;
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(verifyMentor.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(verifyMentor.fulfilled, (state, action: PayloadAction<IMentor>) => {
          state.status = 'succeeded';
          state.mentor = action.payload;
        })
        .addCase(verifyMentor.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
        });
    },
  });
  
  export const { clearMentor } = mentorSlice.actions;
  export default mentorSlice.reducer;