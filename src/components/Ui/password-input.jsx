import React from "react";
import { Input } from "./Input";

export const PasswordInput = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Input
        type="password"
        value={value}          // ✅ تمرير القيمة
        onChange={onChange}    // ✅ تمرير التغيير
        placeholder="أدخل كلمة المرور"
        className="text-right w-full"
       
      />
    </div>
  );
};
