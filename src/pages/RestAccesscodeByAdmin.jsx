import React, { useState } from "react";
import { Lock, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ResetAccessCode = () => {
  const [memberId, setMemberId] = useState(""); // ✅ حقل الرمز الحالي
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

 

  setLoading(true); // ⬅️ يبدأ التحميل

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.REACT_APP_API_URL}auth/reset-member-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "en",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        memberId: memberId.trim(),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("تم تغيير الرمز السري بنجاح");
      navigate("/members");
    } else  if (result.msg === "Member Id required") {
  toast.error("مطلوب إدخال معرف العضو");
} else if (result.msg === "Member not found or deleted ") {
  toast.error("العضو غير موجود أو تم حذفه");
}else
{
      toast.error(result.msg || "فشل تغيير الرمز السري");
    }
  } catch (error) {
    console.error("Reset error:", error);
    toast.error("حدث خطأ أثناء الاتصال بالخادم.");
  } finally {
    setLoading(false); // ⬅️ إيقاف التحميل
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 text-center" style={{ maxWidth: "50rem", width: "100%", maxHeight: "1123px" }}>
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/members" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Lock />
          <h2 className="text-xl font-bold text-gray-800 mb-2">اعادة تعين  الرمز السري</h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل الرمز التعريفي لاعادة تعين الرمز السري .
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

     

  

       <button
  type="submit"
  disabled={loading}
  className={`block w-full text-center py-2 rounded-md transition text-white ${
    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-900"
  }`}
>
  {loading ? "جاري ..." : "اعادة رمز السري"}
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
