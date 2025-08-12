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
import { toast } from 'sonner';
import Link from "next/link"
import { useAuthStore } from "@/store/authStote"
// 1. Define validation schema with Zod
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function RegisterForm({ className, ...props }) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login)

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // ✅ Use requireAuth: false to avoid sending token
  const { executeAsync, isPending, error } = useMutate(
    "/api/users",
    null,
    {
      method: "POST",
      requireAuth: false,
      onSuccess: (data) => {
        console.log("Registration successful:", data);

        // ✅ Add success toast
        toast.success("Registration Successful!", {
          description: "Your account has been created. Please sign in.",
        });

        // Redirect to sign-in page after a short delay (optional)
        setTimeout(() => {
          router.push('/sign-in');
        }, 1500); // 1.5 second delay to show the toast
      },
      onError: (error) => {
        console.error("Registration error:", error.message);

        // ✅ Add error toast with specific error handling
        const errorMessage = error?.message || "Registration failed";

        if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exist')) {
          toast.error("Email Already Exists", {
            description: "This email is already registered. Please use a different email or sign in.",
          });
        } else if (errorMessage.toLowerCase().includes('validation')) {
          toast.error("Validation Error", {
            description: "Please check your input and try again.",
          });
        } else if (errorMessage.toLowerCase().includes('password')) {
          toast.error("Password Error", {
            description: "Password doesn't meet requirements.",
          });
        } else {
          toast.error("Registration Failed", {
            description: errorMessage,
          });
        }
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      console.log("Submitting registration data:", data);
      await executeAsync(data);
    } catch (err) {
      console.error("Registration failed:", err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Register with your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error.message}
                </div>
              )}
            </form>

          </Form>

        </CardContent>
        <div className="text-center text-md mt-5">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}