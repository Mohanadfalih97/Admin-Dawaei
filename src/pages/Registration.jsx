import { useState, useRef } from "react";
import { Home, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/Ui/table";
import { PasswordInput } from "../components/Ui/password-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const [name, setName] = useState("");
  const [PhoneCountryCode, setPhoneCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorFields, setErrorFields] = useState({ email: false, phone: false });

  const navigate = useNavigate();
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorFields({ email: false, phone: false });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "en",
        },
        body: JSON.stringify({
          PhoneCountryCode,
          email,
          phone,
          password,
          name,
          role,
        }),
      });

      const result = await response.json();

      if (response.ok && result.data) {
        toast.success("تم إنشاء الحساب بنجاح!");
        localStorage.setItem("token", result.data);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        if (result.errors) {
          const messages = [];
          const newErrorFields = { email: false, phone: false };

          for (const key in result.errors) {
            const errorArray = result.errors[key];

            errorArray.forEach((msg) => {
              const lowerMsg = msg.toLowerCase();

              if (lowerMsg.includes("password") && lowerMsg.includes("minimum") && lowerMsg.includes("maximum")) {
                messages.push("كلمة المرور يجب أن تكون بين 6 و 30 حرفًا.");
              } else if (key === "Email") {
                emailRef.current?.focus();
                newErrorFields.email = true;
                messages.push("يرجى إدخال بريد إلكتروني صالح.");
              } else if (key === "Phone") {
                phoneRef.current?.focus();
                newErrorFields.phone = true;
                messages.push("يرجى إدخال رقم هاتف صالح.");
              } else {
                messages.push(msg);
              }
            });
          }

          setErrorFields(newErrorFields);
          messages.forEach((m) => toast.error(m));
        } else {
          const msgKey = result.msg || result.message || result.error;
          if (msgKey === "EMAIL_ALREADY_REGISTERED") {
            emailRef.current?.focus();
            setErrorFields((prev) => ({ ...prev, email: true }));
            toast.error("البريد الإلكتروني مسجل بالفعل.");
          } else if (msgKey === "PHONE_ALREADY_REGISTERED") {
            phoneRef.current?.focus();
            setErrorFields((prev) => ({ ...prev, phone: true }));
            toast.error("رقم الهاتف مسجل بالفعل.");
          } else {
            toast.error(msgKey || "فشل في إنشاء الحساب.");
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-1/2 bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/dashboard" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2">إنشاء حساب (مسؤول)</h2>
          <p className="text-sm text-gray-500 mb-6">أدخل بيانات الخاصة بك</p>
        </div>

        <form onSubmit={handleRegister}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">البيان</TableHead>
                <TableHead className="text-center">القيمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-center">الاسم</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-center"
                    required
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-center">البريد الإلكتروني</TableCell>
                <TableCell>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 ${
                      errorFields.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-400"
                    }`}
                    required
                  />
                </TableCell>
              </TableRow>
<TableRow>
  <TableCell className="font-medium text-center">رقم الهاتف   </TableCell>
  <TableCell>
    <div className="flex gap-2 items-center justify-center">
   

      <input
        ref={phoneRef}
        type="number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={`flex-1 px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 ${
          errorFields.phone
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-400"
        }`}
        required
      />
         <select
        value={PhoneCountryCode}
        onChange={(e) => setPhoneCountryCode(e.target.value)}
        className="w-[120px] px-2 py-2 border rounded text-center"
        required
      >
        <option value="">رمز</option>
        <option value="+964">العراق +964</option>
        <option value="+966">السعودية +966</option>
        <option value="+20">مصر +20</option>
        <option value="+971">الإمارات +971</option>
        <option value="+962">الأردن +962</option>
        <option value="+965">الكويت +965</option>
        <option value="+1">كندا +1</option>
      </select>
    </div>
  </TableCell>
</TableRow>


              <TableRow>
                <TableCell className="font-medium text-center">كلمة المرور</TableCell>
                <TableCell>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-center"
                    required
                  />
                </TableCell>
              </TableRow>

           <TableRow className="hidden">
  <TableCell className="font-medium text-center">الصلاحية</TableCell>
  <TableCell>
    <select
      value={role}
      onChange={(e) => setRole(Number(e.target.value))}
      className="w-full px-3 py-2 border rounded text-center"
    >
      <option value={0}>سوبر أدمن</option>
    </select>
  </TableCell>
</TableRow>

            </TableBody>
          </Table>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-900"
              }`}
            >
              {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-6 text-white text-sm text-center">
        منصة آمنة للتصويت الإلكتروني خاصة بمجلس إدارة مجلس تطوير القطاع الخاص
      </div>
    </div>
  );
};

export default Registration;
