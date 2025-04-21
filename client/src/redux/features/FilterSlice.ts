import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "../store"
import { fetchCourses } from "./CourseSlice"
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

  searchQuery: string
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

  searchQuery: "",
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

    setPriceOption: (state, action: PayloadAction<{ option: string; checked: boolean }>) => {
      const { option, checked } = action.payload
      if (checked) {
        state.selectedPriceOptions.push(option)
      } else {
        state.selectedPriceOptions = state.selectedPriceOptions.filter((o) => o !== option)
      }
    },

    setDuration: (state, action: PayloadAction<{ duration: string; checked: boolean }>) => {
      const { duration, checked } = action.payload
      if (checked) {
        state.selectedDurations.push(duration)
      } else {
        state.selectedDurations = state.selectedDurations.filter((d) => d !== duration)
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    resetFilters: (state) => {
      state.selectedCategories = []
      state.selectedTools = []
      state.selectedRatings = []
      state.selectedLevels = []
      state.priceRange = { min: 0, max: 100 }
      state.selectedPriceOptions = []
      state.selectedDurations = []
      state.searchQuery = ""
    },
  },
})

// Thunk to apply all filters
export const applyFilters = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState()
  const { page, limit } = state.courses
  const filters = state.filters

  // P filter object for API
  const apiFilters = {
    q: filters.searchQuery,
    category: filters.selectedCategories.length > 0 ? filters.selectedCategories : undefined,
    tags: filters.selectedTools.length > 0 ? filters.selectedTools : undefined,
    ratingMin: filters.selectedRatings.length > 0 ? Math.min(...filters.selectedRatings) : undefined,
    level: filters.selectedLevels.length > 0 ? filters.selectedLevels : undefined,
    priceMin: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
    priceMax: filters.priceRange.max < 100 ? filters.priceRange.max : undefined,
    duration: filters.selectedDurations.length > 0 ? filters.selectedDurations : undefined,
    selectedPriceOptions: filters.selectedPriceOptions.length > 0 ? filters.selectedPriceOptions : undefined,
    page,
    limit,
  }

  // Dispatch the fetch with filters
  dispatch(fetchCourses(apiFilters))
}

export const {
  setCategory,
  setTool,
  setRating,
  setCourseLevel,
  setPriceRange,
  setPriceOption,
  setDuration,
  setSearchQuery,
  resetFilters,
} = filterSlice.actions

export default filterSlice.reducer
