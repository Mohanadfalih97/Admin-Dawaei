import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../Ui/table";
import { CloudUpload } from "lucide-react";

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

  setLoading(true);
  try {
    const token = localStorage.getItem("token");

    // 1️⃣ رفع الملف أولاً إلى /api/attachments
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const uploadRes = await axios.post(
      `${process.env.REACT_APP_API_URL}attachments`,
      uploadFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const fileUrl = uploadRes.data?.data;
    if (!fileUrl) {
      toast.error("فشل في رفع الملف");
      setLoading(false);
      return;
    }

    // 2️⃣ إرسال بيانات الوثيقة إلى /api/document
    const documentPayload = {
      dscrp: description,
      date: new Date(agendaDate).toISOString(),
      inUrl: fileUrl,
      outUrl: "",
    };

    const docRes = await axios.post(
      `${process.env.REACT_APP_API_URL}document`,
      documentPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (docRes.status === 200) {
      toast.success("تم حفظ الوثيقة بنجاح");
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
    <div className="flex justify-center">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
      >
        <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500 text-center">
ارفع ملف الخاص بالجدول        </span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
    {file && (
  <div className="mt-2 text-sm text-gray-600 text-center">
    <div className="truncate max-w-[200px] mx-auto">
      📄 {file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name}
    </div>
    <button
      type="button"
      onClick={() => window.open(previewUrl, "_blank")}
      className="mt-1 text-blue-600 hover:underline text-sm"
    >
      عرض الملف
    </button>
  </div>
)}

  </TableCell>
  
</TableRow>


          
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
