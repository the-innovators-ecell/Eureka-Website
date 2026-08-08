"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validations";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        name: data.name,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.toLowerCase().includes("blocked")) {
          toast.error("Your account has been blocked. Please contact support.");
        } else {
          toast.error("Invalid credentials. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!");
      // After sign in, fetch session to determine redirect based on role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FFDF00]/5 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] left-[60%] w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-[#111111]/80 border border-[#D4AF37]/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFDF00] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Sparkles className="text-black w-6 h-6" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] bg-clip-text text-transparent tracking-wide">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Sign in to IdeaForge 2026 to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your registered name"
              {...register("name")}
              className="bg-[#111111] border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder:text-gray-500 transition-colors rounded-lg px-4 py-6"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <InteractiveHoverButton
            type="submit"
            disabled={isLoading}
            text={isLoading ? "Signing In..." : "Sign In"}
            className="w-full bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black transition-all duration-300 h-12 uppercase tracking-widest text-sm"
          />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#D4AF37] hover:text-[#FFDF00] hover:underline transition-colors font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
