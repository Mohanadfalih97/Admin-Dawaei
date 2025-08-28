import React, { useState } from "react";
import { User2, Mail, Lock, Phone } from "lucide-react";

export default function LoginCard() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    country: "IQ",
    password: "",
  });

  const countries = [
    { code: "IQ", name: "العراق", dial: "+964", flag: "🇮🇶" },
    { code: "SA", name: "السعودية", dial: "+966", flag: "🇸🇦" },
    { code: "EG", name: "مصر", dial: "+20", flag: "🇪🇬" },
  ];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#b8e0d4]">
      <div className="relative bg-white shadow-lg rounded-xl w-[350px] p-6 text-right">
        {/* العنوان */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">مرحباً بك في بورتال !</h2>
        <p className="text-gray-500 text-sm mb-6">ادخل البيانات لتسجيل الدخول</p>

        {/* حقل اسم المستخدم */}
        <div className="flex items-center border rounded-lg px-3 mb-3">
          <User2 className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full py-2 outline-none text-sm"
          />
        </div>

        {/* حقل البريد الإلكتروني */}
        <div className="flex items-center border rounded-lg px-3 mb-3">
          <Mail className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full py-2 outline-none text-sm"
          />
        </div>

        {/* حقل رقم الهاتف مع الدولة */}
        <div className="flex items-center border rounded-lg px-3 mb-3">
          <Phone className="w-5 h-5 text-gray-400 ml-2" />
          <select
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="outline-none text-sm bg-transparent px-1"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <input
            type="tel"
            placeholder="رقم الهاتف"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full py-2 outline-none text-sm"
          />
        </div>

        {/* كلمة المرور */}
        <div className="flex items-center border rounded-lg px-3 mb-5">
          <Lock className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full py-2 outline-none text-sm"
          />
        </div>

        {/* زر تسجيل الدخول */}
        <button
          className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold cursor-pointer hover:bg-gray-500 transition"
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
}
