"use client";

import type React from "react";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "text" | "password";
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "text", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // If variant is password, we handle the type internally
    const inputType =
      variant === "password"
        ? showPassword
          ? "text"
          : "password"
        : type || "text";

    return (
      <div className="relative">
        <Input
          type={inputType}
          className={cn(
            "transition-all duration-300 rounded-lg pr-10",
            variant === "password" && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {variant === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <Eye
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
