"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { resetPassword } from "@/services/authService"
import { Lock, Eye, EyeOff, Code } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be less than 20 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be less than 20 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const token = urlParams.get("token")

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid or expired token")
      return
    }

    setLoading(true)
    try {
      const response = await resetPassword(token, data.confirmPassword)
      if (response.status === 200) {
        toast.success("Password reset successfully. You can now log in.", {
          position: "top-right",
        })
        navigate("/")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.", {
        position: "top-right",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#20B486]/20 via-white to-[#20B486]/10">
      <div className="w-full max-w-md p-2">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code className="w-8 h-8 text-[#20B486]" />
            <span className="text-2xl font-bold text-[#20B486]">Codefolio</span>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-2">
            <div className="mx-auto bg-[#20B486]/10 p-3 rounded-full">
              <Lock className="w-6 h-6 text-[#20B486]" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">Enter a new password for your Codefolio account</CardDescription>
          </CardHeader>

          {error && (
            <div className="mx-6 mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your new password"
                    className={cn(
                      "pr-10 transition-all duration-200",
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#20B486]/50",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#20B486] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Confirm your new password"
                    className={cn(
                      "pr-10 transition-all duration-200",
                      errors.confirmPassword
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "focus-visible:ring-[#20B486]/50",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#20B486] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#20B486] hover:bg-[#20B486]/90 text-white transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <a href="/" className="text-[#20B486] hover:underline font-medium transition-colors">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Codefolio. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

