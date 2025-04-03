

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course_id");
  const courseName = searchParams.get("course_name") || "your course";

  useEffect(() => {
    
  }, []);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh] px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md border-emerald-200 shadow-lg">
          <CardContent className="pt-6">
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
                className="rounded-full bg-emerald-100 p-3"
              >
                <CheckCircle className="h-16 w-16 text-emerald-500" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. You now have access to <span className="font-medium">{courseName}</span>.
                </p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 w-full"
              >
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => navigate(`/courses`)}
                >
                  Continue
                </Button>
                {/* <Button
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => navigate("/courses")}
                >
                  View All Courses
                </Button> */}
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
