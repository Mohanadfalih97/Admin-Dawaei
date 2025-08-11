import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Search, SlidersHorizontal, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";

const badgeCls = {
  active: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  blocked: "bg-red-100 text-red-700 border-red-200",
};

function StatusBadge({ status }) {
  const key = status === 1 || status === true ? "active" : status === -1 ? "blocked" : "pending";
  const text = key === "active" ? "نشطة" : key === "blocked" ? "موقوفة" : "معلقة";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${badgeCls[key]}`}>
      {text}
    </span>
  );
}

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}auth/get-all-users`, {
          params: {
            name: searchQuery,
            PageNumber: currentPage,
            PageSize: pageSize,
            StartDate: "",
            EndDate: "",
            IsDeleted: false,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "ar",
            Accept: "application/json",
          },
        });
        const data = res.data?.data ?? {};
        setUsers(data.items || []);
        setTotalPages(data.totalPages || 1);
        setPageSize(data.pageSize || pageSize);
      } catch (e) {
        console.error(e);
        toast.error("حدث خطأ أثناء تحميل المستخدمين.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchQuery, currentPage, pageSize, token]);

  const openDialog = (user) => navigate(`/user/${user.id}`, { state: { user } });

  const deleteUser = async (user) => {
    if (user?.staticRole === 0) {
      toast.info("لا يمكنك حذف مستخدم بصلاحية سوبر أدمن.");
      return;
    }
    setDeletingUserId(user.id);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}auth/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "ar",
          Accept: "application/json",
        },
      });
      toast.success("تم حذف المستخدم بنجاح!");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      toast.error("حدث خطأ أثناء الحذف!");
    } finally {
      setDeletingUserId(null);
    }
  };

  const goToPage = (p) => p >= 1 && p <= totalPages && setCurrentPage(p);

  return (
    <div className="p" >
      {/* شريط علوي */}
      <div className=" px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* بحث + فلترة */}
          <div className="flex w-full md:w-auto items-center gap-3">
            <button
              type="button"
              className="h-10 w-12 rounded-full bg-white  border border-gray-300 flex items-center justify-center hover:bg-#D9D9D9/15 transition"
              title="فلترة"
            >
              <SlidersHorizontal className="size-5 text-gray-500 border-gray-300" />
            </button>

            <div className="flex-1 md:w-[420px] h-10 rounded-full  border border-gray-300 backdrop-blur-sm overflow-hidden flex items-center">
              <Search className="mx-3 size-5 text-gray-500" />
              <input
                className="flex-1 bg-transparent bg-white text-gray-500 placeholder-gray-500 focus:outline-none"
                placeholder="ابحث عن مستخدم"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setSearchQuery(searchInput), setCurrentPage(1))}
              />
              <button
                onClick={() => { setSearchQuery(searchInput); setCurrentPage(1); }}
                className="px-4 h-full text-white/90 hover:bg-white/10"
              >
                بحث
              </button>
            </div>
          </div>

          {/* زر إنشاء */}
          <Link
            to="/Registration"
            className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow"
          >
            <span>تسجيل مستخدم</span>
            <Plus className="size-5" />
          </Link>
        </div>

        {/* بطاقة الجدول */}
        <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead  className=" text-gray-600 text-sm ">
                <tr>
                  <Th className="text-center "></Th>
                  <Th className="text-center ">حالة الحساب</Th>
                  <Th className="text-center ">عدد الطلبات</Th>
                  <Th className="text-center ">تاريخ الانضمام</Th>
                  <Th className="text-center ">العنوان</Th>
                  <Th className="text-center ">رقم الهاتف</Th>
                  <Th className="text-center">البريد الإلكتروني</Th>
                  <Th className="text-center ">اسم المستخدم</Th>
                  <Th className="text-center">الترتيب</Th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="border-t">
                      <Td colSpan={9}>
                        <div className="h-5 w-full animate-pulse bg-gray-100 rounded" />
                      </Td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr className="border-t">
                    <Td colSpan={9} className="text-center py-8 text-gray-500">لا توجد نتائج مطابقة.</Td>
                  </tr>
                ) : (
                  users.map((u, i) => {
                    const rowIndex = (currentPage - 1) * pageSize + i + 1;
                    return (
                      <tr key={u.id} className="border-t hover:bg-gray-50">
                        <Td>
                          <button className="p-2 rounded hover:bg-gray-100 " title="إجراءات">
                            <MoreHorizontal className="size-5 text-gray-500 " />
                          </button>
                        </Td>
                        <Td className="text-center">
                          {/* حاول جلب حالة فعلية من API: u.accountStatus / u.isActive / u.isBlocked */}
                          <StatusBadge status={u.isActive ?? 1} />
                        </Td>
                        <Td className="text-gray-700 text-center">{u.ordersCount ?? 1000}</Td>
                        <Td className="text-gray-700 text-center">{(u.createdAt ?? "").toString().slice(0, 10).replaceAll("-", "/")}</Td>
                        <Td className="text-gray-700 text-center">{u.address ?? "بغداد - السعدون"}</Td>
                        <Td className="text-gray-700 text-center">
                          {`${u.phoneCountryCode ?? "+964"}${u.phone?.replace(/\d(?=\d{4})/g, "X") ?? "7XXXXXXXX"}`}
                        </Td>
                        <Td className="text-gray-700 text-center">{u.email}</Td>
                        <Td className="text-gray-900 font-medium text-center">{u.name}</Td>
                        <Td className="text-gray-500 text-center">{rowIndex}</Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* شريط الإجراءات السفلي (تعديل/حذف) مشابه للصورة يمكن فتحه عند النقر من عمود … */}
          {/* ترقيم الصفحات */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-full border text-gray-700 disabled:opacity-40"
              >
                السابق
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, k) => k + 1)
                  .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`h-9 min-w-9 px-3 rounded-full border ${
                        p === currentPage ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-full border text-gray-700 disabled:opacity-40"
              >
                التالي
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* صغائح خلايا الجدول المختصرة */
function Th({ children }) {
  return (
    <th className="px-4 py-3 font-semibold ">
      {children}
    </th>
  );
}
function Td({ children, className = "", ...rest }) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}
