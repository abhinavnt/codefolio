import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home"; // Eagerly loaded
import { ThemeProvider } from "./components/theme/theme-provider";
import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { refreshToken } from "./services/authService";
import { useAppSelector } from "./redux/store";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CustomErrorBoundary from "./components/error/CustomErrorBoundary";
import { DotLoading } from "./components/user/common/Loading";
// import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/error/NotFound";
import { AdminRoutes } from "./routes/AdminRoutes";


const LazyResetPasswordPage = lazy(() => import("./components/user/Auth/ResetPasswordPage"));
const LazyUserProfile = lazy(() => import("./pages/user/Profile"));
const LazyCourseDisplay = lazy(() => import("./pages/user/CourseDisplay"));
const LazyMentorApplicationPage = lazy(() => import("./pages/user/MentorApplication"));



function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("user fetch chyunnuuu");
      
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (storedAuth) {
        try {
          await refreshToken(dispatch);
        } catch (error) {
          console.log("Error during token refresh", error);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <DotLoading text="Loading..."/>
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <BrowserRouter>
        <CustomErrorBoundary>
          <Suspense fallback={<DotLoading text="Loading..." />}>
            <Routes>

              
              <Route path="/reset-password" element={<LazyResetPasswordPage />} />


               <Route path="/" element={<Home />} />

              {/* Protected routes of users */}
              <Route element={<ProtectedRoute role="user" />}>
                <Route path="/profile" element={<LazyUserProfile />} />
                <Route path="/courses" element={<LazyCourseDisplay />} />
                <Route path="/mentor-application" element={<LazyMentorApplicationPage />} />
              </Route>

               
               {/* <Route path="/admin/login" element={<AdminLogin/>}/> */}
               <Route path="/admin/*" element={<AdminRoutes/>}/>

              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </Suspense>
        </CustomErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;