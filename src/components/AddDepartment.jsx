import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const CreateDepartment = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Navigate = useNavigate("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("يرجى إدخال اسم القطاع");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token"); // تأكد أن التوكن محفوظ هنا

      await axios.post(
        `${process.env.REACT_APP_API_URL}department`,
        { departmentName: name.trim() },
        {
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("تم إنشاء القطاع بنجاح!");
      setName("");
      Navigate("/Department");
    } catch (error) {
      console.error("فشل إنشاء القطاع:", error);
      toast.error("حدث خطأ أثناء إنشاء القطاع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-md space-y-10"
      style={{ direction: "rtl" }}
    >
      <h2 className="text-2xl font-semibold text-center text-primary">
        إضافة قطاع جديد
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="اسم القطاع"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "جارٍ الإضافة..." : "إنشاء القطاع"}
        </button>
      </form>
    </div>
  );
};

export default CreateDepartment;
