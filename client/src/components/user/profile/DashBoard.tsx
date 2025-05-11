import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BarChart, BookOpen, DollarSign, IndianRupee } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

interface DashboardStats {
  coursesPurchased: number;
  mentorshipSessions: number;
  completedCourses: number;
  totalSpent: number;
}

export function Dashboard() {
  const user = useSelector((state: any) => state.auth.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "all">("monthly");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/dashboard/user?period=${period}`);
        setStats(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user, period]);

  const statItems = stats
    ? [
        {
          label: "Courses Purchased",
          value: stats.coursesPurchased,
          icon: BookOpen,
          color: "bg-blue-100 text-blue-600",
        },
        {
          label: "Mentorship Sessions",
          value: stats.mentorshipSessions,
          icon: BarChart,
          color: "bg-green-100 text-green-600",
        },
        {
          label: "Completed Courses",
          value: stats.completedCourses,
          icon: BookOpen,
          color: "bg-purple-100 text-purple-600",
        },
        {
          label: "Total Spent",
          value: `₹${stats.totalSpent}`,
          icon: IndianRupee,
          color: "bg-orange-100 text-orange-600",
        },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as "daily" | "weekly" | "monthly" | "yearly" | "all")}
          className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading && <p className="text-gray-500 text-center py-8">Loading...</p>}
      {error && <p className="text-red-500 text-center py-8">{error}</p>}
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat, index) => (
            <div key={index} className="border rounded-lg p-4 flex items-center">
              <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}