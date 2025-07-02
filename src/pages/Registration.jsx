import { useState } from "react";
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
  const [role, setRole] = useState(0); // 0 = سوبر أدمن, 1 = أدمن
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true); // بدء التحميل

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
      toast.error(result.msg || "فشل في إنشاء الحساب.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("حدث خطأ أثناء الاتصال بالخادم.");
  } finally {
    setLoading(false); // إيقاف التحميل بعد الانتهاء
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" style={{ direction: "rtl" }}>
      <div className="w-full w-96 bg-white rounded-xl shadow-md p-8 text-center">
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-center"
                    required
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-center">رمز البلد</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={PhoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-center"
                    required
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-center">رقم الهاتف</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-center"
                    required
                  />
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

              <TableRow>
                <TableCell className="font-medium text-center">الصلاحية</TableCell>
                <TableCell>
                  <select
                    value={role}
                    onChange={(e) => setRole(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded text-center"
                  >
                    <option value={0}>سوبر أدمن</option>
                    <option value={1}>أدمن</option>
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
