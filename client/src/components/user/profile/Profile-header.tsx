"use client"

import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { NotificationsDialog } from "./NotificationsDialog";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import { toast} from "sonner";

export function ProfileHeader() {
  const user = useSelector((state: any) => state.auth.user);
  const socket = useSocket();

  // Listen for new notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("new-notification", ({ message, type }) => {
      if (type === "approved") {
        toast.success(message, {
          description: "Your mentor application has been approved!",
          style: { background: "#10B981", color: "#fff" },
        });
      } else if (type === "rejected") {
        toast.error(message, {
          description: "Your mentor application was rejected.",
          style: { background: "#EF4444", color: "#fff" },
        });
      } else {
        toast.info(message, {
          description: "Your mentor application status has been updated.",
          style: { background: "#F59E0B", color: "#fff" },
        });
      }
    });

    return () => {
      socket.off("new-notification");
    };
  }, [socket]);

  // Check status conditions
  const isPending = user.reviewerRequestStatus?.includes("pending");
  const isRejected = user.reviewerRequestStatus?.includes("rejected");
  const isApproved = user.reviewerRequestStatus?.includes("approved");

  return (
    <div className="p-4 sm:p-6">



      <div className="max-w-4xl mx-auto rounded-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={
                user.profileImageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" ||
                "/placeholder.svg"
              }
              alt="Profile"
              className="object-cover w-full h-full"
              width={64}
              height={64}
            />
          </div>
          <div>
            <h2 className="text-lg font-medium">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.title}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <NotificationsDialog />
            <ModeToggle />
          </div>

          {isApproved ? (
            <Link
              to="/mentor-verify"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md text-emerald-500 bg-green-50 hover:bg-green-100"
            >
              Mentor Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : isPending ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Link
                      to="#"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed"
                      aria-disabled={true}
                    >
                      Become Mentor
                    </Link>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Already Applied</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              to="/mentor-application"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md text-emerald-500 bg-green-50 hover:bg-green-100"
            >
              Become Mentor
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}