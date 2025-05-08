

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from "@/utils/axiosInstance"
import { RootState, useAppSelector } from "@/redux/store"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface Review {
  id: string
  date: string
  startTime: string
  endTime: string
  student: {
    id: string
    name: string
    email: string
    avatar: string
    jobTitle: string
    company: string
  }
  task: {
    id: string
    title: string
    type: string
  }
  status: "upcoming" | "completed" | "canceled"
  practicalMarks?: number
  theoryMarks?: number
  feedback?: string
  meetingLink?: string
}

export function MentorReviews() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "canceled">("upcoming")
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"complete" | "edit" | null>(null)
  const [practicalMarks, setPracticalMarks] = useState("")
  const [theoryMarks, setTheoryMarks] = useState("")
  const [feedback, setFeedback] = useState("")

  const { mentor } = useAppSelector((state: RootState) => state.mentor)

  const navigate = useNavigate()


  useEffect(() => {
    fetchReviews(tab);
  }, [tab])

  const fetchReviews = async (status: string) => {
    try {
      const response = await axiosInstance.get(`/api/mentor-availability/${mentor?._id}/reviews?status=${status}`);
      console.log(response.data);

      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }



  const handleJoinMeet = (meetId: string) => {
    console.log("Joining meet with ID:", meetId);

    navigate(`/video-call/${meetId}`)
  };



  const handleComplete = (review: Review) => {
    setSelectedReview(review);
    setPracticalMarks("");
    setTheoryMarks("");
    setFeedback("");
    setModalType("complete");
    setIsModalOpen(true);
  }

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setPracticalMarks(review.practicalMarks?.toString() || "");
    setTheoryMarks(review.theoryMarks?.toString() || "");
    setFeedback(review.feedback || "");
    setModalType("edit");
    setIsModalOpen(true);
  }

  const handleCancel = async (review: Review) => {
    try {
      await fetch(`/api/mentor-availability/${mentor?._id}/dates/${review.date}/timeSlots/${review.id}/cancel`, {
        method: "POST",
      });
      fetchReviews(tab);
    } catch (error) {
      console.error("Error canceling review:", error);
    }
  }

  const handleSubmit = async () => {
    if (!selectedReview) return;
    const url = modalType === "complete"
      ? `/api/mentor-availability/${mentor?._id}/dates/${selectedReview.date}/timeSlots/${selectedReview.id}/complete`
      : `/api/mentor-availability/${mentor?._id}/dates/${selectedReview.date}/timeSlots/${selectedReview.id}/edit`;
    const data = {
      practicalMarks: parseInt(practicalMarks),
      theoryMarks: parseInt(theoryMarks),
      feedback,
    };
    try {
      if (modalType === "complete") {
        await axiosInstance.post(url, data);
        toast.success("Marked as Completed")
      } else {
        await axiosInstance.put(url, data);
        toast.success("Review Edited")
      }
      setIsModalOpen(false);
      fetchReviews(tab);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review:")
    }
  };

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailsOpen(true);
  }

  const renderReview = (review: Review) => (
    <div
      key={review.id}
      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start gap-4 mb-4 md:mb-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.student.avatar} alt={review.student.name} />
          <AvatarFallback>{review.student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{review.student.name}</h3>
            <Badge>{review.status}</Badge>
          </div>
          <p className="text-sm text-gray-500">
            {review.student.jobTitle} at {review.student.company}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{review.startTime} - {review.endTime}</span>
            </div>
            {/* <div className="flex items-center">
              {getTypeIcon(review.task.type)}
              <span className="ml-1">{getTypeLabel(review.task.type)}</span>
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-auto">
        {tab === "upcoming" && (
          <>
            <Button variant="outline" size="sm" onClick={() => handleComplete(review)}>
              Complete
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCancel(review)}>
              Cancel
            </Button>
          </>
        )}
        {tab === "completed" && (
          <Button variant="outline" size="sm" onClick={() => handleEdit(review)}>
            Edit
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(review)}>
          Details
        </Button>
        {review.status === "upcoming" && review.meetingLink && (
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600"
            onClick={(e) => {
              e.stopPropagation();
              handleJoinMeet(review.meetingLink!);
            }}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Reviews</CardTitle>
        <CardDescription>Manage your mentoring sessions and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(value) => setTab(value as "upcoming" | "completed" | "canceled")}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">{reviews.map(renderReview)}</TabsContent>
          <TabsContent value="completed">{reviews.map(renderReview)}</TabsContent>
          <TabsContent value="canceled">{reviews.map(renderReview)}</TabsContent>
        </Tabs>
      </CardContent>

      {/* Modal for Complete/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalType === "complete" ? "Complete Review" : "Edit Review"}</DialogTitle>
            <DialogDescription>
              {modalType === "complete" ? "Enter marks and feedback for the review" : "Update marks and feedback"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Practical Marks</label>
              <Input
                type="number"
                value={practicalMarks}
                onChange={(e) => setPracticalMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Theory Marks</label>
              <Input
                type="number"
                value={theoryMarks}
                onChange={(e) => setTheoryMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Feedback</label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>Information about the review session</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedReview.student.avatar} alt={selectedReview.student.name} />
                  <AvatarFallback>{selectedReview.student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedReview.student.name}</h3>
                  <p className="text-sm text-gray-500">{selectedReview.student.email}</p>
                  <p className="text-sm text-gray-500">
                    {selectedReview.student.jobTitle} at {selectedReview.student.company}
                  </p>
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date & Time:</span>
                  <span className="text-sm">
                    {new Date(selectedReview.date).toLocaleDateString()} at {selectedReview.startTime} - {selectedReview.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Review Type:</span>
                  {/* <span className="text-sm">{getTypeLabel(selectedReview.task.type)}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm">{selectedReview.status}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Topic:</span>
                  <p className="text-sm mt-1">{selectedReview.task.title}</p>
                </div>
                {selectedReview.feedback && (
                  <div className="pt-2">
                    <span className="text-sm font-medium">Feedback:</span>
                    <p className="text-sm mt-1">{selectedReview.feedback}</p>
                  </div>
                )}
                {(selectedReview.practicalMarks || selectedReview.theoryMarks) && (
                  <div className="pt-2">
                    <span className="text-sm font-medium">Marks:</span>
                    <p className="text-sm mt-1">
                      Practical: {selectedReview.practicalMarks || "N/A"}, Theory: {selectedReview.theoryMarks || "N/A"}
                    </p>
                  </div>
                )}
              </div>
              {selectedReview.meetingLink && selectedReview.status === "upcoming" && (
                <div className="flex justify-end pt-2">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinMeet(selectedReview.meetingLink!);
                    }}
                  >
                    Join Meeting
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}