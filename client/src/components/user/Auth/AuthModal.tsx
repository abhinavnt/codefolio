import type React from "react";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { AxiosResponse } from "axios";
import { googleAuth, login, registerUser, verifyOtp } from "@/services/authService";
import OTPModal from "./OTPModal";
import ForgotPasswordModal from "./ForgotPasswordModal"; // Import the new component
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialTab = "signup" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    signinEmail: "",
    signinPassword: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // New state for forgot password modal
  const [apiError,setApiError]=useState("")

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError("");
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [apiError]);


  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    validateField();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateField = () => {
    const newErrors: Record<string, string> = {};
    if (activeTab === "signup") {
      if (touched.name && !formData.name.trim()) {
        newErrors.name = "First name is required";
      }
      if (touched.email) {
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
      }
      if (touched.password) {
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
      }
    } else {
      if (touched.signinEmail) {
        if (!formData.signinEmail.trim()) {
          newErrors.signinEmail = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.signinEmail)) {
          newErrors.signinEmail = "Please enter a valid email address";
        }
      }
      if (touched.signinPassword && !formData.signinPassword) {
        newErrors.signinPassword = "Password is required";
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  const validateForm = () => {
    const formFields = activeTab === "signup" ? ["name", "email", "password"] : ["signinEmail", "signinPassword"];
    const newTouched: Record<string, boolean> = {};
    formFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    return validateField();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    if (activeTab === "signup") {
      const { name, email, password } = formData;
      const response: AxiosResponse = await registerUser(name, email, password);
      if (response.status === 200) {
        setIsOtpOpen(true);
        setApiError(" ")
      }else{
        toast.error(response.data.message)
        setApiError(response.data.message)
      }
    } else {
      const { signinEmail, signinPassword } = formData;
      const role = "user";
      const response: AxiosResponse = await login(signinEmail, signinPassword, role, dispatch);
      if (response.status === 200) {
        onClose();
        toast.success('Login successfull')
      } else {
        toast.error(response.data.message)
        setApiError(response.data.message)
      }
    }
    setIsSubmitting(false);
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#20B486]";
    return touched[fieldName] && errors[fieldName]
      ? `${baseClass} border-red-500`
      : touched[fieldName] && !errors[fieldName]
      ? `${baseClass} border-green-500`
      : `${baseClass} border-gray-300`;
  };

  const handleOtpVerify = async (otp: string): Promise<boolean> => {
    const response = await verifyOtp(formData.email, otp, dispatch);
    if (response && response.status === 200) {
      setIsOtpOpen(false);
      onClose();
      toast.success('OTP verified, user registered')
      return true;
    } else {
      return false;
      toast.error('somthing went wrong please try again')
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-background rounded-lg w-full max-w-md flex overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-[#20B486]"></div>
          <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="flex-1 p-8">
            <div className="max-w-md mx-auto">
              <div className="flex border-b mb-8">
                <button
                  className={`pb-2 px-4 cursor-pointer text-lg font-medium ${
                    activeTab === "signin" ? "text-[#20B486] border-b-2 border-[#20B486]" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("signin")}
                >
                  Sign In
                </button>
                <button
                  className={`pb-2 px-4 cursor-pointer text-lg font-medium ${
                    activeTab === "signup" ? "text-[#20B486] border-b-2 border-[#20B486]" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </button>
              </div>
              <div className="mb-8">
                <p className="text-center text-gray-500 mb-2">
                  Sign {activeTab === "signin" ? "In" : "Up"} via
                </p>
                <button onClick={googleAuth} className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
              <p className="font-bold text-sm text-red-600 ml-25">{apiError}</p>
              {activeTab === "signup" && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        First name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName("name")}
                      />
                      {touched.name && errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName("email")}
                      />
                      {touched.email && errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Create password*
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={getInputClassName("password")}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {touched.password && errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                      )}
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#20B486] text-white px-8 py-3 rounded-md hover:bg-[#1a9d75] transition-colors disabled:bg-gray-400 w-full"
                      >
                        {isSubmitting ? "Processing..." : "Sign Up"}
                      </button>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-[#20B486] hover:underline cursor-pointer"
                        onClick={() => setActiveTab("signin")}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              )}
              {activeTab === "signin" && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="signinEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="signinEmail"
                        name="signinEmail"
                        value={formData.signinEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName("signinEmail")}
                      />
                      {touched.signinEmail && errors.signinEmail && (
                        <p className="text-xs text-red-500 mt-1">{errors.signinEmail}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="signinPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Password*
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="signinPassword"
                          name="signinPassword"
                          value={formData.signinPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={getInputClassName("signinPassword")}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {touched.signinPassword && errors.signinPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.signinPassword}</p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-[#20B486] hover:underline"
                        onClick={() => setIsForgotPasswordOpen(true)} // Open the forgot password modal
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#20B486] text-white px-8 py-3 rounded-md hover:bg-[#1a9d75] transition-colors disabled:bg-gray-400 w-full"
                      >
                        {isSubmitting ? "Processing..." : "Sign In"}
                      </button>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        className="text-[#20B486] hover:underline cursor-pointer"
                        onClick={() => setActiveTab("signup")}
                      >
                        Create one
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <OTPModal
        onClose={() => setIsOtpOpen(false)}
        onVerify={handleOtpVerify}
        email={formData.email}
        isOpen={isOtpOpen}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
}