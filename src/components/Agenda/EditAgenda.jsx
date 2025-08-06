import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { CloudUpload } from "lucide-react";
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../Ui/table";
import "react-toastify/dist/ReactToastify.css";

const EditAgenda = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const agendaData = location.state?.agenda;

  const [description, setDescription] = useState("");
  const [agendaDate, setAgendaDate] = useState("");

  const [inFile, setInFile] = useState(null);
  const [outFile, setOutFile] = useState(null);

  const [inPreviewUrl, setInPreviewUrl] = useState("");
  const [outPreviewUrl, setOutPreviewUrl] = useState("");

  const [existingInUrl, setExistingInUrl] = useState("");
  const [existingOutUrl, setExistingOutUrl] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agendaData) {
      setDescription(agendaData.dscrp || "");
      setAgendaDate(agendaData.date?.split("T")[0] || "");
      setExistingInUrl(agendaData.inUrl || "");
      setExistingOutUrl(agendaData.outUrl || "");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}document/${id}`, {
          headers: {
            "Accept-Language": "ar",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setDescription(data.dscrp || "");
          setAgendaDate(data.date?.split("T")[0] || "");
          setExistingInUrl(data.inUrl || "");
          setExistingOutUrl(data.outUrl || "");
        })
        .catch(() => toast.error("فشل في تحميل البيانات"));
    }
  }, [agendaData, id]);

  const handleInFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setInFile(selected);
      setInPreviewUrl(URL.createObjectURL(selected));
    } else {
      toast.error("يرجى اختيار ملف PDF فقط للمرفق الوارد");
      setInFile(null);
      setInPreviewUrl("");
    }
  };

  const handleOutFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setOutFile(selected);
      setOutPreviewUrl(URL.createObjectURL(selected));
    } else {
      toast.error("يرجى اختيار ملف PDF فقط للمرفق الصادر");
      setOutFile(null);
      setOutPreviewUrl("");
    }
  };

  const handleSubmit = async () => {
    if (!description || !agendaDate) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      let uploadedInUrl = existingInUrl;
      let uploadedOutUrl = existingOutUrl;

      if (inFile) {
        const form = new FormData();
        form.append("file", inFile);
        const res = await axios.post(`${process.env.REACT_APP_API_URL}attachments`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        uploadedInUrl = res.data?.data;
      }

      if (outFile) {
        const form = new FormData();
        form.append("file", outFile);
        const res = await axios.post(`${process.env.REACT_APP_API_URL}attachments`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        uploadedOutUrl = res.data?.data;
      }

      const updatePayload = {
        dscrp: description,
        date: new Date(agendaDate).toISOString(),
        inUrl: uploadedInUrl,
        outUrl: uploadedOutUrl,
      };

      const updateRes = await axios.put(
        `${process.env.REACT_APP_API_URL}document/${id}`,
        updatePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (updateRes.status === 200) {
        toast.success("تم تحديث جدول الأعمال بنجاح");
        navigate("/Agenda");
      } else {
        toast.error("فشل في التحديث");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  const FileUploadBox = ({ label, file, previewUrl, existingUrl, onChange }) => (
    <div className="flex flex-col items-center">
      <label
        htmlFor={label}
        className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
      >
        <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500 text-center">
          {file ? "تم اختيار ملف جديد" : `رفع ملف PDF ${label === 'inFile' ? 'جدول الاعمال ' : 'مخرجات الجلسة'}`}
        </span>
      </label>
      <input
        id={label}
        type="file"
        accept="application/pdf"
        onChange={onChange}
        className="hidden"
      />
      {(file || existingUrl) && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          <div className="truncate max-w-[200px] mx-auto">
            📄 {file ? (file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name) : "ملف محفوظ مسبقاً"}
          </div>
          <button
            type="button"
            onClick={() => window.open(file ? previewUrl : existingUrl, "_blank")}
            className="mt-1 text-blue-600 hover:underline text-sm"
          >
            عرض الملف
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <div className="mt-4 space-y-6 px-1">
          <h3 className="text-lg font-semibold">تعديل جدول الأعمال</h3>

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
                <TableCell className="font-medium">المرفقات  </TableCell>
       <TableCell>
  <div className="flex flex-col md:flex-row justify-center items-center gap-6">
    <FileUploadBox
      label="inFile"
      file={inFile}
      previewUrl={inPreviewUrl}
      existingUrl={existingInUrl}
      onChange={handleInFileChange}
    />
    <FileUploadBox
      label="outFile"
      file={outFile}
      previewUrl={outPreviewUrl}
      existingUrl={existingOutUrl}
      onChange={handleOutFileChange}
    />
  </div>
</TableCell>

              </TableRow>

           
            </TableBody>
          </Table>

          <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
            <Button className="bg-blue-600 text-white" onClick={handleSubmit} disabled={loading}>
              {loading ? "جاري التحديث..." : "تحديث جدول الأعمال"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditAgenda;
