import React, { useState } from "react";
import { User, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [memberID, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showResetLink, setShowResetLink] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/loginmember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          "Accept-Language": "en",
        },
        body: JSON.stringify({
          memberID: memberID.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

     if (response.ok && result.data) {
  // ✅ تسجيل الدخول ناجح
  const token = result.data;
  const payload = JSON.parse(atob(token.split('.')[1]));
  localStorage.setItem("token", token);
  localStorage.setItem("memberID", payload.nameid);
  toast.success("تم تسجيل الدخول بنجاح ✅", { position: "top-center" });
  navigate("/VoteUsers");
} else {
  let arabicMsg = "فشل تسجيل الدخول ❌";
  setShowResetLink(false); // إخفاء الرابط افتراضيًا

  if (response.status === 401) {
    arabicMsg = "الرمز السري غير صحيح";
  } else {
    const serverMsg = result.message || result.msg || result.error || "";
    if (serverMsg.includes("not found")) {
      arabicMsg = "المستخدم غير موجود";
    } else if (serverMsg.includes("incorrect") || serverMsg.includes("invalid")) {
      arabicMsg = "الرمز التعريفي أو الرمز السري غير صحيح";
    } else if (serverMsg.includes("required")) {
      arabicMsg = "جميع الحقول مطلوبة";
    } else if (serverMsg.includes("set your password")) {
      arabicMsg = "يجب تعيين الرمز السري أولاً";
      setShowResetLink(true);
      navigate("/RestAccesscode");
    }
  }

  setErrorMsg(arabicMsg);
  toast.error(arabicMsg, { position: "top-center" });
}

    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم.");
      toast.error("خطأ في الاتصال بالخادم ❌", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 text-center" style={{ maxWidth: "50rem", width: "100%", maxHeight: "1123px" }}>
        <div className="flex flex-col items-center justify-center gap-2">
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل بيانات الدخول الخاصة بك للوصول إلى منصة التصويت
          </p>
        </div>

        <Link to="/login" className="no-underline">
          <div className="flex flex-row items-start gap-2 cursor-pointer hover:opacity-80 transition">
            <ShieldCheck className="text-blue-800 w-10 h-9" />
            <span className="text-xl text-center bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition w-44">
              دخول كـ مسؤول
            </span>
          </div>
        </Link>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="text-right mt-4">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              ادخل الرمز التعريفي
            </label>
            <input
              type="text"
              value={memberID}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="اسم الرمز التعريفي"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              الرمز السري
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ادخل الرمز السري"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              
            />
          </div>

          {showResetLink && (
            <Link to="/RestAccesscode" className="no-underline">
            {/*   <p className="text-m text-blue-500 mb-6 text-right">
                تعيين الرمز السري
              </p> */}
            </Link>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="form-checkbox" />
              تذكرني
            </label>
          </div>

          <button
            type="submit"
            className="block w-full text-center bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-white text-sm text-center">
        منصة آمنة للتصويت الإلكتروني
      </div>
    </div>
  );
};

export default Login;
