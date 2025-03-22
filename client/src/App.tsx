import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/user/Home"
import { ThemeProvider } from "./context/Theme-provider"
import CourseDisplay from "./pages/user/CourseDisplay"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { refreshToken } from "./services/authService"
import { useAppSelector } from "./redux/store"
import UserProfile from "./pages/user/Profile"
import ResetPasswordPage from "./components/user/Auth/ResetPasswordPage"

function App() {

  const dispatch=useDispatch()
  const [loading, setLoading] = useState<boolean>(true);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(()=>{
    const fetchUser= async()=>{
      console.log('user fetch chyunnuuu');
      
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if(isAuthenticated){
        try {
          await refreshToken(dispatch)
        } catch (error) {
          console.log("Error during token refresh", error);
        }finally{
          setLoading(false)

        }
      }else{
        setLoading(false)
      }
    }
    fetchUser()
  },[dispatch,isAuthenticated])

  if (loading) {
    return <div>loading</div>;
  }
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/courses" element={<CourseDisplay/>}/>
    <Route path="/profile" element={<UserProfile/>}/>
    <Route path="/reset-password" element={<ResetPasswordPage/>} />
   </Routes>
   </BrowserRouter>
   </ThemeProvider>
  )
}

export default App
