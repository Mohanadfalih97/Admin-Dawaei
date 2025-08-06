import React, { useEffect, useState } from "react";
import MembersDilog from "./MembersDilog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { FileText, RefreshCw, Send } from "lucide-react";
import { toast } from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

const MemberTable = ({ searchTerm }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [institutionId, setInstitutionId] = useState(null);
  const [selectedResetMember, setSelectedResetMember] = useState(null);

const sendResetEmailMessage = async (email) => {
  try {
    const Token = localStorage.getItem("token");

    const response = await fetch(`${process.env.REACT_APP_API_URL}otp/send-message-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "ar",
        Authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify({
        email: email,
        voteUrl: `${process.env.REACT_APP_VOTE_URL}/LoginAsMember`
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      console.error("فشل في إرسال الإشعار:", result?.error || result);
      toast.warn("تم تغيير الرمز السري، لكن تعذر إرسال الإشعار عبر البريد.");
    }
  } catch (err) {
    console.error("خطأ أثناء إرسال الإشعار:", err);
    toast.warn("تم تغيير الرمز السري، لكن تعذر إرسال الإشعار عبر البريد.");
  }
};


  useEffect(() => {
    const fetchInstitution = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}institution`, {
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.data?.items?.length > 0) {
          setInstitutionId(result.data.items[0].id);
        }
      } catch (err) {
        console.error("Institution fetch error:", err);
      }
    };

    fetchInstitution();
  }, []);

  const formatDateArabic = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "yyyy/MM/dd", { locale: ar });
    } catch {
      return "—";
    }
  };

  const sendVoteLink = async (email) => {
    if (!email) {
      toast.error("البريد الإلكتروني غير متوفر");
      return;
    }
    try {
      const Token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}otp/send-member-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
          Accept: "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({
          email,
          voteUrl: `${process.env.REACT_APP_VOTE_URL}/LoginAsMember`,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        toast.error(`فشل الإرسال: ${text}`);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("حدث خطأ أثناء إرسال الرابط.");
    }
  };

  const handleSubmit = async (memberId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/reset-member-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId: memberId.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم تغيير الرمز السري بنجاح");

        const emailResponse = await fetch(`${process.env.REACT_APP_API_URL}members?MemberId=${encodeURIComponent(memberId.trim())}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${token}`,
          },
        });

        const emailResult = await emailResponse.json();
        const member = emailResult?.data?.items?.[0];

        if (member?.eMail) {
          await sendResetEmailMessage(member.eMail);
        }
      } else {
        const msg = result.msg || "فشل تغيير الرمز السري";
        toast.error(msg);
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
      setSelectedResetMember(null);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}members?PageNumber=${currentPage}&PageSize=${pageSize}`,
          {
            headers: {
              Accept: "application/json",
              "Accept-Language": "en",
              Authorization: `Bearer ${token}`,
            },
          });

        const result = await response.json();
        if (response.ok && result.data?.items) {
          setMembers(result.data.items);
          setTotalPages(result.data.totalPages || 1);
          setPageSize(result.data.pageSize || 10);
          setError("");
        } else {
          setError(result.msg || "فشل في جلب البيانات");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("حدث خطأ أثناء الاتصال بالخادم.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openDialog = (member) => {
    setSelectedReport(member);
    setOpen(true);
  };

  const filteredMembers = members.filter((member) => {
    const search = searchTerm.trim().toLowerCase();
    return member.fullName?.toLowerCase().includes(search);
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
      <h1 className="text-xl md:text-2xl font-semibold text-right mb-4">قائمة الأعضاء</h1>
      {error && <p className="text-red-600 text-right mb-4">{error}</p>}
      <table className="min-w-full table-auto" style={{ direction: "ltr" }}>
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th  className="px-2 md:px-6 py-3 text-center border-b">الإجراءات</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">تاريخ الإنشاء</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">رقم WhatsApp</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">رقم الهاتف</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">البريد الإلكتروني</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">القسم</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">المنصب</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">الاسم</th>
            <th  className="px-2 md:px-6 py-3 text-center border-b">الرمز التعريفي</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="10" className="text-center">جاري التحميل...</td></tr>
          ) : filteredMembers.length === 0 ? (
            <tr><td colSpan="10" className="text-center text-red-500">لا توجد نتائج مطابقة.</td></tr>
          ) : (
            filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-100">
                <td className="text-center">
                  <div className="flex gap-3 justify-center py-2">
                    <button title="عرض التقرير" className="text-blue-600" onClick={() => openDialog(member)}><FileText size={18} /></button>
                    <button title="إعادة تعيين الرمز" className="text-green-600" onClick={() => setSelectedResetMember(member)}><RefreshCw size={18} /></button>
                    <button title="إرسال رابط التصويت" className="text-purple-600" onClick={() => sendVoteLink(member.eMail)}><Send size={18} /></button>
                  </div>
                </td>
                <td className="text-center">{formatDateArabic(member.createdAt)}</td>
                <td className="text-center">{member.watsApp || "—"}</td>
                <td className="text-center">{member.phone1 || "—"}</td>
                <td className="text-center">{member.eMail || "—"}</td>
                <td className="text-center">{member.department || "—"}</td>
                <td className="text-center">{member.position || "—"}</td>
                <td className="text-center">{member.fullName}</td>
                <td className="text-center">{member.memberId}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">السابق</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
            <button key={pageNum} onClick={() => goToPage(pageNum)} className={`px-3 py-1 border rounded ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>{pageNum}</button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">التالي</button>
        </div>
      )}

      <MembersDilog
        open={open}
        onOpenChange={setOpen}
        member={selectedReport}
        memberId={selectedReport?.memberId}
        fullName={selectedReport?.fullName}
        department={selectedReport?.department}
        position={selectedReport?.position}
        imgUrl={selectedReport?.imgUrl}
        phone1={selectedReport?.phone1}
        phone2={selectedReport?.phone2}
        watsApp={selectedReport?.watsApp}
        eMail={selectedReport?.eMail}
        cycleId={selectedReport?.cycleId}
        createdAt={selectedReport?.createdAt}
        updatedAt={selectedReport?.updatedAt}
        institutionId={institutionId}
      />

      {selectedResetMember && (
        <AlertDialog.Root open={true} onOpenChange={() => setSelectedResetMember(null)}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg w-7/12 max-w-md">
              <AlertDialog.Title className="text-lg font-semibold text-gray-800 mb-2 text-center">
                تأكيد إعادة تعيين الرمز
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-600 mb-4">
                هل أنت متأكد أنك تريد إعادة تعيين الرمز السري لهذا العضو ({selectedResetMember.fullName})؟
              </AlertDialog.Description>
              <div className="flex justify-center gap-3">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    إلغاء
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    className="px-4 py-1 bg-blue-800 text-white rounded hover:bg-blue-700"
                    onClick={() => handleSubmit(selectedResetMember.memberId)}
                  >
                    تأكيد
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </div>
  );
};

export default MemberTable;
