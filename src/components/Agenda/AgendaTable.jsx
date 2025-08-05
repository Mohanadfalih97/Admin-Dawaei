import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, FileText } from "lucide-react";
import { DateTime } from "luxon";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (date) => {
  if (!date) return "—";
  try {
    return DateTime
      .fromISO(date, { zone: "utc" })
      .setZone("Asia/Baghdad")
      .setLocale("ar")
      .toFormat("cccc d LLLL yyyy");
  } catch (error) {
    return "تاريخ غير صالح";
  }
};

const AgendaTable = ({ searchTerm }) => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}agendas`, {
          params: {
            Dscrp: searchTerm || "",
            PageNumber: currentPage,
            PageSize: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "ar",
          },
        });
        const data = res.data.data;
        setAgendas(data.items || []);
        setTotalPages(data.totalPages || 1);
        setPageSize(data.pageSize || 10);
      } catch (err) {
        toast.error("فشل تحميل جدول الأعمال");
      } finally {
        setLoading(false);
      }
    };

    fetchAgendas();
  }, [searchTerm, currentPage, pageSize]);

  const deleteAgenda = async (id) => {
    setDeletingId(id);
    const toastId = toast.loading("جاري الحذف...");
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}agendas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "ar",
        },
      });
      toast.update(toastId, {
        render: "تم الحذف بنجاح",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setAgendas((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.update(toastId, {
        render: "فشل في حذف الجدول",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
      <h2 className="text-xl font-semibold mb-4">جدول الأعمال</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border text-center">تاريخ الجدول</th>
            <th className="px-4 py-2 border text-center">الوصف</th>
            <th className="px-4 py-2 border text-center">المرفق</th>
            <th className="px-4 py-2 border text-center">تعديل</th>
            <th className="px-4 py-2 border text-center">حذف</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="text-center py-4">جاري التحميل...</td></tr>
          ) : agendas.length === 0 ? (
            <tr><td colSpan="6" className="text-center text-red-500 py-4">لا توجد نتائج.</td></tr>
          ) : (
            agendas.map((a, index) => (
              <tr key={a.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-2 border text-center">{formatDate(a.date)}</td>
                <td className="px-4 py-2 border text-center">{a.dscrp || "بدون وصف"}</td>
                <td className="px-4 py-2 border text-center">
                  <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <FileText size={18} />
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => navigate(`/EditAgenda/${a.id}`, { state: { agenda: a } })}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => deleteAgenda(a.id)}
                    disabled={deletingId === a.id}
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
    </div>
  );
};

export default AgendaTable;
