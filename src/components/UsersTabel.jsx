import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alert, AlertTitle, AlertDescription } from "../components/Ui/Alert"; // المسار حسب مجلدك



const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showSuperAdminAlert, setShowSuperAdminAlert] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);


  const navigate = useNavigate();

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}auth/get-all-users`, {
        params: {
          name: searchQuery,
          PageNumber: currentPage,
          PageSize: pageSize,
          StartDate: "",
          EndDate: "",
          IsDeleted: false,
        },
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });

      const data = response.data.data;
      setUsers(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPageSize(data.pageSize || 10);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [searchQuery, currentPage, pageSize]);

  const openDialog = (user) => {
    navigate(`/user/${user.id}`, { state: { user } });
  };


const deleteUser = async (user) => {
  if (user.staticRole === 0) {
    setShowSuperAdminAlert(true);
    return;
  }

  setDeletingUserId(user.id); // ⬅️ تحديد المستخدم الجاري حذفه

  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}auth/${user.id}`, {
      headers: {
        "Accept-Language": "en",
        Accept: "application/json",
      },
    });

    if (response.status === 200) {
      toast.success("تم حذف المستخدم بنجاح!");
      setUsers(users.filter((u) => u.id !== user.id));
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("حدث خطأ أثناء الحذف!");
  } finally {
    setDeletingUserId(null); // ⬅️ إلغاء التحديد بعد انتهاء العملية
  }
};

useEffect(() => {
  if (showSuperAdminAlert) {
    const timeout = setTimeout(() => setShowSuperAdminAlert(false), 4000);
    return () => clearTimeout(timeout);
  }
}, [showSuperAdminAlert]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4" style={{ direction: "ltr" }}>
        <Link
          to="/Registration"
          className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          انشاء مستخدم
        </Link>
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right">
          المستخدمين
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="ابحث عن الاسم الكامل..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded px-4 py-2 w-full md:flex-1"
        />
        <button
          onClick={() => {
            setSearchQuery(searchInput);
            setCurrentPage(1);
          }}
          className="bg-blue-600 text-white px-4 py-2 w-40 rounded hover:bg-blue-700 transition"
        >
          بحث
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 md:px-4 py-2 border">العدد</th>
            <th className="px-2 md:px-4 py-2 border text-center">الاسم الكامل</th>
            <th className="px-2 md:px-4 py-2 border text-center">البريد الكتروني</th>
            <th className="px-2 md:px-4 py-2 border text-center">رمز البلد</th>
            <th className="px-2 md:px-4 py-2 border text-center">تعديل</th>
            <th className="px-2 md:px-4 py-2 border text-center">حذف</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="text-center py-4">جاري التحميل...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan="6" className="text-center text-red-500 py-4">لا توجد نتائج مطابقة.</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-2 md:px-4 py-2 border text-center">{user.id}</td>
                <td className="px-2 md:px-4 py-2 border text-center text-gray-700">{user.name}</td>
                <td className="px-2 md:px-4 py-2 border text-center text-gray-700">{user.email}</td>
                <td className="px-2 md:px-4 py-2 border text-center text-gray-700">{user.phoneCountryCode}</td>
                <td className="px-2 md:px-4 py-2 border text-center">
                  <button
                    type="button"
                    className="bg-blue-500 text-white text-xs font-bold p-3 rounded-full"
                    onClick={() => openDialog(user)}
                  >
                    تعديل
                  </button>
                </td>
                <td className="px-2 md:px-4 py-2 border text-center">
                <button
  className="bg-red-500 text-white text-xs font-bold p-3 rounded-full disabled:opacity-50"
  onClick={() => deleteUser(user)}
  disabled={deletingUserId === user.id}
>
  {deletingUserId === user.id ? "جارٍ الحذف..." : "حذف"}
</button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showSuperAdminAlert && (
  <Alert variant="destructive" className="mt-4">
    <AlertTitle>تنبيه</AlertTitle>
    <AlertDescription>
      لا يمكنك حذف مستخدم بصلاحية <strong>سوبر أدمن</strong>.
    </AlertDescription>
  </Alert>
)}


      {/* ✅ Pagination: فقط 5 صفحات في كل مجموعة */}
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

export default UsersTable;
