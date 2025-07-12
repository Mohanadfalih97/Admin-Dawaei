import React, { useState } from "react";
import { User, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordInput } from "../components/Ui/password-input";
import { Alert, AlertTitle, AlertDescription } from "../components/Ui/Alert";

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // تأكد أنك خزّنت userId عند تسجيل الدخول

    if (!token || !userId) {
      setErrorMsg("الرجاء تسجيل الدخول أولاً.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/reset-password/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.statusCode === 200) {
        navigate("/login");
      } else {
        setErrorMsg(result.msg || "فشل في تغيير كلمة المرور.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800"
      style={{ direction: "rtl" }}
    >
      <div className="w-1/2  bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/login" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2">إعادة تعيين كلمة المرور</h2>
          <p className="text-sm text-gray-500 mb-6">
            قم بإدخال كلمة المرور الحالية والجديدة
          </p>
        </div>

      {errorMsg && (
  <Alert variant="destructive" className="text-right">
    <AlertTitle>خطأ</AlertTitle>
    <AlertDescription>{errorMsg}</AlertDescription>
  </Alert>
)}

        <form className="space-y-4" onSubmit={handleReset}>
          <div className="text-right">
            <label className="block mb-1 text-sm font-semibol  ْ ~ْ text-gray-700">
              كلمة المرور الحالية
            </label>
            <PasswordInput
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              كلمة المرور الجديدة
            </label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="block w-full text-center bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition"
          >
            حفظ كلمة المرور الجديدة
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-white text-sm text-center">
        منصة آمنة للتصويت الإلكتروني خاصة بمجلس إدارة مجلس تطوير القطاع الخاص
      </div>
    </div>
  );
};

export default ResetPassword;
