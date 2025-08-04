import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../Ui/table";
import { DateTime } from "luxon";

const EditElectoralcycles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { election: cycle } = location.state || {};

  const arabicMonthNames = {
    January: "كانون الثاني",
    February: "شباط",
    March: "آذار",
    April: "نيسان",
    May: "أيار",
    June: "حزيران",
    July: "تموز",
    August: "آب",
    September: "أيلول",
    October: "تشرين الأول",
    November: "تشرين الثاني",
    December: "كانون الأول"
  };

  const [form, setForm] = useState({
    dscrp: "",
    startDate: "",
    startTime: "",
    finishDate: "",
    finishTime: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ دالة تنسيق الوقت لتوقيت بغداد بصيغة عربية
  const formatDate = (datetime) => {
    if (!datetime) return "—";

    try {
      const utcTime = DateTime.fromISO(datetime, { zone: "utc" });
      const baghdadTime = utcTime.setZone("Asia/Baghdad").setLocale("ar");

      const englishMonth = baghdadTime.toFormat("LLLL");
      const arabicMonth = arabicMonthNames[englishMonth] || englishMonth;

      const formatted = baghdadTime.toFormat(`cccc d '${arabicMonth}' yyyy، hh:mm a`);

      return `${formatted} (بتوقيت بغداد)`;
    } catch {
      return "تاريخ غير صالح";
    }
  };

useEffect(() => {
  if (cycle) {
    const start = DateTime.fromISO(cycle.startDate, { zone: "utc" }).setZone("Asia/Baghdad");
    const finish = DateTime.fromISO(cycle.finishDate, { zone: "utc" }).setZone("Asia/Baghdad");

    setForm({
      dscrp: cycle.dscrp || "",
      startDate: start.toFormat("yyyy-MM-dd"),
      startTime: start.toFormat("HH:mm"),
      finishDate: finish.toFormat("yyyy-MM-dd"),
      finishTime: finish.toFormat("HH:mm"),
    });
  }
}, [cycle]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.dscrp || !form.startDate || !form.startTime || !form.finishDate || !form.finishTime) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const Token = localStorage.getItem("token");

      const start = DateTime.fromFormat(
        `${form.startDate} ${form.startTime}`,
        "yyyy-MM-dd HH:mm",
        { zone: "Asia/Baghdad" }
      ).toUTC().toISO();

      const finish = DateTime.fromFormat(
        `${form.finishDate} ${form.finishTime}`,
        "yyyy-MM-dd HH:mm",
        { zone: "Asia/Baghdad" }
      ).toUTC().toISO();

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}elections-cycles/${id}`,
        {
          dscrp: form.dscrp,
          startDate: start,
          finishDate: finish,
        },
        {
          headers: {
            "Accept-Language": "en",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث بيانات الدورة الانتخابية!");
        setTimeout(() => navigate("/Electoralcycles"), 1000);
      }
    } catch (err) {
      console.error("Error updating cycle:", err);
      const msg = err.response?.data?.msg;
      let errorMessage = "حدث خطأ أثناء التحديث!";

      switch (msg) {
        case "Finish date cannot be before start date.":
          errorMessage = "تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البداية.";
          break;
        case "The new election cycle must start after the previous one finishes":
          errorMessage = "يجب أن تبدأ الدورة الجديدة بعد انتهاء الدورة السابقة.";
          break;
        case "Updated start date must be after the last cycle finishes":
          errorMessage = "يجب أن يكون تاريخ بدء الدورة المعدّلة بعد انتهاء الدورة السابقة.";
          break;
        default:
          if (
            msg?.startsWith("Cannot create a new election cycle until the previous one finishes on")
          ) {
            const datePart = msg.split("on")[1]?.trim();
            errorMessage = `لا يمكن إنشاء دورة جديدة حتى تنتهي الدورة السابقة في ${datePart}.`;
          }
          break;
      }

      toast.error(errorMessage);
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
                  <div className="flex flex-row gap-1">
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className="w-60 p-2 border rounded text-center"
                    />
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1 text-end">
                    {
                      formatDate(
                        DateTime.fromFormat(
                          `${form.startDate} ${form.startTime}`,
                          "yyyy-MM-dd HH:mm",
                          { zone: "Asia/Baghdad" }
                        ).toUTC().toISO()
                      )
                    }
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">تاريخ الانتهاء</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-1">
                    <input
                      type="time"
                      name="finishTime"
                      value={form.finishTime}
                      onChange={handleChange}
                      className="w-60 p-2 border rounded text-center"
                    />
                    <input
                      type="date"
                      name="finishDate"
                      value={form.finishDate}
                      onChange={handleChange}
                      className="w-full p-2 border rounded text-center"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1 text-end">
                    {
                      formatDate(
                        DateTime.fromFormat(
                          `${form.finishDate} ${form.finishTime}`,
                          "yyyy-MM-dd HH:mm",
                          { zone: "Asia/Baghdad" }
                        ).toUTC().toISO()
                      )
                    }
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
