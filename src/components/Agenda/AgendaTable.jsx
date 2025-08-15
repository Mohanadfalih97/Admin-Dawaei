import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal, FileText, Search, SlidersHorizontal,Filter } from "lucide-react";
import UserHead from "../profile/UserHead"

const mockPharmacies = [
  { id: 1, serial: 2, name: "صيدلية الشفاء", manager: "بها محمد كاظم", phone: "+96478XXXXXXXX", address: "بغداد - المنصور", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "معلقة" },
  { id: 2, serial: 4, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "معلقة" },
  { id: 3, serial: 7, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "معلقة" },
  { id: 4, serial: 9, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "معلقة" },
  { id: 5, serial: 13, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "معلقة" },
  { id: 6, serial: 1, name: "صيدلية الحياة", manager: "حسن عباس كاظم", phone: "+96478XXXXXXXX", address: "بغداد - الجامعة", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "نشطة" },
  { id: 7, serial: 14, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "نشطة" },
  { id: 8, serial: 10, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "نشطة" },
  { id: 9, serial: 6, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "نشطة" },
  { id: 10, serial: 3, name: "صيدلية الشمس", manager: "نور محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الكاظمية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "مرفوضة" },
  { id: 11, serial: 5, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "مرفوضة" },
  { id: 12, serial: 8, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "مرفوضة" },
  { id: 13, serial: 11, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "مرفوضة" },
  { id: 14, serial: 12, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "مرفوضة" },
  { id: 15, serial: 15, name: "صيدلية النبل", manager: "مصطفى محمد عبد", phone: "+96478XXXXXXXX", address: "بغداد - الحرية", joinDate: "2025/7/8", drugs: 1000, orders: 1000, status: "مرفوضة" },
];

const StatusBadge = ({ value }) => {
  const map = {
    "معلقة": "bg-amber-100 text-amber-700",
    "نشطة": "bg-emerald-100 text-emerald-700",
    "مرفوضة": "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[value] || "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
};

export default function PharmaciesTableMock() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(mockPharmacies.length / pageSize);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return mockPharmacies.slice(start, start + pageSize);
  }, [page]);

  return (
    <div className="mt-6">
         {/* Header */}
           <div className=" h-[50px] flex justify-between items-center px-5 opacity-100" style={{direction:"rtl"}}> 
  <UserHead  style={{direction:"ltr"}}/>
      {/* حقل البحث */}
<div className="flex justify-center items-center gap-1">
  
        <div className="flex items-center bg-white h-[45px] px-3 rounded-[16px] shadow border w-[300px] gap-1">
                  <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="ابحث عن صيدلية"
          className="flex-1 outline-none text-sm text-right placeholder-gray-400"
        />
      </div>
            <div className="flex items-center bg-white h-[45px] px-3 rounded-[16px] shadow border w-[80px]">
        <Filter
     
          className="flex-1 outline-none text-sm text-right placeholder-gray-400"
        />
      </div>
 
</div>
            </div>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between "  style={{ direction: "rtl" }}>
        
          <button
            className="inline-flex items-center h-[45px]  gap-2 rounded-full bg-emerald-500 px-4 py-2 text-white shadow hover:bg-emerald-600 transition"
            onClick={() => alert("تسجيل صيدلية (وهمي)")}
            style={{ direction: "ltr" }}
          >
            <Plus size={18} />
            <span>تسجيل صيدلية</span>
          </button>
        </div>
      <div className="w-full overflow-hidden  " style={{ direction: "rtl" }}>
     

        {/* Table */}
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-[980px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 pe-3 ps-4 text-center font-medium">التسلسل</th>
                <th className="py-3 px-3 text-center font-medium">اسم الصيدلية</th>
                <th className="py-3 px-3 text-center font-medium">اسم المدير</th>
                <th className="py-3 px-3 text-center font-medium">رقم الهاتف</th>
                <th className="py-3 px-3 text-center font-medium">العنوان</th>
                <th className="py-3 px-3 text-center font-medium">تاريخ الانضمام</th>
                <th className="py-3 px-3 text-center font-medium">عدد الدواء</th>
                <th className="py-3 px-3 text-center font-medium">عدد الطلبات</th>
                <th className="py-3 px-3 text-center font-medium">حالة الحساب</th>
                <th className="py-3 ps-3 pe-4 text-center font-medium">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pageData.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition border-b">
                  <td className="py-3 pe-3 ps-4 text-center text-gray-700">{p.serial}</td>
                  <td className="py-3 px-3 text-center text-gray-900">{p.name}</td>
                  <td className="py-3 px-3 text-center text-gray-900">{p.manager}</td>
                  <td className="py-3 px-3 text-center text-gray-700">{p.phone}</td>
                  <td className="py-3 px-3 text-center text-gray-700">{p.address}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      {p.joinDate}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900">{p.drugs}</td>
                  <td className="py-3 px-3 text-center text-gray-900">{p.orders}</td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge value={p.status} />
                  </td>
                  <td className="py-3 ps-3 pe-4">
                    <div className="flex items-center justify-center gap-2" style={{ direction: "ltr" }}>
                
                      <button
                        className="inline-flex items-center justify-center   border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"
                        title="المزيد"
                        onClick={() => alert(`المزيد عن ${p.name} (وهمي)`)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            السابق
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`rounded-full px-3 py-1 text-sm transition ${
                n === page ? "bg-emerald-500 text-white shadow" : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
