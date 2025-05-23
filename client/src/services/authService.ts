import { clearUser, setCredentials } from "@/redux/features/auth/AuthSlice";
import { AppDispatch } from "@/redux/store";
import axiosInstance from "@/utils/axiosInstance";

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", { name, email, password }, { withCredentials: true });
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const verifyOtp = async (email: string, otp: string, dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post("/api/auth/otpverify", { email, otp }, { withCredentials: true });

    dispatch(setCredentials({ accessToken: response.data.accessToken, user: response.data.user }));
    localStorage.setItem("isAuthenticated", "true");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/api/auth/resend-otp", { email }, { withCredentials: true });

    return response;
  } catch (error) {}
};

export const refreshToken = async (dispatch: AppDispatch) => {
  try {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const isAdmin = localStorage.getItem("adminLoggedIn");

    let data = { role: "user" };

    if (isAuthenticated === "true") {
      if (isAdmin === "true") {
        data = { role: "admin" };
      }

      const response = await axiosInstance.post(`/api/auth/refresh-token`, data, { withCredentials: true });

      dispatch(setCredentials({ accessToken: response.data.accessToken, user: response.data.user }));
      return response.data.accessToken;
    }
    throw new Error("Session expired. Please log in again");
  } catch (error) {
    console.log(error);
    //   dispatch(logout());
    throw new Error("Session expired. Please log in again.");
  }
};

export const login = async (email: string, password: string, role: string, dispatch: AppDispatch) => {
  try {
    

    const response = await axiosInstance.post("/api/auth/login", { email, password, role }, { withCredentials: true });

    

    dispatch(
      setCredentials({
        accessToken: response.data.accessToken,
        user: response.data.user,
      })
    );

    
    

    

    localStorage.clear();
    localStorage.setItem("isAuthenticated", "true");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const userLogout = async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post("/api/auth/logout", {}, { withCredentials: true });

    if (response.status === 200) {
      dispatch(clearUser());
    }

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error while logging out");
  }
};

export const forgotPassword = async (email: string) => {
  
  try {
    

    const response = await axiosInstance.post(`/api/auth/forgot-password`, { email });

    return response;
  } catch (error: any) {
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(`/api/auth/reset-password`, { token, newPassword });

    return response;
  } catch (error: any) {
    throw error;
  }
};

export const googleAuth = async () => {
  window.open("https://codefolio.myvnc.com/api/auth/google", "_self");
};
