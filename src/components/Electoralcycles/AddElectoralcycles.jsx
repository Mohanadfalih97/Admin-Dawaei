import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../Ui/table";

const ElectoralCycleForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dscrp: "",
    startDate: "",
    finishDate: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
  if (!form.dscrp || !form.startDate || !form.finishDate) {
    toast.error("يرجى ملء جميع الحقول");
    return;
  }

  setLoading(true);

  try {
    const Token = localStorage.getItem("token");

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}elections-cycles`,
      {
        dscrp: form.dscrp,
        startDate: new Date(form.startDate).toISOString(),
        finishDate: new Date(form.finishDate).toISOString()
      },
      {
        headers: {
          "Accept-Language": "ar",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        }
      }
    );

    if (response.status === 200) {
      toast.success("تم إنشاء الدورة الانتخابية بنجاح!");
      setTimeout(() => navigate("/Electoralcycles"), 1000);
    }
  } catch (err) {
    console.error("Error creating electoral cycle:", err);

    const serverMessage = err.response?.data?.msg;

    if (serverMessage === "Cannot create a new election cycle while another one is still ongoing.") {
      toast.error("لا يمكن إنشاء دورة انتخابية جديدة بينما توجد دورة حالية مستمرة.");
    } else if (serverMessage === "Cannot create a new election cycle while another one is still marked as active.") {
      toast.error("لا يمكن إنشاء دورة انتخابية جديدة بينما توجد دورة نشطة حاليًا.");
    } else {
      toast.error("حدث خطأ أثناء إنشاء الدورة!");
    }
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <div className="mt-4 space-y-6 px-1">
          <h3 className="text-lg font-semibold">إنشاء دورة انتخابية</h3>

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
                <TableCell className="font-medium">تاريخ الإنشاء</TableCell>
                <TableCell>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-center"
                  />
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
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
            <Button className="bg-primary text-white" onClick={handleSave} disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ElectoralCycleForm;
