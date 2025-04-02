import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string>("the course");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setCourseId(searchParams.get("course_id"));
    setCourseName(searchParams.get("course_name") || "the course");
  }, [location.search]);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-full max-w-md border border-red-200 shadow-lg rounded-lg p-6 bg-white">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className="rounded-full bg-red-100 p-3"
            >
              <XCircle className="h-16 w-16 text-red-500" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Payment Canceled</h1>
              <p className="text-muted-foreground">
                Your payment for <span className="font-medium">{courseName}</span> was canceled. No charges were made.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 w-full"
            >
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/courses/${courseId}`)}>
                Try Again
              </button>
              <button
                className="w-full border border-red-200 text-red-700 hover:bg-red-50 py-2 px-4 rounded"
                onClick={() => navigate("/courses")}
              >
                View All Courses
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
