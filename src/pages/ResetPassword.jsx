import React, { useState } from "react";
import { User, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { PasswordInput } from "../components/Ui/password-input";
import { toast } from "react-toastify";
import { FaExclamationCircle } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // إعادة تعيين الخطأ قبل البدء

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("❌ لم يتم العثور على البريد الإلكتروني.");
      return;
    }

    try {
      // 1. جلب المعرف
      const userIdResponse = await fetch(
        `${process.env.REACT_APP_API_URL}auth/get-all-users?Email=${encodeURIComponent(userEmail)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": "en",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const userIdResult = await userIdResponse.json();

      if (!userIdResponse.ok || !userIdResult.data?.items?.length) {
        toast.error("❌ لم يتم العثور على المستخدم.");
        return;
      }

      const userId = userIdResult.data.items[0].id;

      // 2. تغيير كلمة المرور
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/reset-password/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "en",
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await response.json();

      // ترجمة أخطاء التحقق
      if (result.errors) {
        const messages = [];

        for (const key in result.errors) {
          const errorArray = result.errors[key];

          errorArray.forEach((msg) => {
            const lowerMsg = msg.toLowerCase();

            if (lowerMsg.includes("newpassword") && lowerMsg.includes("minimum") && lowerMsg.includes("maximum")) {
              messages.push("كلمة المرور يجب أن تكون بين 6 و 30 حرفًا.");
            } else {
              messages.push(msg);
            }
          });
        }

        // عرض أول رسالة كخطأ رئيسي
        setErrorMsg(messages[0]);
        return;
      }

   if (response.ok && result.msg === "Password reset successful.") {
  toast.success(" تم إعادة تعيين كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول.");
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
      <div className="w-1/2 bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/login" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2">إعادة تعيين كلمة المرور</h2>
          <p className="text-sm text-gray-500 mb-6">
            قم بإدخال كلمة المرور الجديدة
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              كلمة المرور الجديدة
            </label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {errorMsg && (
              <span className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <FaExclamationCircle className="text-red-600" /> {errorMsg}
              </span>
            )}
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
