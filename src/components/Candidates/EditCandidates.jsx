import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../Ui/Button";
import { ScrollArea } from "../Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../Ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import "react-toastify/dist/ReactToastify.css";

const CandidateEditDialog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidate } = location.state || {};

  const [voteType, setVoteType] = useState(candidate?.voteType || 0);
  const [selectedMemberId, setSelectedMemberId] = useState(candidate?.memberId || "");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const createdAt = candidate?.createdAt;
  const updatedAt = candidate?.updatedAt;

 

useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}members`, {
        headers: {
          "Accept": "application/json",
          "Accept-Language": "en",
        },
      });
      setMembers(res.data.data?.items || []);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("فشل تحميل قائمة الأعضاء");
    }
  };

  fetchMembers();
}, []); // ✅ لا حاجة لتبعيات


  const handleSave = async () => {
    if (!candidate?.id || !selectedMemberId) {
      return toast.error("الرجاء اختيار العضو أولاً.");
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}candi-date/${candidate.id}`,
        {
          voteType,
          memberName: members.find((m) => m.id === Number(selectedMemberId))?.fullName || "عضو غير معروف",
          memberId: Number(selectedMemberId),
        },
        {
          headers: {
            "Accept": "application/json",
            "Accept-Language": "en",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث المرشح بنجاح");
        setTimeout(() => navigate("/Candidates"), 1000);
      }
    } catch (err) {
      console.error("Error updating candidate:", err);
      toast.error("فشل في تحديث بيانات المرشح");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";
    return format(new Date(dateString), "yyyy/MM/dd - hh:mm a", { locale: ar });
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <h2 className="text-lg font-semibold mb-4">تعديل بيانات المرشح</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">البيان</TableHead>
              <TableHead>القيمة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">العضو</TableCell>
              <TableCell>
                <select
                  className="w-full p-2 border rounded text-center"
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                >
                  <option value="">اختر العضو</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.fullName} ({member.memberId})
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">نوع التصويت</TableCell>
              <TableCell>
                <select
                  className="w-full p-2 border rounded text-center"
                  value={voteType}
                  onChange={(e) => setVoteType(Number(e.target.value))}
                >
                  <option value={0}>عام</option>
                  <option value={1}>خاص</option>
                </select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">تاريخ الإنشاء</TableCell>
              <TableCell>{formatDate(createdAt)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">آخر تعديل</TableCell>
              <TableCell>{formatDate(updatedAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
          <Button className="bg-primary text-white" onClick={handleSave} disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CandidateEditDialog;
