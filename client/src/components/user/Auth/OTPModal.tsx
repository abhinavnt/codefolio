
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, ArrowRight } from "lucide-react";
import { resendOtp } from "@/services/authService";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  email?: string;
}

export default function OTPModal({
  isOpen,
  onClose,
  onVerify,
  email = "your@email.com",
}: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Reset timer and states when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(60);
      setCanResend(false);
      setError(null);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus(); // Enhance UX by focusing the first input
    }
  }, [isOpen]);

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const success = await onVerify(otpString);
      if (!success) {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await resendOtp(email)
      
      
      setTimeLeft(60); 
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] h-[400px] max-w-md overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-1"></div>
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter verification code
                </label>
                {error && (
                  <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20B486] focus:border-transparent"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-[#20B486] hover:underline font-medium"
                  >
                    {isResending ? "Resending..." : "Resend Code"}
                  </button>
                ) : (
                  <p className="text-gray-500">
                    Resend code in{" "}
                    <span className="font-medium">{timeLeft}s</span>
                  </p>
                )}
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || otp.join("").length !== 6}
                  className="bg-[#20B486] text-white px-6 py-2 rounded-md hover:bg-[#1a9d75] transition-colors disabled:bg-gray-400 w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}