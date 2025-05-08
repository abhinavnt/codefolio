"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

interface FilterSidebarProps {
  onFilterChange: (filters: {
    rating?: number
    technicalSkills?: string[]
    priceRange?: [number, number]
    timeSlots?: string[]
  }) => void
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

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])

  const handleFilterUpdate = () => {
    onFilterChange({
      rating: selectedRating,
      technicalSkills: selectedSkills.length > 0 ? selectedSkills : undefined,
      priceRange: priceRange[0] !== 0 || priceRange[1] !== 500 ? priceRange : undefined,
      timeSlots: selectedTimeSlots.length > 0 ? selectedTimeSlots : undefined,
    })
  }

  return (
    <div className="bg-background rounded-lg border p-4">
      <FilterSection title="Tools" defaultOpen={true}>
        <div className="space-y-2">
          {expertise.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`expertise-${item.id}`}
                checked={selectedSkills.includes(item.name)}
                onCheckedChange={(checked) => {
                  setSelectedSkills(
                    checked ? [...selectedSkills, item.name] : selectedSkills.filter((skill) => skill !== item.name),
                  )
                  setTimeout(handleFilterUpdate, 0)
                }}
              />
              <Label htmlFor={`expertise-${item.id}`} className="text-sm font-normal cursor-pointer flex-1">
                {item.name} 
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* <FilterSection title="Rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRating === rating}
                onCheckedChange={(checked) => {
                  setSelectedRating(checked ? rating : undefined)
                  handleFilterUpdate()
                }}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm font-normal cursor-pointer flex-1 flex items-center"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground ml-1">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </FilterSection> */}

      {/* <FilterSection title="Available Time Slots">
        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <div key={slot.id} className="flex items-center space-x-2">
              <Checkbox
                id={`timeslot-${slot.id}`}
                checked={selectedTimeSlots.includes(slot.value)}
                onCheckedChange={(checked) => {
                  setSelectedTimeSlots(
                    checked
                      ? [...selectedTimeSlots, slot.value]
                      : selectedTimeSlots.filter((time) => time !== slot.value),
                  )
                  setTimeout(handleFilterUpdate, 0)
                }}
              />
              <Label htmlFor={`timeslot-${slot.id}`} className="text-sm font-normal cursor-pointer flex-1">
                {slot.label} <span className="text-muted-foreground ml-1">({slot.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </FilterSection> */}

      {/* <FilterSection title="Price">
        <div className="px-2 pt-6 pb-2">
          <Slider
            defaultValue={[500]}
            max={500}
            step={1}
            className="mb-6"
            onValueChange={(value) => {
              setPriceRange([0, value[0]])
              handleFilterUpdate()
            }}
          />
          <div className="flex justify-between text-sm">
            <div>$0</div>
            <div>${priceRange[1]}</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="price-free"
                checked={priceRange[1] === 0}
                onCheckedChange={(checked) => {
                  setPriceRange([0, checked ? 0 : 500])
                  handleFilterUpdate()
                }}
              />
              <Label htmlFor="price-free" className="text-sm font-normal cursor-pointer">
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="price-paid"
                checked={priceRange[1] > 0}
                onCheckedChange={(checked) => {
                  setPriceRange([0, checked ? 500 : 0])
                  handleFilterUpdate()
                }}
              />
              <Label htmlFor="price-paid" className="text-sm font-normal cursor-pointer">
                Paid
              </Label>
            </div>
          </div>
        </div>
      </FilterSection> */}
    </div>
  )
}

const expertise = [
  { id: 1, name: "Web Development", count: 567 },
  { id: 2, name: "Mobile Development", count: 432 },
  { id: 3, name: "Data Science", count: 321 },
  { id: 4, name: "Machine Learning", count: 234 },
  { id: 5, name: "DevOps", count: 189 },
]

// Add this after the expertise constant
const timeSlots = [
  { id: 1, value: "morning", label: "Morning (8AM - 12PM)", count: 245 },
  { id: 2, value: "afternoon", label: "Afternoon (12PM - 5PM)", count: 312 },
  { id: 3, value: "evening", label: "Evening (5PM - 9PM)", count: 198 },
  { id: 4, value: "weekend", label: "Weekends", count: 156 },
  { id: 5, value: "weekday", label: "Weekdays", count: 423 },
]

