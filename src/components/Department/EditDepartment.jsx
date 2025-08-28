import React, { useState } from "react";
import { Plus, ChevronLeft } from "lucide-react";

/**
 * PharmacyDetailsPanel
 * - تصميم مستوحى من الصورة المرفقة
 * - مكتوب بـ TailwindCSS فقط (بدون تبعيات خارجية)
 * - يدعم RTL بالكامل
 */
export default function PharmacyDetailsPanel() {
  // بيانات تجريبية — يمكنك تمريرها كـ props لاحقًا إذا أردت
  const [pharmacy, setPharmacy] = useState({
    name: "صيدلية الحياة",
    owner: "الدكتور احمد عباس علي محمد",
    phone: "+9647700000000",
    email: "Ahmedmo@gmail.com",
    active: true,
    locked: false, // حالة قفل الصلاحية
  });

  const toggleActive = () => setPharmacy(p => ({ ...p, active: !p.active }));
  const toggleLocked = () => setPharmacy(p => ({ ...p, locked: !p.locked }));

  return (
    <div className="min-h-screen bg-[#e9eaec] flex" dir="rtl">
      {/* فراغ يسار مثل المعاينة */}
      <div className="hidden lg:block flex-1" />

      {/* اللوحة اليمنى */}
      <aside className="w-full lg:max-w-[520px] bg-white shadow-sm rounded-3xl m-4 lg:mx-6 overflow-hidden border border-zinc-100">
        {/* شريط علوي */}
        <div className="p-4 flex items-center justify-between">
          <button
            className="px-3 py-1.5 text-sm rounded-full border border-zinc-200 hover:bg-zinc-50 transition flex items-center gap-1"
            onClick={() => alert("عرض الصيدلية")}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>عرض الصيدلية</span>
          </button>

          <h2 className="font-semibold text-zinc-800">{pharmacy.name}</h2>

          <div className="flex items-center gap-2">
            {/* حالة النشاط */}
            <button
              onClick={toggleActive}
              className={`px-3 py-1.5 text-xs rounded-full transition border ${
                pharmacy.active
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-zinc-700 bg-zinc-50 border-zinc-200"
              }`}
            >
              {pharmacy.active ? "نشط" : "غير نشط"}
            </button>

            {/* أفاتار */}
            <div className="w-12 h-12 rounded-full border border-zinc-200 grid place-items-center relative">
              <Plus className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* معلومات الصيدلي */}
        <section className="p-4">
          <div className="space-y-1 text-sm">
            <div className="grid grid-cols-3 items-center">
              <span className="text-zinc-500">اسم الصيدلي</span>
              <span className="col-span-2 text-zinc-800">{pharmacy.owner}</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-zinc-500">رقم الهاتف</span>
              <span className="col-span-2 text-zinc-800">{pharmacy.phone}</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-zinc-500">البريد الالكتروني</span>
              <span className="col-span-2 text-zinc-800 truncate">{pharmacy.email}</span>
            </div>
          </div>
        </section>

        {/* الصلاحيات */}
        <section className="p-4">
          <div className="rounded-2xl border border-zinc-200 bg-white">
            <header className="p-4 border-b border-zinc-200">
              <h3 className="font-medium text-zinc-800">الصلاحيات</h3>
            </header>

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={pharmacy.locked}
                    onChange={toggleLocked}
                  />
                  <div className="w-12 h-7 bg-zinc-200 rounded-full peer-checked:bg-zinc-300 transition-all relative">
                    <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-all ${pharmacy.locked ? 'translate-x-5' : ''}`} />
                  </div>
                </label>

                <div className="space-y-0.5">
                  <div className="font-medium text-zinc-800">قفل الصلاحية</div>
                  <p className="text-xs text-zinc-500">
                    لن يعد بالإمكان الاستفادة من خدمات التطبيق
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
