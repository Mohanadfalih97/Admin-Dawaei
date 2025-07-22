import React, { useState } from "react";
import { Input } from "./Input";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="أدخل كلمة المرور"
        className="text-right w-full "
        dir="rtl"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute left-2  top-1/2 transform -translate-y-1/2 text-gray-600"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
