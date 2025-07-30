import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const ElectionCyclesTable = ({ searchTerm }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("token");

const formatDate = (date) => {
  if (!date) return "—";
  try {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "مساءً" : "صباحًا";
    const formattedTime = `${(hours % 12 || 12)}:${minutes} ${ampm}`;
    const formattedDate = format(d, "EEEE، d MMMM yyyy", { locale: ar });

    return `${formattedDate} في ${formattedTime}`;
  } catch {
    return "تاريخ غير صالح";
  }
};


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
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Accept-Language": "ar",
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
  }, [searchTerm, currentPage, pageSize, token]);

  const deleteElectionCycle = async (id) => {
    setDeletingId(id);
    const toastId = toast.loading("جاري الحذف...");
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}elections-cycles/${id}`, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        toast.update(toastId, { render: "تم الحذف بنجاح", type: "success", isLoading: false, autoClose: 2000 });
        setElections((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.update(toastId, { render: "لم يتم الحذف، خطأ غير متوقع", type: "error", isLoading: false ,autoClose: 2000 });
      }
    } catch (error) {
     console.error("Error deleting election cycle:", error);
  const serverMessage = error.response?.data?.msg;

  if (serverMessage === "Cannot delete this cycle. One or more members are assigned to it.") {
    toast.update(toastId, {
      render: "لا يمكن حذف هذه الدورة، هناك أعضاء مرتبطون بها.",
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  } else if (serverMessage === "Cycle not found or already deleted.") {
    toast.update(toastId, {
      render: "لم يتم العثور على الدورة أو تم حذفها مسبقًا.",
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  } else {
    toast.update(toastId, {
      render: serverMessage || "فشل في حذف الدورة",
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  }
    } finally {
      setDeletingId(null);
    }
  };

  const updateVoteStatus = async (cycle, field, value) => {
    const toastId = toast.loading("جاري التحديث...");
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}elections-cycles/${cycle.id}`,
        {
          dscrp: cycle.dscrp,
          startDate: cycle.startDate,
          finishDate: cycle.finishDate,
          [field]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Accept-Language": "ar",
            "Content-Type": "application/json",
          },
        }
      );

      toast.update(toastId, { render: "تم تحديث حالة الدورة", type: "success", isLoading: false, autoClose: 2000 });
      setElections((prev) =>
        prev.map((item) =>
          item.id === cycle.id ? { ...item, [field]: value } : item
        )
      );
    } catch (error) {
      console.error("فشل في تحديث حالة الدورة:", error);
      const msg = error.response?.data?.msg;

      if (msg === "Election cycle not found.") {
        toast.update(toastId, { render: "لم يتم العثور على الدورة", type: "error", isLoading: false });
      } else if (msg === "Another active election cycle already exists. You cannot activate this one.") {
        toast.update(toastId, { render: "يوجد دورة نشطة بالفعل، لا يمكنك تفعيل أخرى", type: "error", isLoading: false });
      } else {
        toast.update(toastId, { render: "فشل في تحديث الحالة", type: "error", isLoading: false });
      }
    }
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
            <th className="px-4 py-2 border text-center">الحالة</th>
            <th className="px-4 py-2 border text-center">تعديل</th>
            <th className="px-4 py-2 border text-center">حذف</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-4">جاري التحميل...</td>
            </tr>
          ) : elections.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-red-500 py-4">لا توجد نتائج مطابقة.</td>
            </tr>
          ) : (
            elections.map((e, index) => (
              <tr key={e.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{e.dscrp || "بدون وصف"}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{formatDate(e.startDate)}</td>
                <td className="px-4 py-2 border text-center text-gray-700">{formatDate(e.finishDate)}</td>
                <td className="px-4 py-2 border text-center text-gray-700">
                  <label className="flex items-center gap-2 justify-center">
                    <input
                      type="checkbox"
                      checked={e.voteActveStatus === 1}
                      disabled={
                        e.voteActveStatus !== 1 &&
                        elections.some(c => c.voteActveStatus === 1)
                      }
                      onChange={(event) =>
                        updateVoteStatus(e, "voteActveStatus", event.target.checked ? 1 : 0)
                      }
                    />
                    تنشيط الدورة
                  </label>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/EditElectoralcycles/${e.id}`, { state: { election: e } })}
                  >
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

      {/* ✅ Pagination */}
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
