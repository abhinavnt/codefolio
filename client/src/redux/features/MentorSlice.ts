import { IMentor } from "@/types/mentor";
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";
import { act } from "react";
import { number } from "zod";






interface MentorState{
    mentors:IMentor[];
    loading:boolean;
    error: string | null;
    pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}




const initialState: MentorState = {
    mentors: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 8,
      total: 0,
      totalPages: 0,
    },
  };



  export const fetchMentors = createAsyncThunk(
    'mentors/fetchMentors',
    async ({page = 1,search, filters,}: {page?: number;search?: string;filters?: { rating?: number; technicalSkills?: string[]; priceRange?: [number, number] };}) => {
      const params = new URLSearchParams({ page: page.toString(),limit: '8',});
      if (search) params.append('search', search);
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.technicalSkills) params.append('technicalSkills', filters.technicalSkills.join(','));
      if (filters?.priceRange) params.append('priceRange', filters.priceRange.join(','));
  
      const response = await axiosInstance.get(`/api/user/getAllMentors?${params.toString()}`);
      return response.data;
    }
  );


  const mentorSlice=createSlice({
   name:'mentors',
   initialState,
   reducers:{},
   extraReducers:(builder)=>{
    builder.addCase(fetchMentors.pending,(state)=>{
        state.loading=true
        state.error=null
    })
    .addCase(fetchMentors.fulfilled,(state,action)=>{
        state.loading=false
        state.mentors=action.payload.data
        state.pagination=action.payload.pagination
    })
    .addCase(fetchMentors.rejected,(state,action)=>{
        state.loading=false
        state.error=action.error.message || 'Failed to fetch mentors';
    })
   }
  })


  export default mentorSlice.reducer;