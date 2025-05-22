import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/utils/axiosInstance"; // Adjust the import path as necessary
import { formatDistanceToNow } from "date-fns";

interface User {
  name: string;
  profileImageUrl: string;
}

interface FeedbackItem {
  _id: string;
  userId: User;
  rating: number;
  feedback: string;
  createdAt: string;
}

export function Feedback({ mentorId }: { mentorId: string }) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 5;

  // Reset feedback and page when filter changes
  useEffect(() => {
    setFeedback([]);
    setPage(1);
  }, [filter]);

  // Fetch feedback when mentorId, filter, or page changes
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const rating = filter === "all" ? undefined : parseInt(filter);
        const response = await axiosInstance.get(`/api/feedback/${mentorId}`, {
          params: { page, limit, rating },
        });
        const newFeedback = response.data.feedback;
        

        if (page === 1) {
          setFeedback(newFeedback);
        } else {
          setFeedback((prev) => [...prev, ...newFeedback]);
        }
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [mentorId, filter, page]);

  // Function to load more feedback
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Format date
  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Students Feedback</h3>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Star Rating</SelectItem>
              <SelectItem value="4">4 Star Rating</SelectItem>
              <SelectItem value="3">3 Star Rating</SelectItem>
              <SelectItem value="2">2 Star Rating</SelectItem>
              <SelectItem value="1">1 Star Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {feedback.length > 0 ? (
            feedback.map((item) => (
              <div key={item._id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={item.userId.profileImageUrl} alt={item.userId.name} />
                  <AvatarFallback>{item.userId.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.userId.name}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(item.createdAt)}</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < item.rating ? "currentColor" : "none"}
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
                  <p className="text-sm">{item.feedback}</p>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-muted-foreground">No feedback available.</p>
          )}
          {loading && <p className="text-center">Loading...</p>}
          {feedback.length < total && !loading && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}