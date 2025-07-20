import React, { useState } from "react";
import { Home, MailCheck, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "../components/Ui/Alert";
import OtpInput from "react-otp-input";

const ResetPasswordStepper = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userEmail", email);
        setStep(2);
      } else {
        setErrorMsg(result.detail || "فشل إرسال رمز التحقق.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("حدث خطأ أثناء إرسال رمز التحقق.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      setErrorMsg("المعلومات غير مكتملة. يرجى إدخال البريد أولاً.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
        },
        body: JSON.stringify({ email: storedEmail, otpCode }),
      });

      const result = await response.json();

      if (response.ok) {

        navigate("/ResetPassword");
      } else {
        setErrorMsg(result.message || "رمز التحقق غير صحيح أو منتهي.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-1/2 bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/login" className="hover:text-blue-900 transition"><Home /></Link>
        </div>

        {/* ✅ Step Indicator */}
        <div className="flex justify-center mb-6 gap-4" >
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
            <MailCheck /> <span>البريد الإلكتروني</span>
          </div>
<div>←</div>
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
            <ShieldCheck /> <span>رمز التحقق</span>
          </div>
        </div>

        {errorMsg && (
          <Alert variant="destructive" className="text-right mb-4">
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendEmail}>
            <label className="block text-right font-semibold text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full py-2 px-4 border rounded-lg text-right"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition">
              إرسال رمز التحقق
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600 mb-2">أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</p>
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
            <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition">
              تحقق من الرمز
            </button>
          </form>
        )}
      </div>

      <div className="absolute bottom-6 text-white text-sm text-center">
        منصة آمنة للتصويت الإلكتروني خاصة بمجلس إدارة مجلس تطوير القطاع الخاص
      </div>
    </div>
  );
};

export default ResetPasswordStepper;
