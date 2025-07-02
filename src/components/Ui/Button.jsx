// src/components/ui/button.jsx
import React from "react";

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    };

    const sizes = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-sm",
      icon: "w-9 h-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
