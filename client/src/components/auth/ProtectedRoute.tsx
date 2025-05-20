import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import { RootState } from "../../../redux/store"; 
    
interface ProtectedRouteProps {
  role: "user" | "admin";
}

const ProtectedRoute = ({role}:ProtectedRouteProps) => {

  const user = useSelector((state: RootState) => state.auth.user);  
  const isAdmin = localStorage.getItem("adminLoggedIn")
 
  if(role === 'user' && !isAdmin){
    return user && !isAdmin && user.status === 'active' ? <Outlet /> : <Navigate to="/" replace />;
  }else{
    console.log('here admin outlet comming');
    
    return user && isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute; 