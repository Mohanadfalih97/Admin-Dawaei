import React, { useEffect, useState } from "react";
import MembersDilog from "./MembersDilog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { FileText, RefreshCw, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const MemberTable = ({ searchTerm }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [institutionId, setInstitutionId] = useState(null);


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
      } else {
        console.error("Institution fetch failed");
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
      return format(new Date(dateStr), "yyyy/MM/dd ", { locale: ar });
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
          const Token= localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}otp/send-member-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
          Accept: "application/json",
          Authorization: `Bearer ${Token}`,

        },
        body: JSON.stringify({
          email: email,
          voteUrl: `${process.env.REACT_APP_VOTE_URL}/vote`,
        }),
      });

      const text = await response.text();
      if (response.ok) {
      } else {
        toast.error(` فشل الإرسال: ${text}`);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("حدث خطأ أثناء إرسال الرابط.");
    }
  };

  const goToResetAccesscodePage = (memberId) => {
    navigate(`/RestAccesscodeByAdmin/${memberId}`);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}members?PageNumber=${currentPage}&PageSize=${pageSize}`,
          {
            headers: {
              Accept: "application/json",
              "Accept-Language": "en",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
            <th className="px-2 md:px-6 py-3 text-center border-b">الإجراءات</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">تاريخ التعديل</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">تاريخ الإنشاء</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">رقم WhatsApp</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">رقم الهاتف</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">البريد الإلكتروني</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">القسم</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">المنصب</th>
            <th className="px-2 md:px-6 py-3 text-right border-b">الاسم</th>
            <th className="px-2 md:px-6 py-3 text-center border-b">الرمز التعريفي</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center py-4">جاري التحميل...</td>
            </tr>
          ) : filteredMembers.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center text-red-500 py-4">
                لا توجد نتائج مطابقة.
              </td>
            </tr>
          ) : (
            filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-100">
        <td className="px-2 md:px-6 py-4 border-b text-center">
  <div className="flex flex-row gap-4 py-3 justify-center">
    <button
      onClick={() => openDialog(member)}
      className="text-blue-600 hover:text-blue-800"
      title="عرض التقرير"
    >
      <FileText size={18} />
    </button>
    <button
      onClick={() => goToResetAccesscodePage(member.memberId)}
      className="text-green-600 hover:text-green-800"
      title="إعادة تعيين الرمز"
    >
      <RefreshCw size={18} />
    </button>
    <button
      onClick={() => sendVoteLink(member.eMail)}
      className="text-purple-600 hover:text-purple-800"
      title="إرسال رابط التصويت"
    >
      <Send size={18} />
    </button>
  </div>
</td>

                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {formatDateArabic(member.updatedAt)}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {formatDateArabic(member.createdAt)}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {member.watsApp || "—"}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {member.phone1 || "—"}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {member.eMail || "—"}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {member.department || "—"}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {member.position || "—"}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-right text-gray-600">
                  {member.fullName}
                </td>
                <td className="px-2 md:px-6 py-4 border-b text-center text-gray-600">
                  {member.memberId}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            السابق
          </button>

          {(() => {
            const visiblePages = 5;
            const currentGroup = Math.floor((currentPage - 1) / visiblePages);
            const startPage = currentGroup * visiblePages + 1;
            const endPage = Math.min(startPage + visiblePages - 1, totalPages);

            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 border rounded ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
              >
                {pageNum}
              </button>
            ));
          })()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            التالي
          </button>
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
    </div>
  );
};

export default MemberTable;
