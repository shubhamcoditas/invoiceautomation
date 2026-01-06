import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Shield, Plane, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EAAgentSignInProps {
  onSignInSuccess: () => void;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
const validateEmail = (email: string): boolean => {
  if (!email.trim()) {
    return false;
  }
  return emailRegex.test(email);
};

// Validate OTP (6 digits)
const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export function EAAgentSignIn({ onSignInSuccess }: EAAgentSignInProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      // Clear error when user starts typing
      if (otpError) {
        setOtpError("");
      }
    }
  };

  const handleSendOTP = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate captcha
    if (!captchaVerified) {
      toast({
        title: "Verification Required",
        description: "Please complete the CAPTCHA verification",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOTP(true);
    setEmailError("");

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsSendingOTP(false);
      setShowOTP(true);
      toast({
        title: "OTP Sent",
        description: `A 6-digit OTP has been sent to ${email}`,
      });
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    // Validate OTP
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (!validateOTP(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifyingOTP(true);
    setOtpError("");

    // Simulate API call to verify OTP
    // For demo purposes, accept any 6-digit OTP
    setTimeout(() => {
      setIsVerifyingOTP(false);
      toast({
        title: "Sign In Successful",
        description: "Welcome! Redirecting to download page...",
      });
      // Store sign-in state in localStorage
      localStorage.setItem("ea_agent_signed_in", "true");
      localStorage.setItem("ea_agent_email", email);
      // Clear old agent-specific data
      localStorage.removeItem("ea_agent_sl_code");
      localStorage.removeItem("ea_agent_gstn");
      localStorage.removeItem("ea_agent_signed_up");
      localStorage.removeItem("ea_agent_username");
      onSignInSuccess();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!showOTP) {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FBEAEC] via-[#FBEAEC] to-[#FBEAEC] dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="w-full max-w-md space-y-5 -mt-16">
        {/* Emirates Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D71921] to-[#B3131B] rounded-xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#D71921] to-[#B3131B] p-4 rounded-xl shadow-xl">
                <Plane className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Emirates Airlines
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-1">
            Invoice Downloader Portal
          </p>
          <p className="text-sm text-[#D71921] dark:text-[#D71921] font-semibold">
            Agent Login
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-2 border-[#D71921]/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#D71921] to-[#B3131B] text-white rounded-t-lg py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Sign In</CardTitle>
                <CardDescription className="text-white/90 text-sm mt-1">
                  {showOTP ? "Enter the OTP sent to your email" : "Enter your email to continue"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-6">
            {!showOTP ? (
              // Email Input Step
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    className={cn(
                      "h-12 px-4 border-2 ea-input-focus text-base",
                      emailError && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                    disabled={isSendingOTP}
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{emailError}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    We'll send a 6-digit OTP to this email address
                  </p>
                </div>

                {/* Dummy CAPTCHA */}
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800/50 border-2 border-[#E6E6E6] dark:border-gray-700 rounded-lg">
                  <Checkbox
                    id="captcha"
                    checked={captchaVerified}
                    onCheckedChange={(checked) => setCaptchaVerified(checked === true)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                        <CheckCircle2 className={cn(
                          "h-6 w-6 transition-all",
                          captchaVerified ? "text-green-600" : "text-gray-400"
                        )} />
                      </div>
                      <div>
                        <Label htmlFor="captcha" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          I'm not a robot
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {captchaVerified ? "Verification complete" : "Click to verify"}
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      reCAPTCHA
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || !email.trim() || !captchaVerified}
                  className="w-full h-12 bg-gradient-to-r from-[#D71921] to-[#B3131B] hover:from-[#B3131B] hover:to-[#D71921] text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold"
                >
                  {isSendingOTP ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // OTP Input Step
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Enter OTP *
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={handleOTPChange}
                    onKeyPress={handleKeyPress}
                    maxLength={6}
                    className={cn(
                      "h-14 text-center text-2xl font-mono tracking-[0.5em] border-2 focus:border-[#D71921] focus:ring-[#D71921]/20",
                      otpError && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                    disabled={isVerifyingOTP}
                  />
                  {otpError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{otpError}</p>
                  )}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      OTP sent to: <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span>
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setShowOTP(false);
                        setOtp("");
                        setOtpError("");
                        setCaptchaVerified(false);
                      }}
                      className="h-auto p-0 text-[#D71921] hover:text-[#B3131B] font-medium"
                    >
                      Change Email
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isVerifyingOTP || !otp.trim() || otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-[#D71921] to-[#B3131B] hover:from-[#B3131B] hover:to-[#D71921] text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold"
                >
                  {isVerifyingOTP ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to Emirates Airlines terms and conditions
        </p>
      </div>
    </div>
  );
}
