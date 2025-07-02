import React, { useState } from "react";
import { User,Home } from "lucide-react";
import { useNavigate , Link } from "react-router-dom";
import { PasswordInput } from "../components/Ui/password-input";
import { toast } from "react-toastify";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg] = useState("");
  const navigate = useNavigate();

const translateMessage = (msg) => {
  if (!msg) return "حدث خطأ غير متوقع";

  const lowerMsg = msg.toLowerCase();

  if (lowerMsg.includes("invalid") || lowerMsg.includes("incorrect")) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  }

  if (lowerMsg.includes("not found")) {
    return "المستخدم غير موجود";
  }

  if (lowerMsg.includes("required")) {
    return "جميع الحقول مطلوبة";
  }

  if (lowerMsg.includes("unauthorized")) {
    return "غير مصرح بالدخول، يرجى التحقق من البيانات";
  }

  if (lowerMsg.includes("password must")) {
    return "كلمة المرور لا تلبي المتطلبات الأمنية";
  }

  return msg; // إذا لم يتم التعرف على الرسالة، يتم عرضها كما هي
};

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

if (response.ok && result.data?.token) {
  localStorage.setItem("token", result.data.token);
  localStorage.setItem("userId", result.data.userId);
  localStorage.setItem("userName", result.data.name);
  localStorage.setItem("userRole", result.data.role);

  toast.success("تم تسجيل الدخول بنجاح ");
  navigate("/dashboard");
} else {
  const errorMessage = translateMessage(result.msg || result.message || result.error);
  toast.error(errorMessage);
}

  } catch (error) {
    console.error("Login error:", error);
    toast.error("حدث خطأ أثناء الاتصال بالخادم.");
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800"
      style={{ direction: "rtl" }}
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 text-center"
       style={{ maxWidth: "50rem", width: "100%", maxHeight: "1123px" }}>
           <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/LoginAsMember" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
       
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2 ">تسجيل الدخول</h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل بيانات الدخول الخاصة بك للوصول إلى منصة التصويت
          </p>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              اسم البريد الكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="اسم البريد الكتروني"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="text-right w-full">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              كلمة المرور
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="form-checkbox" />
              تذكرني
            </label>
          <Link to="/ResetPassword" className="text-sm text-blue-600 hover:underline">
  نسيت كلمة المرور؟
        </Link>
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
