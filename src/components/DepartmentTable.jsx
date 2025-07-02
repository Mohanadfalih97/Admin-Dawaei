import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}department`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": "en",
              Accept: "application/json",
            },
          }
        );

        const data = response.data.data;
        setDepartments(data.items || []);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب القطاعات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

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
      toast.success("✅ تم حذف القطاع بنجاح");
    } catch (error) {
      console.error("فشل في الحذف:", error);
      toast.error("❌ حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto"
      style={{ direction: "rtl" }}
    >
 <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4" >
       <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right mb-4">
        القطاعات
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 " >
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
                <td className="px-2 py-2 border text-center space-x-2 space-x-reverse">
                  <Link
                    to={`/EditDepartment/${dep.id}`}
                    className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(dep.id)}
                    disabled={deletingId === dep.id}
                    className={`px-3 py-2 rounded-full text-sm text-white ${
                      deletingId === dep.id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {deletingId === dep.id ? "جارٍ الحذف..." : "حذف"}
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

export default DepartmentTable;
