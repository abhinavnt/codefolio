import { Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    username:string
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="group border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
      <div className="relative w-full h-68 overflow-hidden">
        <img
          src={mentor.imageUrl || "/placeholder.svg"}
          alt={mentor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {mentor.expertise && (
          <Badge className="absolute top-2 left-2 bg-emerald-500 text-white">{mentor.expertise}</Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-lg line-clamp-2 mb-1">{mentor.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mentor.title}</p>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{mentor.rating}</span>
              <span className="text-xs text-muted-foreground">({mentor.reviews})</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Mentor</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-emerald-500"
            asChild
          >
            <a href={`/mentor/${mentor.username}`}>See Profile</a>
          </Button>
        </div>
      </div>
    </div>
  )
}