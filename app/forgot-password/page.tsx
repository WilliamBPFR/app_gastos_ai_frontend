"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {toast} from "sonner"
import { ApiRequestError } from "@/axiosConfig/apiRequest"
import { useRouter } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Wallet,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  forgotPasswordService
} from "@/services/forgotPasswordService"
import { set } from "date-fns"

type Step = 1 | 2 | 3

const steps = [
  { id: 1, label: "Email", icon: Mail },
  { id: 2, label: "Verification", icon: ShieldCheck },
  { id: 3, label: "New Password", icon: KeyRound },
] as const

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleStepTransition = (nextStep: Step) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(nextStep)
      setIsTransitioning(false)
    }, 150)
  }

  const handleSendCode = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      setCountdown(60)
      await forgotPasswordService.requestPasswordReset(email)
      handleStepTransition(2)
    } catch (error) {
      console.error("Error sending verification code:", error)
      if (error instanceof ApiRequestError && error.status === 404) {
        toast.error("Email not found",
          {
            description: "Please check the email address and try again.",
            duration: 3000,
          }
        )
      } else {
        toast.error("Failed to send verification code",
          {
            description: "Please check your email and try again.",
          }
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate API call to verify code
      await forgotPasswordService.requestVerifyCode(email, otp)
      handleStepTransition(3)
    } catch (error) {
      console.error("Error sending verification code:", error)
      if (error instanceof ApiRequestError && error.status === 404 || error instanceof ApiRequestError && error.status === 400) {
        toast.error("Invalid verification code",
          {
            description: "Please check the code and try again. If you didn't receive it, you can resend the code.",
            duration: 3000,
          }
        )
      } else {
        toast.error("Failed to verify code",
          {
            description: "We couldn't verify the code. Please check it and try again.",
          }
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    // Handle password reset
    try{
      forgotPasswordService.requestPasswordResetConfirmation(email, newPassword)
      toast.success("Password reset successful",
        {
          description: "You can now log in with your new password.",
          duration: 3000,
        }
      )
      setTimeout(() => {
        router.push("/")
      }, 3250)

    } catch(error){
      console.error("Error resetting password:", error)
      toast.error("Failed to reset password",
        {
          description: "Please try again later.",
        }
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = () => {
    if (countdown === 0) {
      setCountdown(60)
      try{
        forgotPasswordService.requestPasswordReset(email)
        toast.success("Verification code resent",
          {
            description: "Please check your email for the new code.",
          }
        )
      } catch(error){
        console.error("Error resending verification code:", error)
        if (error instanceof ApiRequestError && error.status === 404) {
          toast.error("Email not found",
            {
              description: "Please check the email address and try again.",
              duration: 3000,
            }
          )
        } else {  
          toast.error("Failed to resend verification code",
            {
              description: "Please check your email and try again.",
            }
          )
        }
      // Simulate resending code
      }
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setOtp("");

    }
    
    if (currentStep > 1) {
      handleStepTransition((currentStep - 1) as Step)
    }


  }

  // Password validation
  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "Contains number", met: /\d/.test(newPassword) },
  ]

  const passwordStrength = passwordRequirements.filter((r) => r.met).length
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Visual/Decorative */}
          <div className="relative lg:w-1/2 bg-gradient-to-br from-[#0f3433] via-[#134e4a] to-[#115e59] p-8 lg:p-12 flex flex-col justify-between min-h-[200px] lg:min-h-[620px]">
            {/* Decorative patterns */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Abstract wave lines */}
              <svg
                className="absolute bottom-0 left-0 w-full h-full opacity-10"
                viewBox="0 0 400 400"
                fill="none"
              >
                <path
                  d="M0 300 Q100 250 200 280 T400 260"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M0 320 Q100 270 200 300 T400 280"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M0 340 Q100 290 200 320 T400 300"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
              {/* Glowing orbs */}
              <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="absolute bottom-32 left-10 w-24 h-24 rounded-full bg-teal-300/15 blur-xl" />
              <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-cyan-400/10 blur-lg" />
            </div>

            {/* Logo and Brand */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">Gastos Personales</span>
              </div>
              <h2 className="text-white/90 text-xl lg:text-2xl font-light mt-6 lg:mt-8 leading-relaxed text-balance">
                Secure account recovery in just a few steps
              </h2>
            </div>

            {/* Security Features */}
            <div className="relative z-10 hidden lg:block">
              <div className="space-y-4">
                <SecurityFeature
                  icon={<ShieldCheck className="w-5 h-5" />}
                  label="Secure verification"
                  description="6-digit code sent to your email"
                />
                <SecurityFeature
                  icon={<KeyRound className="w-5 h-5" />}
                  label="Strong encryption"
                  description="Your password is securely hashed"
                />
                <SecurityFeature
                  icon={<Mail className="w-5 h-5" />}
                  label="Email confirmation"
                  description="Verify your identity safely"
                />
              </div>
            </div>

            {/* Help text */}
            <div className="relative z-10 hidden lg:block mt-8 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Need help? Contact us through{" "}
                <a href="https://t.me/" className="text-emerald-300 hover:text-emerald-200 transition-colors">
                  Telegram
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Multi-step Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
            {/* Stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  const isCompleted = currentStep > step.id
                  const isActive = currentStep === step.id

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2",
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isActive
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-muted border-border text-muted-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium mt-2 transition-colors duration-300",
                            isActive || isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div className="flex-1 h-0.5 mx-2 mb-6">
                          <div
                            className={cn(
                              "h-full transition-all duration-500",
                              currentStep > step.id
                                ? "bg-primary"
                                : "bg-border"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Content with Transition */}
            <div
              className={cn(
                "flex-1 flex flex-col justify-center transition-all duration-150",
                isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              )}
            >
              <div className="max-w-sm mx-auto w-full">
                {/* Step 1: Email */}
                {currentStep === 1 && (
                  <form onSubmit={handleSendCode} className="space-y-6">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
                        Forgot password?
                      </h1>
                      <p className="text-muted-foreground">
                        Enter your email and we&apos;ll send you a verification code.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={loading || email.trim() === ""}
                    >
                      {loading && currentStep === 1 ? (
                        <>
                          <Spinner className="mr-2 size-4" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send code
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                      </Link>
                    </div>
                  </form>
                )}

                {/* Step 2: Verification */}
                {currentStep === 2 && (
                  <form onSubmit={handleVerifyCode} className="space-y-6">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
                        Check your email
                      </h1>
                      <p className="text-muted-foreground">
                        We sent a 6-digit verification code to{" "}
                        <span className="font-medium text-foreground">{email}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Verification code</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={setOtp}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-11 h-12 text-lg" />
                            <InputOTPSlot index={1} className="w-11 h-12 text-lg" />
                            <InputOTPSlot index={2} className="w-11 h-12 text-lg" />
                            <InputOTPSlot index={3} className="w-11 h-12 text-lg" />
                            <InputOTPSlot index={4} className="w-11 h-12 text-lg" />
                            <InputOTPSlot index={5} className="w-11 h-12 text-lg" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground">Didn&apos;t receive it?</span>
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={countdown > 0}
                        className={cn(
                          "inline-flex items-center gap-1 font-medium transition-colors",
                          countdown > 0
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-primary hover:text-primary/80"
                        )}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend code
                        {countdown > 0 && (
                          <span className="text-muted-foreground">({countdown}s)</span>
                        )}
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={otp.length !== 6 || loading}
                    >
                       {loading && currentStep === 2 ? (
                        <>
                          <Spinner className="mr-2 size-4" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify code
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: New Password */}
                {currentStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
                        Create new password
                      </h1>
                      <p className="text-muted-foreground">
                        Choose a new password for your account.
                      </p>
                    </div>

                    {/* New Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium">
                        New password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-11 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors",
                                passwordStrength >= level
                                  ? passwordStrength <= 1
                                    ? "bg-destructive"
                                    : passwordStrength <= 2
                                      ? "bg-orange-500"
                                      : passwordStrength <= 3
                                        ? "bg-yellow-500"
                                        : "bg-primary"
                                  : "bg-border"
                              )}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {passwordRequirements.map((req) => (
                            <div
                              key={req.label}
                              className={cn(
                                "flex items-center gap-1.5 text-xs transition-colors",
                                req.met ? "text-primary" : "text-muted-foreground"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-3.5 h-3.5 rounded-full flex items-center justify-center",
                                  req.met ? "bg-primary" : "bg-muted"
                                )}
                              >
                                {req.met && <Check className="w-2 h-2 text-primary-foreground" />}
                              </div>
                              {req.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={cn(
                            "h-11 pr-10",
                            confirmPassword.length > 0 && !passwordsMatch && "border-destructive"
                          )}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && !passwordsMatch && (
                        <p className="text-xs text-destructive">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={passwordStrength < 4 || !passwordsMatch || loading}
                    >
                      {loading && currentStep === 3 ? (
                        <>
                          <Spinner className="mr-2 size-4" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          Reset password
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SecurityFeature({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode
  label: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="text-emerald-300 mt-0.5">{icon}</div>
      <div>
        <span className="text-white/90 text-sm font-medium block">{label}</span>
        <span className="text-white/60 text-xs">{description}</span>
      </div>
    </div>
  )
}
