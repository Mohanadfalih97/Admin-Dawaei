import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText,Pencil, Trash2  } from "lucide-react";
import { DateTime } from "luxon";
import { Link ,useNavigate} from "react-router-dom";








const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

// إعداد دالة عرض التاريخ بالعربية
const formatDate = (date) => {
  if (!date) return "—";
  try {
    return DateTime
      .fromISO(date, { zone: "utc" })
      .setZone("Asia/Baghdad")
      .setLocale("ar")
      .toFormat("cccc dd-MM-yyyy"); // يوم الأسبوع + يوم + شهر + سنة بصيغة رقمية
  } catch (error) {
    return "تاريخ غير صالح";
  }
};


  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}document`, {
          params: {
            PageNumber: currentPage,
            PageSize: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "ar",
          },
        });

        const data = res.data.data;
        setDocuments(data.items || []);
        setTotalPages(data.totalPages || 1);
        setPageSize(data.pageSize || 10);
      } catch (err) {
        toast.error("فشل تحميل الوثائق");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, pageSize]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
const deleteDocument = async (id) => {


  try {
    setDeletingId(id);

    await axios.delete(`${process.env.REACT_APP_API_URL}document/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "ar",
      },
    });

    toast.success("تم حذف الجدول بنجاح");

    // إعادة تحميل البيانات بعد الحذف
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  } catch (error) {
    toast.error("فشل في حذف الجدول");
  } finally {
    setDeletingId(null);
  }
};

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
       <div className="flex flex-col-reverse md:flex-row  md:items-center justify-between gap-4 mb-4" style={{ direction: "ltr" }}>
        <Link
          to="/add-Agenda"
          className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
             أضافة جدول اعمال
        </Link>
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right">
           جداول الاعمال 
        </h1>
      </div>
      <h2 className="text-xl font-semibold mb-4"> قائمه الجداول</h2>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border text-center">تاريخ الجدول</th>
            <th className="px-4 py-2 border text-center">الوصف</th>
            <th className="px-4 py-2 border text-center"> ملف جدول الاعمال </th>
                        <th className="px-4 py-2 border text-center">  ملف مخرجات الجلسة</th>

                          <th className="px-4 py-2 border">إجراءات</th>

          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" className="text-center py-4">جاري التحميل...</td></tr>
          ) : documents.length === 0 ? (
            <tr><td colSpan="4" className="text-center text-red-500 py-4">لا توجد نتائج.</td></tr>
          ) : (
            documents.map((doc, index) => (
              <tr key={doc.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-2 border text-center">{formatDate(doc.date)}</td>
                <td className="px-4 py-2 border text-center">{doc.dscrp || "بدون وصف"}</td>
                <td className="px-4 py-2 border text-center  ">
                  <a
                    href={doc.inUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                  >
                    <FileText size={18} />
                  </a>
                </td>
                 <td className="px-4 py-2 border text-center">
  {doc.outUrl ? (
    <a
      href={doc.outUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
    >
      <FileText size={18} />
    </a>
  ) : (
    <span className="text-gray-400 flex items-center justify-center cursor-not-allowed">
      <FileText size={18} />
    </span>
  )}
</td>

                    <td className="px-4 py-2 border text-center">
        <div className="flex items-center justify-center gap-2">
                    <button
                    className="text-blue-600 hover:text-blue-800"
onClick={() => navigate(`/EditAgenda/${doc.id}`, { state: { agenda: doc } })}
                  >
                    <Pencil size={18} />
                  </button>
              <button
  onClick={() => deleteDocument(doc.id)}
  disabled={deletingId === doc.id}
  className="text-red-600 hover:text-red-800 ml-2"
>
  {deletingId === doc.id ? "..." : <Trash2 size={18} />}
</button>
        </div>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            السابق
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 border rounded ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              {pageNum}
            </button>
          ))}

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

export default DocumentTable;
