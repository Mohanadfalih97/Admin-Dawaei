import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./Ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Ui/table";
import { FileChartLine, Camera } from "lucide-react";
import { Button } from "../components/Ui/Button";
import { toast } from "react-toastify";
import defaultProfileImage from "../asset/Imge/profiledefautimg.png";

const MembersDilog = ({ open, onOpenChange, member }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [watsApp, setWatsApp] = useState("");
  const [eMail, setEMail] = useState("");
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
const [institutionId, setInstitutionId] = useState("");


  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}department`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
          },
        });
        const result = await response.json();
        if (response.ok && result.data?.items) {
          setDepartments(result.data.items);
        } else {
          toast.error("فشل في تحميل الأقسام");
        }
      } catch (error) {
        toast.error("خطأ في الاتصال بالخادم");
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (member) {
      setName(member.fullName || "");
      setPosition(member.position || "");
      setDepartment(member.department || "");
      setImagePreview(member.imgUrl || defaultProfileImage);
      setPhone1(member.phone1 || "");
      setPhone2(member.phone2 || "");
      setWatsApp(member.watsApp || "");
      setEMail(member.eMail || "");
      setInstitutionId(member.institutionId?.toString() || "");

    }
  }, [member]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
  const fetchInstitutions = async () => {
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
      if (response.ok && result.data?.items) {
        setInstitutions(result.data.items);
      } else {
        toast.error("فشل في تحميل المؤسسات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل المؤسسات");
    }
  };

  fetchInstitutions();
}, []);


  const handleUpdate = async () => {
    if (!member?.id) return;
    setLoadingUpdate(true);
    const token = localStorage.getItem("token");
    let updatedImgUrl = member.imgUrl;

    try {
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
          throw new Error(uploadResult.msg || "فشل رفع الصورة");
        }

        const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "");
        updatedImgUrl = uploadResult.data.startsWith("http")
          ? uploadResult.data
          : `${baseUrl}/uploads/${uploadResult.data}`;
      }

      const updatedData = {
        memberId: member.memberId,
        fullName: name,
        phone1,
        phone2,
        watsApp,
        eMail,
        department,
        position,
        role: member.role || 0,
        cycleId: member.cycleId || 0,
        imgUrl: updatedImgUrl,
        institutionId: parseInt(institutionId) || null,

      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}members/${member.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success("تم تحديث بيانات العضو بنجاح");
        onOpenChange(false);
        window.location.reload();

        navigate("/members");
      } else {
        toast.error("فشل في تحديث البيانات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    if (!member?.id) return;
    setLoadingDelete(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}members/${member.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("تم حذف العضو بنجاح");
        onOpenChange(false);
        window.location.reload();
      } else {
        toast.error("فشل في حذف العضو");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoadingDelete(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white print:bg-white p-4 sm:p-6">
        <DialogHeader dir="rtl">
          <DialogTitle className="flex items-center gap-2 text-xl mt-4">
            <FileChartLine className="h-6 w-6" />
            <span>تقرير وتعديل العضو</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mb-6 gap-2">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-md group">
            <img src={imagePreview || defaultProfileImage} alt="صورة العضو" className="w-full h-full object-cover" />
            <input type="file" accept="image/*" id="imageUpload" onChange={handleImageChange} className="hidden" />
            <label htmlFor="imageUpload" className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white text-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition">
              <Camera className="w-6 h-6" />
            </label>
          </div>
          <small className="text-gray-500">اضغط على الصورة لتغييرها</small>
        </div>

        {/* عرض عمودي للهواتف */}
        <div className="block sm:hidden space-y-4 text-sm">
          {[
            { label: "الاسم", value: name, set: setName, type: "text" },
            { label: "المنصب", value: position, set: setPosition, type: "text" },
            { label: "رقم الهاتف 1", value: phone1, set: setPhone1, type: "text" },
            { label: "رقم الهاتف 2", value: phone2, set: setPhone2, type: "text" },
            { label: "رقم WhatsApp", value: watsApp, set: setWatsApp, type: "text" },
            { label: "البريد الإلكتروني", value: eMail, set: setEMail, type: "email" },
          ].map((item, i) => (
            <div key={i} className="border rounded p-3">
              <label className="font-semibold">{item.label}</label>
              <input
                type={item.type}
                className="border w-full rounded px-3 py-2 mt-1"
                value={item.value}
                onChange={(e) => item.set(e.target.value)}
              />
            </div>
          ))}

          <div className="border rounded p-3">
            <label className="font-semibold">القسم</label>
            <select
              className="border w-full rounded px-3 py-2 mt-1"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">اختر القسم</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.departmentName}>
                  {dep.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* جدول لأجهزة أكبر من sm */}
        <Table className="hidden sm:table" style={{direction:"rtl"}}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">البيان</TableHead>
              <TableHead>المعلومات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">الاسم</TableCell>
              <TableCell>
                <input type="text" className="border px-3 py-2 rounded w-full text-center" value={name} onChange={(e) => setName(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">المنصب</TableCell>
              <TableCell>
                <input type="text" className="border px-3 py-2 rounded w-full text-center" value={position} onChange={(e) => setPosition(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">القسم</TableCell>
              <TableCell>
                <select className="border px-3 py-2 rounded w-full text-center" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">اختر القسم</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.departmentName}>
                      {dep.departmentName}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">رقم الهاتف 1</TableCell>
              <TableCell>
                <input type="text" className="border px-3 py-2 rounded w-full text-center" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">رقم الهاتف 2</TableCell>
              <TableCell>
                <input type="text" className="border px-3 py-2 rounded w-full text-center" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">رقم WhatsApp</TableCell>
              <TableCell>
                <input type="text" className="border px-3 py-2 rounded w-full text-center" value={watsApp} onChange={(e) => setWatsApp(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">البريد الإلكتروني</TableCell>
              <TableCell>
                <input type="email" className="border px-3 py-2 rounded w-full text-center" value={eMail} onChange={(e) => setEMail(e.target.value)} />
              </TableCell>
            </TableRow>
            <TableRow>
  <TableCell className="font-medium">المؤسسة</TableCell>
  <TableCell>
    <select
      className="border px-3 py-2 rounded w-full text-center"
      value={institutionId}
      onChange={(e) => setInstitutionId(e.target.value)}
    >
      <option value="">اختر المؤسسة</option>
      {institutions.map((inst) => (
        <option key={inst.id} value={inst.id}>
          {inst.institutionName}
        </option>
      ))}
    </select>
  </TableCell>
</TableRow>

          </TableBody>
        </Table>

        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2" style={{direction:"rtl"}}>
          <Button
            onClick={handleUpdate}
            disabled={loadingUpdate}
            className={`text-white w-full sm:w-auto ${loadingUpdate ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loadingUpdate ? "جاري التعديل..." : "تعديل البيانات"}
          </Button>

          <Button
            onClick={handleDelete}
            disabled={loadingDelete}
            className={`text-white w-full sm:w-auto ${loadingDelete ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {loadingDelete ? "جاري الحذف..." : "حذف العضو"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembersDilog;
