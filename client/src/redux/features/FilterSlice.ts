import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "../store"
import { filterCourses } from "./CourseSlice"
import { dummyCategories, dummyTools, dummyLevels, dummyDurations } from "@/data/dummy-data"

interface FilterState {
  availableCategories: { id: string; name: string; count: number }[]
  selectedCategories: string[]

  availableTools: { id: string; name: string; count: number }[]
  selectedTools: string[]

  selectedRatings: number[]
  ratingCounts: Record<number, number>

  availableLevels: { id: string; name: string; count: number }[]
  selectedLevels: string[]

  priceRange: { min: number; max: number }
  selectedPriceOptions: string[]

  availableDurations: { id: string; name: string; count: number }[]
  selectedDurations: string[]
}

const initialState: FilterState = {
  availableCategories: dummyCategories,
  selectedCategories: [],

  availableTools: dummyTools,
  selectedTools: [],

  selectedRatings: [],
  ratingCounts: { 1: 120, 2: 340, 3: 580, 4: 890 },

  availableLevels: dummyLevels,
  selectedLevels: [],

  priceRange: { min: 0, max: 100 },
  selectedPriceOptions: [],

  availableDurations: dummyDurations,
  selectedDurations: [],
}

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<{ category: string; checked: boolean }>) => {
      const { category, checked } = action.payload
      if (checked) {
        state.selectedCategories.push(category)
      } else {
        state.selectedCategories = state.selectedCategories.filter((c) => c !== category)
      }
    },

    setTool: (state, action: PayloadAction<{ tool: string; checked: boolean }>) => {
      const { tool, checked } = action.payload
      if (checked) {
        state.selectedTools.push(tool)
      } else {
        state.selectedTools = state.selectedTools.filter((t) => t !== tool)
      }
    },

    setRating: (state, action: PayloadAction<{ rating: number; checked: boolean }>) => {
      const { rating, checked } = action.payload
      if (checked) {
        state.selectedRatings.push(rating)
      } else {
        state.selectedRatings = state.selectedRatings.filter((r) => r !== rating)
      }
    },

    setCourseLevel: (state, action: PayloadAction<{ level: string; checked: boolean }>) => {
      const { level, checked } = action.payload
      if (checked) {
        state.selectedLevels.push(level)
      } else {
        state.selectedLevels = state.selectedLevels.filter((l) => l !== level)
      }
    },

    setPriceRange: (state, action: PayloadAction<number[]>) => {
      const [min, max] = action.payload
      state.priceRange = { min, max }
    },

    setDuration: (state, action: PayloadAction<{ duration: string; checked: boolean }>) => {
      const { duration, checked } = action.payload
      if (checked) {
        state.selectedDurations.push(duration)
      } else {
        state.selectedDurations = state.selectedDurations.filter((d) => d !== duration)
      }
    },

    resetFilters: (state) => {
      state.selectedCategories = []
      state.selectedTools = []
      state.selectedRatings = []
      state.selectedLevels = []
      state.priceRange = { min: 0, max: 100 }
      state.selectedPriceOptions = []
      state.selectedDurations = []
    },
  },
})

// Thunk to apply all filters
export const applyFilters = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState()
  const { courses } = state.courses
  const filters = state.filters

  let filteredCourses = [...courses]

  // Apply category filters
  if (filters.selectedCategories.length > 0) {
    filteredCourses = filteredCourses.filter((course) => filters.selectedCategories.includes(course.categoryId))
  }

  // Apply tool filters
  if (filters.selectedTools.length > 0) {
    filteredCourses = filteredCourses.filter((course) =>
      course.tools.some((tool) => filters.selectedTools.includes(tool)),
    )
  }

  // Apply rating filters
  if (filters.selectedRatings.length > 0) {
    filteredCourses = filteredCourses.filter((course) =>
      filters.selectedRatings.some((rating) => course.rating >= rating),
    )
  }

  // Apply level filters
  if (filters.selectedLevels.length > 0) {
    filteredCourses = filteredCourses.filter((course) => filters.selectedLevels.includes(course.levelId))
  }

  // Apply price range filter
  filteredCourses = filteredCourses.filter(
    (course) => course.price >= filters.priceRange.min && course.price <= filters.priceRange.max,
  )

  // Apply price options (free/paid)
  if (filters.selectedPriceOptions.length > 0) {
    filteredCourses = filteredCourses.filter((course) => {
      if (filters.selectedPriceOptions.includes("free") && course.price === 0) return true
      if (filters.selectedPriceOptions.includes("paid") && course.price > 0) return true
      return false
    })
  }

  // Apply duration filters
  if (filters.selectedDurations.length > 0) {
    filteredCourses = filteredCourses.filter((course) => filters.selectedDurations.includes(course.durationId))
  }

  dispatch(filterCourses(filteredCourses))
}

export const { setCategory, setTool, setRating, setCourseLevel, setPriceRange, setDuration, resetFilters } =
  filterSlice.actions

export default filterSlice.reducer

