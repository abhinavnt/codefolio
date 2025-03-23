import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ProfileHeader() {
  const user = useSelector((state: any) => state.auth.user);

  // Check if the button should be disabled (only for "pending" or "rejected")
  const isDisabled =
    user.reviewerRequestStatus?.includes("pending") || user.reviewerRequestStatus?.includes("rejected");

  return (
    <div className="bg-[#f0fff7] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={
                user.profileImageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
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

        {/* Button with ShadCN Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Link
                  to={isDisabled ? "#" : "/mentor-application"}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md ${
                    isDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-emerald-500 bg-green-50 hover:bg-green-100"
                  }`}
                  aria-disabled={isDisabled}
                >
                  Become Mentor
                  {!isDisabled && <ArrowRight className="w-4 h-4" />}
                </Link>
              </span>
            </TooltipTrigger>
            {isDisabled && <TooltipContent>Already Applied</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
