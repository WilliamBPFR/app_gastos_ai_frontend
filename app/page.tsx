"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import {toast} from "sonner"
import {
  Wallet,
  TrendingUp,
  PieChart,
  CreditCard,
  ArrowRight,
  Eye,
  EyeOff,
  Send,
} from "lucide-react"

import { authService } from "@/services/authService"
import { ApiRequestError } from "@/axiosConfig/apiRequest"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    // Handle login logic here
    try {
      // Simulate API call
      await authService.login(email, password, rememberMe).then((response) => {
        authService.saveAccessToken(response.access_token)
        setLoading(false)
        toast.success("Login successful! Redirecting...", {
          duration: 1300,
        })
        setTimeout(() => {
          router.push("/v1/dashboard")
        }, 1500);
      })
    } catch (error: any) {
      console.error("Error sending verification code:", error)
      if (error instanceof ApiRequestError && error.status != 500) {
        toast.error("Login failed", {
          description: "Email or password is incorrect. Please try again.",
          duration: 5000,
        })
      } else {
        toast.error("An unexpected error occurred. Please try again later.", {
          duration: 5000,
        })
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 3000);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Visual/Decorative */}
          <div className="relative lg:w-1/2 bg-gradient-to-br from-[#0f3433] via-[#134e4a] to-[#115e59] p-8 lg:p-12 flex flex-col justify-between min-h-[280px] lg:min-h-[580px]">
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
                Take control of your finances with smart expense tracking
              </h2>
            </div>

            {/* Feature Icons */}
            <div className="relative z-10 hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <FeatureItem icon={<TrendingUp className="w-5 h-5" />} label="Track Spending" />
                <FeatureItem icon={<PieChart className="w-5 h-5" />} label="Analytics" />
                <FeatureItem icon={<CreditCard className="w-5 h-5" />} label="Manage Cards" />
                <FeatureItem icon={<Wallet className="w-5 h-5" />} label="Budgets" />
              </div>
            </div>

            {/* Stats/Trust indicators */}
            <div className="relative z-10 hidden lg:flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Users</p>
                <p className="text-white font-semibold text-lg">2,500+</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Tracked</p>
                <p className="text-white font-semibold text-lg">$1.2M+</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Rating</p>
                <p className="text-white font-semibold text-lg">4.9/5</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
                  Welcome back
                </h1>
                <p className="text-muted-foreground">
                  Log in to manage your personal expenses
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email or Username
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-5 h-5 text-white" /> 
                      Loggin in...
                    </>
                  ) : (
                    <>
                      Log in
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Need access?</span>
                </div>
              </div>

              {/* Telegram Section */}
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create your account through Telegram
                </p>
                <Button
                  variant="outline"
                  className="w-full h-11 gap-2"
                  onClick={() => window.open("https://t.me/", "_blank")}
                >
                  <Send className="w-4 h-4" />
                  Open Telegram
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="text-emerald-300">{icon}</div>
      <span className="text-white/80 text-sm">{label}</span>
    </div>
  )
}
