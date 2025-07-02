import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

 useEffect(() => {
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}candi-date`, {
        params: {
          PageNumber: currentPage,
          PageSize: pageSize,
        },
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });

      const data = res.data.data;
      setCandidates(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPageSize(data.pageSize || 10);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("فشل في تحميل بيانات المرشحين");
    } finally {
      setLoading(false);
    }
  };

  fetchCandidates();
}, [currentPage, pageSize]); // ✅ التبعيات الصحيحة

  const deleteCandidate = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}candi-date/${id}`, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });

      if (res.status === 204) {
        toast.success("تم حذف المرشح بنجاح");
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        setTimeout(() => navigate("/Candidates"), 1000);
      } else {
        toast.error("لم يتم حذف المرشح، حدث خطأ غير متوقع.");
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("فشل في حذف المرشح");
    }
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleString("ar-IQ", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4" style={{ direction: "ltr" }}>
        <Link
          to="/AddCandidates"
          className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          اضافة مرشح
        </Link>
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right">
          المرشحين
        </h1>
      </div>

      <h2 className="text-xl font-semibold mb-4">قائمة المرشحين</h2>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">الرقم</th>
            <th className="px-4 py-2 border text-center">اسم العضو</th>
            <th className="px-4 py-2 border text-center">رقم العضو</th>
            <th className="px-4 py-2 border text-center">نوع التصويت</th>
            <th className="px-4 py-2 border text-center">تاريخ الإنشاء</th>
            <th className="px-4 py-2 border text-center">تعديل</th>
            <th className="px-4 py-2 border text-center">حذف</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center py-4">جاري التحميل...</td></tr>
          ) : candidates.length === 0 ? (
            <tr><td colSpan="7" className="text-center text-red-500 py-4">لا توجد نتائج.</td></tr>
          ) : (
            candidates.map((c) => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{c.id}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{c.memberName || "غير متوفر"}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{c.memberId || "غير متوفر"}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{c.voteType === 0 ? "عام" : "خاص"}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="bg-blue-500 text-white text-xs font-bold p-2 rounded-full"
                    onClick={() => navigate(`/EditCandidates/${c.id}`, { state: { candidate: c } })}
                  >
                    تعديل
                  </button>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="bg-red-500 text-white text-xs font-bold p-2 rounded-full"
                    onClick={() => deleteCandidate(c.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ الباجنيشن */}
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
                className={`px-3 py-1 border rounded ${pageNum === currentPage ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
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
    </div>
  );
};

export default CandidatesTable;
