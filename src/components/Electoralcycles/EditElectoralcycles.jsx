import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../Ui/table";
import { format } from "date-fns"; // تأكد من أنك استوردت 'format' من 'date-fns'
import { ar } from "date-fns/locale"; // استيراد اللغة العربية من 'date-fns/locale'

const EditElectoralcycles = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // جلب ID من URL
  const location = useLocation();
  const { election: cycle } = location.state || {};

  // تعريف دالة formatDate
  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const d = new Date(date);
      const hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "مساءً" : "صباحًا";
      const formattedTime = `${(hours % 12 || 12)}:${minutes} ${ampm}`;
      const formattedDate = format(d, "EEEE، d MMMM yyyy", { locale: ar });

      return `${formattedDate} في ${formattedTime}`;
    } catch {
      return "تاريخ غير صالح";
    }
  };

  const [form, setForm] = useState({
    dscrp: "",
    startDate: "",
    finishDate: ""
  });

  const [loading, setLoading] = useState(false);

  // تعبئة الحقول عند التحميل
  useEffect(() => {
    if (cycle) {
      setForm({
        dscrp: cycle.dscrp || "",
        startDate: cycle?.startDate
          ? new Date(cycle.startDate).toISOString().slice(0, 16)
          : "",
        finishDate: cycle?.finishDate
          ? new Date(cycle.finishDate).toISOString().slice(0, 16)
          : ""
      });
    }
  }, [cycle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.dscrp || !form.startDate || !form.finishDate) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const Token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}elections-cycles/${id}`,
        {
          dscrp: form.dscrp,
          startDate: new Date(form.startDate).toISOString(),
          finishDate: new Date(form.finishDate).toISOString()
        },
        {
          headers: {
            "Accept-Language": "en",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          }
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث بيانات الدورة الانتخابية!");
        setTimeout(() => navigate("/Electoralcycles"), 1000);
      }
    } catch (err) {
      console.error("Error updating cycle:", err);
      toast.error("حدث خطأ أثناء التحديث!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <div className="mt-4 space-y-6 px-1">
          <h3 className="text-lg font-semibold">تعديل دورة انتخابية</h3>

          <Table>
            <TableHeader />
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">وصف الدورة</TableCell>
                <TableCell>
                  <input
                    type="text"
                    name="dscrp"
                    value={form.dscrp}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-center"
                    placeholder="أدخل وصف الدورة"
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">تاريخ البداية</TableCell>
                <TableCell>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-center"
                  />
                  {/* عرض التاريخ المنسق أسفل الحقل */}
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(form.startDate)} {/* عرض التاريخ بالتنسيق المحلي */}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">تاريخ الانتهاء</TableCell>
                <TableCell>
                  <input
                    type="datetime-local"
                    name="finishDate"
                    value={form.finishDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-center"
                  />
                  {/* عرض التاريخ المنسق أسفل الحقل */}
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(form.finishDate)} {/* عرض التاريخ بالتنسيق المحلي */}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
            <Button className="bg-blue-600 text-white" onClick={handleUpdate} disabled={loading}>
              {loading ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditElectoralcycles;
