import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}department`,
          {
            params: {
              PageNumber: currentPage,
              PageSize: pageSize,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": "en",
              Accept: "application/json",
            },
          }
        );

        const data = response.data.data;
        setDepartments(data.items || []);
        setTotalPages(data.totalPages || 1);
        setPageSize(data.pageSize || 10);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب القطاعات:", error);
        toast.error(" فشل تحميل القطاعات");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [currentPage, pageSize]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });

      setDepartments((prev) => prev.filter((d) => d.id !== id));
      toast.success(" تم حذف القطاع بنجاح");
    } catch (error) {
      console.error("فشل في الحذف:", error);
      toast.error(" حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right mb-4">
          القطاعات
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <Link
            to="/Add-Department"
            className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
          >
            اضافة قطاع
          </Link>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-2 border text-center">اسم القطاع</th>
            <th className="px-2 py-2 border text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="text-center py-4">
                جاري التحميل...
              </td>
            </tr>
          ) : departments.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center text-red-500 py-4">
                لا توجد نتائج.
              </td>
            </tr>
          ) : (
            departments.map((dep) => (
              <tr key={dep.id} className="hover:bg-gray-100">
                <td className="px-2 py-2 border text-center">
                  {dep.departmentName}
                </td>
                <td className="px-2 py-2 border text-center">
                  <div className="">
                    <Link to={`/EditDepartment/${dep.id}`}>
                      <button className="text-blue-600 hover:text-blue-800" title="تعديل">
                        <Pencil size={18} />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(dep.id)}
                      disabled={deletingId === dep.id}
                      className={`text-red-600 hover:text-red-800 mr-5${
                        deletingId === dep.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="حذف"
                    >
                   
                  
                        <Trash2 size={18} />
                    
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* الباجينيشن */}
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
            const group = Math.floor((currentPage - 1) / visiblePages);
            const start = group * visiblePages + 1;
            const end = Math.min(start + visiblePages - 1, totalPages);

            return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-3 py-1 border rounded ${
                  currentPage === num ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
              >
                {num}
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

export default DepartmentTable;
