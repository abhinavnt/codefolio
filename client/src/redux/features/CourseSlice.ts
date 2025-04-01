import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Course } from "@/types/course"
// import { dummyCourses } from "@/data/dummy-data"
import axios from "axios"
import axiosInstance from "@/utils/axiosInstance"

interface CourseState {
  courses: Course[]
  filteredCourses: Course[]
  loading: boolean
  error: string | null
}

const initialState: CourseState = {
  courses: [],
  filteredCourses: [],
  loading: false,
  error: null,
}

// Simulating API call with dummy data
// export const fetchCourses = createAsyncThunk("courses/fetchCourses", async () => {
//   // Simulate network request
//   return new Promise<Course[]>((resolve) => {
//     setTimeout(() => {
//       resolve(dummyCourses)
//     }, 500)
//   })
// })


// Fetch courses from backend API using Axios
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Course[]>('/api/user/getAllCourses', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data,'response foromthe slice');
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An error occurred while fetching courses');
    }
  }
);












const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    searchCourses: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase()
      if (!query) {
        state.courses = state.filteredCourses
        return
      }

      state.courses = state.filteredCourses.filter(
        (course) => course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query),
      )
    },
    filterCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
        state.filteredCourses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch courses"
      })
  },
})

export const { searchCourses, filterCourses } = courseSlice.actions
export default courseSlice.reducer

