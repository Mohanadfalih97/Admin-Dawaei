import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../Ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEditDialog = ({ onOpenChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};
  const [editableUser, setEditableUser] = useState(user || {});
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
  

    const { name, value } = e.target;
    setEditableUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
  

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}auth/${editableUser.id}`,
        {
          staticRole: editableUser.staticRole,
          email: editableUser.email,
          phone: editableUser.phone,
          phoneCountryCode: editableUser.phoneCountryCode,
          name: editableUser.name,
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث بيانات المستخدم بنجاح!");
        setTimeout(() => {
          navigate("/UsersInfo");
        }, 1000);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "EEEE d MMMM yyyy", { locale: ar });
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <div className="mt-4 space-y-6 px-1">
          <h3 className="text-lg font-semibold">معلومات المستخدم</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">البيان</TableHead>
                <TableHead>التفاصيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">الاسم</TableCell>
                <TableCell>
                  <input
                    type="text"
                    name="name"
                    value={editableUser.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded text-center"
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">البريد الإلكتروني</TableCell>
                <TableCell>
                  <input
                    type="email"
                    name="email"
                    value={editableUser.email || ""}
                    onChange={handleChange}
                  
                    className="w-full p-2 border rounded text-center"
                  />
                </TableCell>
              </TableRow>

         <TableRow>
  <TableCell className="font-medium">رقم الهاتف مع رمز البلد</TableCell>
  <TableCell>
    <div className="flex gap-1 justify-center items-center">
            <input
        type="text"
        name="phone"
        value={editableUser.phone || ""}
        onChange={handleChange}
        className="flex-1 p-2 border rounded text-center"
      />
      <input
        type="text"
        name="phoneCountryCode"
        placeholder="+964"
        value={editableUser.phoneCountryCode || ""}
        onChange={handleChange}
        className="w-[80px] p-2 border rounded text-center"
      />

    </div>
  </TableCell>
</TableRow>


              <TableRow>
                <TableCell className="font-medium">تاريخ الإنشاء</TableCell>
                <TableCell>{user?.createdAt ? formatDate(user.createdAt) : "غير معروف"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">تاريخ التحديث</TableCell>
                <TableCell>{user?.updatedAt ? formatDate(user.updatedAt) : "غير معروف"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
            <Button
              className="bg-primary text-white"
              onClick={handleSave}
              disabled={loading}
            >
              {loading
                ? "جاري الحفظ..."
               
                : "حفظ التعديلات"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserEditDialog;
