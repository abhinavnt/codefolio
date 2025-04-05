"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IMentor } from "@/types/mentor"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CalendarDays, Users, Clock, Award } from "lucide-react"

interface MainDashboardProps {
  mentor: IMentor
}

// Dummy data for the chart
const reviewData = [
  { month: "Jan", reviews: 4 },
  { month: "Feb", reviews: 7 },
  { month: "Mar", reviews: 5 },
  { month: "Apr", reviews: 10 },
  { month: "May", reviews: 8 },
  { month: "Jun", reviews: 12 },
  { month: "Jul", reviews: 9 },
  { month: "Aug", reviews: 11 },
  { month: "Sep", reviews: 13 },
  { month: "Oct", reviews: 7 },
  { month: "Nov", reviews: 5 },
  { month: "Dec", reviews: 8 },
]

export function MainDashboard({ mentor }: MainDashboardProps) {
  return (
    <div>comming soon</div>
    // <div className="space-y-6 bg-secondary">
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    //     <Card>
    //       <CardContent className="p-6 flex flex-col items-center">
    //         <div className="rounded-full bg-emerald-100 p-3 mb-4">
    //           <Users className="h-6 w-6 text-emerald-500" />
    //         </div>
    //         <CardTitle className="text-3xl font-bold">{mentor.reviewTakenCount}</CardTitle>
    //         <CardDescription className="text-center">Total Reviews</CardDescription>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardContent className="p-6 flex flex-col items-center">
    //         <div className="rounded-full bg-blue-100 p-3 mb-4">
    //           <CalendarDays className="h-6 w-6 text-blue-500" />
    //         </div>
    //         <CardTitle className="text-3xl font-bold">24</CardTitle>
    //         <CardDescription className="text-center">Upcoming Sessions</CardDescription>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardContent className="p-6 flex flex-col items-center">
    //         <div className="rounded-full bg-purple-100 p-3 mb-4">
    //           <Clock className="h-6 w-6 text-purple-500" />
    //         </div>
    //         <CardTitle className="text-3xl font-bold">86</CardTitle>
    //         <CardDescription className="text-center">Hours Mentored</CardDescription>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardContent className="p-6 flex flex-col items-center">
    //         <div className="rounded-full bg-amber-100 p-3 mb-4">
    //           <Award className="h-6 w-6 text-amber-500" />
    //         </div>
    //         <CardTitle className="text-3xl font-bold">4.8</CardTitle>
    //         <CardDescription className="text-center">Average Rating</CardDescription>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Reviews Overview</CardTitle>
    //       <CardDescription>Monthly review statistics for the past year</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="h-80 w-full">
    //         <ResponsiveContainer width="100%" height="100%">
    //           <BarChart data={reviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    //             <CartesianGrid strokeDasharray="3 3" />
    //             <XAxis dataKey="month" />
    //             <YAxis />
    //             <Tooltip />
    //             <Bar dataKey="reviews" fill="#10b981" />
    //           </BarChart>
    //         </ResponsiveContainer>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Recent Activity</CardTitle>
    //         <CardDescription>Your latest mentoring activities</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           {[1, 2, 3].map((i) => (
    //             <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
    //               <div className="rounded-full bg-gray-100 p-2">
    //                 <Users className="h-4 w-4 text-gray-500" />
    //               </div>
    //               <div>
    //                 <p className="font-medium">Review session with Alex Johnson</p>
    //                 <p className="text-sm text-gray-500">Yesterday at 2:30 PM</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Performance</CardTitle>
    //         <CardDescription>Your mentoring performance metrics</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <div className="space-y-2">
    //             <div className="flex justify-between">
    //               <span className="text-sm font-medium">Response Rate</span>
    //               <span className="text-sm font-medium">95%</span>
    //             </div>
    //             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    //               <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }}></div>
    //             </div>
    //           </div>

    //           <div className="space-y-2">
    //             <div className="flex justify-between">
    //               <span className="text-sm font-medium">Satisfaction Score</span>
    //               <span className="text-sm font-medium">4.8/5</span>
    //             </div>
    //             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    //               <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }}></div>
    //             </div>
    //           </div>

    //           <div className="space-y-2">
    //             <div className="flex justify-between">
    //               <span className="text-sm font-medium">Completion Rate</span>
    //               <span className="text-sm font-medium">92%</span>
    //             </div>
    //             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    //               <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }}></div>
    //             </div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  )
}

