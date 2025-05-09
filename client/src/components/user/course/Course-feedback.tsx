import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

interface CourseFeedbackProps {
  courseId: string
  existingFeedback?: {
    rating: number
    feedback: string
  }
}

export default function CourseFeedback({ courseId }: CourseFeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    const fetchExistingFeedback = async () => {
      try {
        const response = await axiosInstance.get(`/api/feedback/${courseId}/user/`);
        if (response.data) {
          setRating(response.data.rating);
          setFeedback(response.data.feedback);
        }
      } catch (error) {
        console.error("Error fetching existing feedback:", error);
      }
    };
    fetchExistingFeedback();
  }, [courseId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting your feedback");
      return;
    }

    if (feedback.trim() === "") {
      toast.error("Please provide some feedback about the course");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/feedback/course", {
        courseId,
        rating,
        feedback,
      });
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("There was an error submitting your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Rate this course</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">How would you rate your experience with this course?</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
              aria-label={`Rate ${star} stars out of 5`}
            >
              <Star
                className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating) ? "fill-emerald-500 text-emerald-500" : "fill-gray-200 text-gray-200"
                  }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-medium">{rating > 0 ? `${rating} out of 5 stars` : "Select rating"}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Share your thoughts about this course</p>
        <Textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600">
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
}