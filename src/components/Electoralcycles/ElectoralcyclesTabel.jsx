import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react";
import { DateTime } from "luxon";

// ✅ دالة تنسيق التاريخ بتوقيت بغداد وباللغة العربية
const formatDate = (date) => {
  if (!date) return "—";

  try {
    const baghdadTime = DateTime
      .fromISO(date, { zone: "utc" })       // ✅ البيانات القادمة غالبًا بتوقيت UTC
      .setZone("Asia/Baghdad")              // ✅ تحويل إلى توقيت بغداد
      .setLocale("ar");                     // ✅ اللغة العربية

    return `${baghdadTime.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)} (بتوقيت بغداد)`;
  } catch (error) {
    console.error("Date parsing error:", error);
    return "تاريخ غير صالح";
  }
};

const ElectionCyclesTable = ({ searchTerm }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("token");

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

      if (res.status === 200) {
        toast.update(toastId, {
          render: "تم الحذف بنجاح",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setElections((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.update(toastId, {
          render: "لم يتم الحذف، خطأ غير متوقع",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      const msg = error.response?.data?.msg;
      toast.update(toastId, {
        render: msg || "فشل في حذف الدورة",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
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
          startDate: new Date(cycle.startDate).toISOString(),
          finishDate: new Date(cycle.finishDate).toISOString(),
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

      toast.update(toastId, {
        render: "تم تحديث حالة الدورة",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setElections((prev) =>
        prev.map((item) =>
          item.id === cycle.id ? { ...item, [field]: value } : item
        )
      );
    } catch (err) {
      const msg = err.response?.data?.msg;
      let errorMessage = "حدث خطأ أثناء التحديث!";

      switch (msg) {
        case "Finish date cannot be before start date.":
          errorMessage = "تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البداية.";
          break;

        case "The new election cycle must start after the previous one finishes":
          errorMessage = "يجب أن تبدأ الدورة الجديدة بعد انتهاء الدورة السابقة.";
          break;

        case "Updated start date must be after the last cycle finishes":
          errorMessage = "يجب أن يكون تاريخ بدء الدورة المعدّلة بعد انتهاء الدورة السابقة.";
          break;

        case "Election cycle updated successfully.":
          errorMessage = "تم تحديث بيانات الدورة الانتخابية بنجاح.";
          break;

        default:
          if (msg?.startsWith("Cannot create a new election cycle until the previous one finishes on")) {
            const date = msg.split("on")[1]?.trim();
            errorMessage = `لا يمكن إنشاء دورة جديدة حتى تنتهي الدورة السابقة في ${date}.`;
          } else if (msg?.startsWith("Cannot update the election cycle while another is active until")) {
            const date = msg.split("until")[1]?.trim();
            errorMessage = `لا يمكن تعديل الدورة الانتخابية بينما هناك دورة نشطة حتى ${date}.`;
          } else {
            errorMessage = "حدث خطأ غير معروف أثناء معالجة الدورة الانتخابية.";
          }
          break;
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
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
            <tr><td colSpan="8" className="text-center py-4">جاري التحميل...</td></tr>
          ) : elections.length === 0 ? (
            <tr><td colSpan="8" className="text-center text-red-500 py-4">لا توجد نتائج مطابقة.</td></tr>
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
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">السابق</button>
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
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">التالي</button>
        </div>
      )}
    </div>
  );
};

export default ElectionCyclesTable;
