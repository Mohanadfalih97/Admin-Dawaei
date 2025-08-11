import React, { useMemo, useState } from "react";
import {
  Filter,
  Plus,
  MoreHorizontal,
  Search as SearchIcon,
} from "lucide-react";

const badgeCls = {
  متوفرة:
    "bg-green-100 text-green-700 border border-green-200 px-3  py-1 rounded-xl flex items-center justify-center",
  "غير متوفر":
    "bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-xl flex items-center justify-center",
};

// بيانات وهمية تطابق الصورة
const MOCK = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: i === 0 ? "Panadol" : "Amoxicillin",
  category: i === 0 ? "مسكن" : "مضاد حيوي",
  itemName: i === 0 ? "Panadol" : "Amoxicillin",
  availableQty: i === 0 ? "عبوة 120" : "عبوة 80",
  usedQty: i === 0 ? "—" : "عبوة 80",
  price: i === 0 ? "1500 دينار عراقي" : "3500 دينار عراقي",
  prodDate: "2023/7/7",
  expDate: "2026/6/8",
  status:
    [3, 7, 11, 13].includes(i + 1) // عشوائيًا لإظهار الأحمر مثل التصميم
      ? "غير متوفر"
      : "متوفرة",
}));

export default function MedicinesTable() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK;
    return MOCK.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.itemName.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (clampedPage - 1) * pageSize,
    clampedPage * pageSize
  );

  const go = (p) => p >= 1 && p <= totalPages && setPage(p);

  return (
    <div className="w-full" style={{ direction: "rtl" }}>
      {/* شريط علوي */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 rounded-full bg-white text-gray-700 shadow border hover:bg-gray-50 flex items-center justify-center"
            title="فلترة"
          >
            <Filter size={18} />
          </button>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث عن علاج"
              className="h-10 w-[300px] md:w-[420px] rounded-full bg-white shadow border pl-4 pr-10 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full shadow"
          onClick={() => alert("فتح نموذج تسجيل علاج")}
        >
          تسجيل علاج <Plus size={18} />
        </button>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm" style={{ direction: "rtl" }}>
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <Th>الإجراءات</Th>
                <Th>حالة الحساب</Th>
                <Th>تاريخ الانتهاء</Th>
                <Th>تاريخ الإنتاج</Th>
                <Th>السعر</Th>
                <Th>الكمية المصروفة</Th>
                <Th>الكمية المتوفرة</Th>
                <Th>الفئة</Th>
                <Th>اسم الصنف</Th>
                <Th>اسم العلاج</Th>
                <Th>التسلسل</Th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-gray-50/60 transition-colors"
                >
                  <Td center>
                    <button
                      className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      title="المزيد"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </Td>
                  <Td  center>
                    <span className={badgeCls[row.status]}>{row.status}</span>
                  </Td>
                  <Td center>{row.expDate}</Td>
                  <Td center>{row.prodDate}</Td>
                  <Td center>{row.price}</Td>
                  <Td center>{row.usedQty}</Td>
                  <Td center>{row.availableQty}</Td>
                  <Td center>{row.category}</Td>
                  <Td center>{row.itemName}</Td>
                  <Td center className="font-medium">
                    {row.name}
                  </Td>
                  <Td center className="text-gray-500">
                    {row.id}
                  </Td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-8 text-red-500 font-medium"
                  >
                    لا توجد نتائج مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

   
      </div>
           {/* الترقيم */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => go(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            السابق
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  onClick={() => go(n)}
                  className={`h-8 w-8 rounded-full border flex items-center justify-center ${
                    n === page
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            التالي
          </button>
        </div>
    </div>
  );
}

/* عناصر مساعدة لرأس الجدول والخلايا */
function Th({ children }) {
  return (
    <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, center }) {
  return (
    <td
      className={`px-4 py-3 whitespace-nowrap ${
        center ? "text-center" : "text-right"
      }`}
    >
      {children}
    </td>
  );
}
