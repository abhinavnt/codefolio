"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AvailableTime } from "./Availble-time"
import { Feedback } from "./FeedBack"
import { Facebook, Twitter, Instagram, Share2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useParams } from "react-router-dom"
import { findMentorByUsername } from "@/services/mentorService"

export default function MentorProfile() {
  console.log("mentor profile component")

  const [copied, setCopied] = useState(false)
  const [mentor, setMentor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  console.log(mentor, "mentor")

  const params = useParams()
  const username = params.username as string
  console.log("Username from params:", username)

  useEffect(() => {
    let isMounted = true

    async function fetchMentor() {
      try {
        console.log("fetchMentor use effect")
        setLoading(true)
        setError(null)
        const response = await findMentorByUsername(username)
        if (!response) {
          throw new Error("Mentor not found")
        }
        const data = await response.data
        console.log(data, "from mentor profile")

        if (isMounted) {
          setMentor(data)
          console.log(mentor, "after mentor")
        }
      } catch (error) {
        console.error("Error fetching mentor:", error)
        if (isMounted) {
          setError("Failed to load mentor data")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMentor()

    return () => {
      isMounted = false
    }
  }, [username])

  const handleShareProfile = () => {
    navigator.clipboard.writeText("https://example.com/mentor/alex-johnson")
    setCopied(true)
    toast.success("Profile link copied!", {
      description: "You can now share this mentor's profile with others.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <Avatar className="w-24 h-24 border-4 border-emerald-500">
                    <AvatarImage
                      src={mentor.profileImage || "/placeholder.svg?height=96&width=96"}
                      alt={mentor.name || "Mentor"}
                    />
                    <AvatarFallback className="text-2xl">{mentor.name ? mentor.name.charAt(0) : "M"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{mentor.username || "mentor"}</h1>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        Top Rated
                      </span>
                    </div>
                    <p className="text-muted-foreground">{mentor.title || "no title for this mentor"}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < 5 ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-400"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">4.9</span>
                      <span className="text-sm text-muted-foreground">(1,234 reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </span>
                        <span className="text-sm">{mentor.yearsOfExperience} year experience</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        </span>
                        <span className="text-sm">{mentor.currentCompany || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </span>
                        <span className="text-sm">{mentor.primaryLanguage || "Not specified"}</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0 justify-center sm:justify-end">
                    <Button variant="outline" size="icon" className="rounded-full" onClick={handleShareProfile}>
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                    </Button>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Facebook className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">ABOUT ME</h2>
                <p className="text-muted-foreground">{mentor.bio || "no bio for this mentor"}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="book">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="book">Book mock interview</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              <TabsContent value="book" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">book slots</h3>
                    <AvailableTime />
                    <div className="mt-6 flex justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-emerald-500 hover:bg-emerald-600">Book Mock Interview</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Book a Mock Interview</DialogTitle>
                            <DialogDescription>
                              Fill out the form below to book a mock interview with {mentor.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input id="name" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input id="email" type="email" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="message" className="text-right">
                                Message
                              </Label>
                              <Textarea id="message" className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                              Confirm Booking
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="review" className="mt-4">
                <Feedback />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.technicalSkills && mentor.technicalSkills.length > 0 ? (
                    mentor.technicalSkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No skills listed</span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Current Position</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">{mentor.currentCompany || "Not specified"}</p>
                      <p className="text-sm text-muted-foreground">Company</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 7h-3a2 2 0 0 0-2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 0-2-2H2" />
                        <path d="M16 2h-4a2 2 0 0 0-2 2v3" />
                        <path d="M8 2h4a2 2 0 0 1 2 2v3" />
                        <path d="M12 22v-4" />
                        <path d="M12 14v-4" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">{mentor.currentRole || "Not specified"}</p>
                      <p className="text-sm text-muted-foreground">Role</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">{mentor.durationAtCompany || "Not specified"}</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Download Resume</h3>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(mentor.resume, "_blank")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-emerald-500"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Download CV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

