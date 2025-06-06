"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  applyFilters,
  setCategory,
  setTool,
  setRating,
  setCourseLevel,
  setPriceRange,
  setPriceOption,
  setDuration,
  resetFilters,
} from "@/redux/features/FilterSlice"
import type { RootState, AppDispatch } from "@/redux/store"

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b py-4">
      <button
        className="flex items-center justify-between w-full font-semibold text-sm uppercase"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

// Debounce helper function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default function FilterSidebar() {
  const dispatch = useDispatch<AppDispatch>()
  const filters = useSelector((state: RootState) => state.filters)
  const [localPriceRange, setLocalPriceRange] = useState([filters.priceRange.min, filters.priceRange.max])

  // Debounce price range changes
  const debouncedPriceRange = useDebounce(localPriceRange, 500)

  //  debounced version of applyFilters
  const debouncedApplyFilters = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
          dispatch(applyFilters())
          timeoutId = null
        }, 500)
      }
    })(),
    [dispatch],
  )

  // Apply filters when debounced price range changes
  useEffect(() => {
    dispatch(setPriceRange(debouncedPriceRange))
    dispatch(applyFilters())
  }, [debouncedPriceRange, dispatch])

  const handleCategoryChange = (category: string, checked: boolean) => {
    dispatch(setCategory({ category, checked }))
    debouncedApplyFilters()
  }

  // const handleToolChange = (tool: string, checked: boolean) => {
  //   dispatch(setTool({ tool, checked }))
  //   debouncedApplyFilters()
  // }

  // const handleRatingChange = (rating: number, checked: boolean) => {
  //   dispatch(setRating({ rating, checked }))
  //   debouncedApplyFilters()
  // }

  const handleLevelChange = (level: string, checked: boolean) => {
    dispatch(setCourseLevel({ level, checked }))
    debouncedApplyFilters()
  }

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange(value)
  }

  const handlePriceOptionChange = (option: string, checked: boolean) => {
    dispatch(setPriceOption({ option, checked }))
    debouncedApplyFilters()
  }

  // const handleDurationChange = (duration: string, checked: boolean) => {
  //   dispatch(setDuration({ duration, checked }))
  //   debouncedApplyFilters()
  // }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    setLocalPriceRange([0, 100000])
    dispatch(applyFilters())
  }

  return (
    <div className="bg-background rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Reset All
        </Button>
      </div>

      <FilterSection title="Category" defaultOpen={true}>
        {filters.availableCategories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={filters.selectedCategories.includes(category.id)}
              onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
            />
            <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer flex-1">
              {category.name}
              <span className="text-muted-foreground ml-1"></span>
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* <FilterSection title="Tools">
        {filters.availableTools.map((tool) => (
          <div key={tool.id} className="flex items-center space-x-2">
            <Checkbox
              id={`tool-${tool.id}`}
              checked={filters.selectedTools.includes(tool.id)}
              onCheckedChange={(checked) => handleToolChange(tool.id, checked as boolean)}
            />
            <Label htmlFor={`tool-${tool.id}`} className="text-sm font-normal cursor-pointer flex-1">
              {tool.name}
              <span className="text-muted-foreground ml-1">({tool.count})</span>
            </Label>
          </div>
        ))}
      </FilterSection> */}

      {/* <FilterSection title="Rating">
        {[4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <Checkbox
              id={`rating-${rating}`}
              checked={filters.selectedRatings.includes(rating)}
              onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
            />
            <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer flex-1 flex items-center">
              <div className="flex">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-muted-foreground" />
                ))}
              </div>
              <span className="text-muted-foreground ml-1">& Up ({filters.ratingCounts[rating]})</span>
            </Label>
          </div>
        ))}
      </FilterSection> */}

      <FilterSection title="Course Level">
        {filters.availableLevels.map((level) => (
          <div key={level.id} className="flex items-center space-x-2">
            <Checkbox
              id={`level-${level.id}`}
              checked={filters.selectedLevels.includes(level.id)}
              onCheckedChange={(checked) => handleLevelChange(level.id, checked as boolean)}
            />
            <Label htmlFor={`level-${level.id}`} className="text-sm font-normal cursor-pointer flex-1">
              {level.name}
              {/* <span className="text-muted-foreground ml-1">({level.count})</span> */}
            </Label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Price">
        <div className="px-2 pt-6 pb-2">
          <Slider
            defaultValue={[0, 100000]}
            max={100000}
            step={1}
            value={localPriceRange}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm">
            <div>₹{localPriceRange[0]}</div>
            <div>₹{localPriceRange[1]}</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="price-free"
                checked={filters.selectedPriceOptions.includes("free")}
                onCheckedChange={(checked) => handlePriceOptionChange("free", checked as boolean)}
              />
              <Label htmlFor="price-free" className="text-sm font-normal cursor-pointer">
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="price-paid"
                checked={filters.selectedPriceOptions.includes("paid")}
                onCheckedChange={(checked) => handlePriceOptionChange("paid", checked as boolean)}
              />
              <Label htmlFor="price-paid" className="text-sm font-normal cursor-pointer">
                Paid
              </Label>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* <FilterSection title="Duration">
        {filters.availableDurations.map((duration) => (
          <div key={duration.id} className="flex items-center space-x-2">
            <Checkbox
              id={`duration-${duration.id}`}
              checked={filters.selectedDurations.includes(duration.id)}
              onCheckedChange={(checked) => handleDurationChange(duration.id, checked as boolean)}
            />
            <Label htmlFor={`duration-${duration.id}`} className="text-sm font-normal cursor-pointer flex-1">
              {duration.name}
              <span className="text-muted-foreground ml-1">({duration.count})</span>
            </Label>
          </div>
        ))}
      </FilterSection> */}
    </div>
  )
}
