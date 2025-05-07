import type { Course } from "@/types/course"



export const dummyCategories = [
  { id: "development", name: "Development", count: 12 },
  { id: "web-development", name: "web-development", count: 765 },
  { id: "data", name: "ML", count: 432 },
  { id: "it", name: "IT & Software", count: 876 },
  { id: "mobile-development", name: "Mobile-development", count: 654 },
  { id: "flutter", name: "Flutter", count: 543 },
  { id: "python", name: "Python", count: 321 },
  { id: "devops", name: "Devops", count: 234 },
  { id: "data-science", name: "Data Science", count: 432 },
  // { id: "personal", name: "Personal Development", count: 765 },
]

export const dummyTools = [
  { id: "html", name: "HTML", count: 432 },
  { id: "css", name: "CSS", count: 421 },
  { id: "javascript", name: "JavaScript", count: 654 },
  { id: "react", name: "React", count: 432 },
  { id: "nodejs", name: "Node.js", count: 321 },
  { id: "python", name: "Python", count: 543 },
  { id: "sql", name: "SQL", count: 321 },
  { id: "adobe", name: "Adobe", count: 432 },
  { id: "wordpress", name: "WordPress", count: 321 },
]

export const dummyLevels = [
  { id: "all", name: "All Levels", count: 1234 },
  { id: "beginner", name: "Beginner", count: 876 },
  { id: "intermediate", name: "Intermediate", count: 654 },
  { id: "advanced", name: "Advanced", count: 321 },
]

export const dummyDurations = [
  { id: "short", name: "0-3 hours", count: 432 },
  { id: "medium", name: "3-6 hours", count: 654 },
  { id: "long", name: "6-17 hours", count: 543 },
  { id: "extralong", name: "17+ hours", count: 321 },
]

export const mentors = [
  {
    id: "1",
    name: "Wade Warren",
    title: "Full Stack Developer",
    rating: 5.0,
    reviews: 128,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#FFD166",
  },
  {
    id: "2",
    name: "Bessie Cooper",
    title: "UX Designer",
    rating: 4.8,
    reviews: 87,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#EF476F",
  },
  {
    id: "3",
    name: "Floyd Miles",
    title: "Data Scientist",
    rating: 4.7,
    reviews: 114,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#F78C6B",
  },
  {
    id: "4",
    name: "Ronald Richards",
    title: "Frontend Developer",
    rating: 4.9,
    reviews: 156,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#06D6A0",
  },
  {
    id: "5",
    name: "Darrell Lane",
    title: "Mobile Developer",
    rating: 4.6,
    reviews: 93,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#FFD166",
  },
  {
    id: "6",
    name: "Robert Fox",
    title: "DevOps Engineer",
    rating: 4.7,
    reviews: 72,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#EF476F",
  },
  {
    id: "7",
    name: "Kathryn Murphy",
    title: "Backend Developer",
    rating: 4.8,
    reviews: 103,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#F78C6B",
  },
  {
    id: "8",
    name: "Jerome Bell",
    title: "Cloud Architect",
    rating: 4.9,
    reviews: 127,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#06D6A0",
  },
  {
    id: "9",
    name: "Cody Fisher",
    title: "Security Specialist",
    rating: 4.7,
    reviews: 84,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#FFD166",
  },
  {
    id: "10",
    name: "Jane Cooper",
    title: "UI Designer",
    rating: 4.8,
    reviews: 92,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#EF476F",
  },
  {
    id: "11",
    name: "Marvin Parks",
    title: "Game Developer",
    rating: 4.6,
    reviews: 76,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#F78C6B",
  },
  {
    id: "12",
    name: "Darren Russell",
    title: "AI Specialist",
    rating: 4.7,
    reviews: 89,
    imageUrl: "/placeholder.svg?height=300&width=300",
    backgroundColor: "#06D6A0",
  },
]

import { Clock, Video, Award, FileText, Globe, Download } from "lucide-react"

export const courseData = {
  title: "Complete Website Responsive Design: from Figma to Webflow to Website Design",
  subtitle: "3+ hours • Learn to design websites with Figma, build with Webflow, and make a living",
  rating: 4.8,
  reviewCount: 2134,
  students: 12543,
  lastUpdated: "April 2023",
  originalPrice: 89.99,
  discountedPrice: 14.0,
  discount: 84,
  instructor: {
    name: "John Russell",
    title: "Web Design Expert",
    bio: "John is a professional web designer with over 10 years of experience. He has worked with major brands and has taught thousands of students how to create beautiful, responsive websites.",
  },
  features: [
    {
      icon: <Clock className="h-5 w-5 text-gray-500" />,
      text: "3.5 hours on-demand video",
    },
    {
      icon: <FileText className="h-5 w-5 text-gray-500" />,
      text: "25 articles and resources",
    },
    {
      icon: <Download className="h-5 w-5 text-gray-500" />,
      text: "15 downloadable resources",
    },
    {
      icon: <Globe className="h-5 w-5 text-gray-500" />,
      text: "Full lifetime access",
    },
    {
      icon: <Video className="h-5 w-5 text-gray-500" />,
      text: "Access on mobile and TV",
    },
    {
      icon: <Award className="h-5 w-5 text-gray-500" />,
      text: "Certificate of completion",
    },
  ],
  learningPoints: [
    "Create beautiful, responsive designs in Figma from scratch",
    "Build fully-functional websites using Webflow without coding",
    "Understand responsive design principles and best practices",
    "Convert designs into custom websites",
    "Optimize websites for different devices and screen sizes",
    "Create animations and interactions to enhance user experience",
  ],
  targetAudience: [
    "Web designers who want to expand their skills to include Webflow",
    "Beginners who want to learn web design and development",
    "Freelancers looking to offer website design services",
    "Entrepreneurs who want to create their own websites",
  ],
  requirements: [
    "Basic computer skills",
    "No prior experience with Figma or Webflow is required",
    "A computer with internet access (Mac or Windows)",
    "Free Figma account and Webflow trial account (no paid software required)",
  ],
  curriculum: [
    {
      title: "Getting Started with Design",
      duration: "45m",
      lessons: [
        { title: "Introduction to Web Design", duration: "5:23" },
        { title: "Setting Up Your Figma Account", duration: "8:45" },
        { title: "Understanding Responsive Design", duration: "12:10" },
        { title: "Design Principles for the Web", duration: "15:30" },
      ],
    },
    {
      title: "Designing in Figma",
      duration: "1h 15m",
      lessons: [
        { title: "Creating Your First Wireframe", duration: "18:20" },
        { title: "Working with Components", duration: "14:55" },
        { title: "Color Theory and Typography", duration: "12:30" },
        { title: "Designing for Mobile First", duration: "16:40" },
        { title: "Creating Responsive Layouts", duration: "22:15" },
      ],
    },
    {
      title: "Building with Webflow",
      duration: "1h 30m",
      lessons: [
        { title: "Introduction to Webflow", duration: "10:15" },
        { title: "Setting Up Your Project", duration: "8:30" },
        { title: "Building the Navigation", duration: "15:45" },
        { title: "Creating Responsive Sections", duration: "20:10" },
        { title: "Adding Interactions and Animations", duration: "18:20" },
        { title: "Publishing Your Website", duration: "12:00" },
      ],
    },
  ],
  reviews: [
    {
      name: "Sarah Johnson",
      rating: 5,
      date: "March 15, 2023",
      comment:
        "This course exceeded my expectations! I had no prior experience with Figma or Webflow, but the instructor made everything easy to understand. I've already built my first website and received great feedback from clients.",
    },
    {
      name: "Michael Chen",
      rating: 4,
      date: "February 28, 2023",
      comment:
        "Very comprehensive course that covers all aspects of the design and development process. The only reason I'm giving 4 stars instead of 5 is that some sections could use more examples.",
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      date: "January 10, 2023",
      comment:
        "As someone who has been designing websites for years but never used Webflow, this course was perfect for me. The instructor's teaching style is clear and engaging. Highly recommended!",
    },
  ],
}

export const relatedCoursesData = [
  {
    title: "Advanced Figma: Design Systems and Component Libraries",
    instructor: "Sarah Williams",
    rating: 4.7,
    reviewCount: 1245,
    price: 19.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=160&width=240",
  },
  {
    title: "Webflow Masterclass: Build Complex Websites Without Coding",
    instructor: "Michael Thompson",
    rating: 4.9,
    reviewCount: 2356,
    price: 24.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=160&width=240",
  },
  {
    title: "Responsive Web Design: Principles and Best Practices",
    instructor: "Jennifer Lee",
    rating: 4.6,
    reviewCount: 987,
    price: 16.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=160&width=240",
  },
]

