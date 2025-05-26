import { Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MentorCardProps {
  mentor: {
    id: string
    name: string
    title: string
    rating: number
    reviews: number
    imageUrl: string
    backgroundColor?: string
    expertise?: string
    username: string
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="group relative border rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 h-full hover:border-emerald-200 hover:-translate-y-1">
      {/* Image container with overlay gradient */}
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src={mentor.imageUrl || "/placeholder.svg?height=256&width=384"}
          alt={mentor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* {mentor.expertise && (
          <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-600 text-white border-0 z-20 shadow-md">
            {mentor.expertise}
          </Badge>
        )} */}
      </div>

      {/* Content area */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg tracking-tight line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">
          {mentor.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 italic">{mentor.title}</p>

        <div className="mt-auto space-y-4">
          {/* Stats row */}
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center gap-1.5  px-2.5 py-1 rounded-full">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({mentor.reviews})</span>
            </div> */}

            <div className="flex items-center gap-1.5  px-2.5 py-1 rounded-full">
              <Award className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-600">Verified Mentor</span>
            </div>
          </div>

          {/* Button */}
          <Button
            variant="default"
            size="sm"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-sm group-hover:shadow transition-all"
            asChild
          >
            <a href={`/mentor/${mentor.username}`} className="flex items-center justify-center gap-2">
              View Profile
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                →
              </span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
