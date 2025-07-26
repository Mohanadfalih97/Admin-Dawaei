import { useState, useEffect } from "react";
import { Home, User, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import defaultProfileImage from "../../asset/Imge/profiledefautimg.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMember = () => {
  const [fullName, setFullName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [watsApp, setWatsApp] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [position, setPosition] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [institutionId, setInstitutionId] = useState(null);




  const [errors, setErrors] = useState({
    fullName: "",
    phone1: "",
    email: "",
  });

  const navigate = useNavigate();



useEffect(() => {
  const fetchInstitution = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}institution`, {
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.data?.items?.length > 0) {
        setInstitutionId(result.data.items[0].id); // 👈 حفظ أول id
      } else {
        toast.error("فشل في تحميل بيانات المؤسسة");
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات المؤسسة:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات المؤسسة");
    }
  };

  fetchInstitution();
}, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}department`, {
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.data?.items) {
          setDepartments(result.data.items);
        } else {
          toast.error("فشل في تحميل الأقسام");
        }
      } catch (error) {
        console.error("خطأ في جلب الأقسام:", error);
        toast.error("حدث خطأ أثناء تحميل الأقسام");
      }
    };

    fetchDepartments();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

 const handleRegister = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  setErrors({});
  setLoading(true);

  try {
    let uploadedImagePath = null;

    // رفع الصورة إن وُجدت
    if (imageFile) {
      const imageForm = new FormData();
      imageForm.append("file", imageFile);

      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}attachments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en",
        },
        body: imageForm,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.data) {
        if (uploadResult.msg === "FILE_TOO_LARGE") {
          toast.error(" حجم الملف كبير جدًا. الحد الأقصى المسموح به هو 20 ميغابايت.");
        } else if (uploadResult.msg === "INVALID_FILE_TYPE") {
          toast.error(" نوع الملف غير مدعوم.");
        } else {
          toast.error(uploadResult.msg || "حدث خطأ أثناء رفع الملف.");
        }
        throw new Error(uploadResult.msg || "Upload failed");
      }

      const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "");
      uploadedImagePath = uploadResult.data.startsWith("http")
        ? uploadResult.data
        : `${baseUrl}/uploads/${uploadResult.data}`;
    }

    // بيانات العضو
    const memberData = {
      fullName,
      phone1,
      phone2,
      eMail: email,
      watsApp,
      department,
      position,
      role: 0,
      imgUrl: uploadedImagePath,
      institutionId, 
    };

    // إرسال بيانات العضو
    const memberResponse = await fetch(`${process.env.REACT_APP_API_URL}members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });

    const memberResult = await memberResponse.json();

    // نجاح التسجيل
    if (memberResponse.ok && memberResult.data) {
      toast.success("تم حفظ العضو بنجاح");
      navigate("/members");

      const memberId = memberResult.data.memberId;
      const memberEmail = memberResult.data.eMail;

      // إرسال OTP إلى البريد
      try {
        const otpResponse = await fetch(`${process.env.REACT_APP_API_URL}otp/member-id`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
          },
          body: JSON.stringify({
            email: memberEmail,
            memberId: memberId,
          }),
        });

        if (otpResponse.ok) {
        } else {
          toast.error("⚠️ فشل في إرسال رمز التحقق.");
        }
      } catch (otpErr) {
        console.error("OTP send error:", otpErr);
        toast.error("⚠️ حدث خطأ أثناء إرسال رمز التحقق.");
      }


    } else {
      // معالجة الأخطاء المرتبطة بالحقول
      if (
        memberResult.msg?.includes("same phone number") ||
        memberResult.msg?.includes("same email") ||
        memberResult.msg?.includes("same full name")
      ) {
        const newErrors = {
          fullName: memberResult.msg.includes("same full name") ? "الاسم الكامل مستخدم مسبقًا." : "",
          phone1: memberResult.msg.includes("same phone number") ? "رقم الهاتف مستخدم مسبقًا." : "",
          email: memberResult.msg.includes("same email") ? "البريد الإلكتروني مستخدم مسبقًا." : "",
        };
        setErrors(newErrors);
      } else {
        toast.error(memberResult.msg || "فشل إضافة العضو.");
      }
    }

  } catch (error) {
    console.error("Add member error:", error);
    toast.error("حدث خطأ أثناء الاتصال بالخادم.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800" dir="rtl">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-4xl text-center">
        <div className="text-blue-700 mb-4 text-3xl font-bold">
          <Link to="/members" className="hover:text-blue-900 transition">
            <Home />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <User />
          <h2 className="text-xl font-bold text-gray-800 mb-2">إضافة عضو</h2>
          <p className="text-sm text-gray-500 mb-6">أدخل البيانات الخاصة بالعضو الجديد</p>
        </div>

        <div className="relative w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md group">
          <img
            src={imagePreview || defaultProfileImage}
            className="w-full h-full object-cover"
            alt="صورة العضو"
          />
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white text-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition"
          >
            <Camera className="w-6 h-6" />
          </label>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <InputField label="الاسم الكامل" value={fullName} onChange={setFullName} requiredLabel error={errors.fullName} />
          <InputField label="رقم الهاتف الأول" value={phone1} onChange={setPhone1} type="number" requiredLabel error={errors.phone1} />
          <InputField label="رقم الهاتف الثاني" value={phone2} onChange={setPhone2} type="number" />
          <InputField label="البريد الإلكتروني" value={email} onChange={setEmail} type="email" requiredLabel error={errors.email} />
          <InputField label="رقم الواتساب" value={watsApp} onChange={setWatsApp} type="number" />

          <div className="text-right">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              القسم <span className="text-red-600">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">اختر القسم</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.departmentName}>
                  {dep.departmentName}
                </option>
              ))}
            </select>

          </div>
          <input type="hidden" value={institutionId || ''} name="institutionId" />

  


          <InputField label="المنصب" value={position} onChange={setPosition} />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-900"
            }`}
          >
            {loading ? "جاري الحفظ..." : "حفظ العضو"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", requiredLabel = false, error = "" }) => (
  <div className="text-right">
    <label className="block mb-1 text-sm font-semibold text-gray-700">
      {label}
      {requiredLabel && <span className="text-red-600"> *</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      required={requiredLabel}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default AddMember;
