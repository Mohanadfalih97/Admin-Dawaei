import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "./Ui/Button";
import { ScrollArea } from "./Ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Ui/table";

import "react-toastify/dist/ReactToastify.css";

const Candidates = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [voteType, setVoteType] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // جلب الأعضاء
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}members`, {
        params: {
          PageNumber: 1,
          PageSize: 100,
        },
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      })
      .then((res) => {
        setMembers(res.data.data.items);
      })
      .catch((err) => {
        console.error("خطأ في جلب الأعضاء:", err);
        toast.error("فشل في تحميل الأعضاء");
      });
  }, []);

  const handleSubmit = async () => {
    if (!selectedMemberId) {
      toast.error("يرجى اختيار العضو");
      return;
    }

    const selectedMember = members.find((m) => m.id === Number(selectedMemberId));
    if (!selectedMember) {
      toast.error("العضو المحدد غير موجود");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}candi-date`,
        {
          voteType,
          memberName: selectedMember.fullName,
          memberId: selectedMember.id,
        },
        {
          headers: {
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("تم إنشاء المرشح بنجاح!");
        setTimeout(() => navigate("/Candidates"), 1000); // غيّر المسار حسب الحاجة
      }
    } catch (err) {
      console.error("خطأ أثناء الإرسال:", err);
      toast.error("حدث خطأ أثناء إنشاء المرشح");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md">
      <ScrollArea className="max-h-[100vh] overflow-auto" dir="rtl">
        <div className="mt-4 space-y-6 px-1">
          <h3 className="text-lg font-semibold">إضافة مرشح جديد</h3>

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
            </TableBody>
          </Table>

          <div className="pt-4 flex justify-end gap-2" style={{ direction: "ltr" }}>
            <Button className="bg-blue-600 text-white" onClick={handleSubmit} disabled={loading}>
              {loading ? "جارٍ الإرسال..." : "حفظ المرشح"}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Candidates;
