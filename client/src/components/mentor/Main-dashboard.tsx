"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { CalendarDays, Users, Clock, Award, Wallet, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import type { IMentor } from "@/types/mentor"
import axiosInstance from "@/utils/axiosInstance"
import { RootState, useAppSelector } from "@/redux/store"


interface BookingStats {
  date: string
  bookings: number
  revenue: number
}

interface WalletTransaction {
  transactionId: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
}

interface DashboardData {
  totalBookings: number
  pendingBookings: number
  totalRevenue: number
  walletBalance: number
  bookingStats: BookingStats[]
  recentTransactions: WalletTransaction[]
  upcomingSlots: Array<{
    date: string
    startTime: string
    endTime: string
    status: string
  }>
}

interface MainDashboardProps {
  mentor: IMentor
}

export function MainDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    walletBalance: 0,
    bookingStats: [],
    recentTransactions: [],
    upcomingSlots: []
  })

  const { mentor } = useAppSelector((state: RootState) => state.mentor)

  if (!mentor) {
    return
  }

  useEffect(() => {
    // Fetch dashboard data using axiosInstance
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(`/api/dashboard/mentor/${mentor._id}`)
        setDashboardData(response.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [mentor._id])

  return (
    <div className="space-y-6 bg-secondary p-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conducted MentorShip</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time MentorShip</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending MentorShip</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.walletBalance}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Weekly booking statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.bookingStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your next scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{format(new Date(slot.date), "PPP")}</p>
                        <p className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                      <Badge variant={slot.status === "upcoming" ? "default" : "secondary"}>
                        {slot.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>All your past and upcoming bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add table or list of bookings here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Transactions</CardTitle>
              <CardDescription>Recent wallet activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.transactionId}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), "PPP")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.transactionId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Update your available time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Add New Time Slot
              </Button>
              {/* Add availability management UI here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}