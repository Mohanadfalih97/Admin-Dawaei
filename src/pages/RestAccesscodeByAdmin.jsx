import React, { useState } from "react";
import { Lock, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ResetAccessCode = () => {
  const [memberId, setMemberId] = useState(""); // ✅ الرمز التعريفي للعضو
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ إرسال إشعار بالبريد بعد إعادة تعيين الرمز
  const sendResetEmailMessage = async (email) => {
    try {
      const Token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}otp/send-message-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
          Authorization: `Bearer ${Token}`,

        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const result = await response.json();
        console.error("فشل في إرسال الإشعار:", result.error);
        toast.warn("تم تغيير الرمز السري، لكن تعذر إرسال الإشعار عبر البريد.");
      }
    } catch (err) {
      console.error("خطأ أثناء إرسال الإشعار:", err);
      toast.warn("تم تغيير الرمز السري، لكن تعذر إرسال الإشعار عبر البريد.");
    }
  };

  // ✅ الحدث عند إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // 1. إعادة تعيين الرمز السري
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/reset-member-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId: memberId.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم تغيير الرمز السري بنجاح");
        const token = localStorage.getItem("token");

        // 2. جلب الإيميل للعضو
        const emailResponse = await fetch(`${process.env.REACT_APP_API_URL}members?MemberId=${encodeURIComponent(memberId.trim())}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${token}`,

          },
        });

        const emailResult = await emailResponse.json();
        const member = emailResult?.data?.items?.[0];

        if (member?.eMail) {
          // 3. إرسال الإشعار إلى البريد
          await sendResetEmailMessage(member.eMail);
        }

        navigate("/members");
      } else if (result.msg === "Member Id required") {
        toast.error("مطلوب إدخال معرف العضو");
      } else if (result.msg === "Member not found or deleted ") {
        toast.error("العضو غير موجود أو تم حذفه");
      } else {
        toast.error(result.msg || "فشل تغيير الرمز السري");
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800"
      style={{ direction: "rtl" }}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 text-center"
        style={{ maxWidth: "50rem", width: "100%", maxHeight: "1123px" }}
      >
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/members" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Lock />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            اعادة تعين الرمز السري
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            أدخل الرمز التعريفي لاعادة تعين الرمز السري.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              الرمز الحالي (الرقم المرسل عبر البريد الإلكتروني)
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
