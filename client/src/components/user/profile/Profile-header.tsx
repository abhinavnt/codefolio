import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// interface ProfileHeaderProps {
//   fullName: string;
//   title: string;
//   profileImage: string;
// }

export function ProfileHeader() {

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {}, [user]);

  return (
    <div className="bg-[#f0fff7]  p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={user.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
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
        <Link
          to="/become-instructor"
          className="flex items-center gap-2 text-sm font-medium text-emerald-500 bg-green-50 px-4 py-2 rounded-md"
        >
          Become Mentor
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
