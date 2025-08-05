import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../Ui/table";
import "react-toastify/dist/ReactToastify.css";

const AddAgenda = () => {
  const [description, setDescription] = useState("");
  const [agendaDate, setAgendaDate] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      toast.error("يرجى اختيار ملف PDF فقط");
      setFile(null);
      setPreviewUrl("");
    }
  };

  const handleSubmit = async () => {
    if (!description || !agendaDate || !file) {
      toast.error("يرجى ملء جميع الحقول وإرفاق ملف");
      return;
    }

    const formData = new FormData();
    formData.append("dscrp", description);
    formData.append("date", agendaDate);
    formData.append("pdfFile", file);

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}agendas`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Language": "ar",
        },
      });

      if (res.status === 200) {
        toast.success("تم حفظ جدول الأعمال بنجاح");
        navigate("/Agenda");
      } else {
        toast.error("حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error(err);
      toast.error("فشل الحفظ، تحقق من الاتصال أو البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <div className="mt-4 space-y-6 px-1">
          <h3 className="text-lg font-semibold">إضافة جدول أعمال</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">البيان</TableHead>
                <TableHead>القيمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">الوصف</TableCell>
                <TableCell>
                  <textarea
                    className="w-full p-2 border rounded text-right"
                    rows={3}
                    placeholder="أدخل وصف جدول الأعمال"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">تاريخ الجدول</TableCell>
                <TableCell>
                  <input
                    type="date"
                    className="w-full p-2 border rounded text-center"
                    value={agendaDate}
                    onChange={(e) => setAgendaDate(e.target.value)}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">رفع الملف (PDF)</TableCell>
                <TableCell>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </TableCell>
              </TableRow>

              {previewUrl && (
                <TableRow>
                  <TableCell className="font-medium">عرض الملف</TableCell>
                  <TableCell>
                    <iframe
                      src={previewUrl}
                      title="preview"
                      width="100%"
                      height="400px"
                      className="border"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
            <Button className="bg-blue-600 text-white" onClick={handleSubmit} disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ جدول الأعمال"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AddAgenda;
