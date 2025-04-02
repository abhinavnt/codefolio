"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axiosInstance from "@/utils/axiosInstance"
import { findCourseById } from "@/services/courseService"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentProcessingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const courseId = searchParams.get("course_id")
  const [hasVerified, setHasVerified] = useState(false)

  if(!courseId){
    return <div>course id illa</div>
  }

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified) return
      setHasVerified(true)

      try {
        const courseData = await findCourseById(courseId)
        const course = courseData?.data.course

        if (!sessionId || !course) {
          throw new Error("Missing payment information")
        }

        const response = await axiosInstance.post(
          `/api/payment/verify-payment?sessionId=${sessionId}`,
          { course },
          { withCredentials: true },
        )

        if (response.data.isPaid) {
          // Navigate to success page with course information
          navigate(
            `/payment/successfully?course_id=${courseId}&course_name=${encodeURIComponent(course.title || "your course")}`,
          )
        }
      } catch (error) {
        console.error("Payment verification failed:", error)
        navigate("/payment/cancel")
      }
    }

    if (sessionId && courseId) {
      verifyPayment()
    }
  }, [sessionId, courseId, navigate, hasVerified])

  if (!courseId) {
    return <div className="container mx-auto px-4 py-8">Course ID not found</div>
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh] px-4 py-8">
      <Card className="w-full max-w-md border-emerald-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-emerald-100"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Processing Payment</h1>
              <p className="text-muted-foreground">Please wait while we verify your payment. This may take a moment.</p>
            </div>

            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

