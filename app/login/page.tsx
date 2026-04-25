"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Shield, Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async () => {
    if (phoneNumber.length >= 10) {
      setIsLoading(true)
      // Simulate OTP send
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
      setStep("otp")
      setCountdown(30)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      setIsLoading(true)
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      localStorage.setItem("terraloop_phone", phoneNumber)
      setIsLoading(false)
      router.push("/name")
    }
  }

  const handleResendOtp = () => {
    if (countdown === 0) {
      setCountdown(30)
      // Simulate resend
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <button
        onClick={() => step === "otp" ? setStep("phone") : router.push("/language")}
        className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/30 bg-card/50 backdrop-blur-sm transition-all hover:border-[#d4af37] hover:bg-card"
      >
        <ArrowLeft className="h-5 w-5 text-[#d4af37]" />
      </button>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md px-4 py-20">
        {step === "phone" ? (
          <>
            {/* Phone Number Step */}
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-card shadow-lg">
                <Phone className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h1 
                className="mb-2 text-3xl font-bold text-magical"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Enter Your Number
              </h1>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: 'Lora, serif' }}
              >
                We&apos;ll send you a magical verification code
              </p>
            </div>

            <Card className="card-magical mb-6">
              <CardContent className="p-6">
                <label 
                  className="mb-2 block text-sm font-medium text-foreground"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Phone Number
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 items-center justify-center rounded-lg border border-border bg-secondary px-4">
                    <span className="text-lg font-medium text-foreground">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="h-14 flex-1 rounded-lg border border-border bg-input px-4 text-lg font-medium text-foreground placeholder:text-muted-foreground focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                    style={{ fontFamily: 'Lora, serif' }}
                  />
                </div>
              </CardContent>
            </Card>

            <button
              onClick={handleSendOtp}
              disabled={phoneNumber.length < 10 || isLoading}
              className={`group relative w-full overflow-hidden rounded-full border-2 py-4 text-lg font-semibold transition-all duration-300 ${
                phoneNumber.length >= 10 && !isLoading
                  ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#b8962f] text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
                  : 'border-border bg-secondary text-muted-foreground cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Send Verification Code
                  <Sparkles className="h-5 w-5" />
                </span>
              )}
            </button>
          </>
        ) : (
          <>
            {/* OTP Step */}
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-card shadow-lg">
                <Shield className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h1 
                className="mb-2 text-3xl font-bold text-magical"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Verify OTP
              </h1>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: 'Lora, serif' }}
              >
                Enter the 6-digit code sent to +91 {phoneNumber}
              </p>
            </div>

            <Card className="card-magical mb-6">
              <CardContent className="p-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-14 w-12 rounded-lg border border-border bg-input text-center text-2xl font-bold text-foreground focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                    />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in <span className="font-semibold text-[#d4af37]">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-sm font-medium text-[#d4af37] hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.join("").length < 6 || isLoading}
              className={`group relative w-full overflow-hidden rounded-full border-2 py-4 text-lg font-semibold transition-all duration-300 ${
                otp.join("").length === 6 && !isLoading
                  ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#b8962f] text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
                  : 'border-border bg-secondary text-muted-foreground cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Verify & Continue
                  <Sparkles className="h-5 w-5" />
                </span>
              )}
            </button>
          </>
        )}

        {/* Step indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-2 w-8 rounded-full bg-[#d4af37]" />
          <div className="h-2 w-8 rounded-full bg-[#d4af37]" />
          <div className="h-2 w-8 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}
