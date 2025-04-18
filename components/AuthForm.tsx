"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import FormInput from "./FormInput";

type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use the appropriate schema based on form type
  const formSchema = type === "login" ? loginSchema : registerSchema;

  // Define the form with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "register" ? { name: "", confirmPassword: "" } : {}),
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Here you would implement your authentication logic
      // For example, calling an API endpoint to login or register

      // Simulate API call
      console.log(values);

      // Show success message
      toast.success(
        type === "login"
          ? "Logged in successfully"
          : "Account created successfully",
        {
          description:
            type === "login"
              ? "Welcome back to your language assistant."
              : "Your account has been created. You can now log in.",
        }
      );

      // Redirect after successful authentication
      if (type === "login") {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      // Show error message
      toast.error("Authentication failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {type === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-muted-foreground">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Enter your information to create an account"}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {type === "register" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormInput
                    type="email"
                    placeholder="example@example.com"
                    {...field}
                  />
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
                  <FormInput
                    variant="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "register" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <FormInput
                      variant="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : type === "login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        {type === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
