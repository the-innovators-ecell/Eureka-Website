"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Eye, EyeOff, Rocket, CheckCircle2, Circle, FileText } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import TermsModal from "@/components/auth/TermsModal";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      year: "",
      course: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  // eslint-disable-next-line
  const watchPassword = watch("password");

  const hasUppercase = /[A-Z]/.test(watchPassword || "");
  const hasLowercase = /[a-z]/.test(watchPassword || "");
  const hasNumber = /[0-9]/.test(watchPassword || "");
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(watchPassword || "");
  const hasMinLength = (watchPassword || "").length >= 8;

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        toast.error(responseData.error || "Failed to register. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#000000] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#FFDF00]/5 rounded-full blur-[120px]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl p-8 rounded-2xl backdrop-blur-xl bg-[#111111]/80 border border-[#D4AF37]/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFDF00] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            <Rocket className="text-black w-7 h-7" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] bg-clip-text text-transparent tracking-wide">
          Create Account
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
          Join IdeaForge 2026 and unleash your creativity
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
              />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit number"
                {...register("phone")}
                className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
              />
              {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-300">Year of Study</Label>
              <select
                id="year"
                {...register("year")}
                className="flex h-12 w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50 text-white transition-colors"
              >
                <option value="" className="bg-[#111] text-gray-400">Select Year</option>
                <option value="1" className="bg-[#111]">1st Year</option>
                <option value="2" className="bg-[#111]">2nd Year</option>
                <option value="3" className="bg-[#111]">3rd Year</option>
                <option value="4" className="bg-[#111]">4th Year</option>
                <option value="5" className="bg-[#111]">5th Year (Dual Degree)</option>
              </select>
              {errors.year && <p className="text-red-400 text-xs">{errors.year.message}</p>}
            </div>

            {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="course" className="text-gray-300">Course / Branch</Label>
              <Input
                id="course"
                type="text"
                placeholder="B.Tech Computer Science"
                {...register("course")}
                className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
              />
              {errors.course && <p className="text-red-400 text-xs">{errors.course.message}</p>}
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github" className="text-gray-300">GitHub Profile (Optional)</Label>
              <Input
                id="github"
                type="url"
                placeholder="https://github.com/johndoe"
                {...register("github")}
                className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
              />
              {errors.github && <p className="text-red-400 text-xs">{errors.github.message}</p>}
            </div>

            {/* LinkedIn */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedin" className="text-gray-300">
                LinkedIn Profile <span className="text-[#D4AF37] font-bold">*</span>
              </Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/johndoe"
                {...register("linkedin")}
                className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
              />
              {errors.linkedin && <p className="text-red-400 text-xs">{errors.linkedin.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  {...register("password")}
                  className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 pr-10 transition-colors rounded-lg px-4 py-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
              
              {/* Password Requirements Indicator */}
              <div className="mt-2 space-y-1 text-xs">
                <p className="text-gray-400 font-medium mb-1">Password requirements:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className={`flex items-center gap-1 ${hasMinLength ? "text-green-400" : "text-gray-500"}`}>
                    {hasMinLength ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />} 8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasUppercase ? "text-green-400" : "text-gray-500"}`}>
                    {hasUppercase ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />} Uppercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasLowercase ? "text-green-400" : "text-gray-500"}`}>
                    {hasLowercase ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />} Lowercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? "text-green-400" : "text-gray-500"}`}>
                    {hasNumber ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />} Number
                  </span>
                  <span className={`flex items-center gap-1 ${hasSpecial ? "text-green-400" : "text-gray-500"}`}>
                    {hasSpecial ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />} Special Char
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 pr-10 transition-colors rounded-lg px-4 py-6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Terms & Conditions Checkbox & Learn More Button */}
          <div className="p-4 rounded-xl bg-[#000000] border border-[#D4AF37]/30 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  {...register("termsAccepted")}
                  className="w-4 h-4 mt-1 rounded border-white/20 bg-[#111111] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0 cursor-pointer accent-[#D4AF37]"
                />
                <Label htmlFor="termsAccepted" className="text-xs sm:text-sm text-gray-200 cursor-pointer leading-normal">
                  I agree to the <span className="text-[#D4AF37] font-semibold">Terms & Conditions</span> applied for participants.
                </Label>
              </div>

              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-bold uppercase tracking-wider shrink-0"
              >
                <FileText size={14} /> Learn More
              </button>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-400 text-xs pl-7">{errors.termsAccepted.message}</p>
            )}
          </div>

          <InteractiveHoverButton
            type="submit"
            disabled={isLoading}
            text={isLoading ? "Creating Account..." : "Create Account"}
            className="w-full bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black transition-all duration-300 mt-6 h-12 uppercase tracking-widest text-sm"
          />
        </form>

        {/* Terms & Conditions Modal */}
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#D4AF37] hover:text-[#FFDF00] hover:underline transition-colors font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
