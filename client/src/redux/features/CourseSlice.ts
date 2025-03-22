import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Course } from "@/types/course"
import { dummyCourses } from "@/data/dummy-data"

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
export const fetchCourses = createAsyncThunk("courses/fetchCourses", async () => {
  // Simulate network request
  return new Promise<Course[]>((resolve) => {
    setTimeout(() => {
      resolve(dummyCourses)
    }, 500)
  })
})

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

