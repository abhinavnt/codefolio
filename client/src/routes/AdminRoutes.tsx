import { Routes, Route, Outlet } from "react-router-dom"
import { AdminLayout } from "@/components/admin/items/AdminLayout"

import { AllUsers } from "@/components/admin/items/AllUsers"
import { AllMentors } from "@/components/admin/items/AllMentors"
import { MentorRequests } from "@/components/admin/items/MentorRequests"
import { AddCourse } from "@/components/admin/items/AddCourse"
import { EnrolledUsers } from "@/components/admin/items/EnrolledUsers"

import { Settings } from "@/components/admin/items/Settings"
import { Dashboard } from "@/components/admin/items/DashBoard"
import { CourseManagement } from "@/components/admin/items/CourseManagment"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AdminLogin from "@/pages/admin/AdminLogin"

export function AdminRoutes() {
    console.log('admin routil kayritundllooo');
    
  return (
    <Routes>

         <Route path="/login" element={<AdminLogin/>}/>
       
        <Route element={<ProtectedRoute role="admin" />}>
       
      <Route path="/"element={<AdminLayout><Outlet /></AdminLayout>}>

        <Route index element={<Dashboard />} />
        <Route path="users" element={<AllUsers />} />
        <Route path="mentors" element={<AllMentors />} />
        <Route path="mentor-requests" element={<MentorRequests />} />
        <Route path="add-course" element={<AddCourse />} />
        <Route path="enrolled-users" element={<EnrolledUsers />} />
        <Route path="course-management" element={<CourseManagement />} />
        <Route path="settings" element={<Settings />} />
        </Route>

      </Route>
    </Routes>
  )
}

