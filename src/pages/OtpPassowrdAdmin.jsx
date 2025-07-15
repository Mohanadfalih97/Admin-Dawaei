import React, { useState } from "react";
import { User, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "../components/Ui/Alert";
// import { toast } from "react-toastify";
import OtpInput from "react-otp-input"; // ✅ استيراد


const OtpVerification = () => {
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMsg("المعلومات غير مكتملة. الرجاء تسجيل الدخول أولاً.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "en",
        },
        body: JSON.stringify({
          email,
          otpCode, // ✅ يجب أن يكون المفتاح اسمه otpCode وليس otp فقط
        }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/ResetPassword");
      } else {
        setErrorMsg(result.message || "رمز التحقق غير صحيح أو منتهي الصلاحية.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMsg("حدث خطأ أثناء التحقق من الرمز.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-1/2 bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/login" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2">رمز التحقق</h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
          </p>
        </div>

        {errorMsg && (
          <Alert variant="destructive" className="text-right">
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleVerifyOtp}>
        <div className="flex justify-center">
            <OtpInput
              value={otpCode}
              onChange={setOtpCode}
              numInputs={6}
              isInputNum
              shouldAutoFocus
              containerStyle={{ direction: "ltr", gap: "0.5rem" }}
              inputStyle={{
                width: "3rem",
                height: "3rem",
                fontSize: "1.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #cbd5e0",
                textAlign: "center",
              }}
            />
          </div>

          <button
            type="submit"
            className="block w-full text-center bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition"
          >
            تحقق من الرمز
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-white text-sm text-center">
        منصة آمنة للتصويت الإلكتروني خاصة بمجلس إدارة مجلس تطوير القطاع الخاص
      </div>
    </div>
  );
};

export default OtpVerification;
