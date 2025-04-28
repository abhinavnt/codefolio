import { useState, useEffect } from 'react';
import { Clock, Star, Trash2 } from "lucide-react";
import axiosInstance from '@/utils/axiosInstance';
import { filterCourses } from '@/redux/features/CourseSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


interface Course {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  price: string;
  rating: number;
  enrolledStudents: string[];
  status: "draft" | "published" | "archived";
  tags: string[];
  learningPoints: string[];
  targetedAudience: string[];
  courseRequirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Wishlist {
  courseIds: Course[];
}

export function Wishlist() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get('/api/wishlist');
        setWishlist(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setWishlist({ courseIds: [] });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleViewDetails = (course: Course) => {
    if (wishlist !== null) {
      dispatch(filterCourses(wishlist.courseIds));
    }
    navigate(`/courses/${course._id}`)
  };

  const removeFromWishlist = async (courseId: string) => {
    try {
      await axiosInstance.delete(`/api/wishlist/${courseId}`);
      const response = await axiosInstance.get('/api/wishlist');
      setWishlist(response.data);
    } catch (err: any) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!wishlist || wishlist.courseIds.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">
          Browse Courses
        </button>
      </div>
    );
  }

  const wishlistItems = wishlist.courseIds;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">My Wishlist</h1>
        <p className="text-sm text-gray-500">{wishlistItems.length} courses</p>
      </div>

      <div className="space-y-4">
        {wishlistItems.map((item: Course) => (
          <div key={item._id} className="border bg-secondary rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-40 sm:h-auto relative">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="mx-2 text-gray-300">|</span>
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{item.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="mt-auto">
                      <p className="text-lg font-bold">₹{item.price}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}