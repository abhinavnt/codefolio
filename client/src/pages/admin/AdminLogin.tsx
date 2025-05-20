
import type React from "react"

import { useEffect, useState } from "react"
import { Eye, EyeOff, Code, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/services/authService"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [touched, setTouched] = useState({ email: false, password: false })
  const [apiError,setApiError]=useState(" ")
 
  const dispactch = useDispatch()
  const navigate=useNavigate()

  const user = useSelector((state:RootState) => state.auth.user)
  
  const isAdmin = localStorage.getItem("adminLoggedIn")

  console.log(user,'user from adminLogin');
  console.log(isAdmin,'isadmin from adminLogin');
  
  
  useEffect(()=>{
    console.log('use effect work ayitund');
    
    if(user && isAdmin === 'true'){
        console.log('admin work ayitund');
          navigate('/admin/')
      }
  },[user,isAdmin])

  const validateEmail = (email: string) => {
    setTouched((prev) => ({ ...prev, email: true }))

    if (!email) {
      setEmailError("Email is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    setEmailError("")
    return true
  }

  const validatePassword = (password: string) => {
    setTouched((prev) => ({ ...prev, password: true }))

    if (!password) {
      setPasswordError("Password is required")
      return false
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)

    try {
        
        const response = await login(email,password, 'admin', dispactch)
        
        if(response?.status === 200){
          
            localStorage.setItem("adminLoggedIn", "true")
            
            toast.success("login success vai admin")
            navigate('/admin/')
        }else{
            setApiError(response?.data.message)
            toast.error(response?.data.message||'invalid credentials', {
                position: "top-right",
            })
        }
      // Redirect to dashboard on success
      // window.location.href = "/admin/"
    // navigate('admin/')
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-full">
            <Code className="h-8 w-8 text-white" />
          </div>
        </div>

        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
            <p className="font-bold text-sm text-red-600 ml-28">{apiError}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@codefolio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    className={`focus-visible:ring-emerald-500 ${
                      touched.email && emailError
                        ? "border-red-500 pr-10"
                        : touched.email && !emailError
                          ? "border-emerald-500 pr-10"
                          : ""
                    }`}
                    
                  />
                  {touched.email && emailError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {touched.email && !emailError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {touched.email && emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </a> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validatePassword(password)}
                    className={`pr-10 focus-visible:ring-emerald-500 ${
                      touched.password && passwordError
                        ? "border-red-500"
                        : touched.password && !passwordError
                          ? "border-emerald-500"
                          : ""
                    }`}
                    
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {touched.password && passwordError && (
                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {touched.password && !passwordError && (
                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {touched.password && passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              Not an admin?{" "}
              <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Go to user login
              </a>
            </div>
            {/* <div className="text-xs text-center text-gray-400">Codefolio Admin Portal © {new Date().getFullYear()}</div> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

