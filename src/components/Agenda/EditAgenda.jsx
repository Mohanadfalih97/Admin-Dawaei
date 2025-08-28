import React, { useState } from "react";

/**
 * MedicineForm
 * - تصميم RTL مطابق للصورة
 * - شبكة حقول مرنة: عمود واحد على الموبايل، عمودان على الشاشات المتوسطة+
 * - صورة المنتج في أعلى يمين النموذج
 * - أزرار: حفظ (أساسي) + حذف العلاج (خطر)
 * - onSave/onDelete كـ Props اختيارية
 */
export default function MedicineForm({
  initial = {},
  onSave,
  onDelete,
  productImage =
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop",
}) {
  const [form, setForm] = useState({
    // أسماء مطابقة لما في الصورة
    tradeName: "Panadol 500 mg Tablets",
    scientificName: "paracetamol",
    manufacturer: "GSK ( Glaxo Smith Kline )",
    description:
      "دواء مسكن للألم وخافض للحرارة لعلاج الصداع، ألم العضلات، آلام الأسنان",
    type: "TABLETS",
    dose: "500 Mg",
    packageType: "شريط يحتوي على 10 أقراص",
    availability: "متوفر",
    supplierName: "شركة النصر للأدوية",
    originCountry: "المملكة المتحدة UK",
    originCountry2: "المملكة المتحدة UK",
    price: "1000 دينار عراقي",
    quantity: "500 عبوة",
    licenseNo: "MOH-12345678",
    issueDate: "2025-07-06",
    expireDate: "2026-05-05",
    licenseStatus: "ساري",
    authority: "وزارة الصحة",
    prodDate1: "2023-04-05",
    prodDate2: "2023-04-05",
    endDate1: "2026-05-07",
    endDate2: "2026-05-07",
    uses:
      "مسكن وخافض حرارة\nيستخدم للصداع والحمى\nآلام العضلات والمفاصل",
    sideEffects:
      "الغثيان أو النعاس\nالطفح أو احمرار الجلد\nألم خفيف في المعدة\nطفح جلدي أو حكة",
    notes:
      "عند استخدامها مع أدوية تحتوي على نفس المادة الفعالة تجنب الجرعة الزائدة",
    ...initial,
  });

  const handle = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const submit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <form
      onSubmit={submit}
      dir="rtl"
      className="w-full bg-white rounded-2xl shadow border border-slate-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200">
        <div>
          <h2 className="text-slate-700 text-lg font-semibold">
            المعلومات العامة عن العلاج
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={productImage}
            alt="product"
            className="w-16 h-16 object-cover rounded-xl border border-slate-200"
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* صف الاسم التجاري / العلمي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="الاسم التجاري">
            <Input
              value={form.tradeName}
              onChange={(e) => handle("tradeName", e.target.value)}
              placeholder="Panadol 500 mg Tablets"
            />
          </Field>

          <Field label="الاسم العلمي">
            <Input
              value={form.scientificName}
              onChange={(e) => handle("scientificName", e.target.value)}
              placeholder="paracetamol"
            />
          </Field>
        </div>

        {/* الشركة المصنّعة (يسار) – في الصورة على اليسار تحت العلمي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="الشركة المصنعة">
            <Input
              value={form.manufacturer}
              onChange={(e) => handle("manufacturer", e.target.value)}
            />
          </Field>

          <div /> {/* فراغ لمحاذاة الشبكة مثل الصورة */}
        </div>

        {/* الوصف */}
        <Field label="الوصف">
          <Textarea
            rows={2}
            value={form.description}
            onChange={(e) => handle("description", e.target.value)}
            placeholder="دواء مسكن للألم وخافض للحرارة..."
          />
        </Field>

        {/* النوع / الأثر / نوع العبوة / حالة العلاج */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="النوع">
            <Select
              value={form.type}
              onChange={(e) => handle("type", e.target.value)}
              options={[
                { value: "TABLETS", label: "TABLETS" },
                { value: "SYRUP", label: "SYRUP" },
                { value: "CAPSULES", label: "CAPSULES" },
              ]}
            />
          </Field>

          <Field label="الأثر">
            <Input
              value={form.dose}
              onChange={(e) => handle("dose", e.target.value)}
              placeholder="500 Mg"
            />
          </Field>

          <Field label="نوع العبوة">
            <Input
              value={form.packageType}
              onChange={(e) => handle("packageType", e.target.value)}
              placeholder="شريط يحتوي على 10 أقراص"
            />
          </Field>

          <Field label="حالة العلاج">
            <Select
              value={form.availability}
              onChange={(e) => handle("availability", e.target.value)}
              options={[
                { value: "متوفر", label: "متوفر" },
                { value: "غير متوفر", label: "غير متوفر" },
              ]}
            />
          </Field>
        </div>

        {/* اسم المورد المحلي / شركة النصل للأدوية (قائمة) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="اسم المورد المحلي">
            <Select
              value={form.supplierName}
              onChange={(e) => handle("supplierName", e.target.value)}
              options={[
                { value: "شركة النصر للأدوية", label: "شركة النصر للأدوية" },
                { value: "شركة الحياة", label: "شركة الحياة" },
              ]}
            />
          </Field>

          <Field label="بلد المنشأ">
            <div className="flex items-center gap-2">
              <Select
                value={form.originCountry}
                onChange={(e) => handle("originCountry", e.target.value)}
                options={[
                  { value: "المملكة المتحدة UK", label: "المملكة المتحدة UK" },
                  { value: "الأردن", label: "الأردن" },
                  { value: "تركيا", label: "تركيا" },
                ]}
              />
            </div>
          </Field>
        </div>

        {/* الكمية / السعر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="الكمية">
            <Input
              value={form.quantity}
              onChange={(e) => handle("quantity", e.target.value)}
              placeholder="500 عبوة"
            />
          </Field>

          <Field label="السعر">
            <Input
              value={form.price}
              onChange={(e) => handle("price", e.target.value)}
              placeholder="1000 دينار عراقي"
            />
          </Field>
        </div>

        {/* رقم الترخيص */}
        <Field label="رقم الترخيص">
          <Input
            value={form.licenseNo}
            onChange={(e) => handle("licenseNo", e.target.value)}
            placeholder="MOH-XXXXXXXX"
          />
        </Field>

        {/* تواريخ وحقول الحالة والجهة المانحة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="تاريخ إصدار الترخيص">
            <Input
              type="date"
              value={form.issueDate}
              onChange={(e) => handle("issueDate", e.target.value)}
            />
          </Field>

          <Field label="تاريخ انتهاء الترخيص">
            <Input
              type="date"
              value={form.expireDate}
              onChange={(e) => handle("expireDate", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="حالة الترخيص">
            <Select
              value={form.licenseStatus}
              onChange={(e) => handle("licenseStatus", e.target.value)}
              options={[
                { value: "ساري", label: "ساري" },
                { value: "موقوف", label: "موقوف" },
              ]}
            />
          </Field>

          <Field label="الجهة المانحة">
            <Input
              value={form.authority}
              onChange={(e) => handle("authority", e.target.value)}
              placeholder="وزارة الصحة"
            />
          </Field>
        </div>

        {/* تاريخ الإنتاج/الانتهاء (يمين/يسار) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="تاريخ الإنتاج">
            <Input
              type="date"
              value={form.prodDate1}
              onChange={(e) => handle("prodDate1", e.target.value)}
            />
          </Field>
          <Field label="تاريخ الانتهاء">
            <Input
              type="date"
              value={form.endDate1}
              onChange={(e) => handle("endDate1", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="تاريخ الإنتاج">
            <Input
              type="date"
              value={form.prodDate2}
              onChange={(e) => handle("prodDate2", e.target.value)}
            />
          </Field>
          <Field label="تاريخ الانتهاء">
            <Input
              type="date"
              value={form.endDate2}
              onChange={(e) => handle("endDate2", e.target.value)}
            />
          </Field>
        </div>

        {/* الاستخدامات / الآثار الجانبية / الملاحظات */}
        <Field label="الاستخدامات">
          <Textarea
            rows={3}
            value={form.uses}
            onChange={(e) => handle("uses", e.target.value)}
            placeholder="اكتب الاستخدامات..."
          />
        </Field>

        <Field label="الآثار الجانبية">
          <Textarea
            rows={3}
            value={form.sideEffects}
            onChange={(e) => handle("sideEffects", e.target.value)}
            placeholder="اكتب الآثار الجانبية..."
          />
        </Field>

        <Field label="الملاحظات">
          <Textarea
            rows={2}
            value={form.notes}
            onChange={(e) => handle("notes", e.target.value)}
            placeholder="اكتب ملاحظاتك..."
          />
        </Field>

        {/* تحذير نصي أسفل الفورم (كما في الصورة) */}
        <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
          عند استخدامها مع أدوية تحتوي على نفس المادة الفعالة تجنب الجرعة الزائدة
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col md:flex-row gap-3 p-6 border-t border-slate-200">
        <button
          type="submit"
          className="flex-1 md:flex-none md:min-w-[180px] h-12 rounded-xl font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
          disabled
          title="زر حفظ معطل مثل التصميم (يمكن تفعيله لاحقًا)"
        >
          حفظ
        </button>

        <div className="md:ml-auto flex gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onDelete?.(form)}
            className="flex-1 md:flex-none h-12 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            حذف العلاج
          </button>
        </div>
      </div>
    </form>
  );
}

/* ----------------- عناصر مساعدة بسيطة ----------------- */

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm text-slate-600">{label}</div>
      {children}
    </label>
  );
}

function Input(props) {
  const base =
    "w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30";
  return <input {...props} className={cx(base, props.className)} />;
}

function Textarea(props) {
  const base =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-y";
  return <textarea {...props} className={cx(base, props.className)} />;
}

function Select({ options = [], ...props }) {
  const base =
    "w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30";
  return (
    <select {...props} className={cx(base, props.className)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
