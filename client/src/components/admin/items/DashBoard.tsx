import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, GraduationCap, BookOpen,  ShoppingCart, IndianRupee } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "@/utils/axiosInstance";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface DashboardData {
  enrolledCourses: number;
  activeCourses: number;
  courseInstructors: number;
  completedCourses: number;
  totalStudents: number;
  onlineCourses: number;
  totalEarning: number;
  coursesSold: number;
  totalUsers: number;
  totalMentors: number;
  enrollmentsByCategory: { category: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/api/dashboard/");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading dashboard data.</div>;
  }

  // Bar chart data for enrollments by category
  const barChartData = {
    labels: data.enrollmentsByCategory.map((item) => item.category),
    datasets: [
      {
        label: "Enrollments",
        data: data.enrollmentsByCategory.map((item) => item.count),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Line chart data for monthly revenue
  const lineChartData = {
    labels: data.monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.monthlyRevenue.map((item) => item.revenue),
        fill: false,
        borderColor: "rgba(16, 185, 129, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.enrolledCourses.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeCourses}</div>
            {/* <p className="text-xs text-muted-foreground">+2 new courses this week</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completedCourses.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+18% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+10,234 new students</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earning</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.totalEarning.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.coursesSold.toLocaleString()}</div>
            {/* <p className="text-xs text-muted-foreground">+7% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalMentors}</div>
            <p className="text-xs text-muted-foreground">Active mentors</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollments by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" }, title: { display: true, text: "Course Enrollments by Category" } },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" }, title: { display: true, text: "Monthly Revenue Trend" } },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}