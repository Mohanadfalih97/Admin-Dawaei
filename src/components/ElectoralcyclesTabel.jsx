import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react";

const ElectionCyclesTable = ({ searchTerm }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  
useEffect(() => {
  const fetchElectionCycles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
        params: {
          Dscrp: searchTerm || "",
          PageNumber: currentPage,
          PageSize: pageSize,
        },
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });

      const data = res.data.data;
      setElections(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPageSize(data.pageSize || 10);
    } catch (error) {
      console.error("Error fetching election cycles:", error);
      toast.error("فشل في تحميل بيانات الدورات الانتخابية");
    } finally {
      setLoading(false);
    }
  };

  fetchElectionCycles();
}, [searchTerm, currentPage, pageSize]); // ✅ كل التبعيات المطلوبة


const deleteElectionCycle = async (id) => {
  setDeletingId(id); // ⬅️ نحدد الدورة التي يتم حذفها الآن

  try {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}elections-cycles/${id}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    });

    if (res.status === 204) {
      toast.success("تم حذف الدورة الانتخابية بنجاح");
      setElections((prev) => prev.filter((e) => e.id !== id));
    } else {
      toast.error("لم يتم الحذف، حدث خطأ غير متوقع.");
    }
  } catch (error) {
    console.error("Error deleting election cycle:", error);

    const serverMessage = error.response?.data?.msg;
    if (serverMessage === "Cannot delete this cycle. One or more members are assigned to it.") {
      toast.error("لا يمكن حذف هذه الدورة، هناك أعضاء مرتبطون بها.");
    } else {
      toast.error("فشل في حذف الدورة");
    }
  } finally {
    setDeletingId(null); // ⬅️ إلغاء التحديد بعد الانتهاء
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
      <h2 className="text-xl font-semibold mb-4">قائمة الدورات</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">الرقم</th>
            <th className="px-4 py-2 border text-center">الوصف</th>
            <th className="px-4 py-2 border text-center">تاريخ البدء</th>
            <th className="px-4 py-2 border text-center">تاريخ الانتهاء</th>
            <th className="px-4 py-2 border text-center">تاريخ الإنشاء</th>
            <th className="px-4 py-2 border text-center">تعديل</th>
            <th className="px-4 py-2 border text-center">حذف</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">جاري التحميل...</td>
            </tr>
          ) : elections.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-red-500 py-4">لا توجد نتائج مطابقة.</td>
            </tr>
          ) : (
            elections.map((e,index) => (
              <tr key={e.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{e.dscrp || "بدون وصف"}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{formatDate(e.startDate)}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{formatDate(e.finishDate)}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{formatDate(e.createdAt)}</td>
                <td className="px-4 py-2 border text-center">
                
                    <button className="text-blue-600 hover:text-blue-800"
                     onClick={() => navigate(`/EditElectoralcycles/${e.id}`, { state: { election: e } })}>
      <Pencil size={18} />
    </button>
                                  </td>
                <td className="px-4 py-2 border text-center">
   
  <button
 onClick={() => deleteElectionCycle(e.id)}
  disabled={deletingId === e.id}
      className="text-red-600 hover:text-red-800"
  >

    <Trash2 size={18} />
  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ الباجنيشن - عرض 5 صفحات فقط في كل مجموعة */}
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
    </div>
  );
};

export default ElectionCyclesTable;
