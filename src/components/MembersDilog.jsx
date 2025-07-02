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
  const navigate = useNavigate();

  // جلب الأقسام
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
        console.error("فشل في جلب الأقسام:", error);
        toast.error("خطأ في الاتصال بالخادم");
      }
    };

    fetchDepartments();
  }, []);

  // تعبئة بيانات العضو عند فتح الحوار
  useEffect(() => {
    if (member) {
      setName(member.fullName || "");
      setPosition(member.position || "");
      setDepartment(member.department || "");
      setImagePreview(member.imgUrl || defaultProfileImage);
    }
  }, [member]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!member?.id) return;
    setLoadingUpdate(true);
    const token = localStorage.getItem("token");
    let updatedImgUrl = member.imgUrl;

    try {
      // رفع الصورة إن وجدت
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
        phone1: member.phone1 || "",
        phone2: member.phone2 || "",
        eMail: member.eMail || "",
        watsApp: member.watsApp || "",
        department,
        position,
        role: member.role || 0,
        imgUrl: updatedImgUrl,
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
        navigate("/members");
      } else {
        toast.error("فشل في تحديث البيانات");
      }
    } catch (error) {
      console.error(error);
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
      console.error("Delete error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoadingDelete(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white print:bg-white">
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

        <div className="mt-4 space-y-3" style={{ direction: "rtl" }}>
          <Table>
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
                  <select
                    className="border px-3 py-2 rounded w-full text-center"
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
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-between mt-6">
            <Button
              onClick={handleUpdate}
              disabled={loadingUpdate}
              className={`text-white ${loadingUpdate ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loadingUpdate ? "جاري التعديل..." : "تعديل البيانات"}
            </Button>

            <Button
              onClick={handleDelete}
              disabled={loadingDelete}
              className={`text-white ${loadingDelete ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {loadingDelete ? "جاري الحذف..." : "حذف العضو"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembersDilog;
