"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useMutate } from "@/hooks/useMutate"

import { useRouter } from 'next/navigation';
import {toast} from "sonner"
import Link from "next/link";
import { useAuthStore } from "@/store/authStote"
// 1. Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm({ className, ...props }) {
  const login = useAuthStore((s) => s.login)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter();

  // ✅ Use requireAuth: false for login
  const { executeAsync, isPending, error } = useMutate(
    "/api/auth/login",
    null,
    {
      method: "POST",
      requireAuth: false,
      onSuccess: (data) => {
        console.log("Login successful:", data);
        router.push('/');
        login(data);
        toast.success("Login Successful", {
          description: "You have successfully logged in.",
        });
      },
      onError: (error) => {
        console.error("Login error:", error);
        
        // Check different possible error formats
        let errorMessage = '';
        
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.error) {
          errorMessage = error.error;
        } else {
          errorMessage = 'An unexpected error occurred';
        }
        
        console.log("Processed error message:", errorMessage);
        
        // Check for invalid credentials (case insensitive)
        if (errorMessage.toLowerCase().includes('invalid credential') || 
            errorMessage.toLowerCase().includes('unauthorized') ||
            errorMessage.toLowerCase().includes('wrong password') ||
            errorMessage.toLowerCase().includes('user not found')) {
          toast.error("Invalid Credentials", {
            description: "Please check your email and password.",
          });
        } else {
          toast.error("Login Failed", {
            description: errorMessage,
          });
        }
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      console.log("Submitting login data:", data);
      await executeAsync(data);
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="text-center text-md mt-5">
        Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}