import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Course } from "@/types/course"
import axios from "axios"
import axiosInstance from "@/utils/axiosInstance"

interface CourseState {
  courses: Course[]
  filteredCourses: Course[]
  loading: boolean
  error: string | null
  total: number
  page: number
  limit: number
}

const initialState: CourseState = {
  courses: [],
  filteredCourses: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 9,
}

// Fetch courses from backend API with filters
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (
    filters: {
      q?: string
      category?: string[]
      tags?: string[]
      ratingMin?: number
      level?: string[]
      priceMin?: number
      priceMax?: number
      duration?: string[]
      selectedPriceOptions?: string[]
      page?: number
      limit?: number
    } = {},
    { rejectWithValue },
  ) => {
    try {
      // Build query parameters
      const params = new URLSearchParams()

      if (filters.q) params.append("q", filters.q)
      if (filters.category && filters.category.length > 0) params.append("category", filters.category.join(","))
      if (filters.tags && filters.tags.length > 0) params.append("tags", filters.tags.join(","))
      if (filters.ratingMin) params.append("ratingMin", filters.ratingMin.toString())
      if (filters.level && filters.level.length > 0) params.append("level", filters.level.join(","))
      if (filters.priceMin !== undefined) params.append("priceMin", filters.priceMin.toString())
      if (filters.priceMax !== undefined) params.append("priceMax", filters.priceMax.toString())
      if (filters.duration && filters.duration.length > 0) params.append("duration", filters.duration.join(","))
      if (filters.selectedPriceOptions && filters.selectedPriceOptions.length > 0)
        params.append("selectedPriceOptions", filters.selectedPriceOptions.join(","))

      // Pagination
      params.append("page", (filters.page || 1).toString())
      params.append("limit", (filters.limit || 9).toString())

      const response = await axiosInstance.get("/api/user/getAllCourses", {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      })
// console.log("response from slice front end courser",response);

      return {
        courses: response.data.courses,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message)
      }
      return rejectWithValue("An error occurred while fetching courses")
    }
  },
)

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    searchCourses: (state, action: PayloadAction<string>) => {
      // We'll handle search through the API now
      state.courses = state.filteredCourses
    },
    filterCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
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
        state.courses = action.payload.courses
        state.filteredCourses = action.payload.courses
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch courses"
      })
  },
})

export const { searchCourses, filterCourses, setPage, setLimit } = courseSlice.actions
export default courseSlice.reducer
