import React, { useState } from "react";
import { Lock, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {Eye, EyeOff } from "lucide-react"

const ResetAccessCode = () => {
  const [memberId, setMemberId] = useState(""); // ✅ حقل الرمز الحالي
  const [newCode, setNewCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newCode !== confirmCode) {
      toast.error("كلمة الرمز السري وتأكيدها غير متطابقين.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/set-new-password`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: newCode,
          memberId: memberId.trim(), // ✅ استخدام الرمز المُدخل
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم تغيير الرمز السري بنجاح");
        navigate("/loginAsMember");
      } else {
        toast.error(result.msg || "فشل تغييرالرمز السري");
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 text-center" style={{ maxWidth: "50rem", width: "100%", maxHeight: "1123px" }}>
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/loginAsMember" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Lock />
          <h2 className="text-xl font-bold text-gray-800 mb-2">تعيين  الرمز السري</h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل الرمز التعريفي  والرمز السري جديد لحسابك.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              الرمز الحالي ( الرقم المرسل عبر البريد الكتروني)
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="أدخل الرمز التعريفي"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="text-right relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
               الرمز السري الجديد
            </label>
             <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="أدخل الرمز السري الجديد"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
           
          </div>

          <div className="text-right relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              تأكيد  الرمز السري
            </label>
       <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="أعد إدخال تأكيد الرمز السري"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          
          </div>

          <button
            type="submit"
            className="block w-full text-center bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition"
          >
            انشاء رمز السري
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-white text-sm text-center">
        منصة آمنة للتصويت الإلكتروني       
      </div>
    </div>
  );
};

export default ResetAccessCode;
