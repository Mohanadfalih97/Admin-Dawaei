// src/components/institution/AddPharmacyImages.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, Calendar, Hash, FileText, Tag, Package, Building2, Globe2, DollarSign, Phone, MapPin } from "lucide-react";

const GREEN = "#54BEA0";

export default function AddPharmacyImages({ onClose }) {
  const steps = useMemo(
    () => [
      { title: "المعلومات العامة" },
      { title: "التوريد والمنشأ" },
      { title: "الترخيص والمستندات" },
      { title: "تفاصيل المصنع" },          // ✅ جديد
      { title: "الاستخدامات والملاحظات" },
    ],
    []
  );

  const [active, setActive] = useState(0);

  // حالة النموذج
  const [form, setForm] = useState({
    // 1) المعلومات العامة
    tradeName: "",
    scientificName: "",
    concentration: "",
    drugType: "",
    packType: "",

    // 2) التوريد والمنشأ
    localSupplier: "",
    originCountry: "",
    manufacturer: "",
    availableQty: "",
    price: "",

    // 3) الترخيص والمستندات
    licenseNumber: "",
    licenseIssueDate: "",
    licenseExpiryDate: "",
    issuingAuthority: "",
    conditionNumber: "",
    barcode: "",

    // 4) تفاصيل المصنع (جديدة)
    factoryName: "",
    factoryCountry: "",
    factoryAddress: "",
    factoryPhone: "",
    batchNumber: "",
    productionLine: "",

    // 5) الاستخدامات والملاحظات
    manufactureDate: "",
    expiryDate: "",
    usageNotes: "",
  });
  const patch = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // حركة البداية + تقدّم
  const [visualStep, setVisualStep] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [didIntro, setDidIntro] = useState(false);
  const introTimersRef = useRef([]);

  const progressFor = (step) => {
    const denom = Math.max(1, steps.length - 1);
    const clamped = Math.max(0, Math.min(step, steps.length - 1));
    return Math.round((clamped / denom) * 100);
  };
  const stopIntro = () => {
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    setDidIntro(true);
  };

  useEffect(() => {
    if (didIntro) return;
    setVisualStep(0);
    setAnimatedProgress(0);
    const SEG = 900;
    const ts = [];
    ts.push(setTimeout(() => { setVisualStep(1); setAnimatedProgress(progressFor(1)); }, 100));
    ts.push(setTimeout(() => { setVisualStep(2); setAnimatedProgress(progressFor(2)); }, 100 + SEG));
    ts.push(setTimeout(() => {
      setVisualStep(active);
      setAnimatedProgress(progressFor(active));
      setDidIntro(true);
    }, 100 + SEG * 2 + 250));
    introTimersRef.current = ts;
    return () => stopIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didIntro, steps.length]);

  function goTo(step) {
    stopIntro();
    const clamped = Math.max(0, Math.min(step, steps.length - 1));
    setActive(clamped);
    setVisualStep(clamped);
    setAnimatedProgress(0);
    setTimeout(() => setAnimatedProgress(progressFor(clamped)), 50);
  }
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  const handleNext = () => next();
  const handleSubmit = () => {
    console.log("Form submit:", form);
    onClose?.();
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      {/* ✅ قياسات المودال مطابقة للصورة مع تمرير داخلي للجسم */}
      <div className="rounded-2xl bg-white shadow-xl overflow-hidden w-[auto]  h-[auto] max-h-[683px]">
        {/* Header */}
        <div className="relative px-5 pt-5 pb-3">
          <div className="flex items-center justify-start">
            <button className="p-1 rounded-full hover:bg-neutral-100 w-[24px] h-[24px]" aria-label="إغلاق" onClick={onClose}>
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-neutral-800">إضافة علاج جديد</h2>
          </div>

          {/* Thin progress bar */}
          <div className="mt-3 h-[5px] w-full rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-[5px]" style={{ width: `${animatedProgress}%`, backgroundColor: GREEN, transition: "width 700ms ease" }} />
          </div>

          {/* Stepper */}
          <div className="p-[10px] flex items-center justify-between gap-2 w-[950px] mx-auto h-[8px] mt-6">
            {steps.map((s, idx) => {
              const isCurrent = idx === visualStep;
              const isCompleted = idx < visualStep || (isCurrent && idx > 0);
              return (
                <div key={s.title} className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={[
                        "size-6 rounded-full border grid place-items-center transition-colors duration-500",
                        isCompleted ? "border-transparent bg-[--g] text-white"
                                    : isCurrent ? "border-[--g] text-[--g]"
                                                : "border-neutral-300 text-neutral-400",
                      ].join(" ")}
                      style={{ "--g": GREEN }}
                    >
                      {isCompleted ? <Check size={14} /> : <span className="text-[10px]" />}
                    </div>
                    <span className={["text-sm transition-colors duration-500",
                                      isCurrent ? "text-neutral-800 font-medium"
                                                : isCompleted ? "text-neutral-700"
                                                              : "text-neutral-400"].join(" ")}>
                      {s.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body (scrollable) */}
        <div className="px-5 pb-4 pt-2 overflow-y-auto" style={{ height: "calc(683px - 150px)" }}>
          {active === 0 && (
            <div className="space-y-4">
              <Field label="الاسم التجاري" placeholder="Panadol 500 mg Tablets" icon={<Tag size={16} />}
                     value={form.tradeName} onChange={(v) => patch("tradeName", v)} />
              <Field label="الاسم العلمي" placeholder="paracetamol" icon={<FileText size={16} />}
                     value={form.scientificName} onChange={(v) => patch("scientificName", v)} />
              <Field label="التركيز" placeholder="500 Mg" icon={<Hash size={16} />}
                     value={form.concentration} onChange={(v) => patch("concentration", v)} />
              <Field label="نوع" placeholder="TABLETS / SYRUP / CAPSULES ..." icon={<Package size={16} />}
                     value={form.drugType} onChange={(v) => patch("drugType", v)} />
              <Field label="نوع العبوة" placeholder="شريط يحتوي على 10 أقراص" icon={<Package size={16} />}
                     value={form.packType} onChange={(v) => patch("packType", v)} />
            </div>
          )}

          {active === 1 && (
            <div className="space-y-4">
              <Field label="اسم المورد المحلي" placeholder="شركة النمل للأدوية" icon={<Building2 size={16} />}
                     value={form.localSupplier} onChange={(v) => patch("localSupplier", v)} />
              <Field label="بلد المنشأ" placeholder="المملكة المتحدة UK" icon={<Globe2 size={16} />}
                     value={form.originCountry} onChange={(v) => patch("originCountry", v)} />
              <Field label="الشركة المصنعة" placeholder="GSK (GlaxoSmithKline)" icon={<Building2 size={16} />}
                     value={form.manufacturer} onChange={(v) => patch("manufacturer", v)} />
              <Field label="الكمية المتوفرة" placeholder="500" type="number" icon={<Package size={16} />}
                     value={form.availableQty} onChange={(v) => patch("availableQty", v)} />
              <Field label="السعر" placeholder="1500 دينار عراقي" icon={<DollarSign size={16} />}
                     value={form.price} onChange={(v) => patch("price", v)} />
            </div>
          )}

          {active === 2 && (
            <div className="space-y-4">
              <Field label="رقم الترخيص" placeholder="MOH-12345678" icon={<Hash size={16} />}
                     value={form.licenseNumber} onChange={(v) => patch("licenseNumber", v)} />
              <Field label="تاريخ إصدار الترخيص" placeholder="YYYY-MM-DD" type="date" icon={<Calendar size={16} />}
                     value={form.licenseIssueDate} onChange={(v) => patch("licenseIssueDate", v)} />
              <Field label="تاريخ انتهاء الترخيص" placeholder="YYYY-MM-DD" type="date" icon={<Calendar size={16} />}
                     value={form.licenseExpiryDate} onChange={(v) => patch("licenseExpiryDate", v)} />
              <Field label="الجهة المانحة" placeholder="وزارة الصحة" icon={<Building2 size={16} />}
                     value={form.issuingAuthority} onChange={(v) => patch("issuingAuthority", v)} />
              <Field label="رقم الشرط" placeholder="2345678" icon={<Hash size={16} />}
                     value={form.conditionNumber} onChange={(v) => patch("conditionNumber", v)} />
              <Field label="رمز الباركود" placeholder="3456765432 9132456" icon={<Hash size={16} />}
                     value={form.barcode} onChange={(v) => patch("barcode", v)} />
            </div>
          )}

          {/* ✅ تفاصيل المصنع (جديدة) */}
          {active === 3 && (
            <div className="space-y-4">
              <Field label="اسم المصنع" placeholder="GSK Manufacturing Plant - Brentford" icon={<Building2 size={16} />}
                     value={form.factoryName} onChange={(v) => patch("factoryName", v)} />
              <Field label="بلد المصنع" placeholder="United Kingdom" icon={<Globe2 size={16} />}
                     value={form.factoryCountry} onChange={(v) => patch("factoryCountry", v)} />
              <Field label="عنوان المصنع" placeholder="980 Great West Rd, Brentford TW8 9GS" icon={<MapPin size={16} />}
                     value={form.factoryAddress} onChange={(v) => patch("factoryAddress", v)} />
              <Field label="هاتف المصنع" placeholder="+44 20 8047 5000" icon={<Phone size={16} />}
                     value={form.factoryPhone} onChange={(v) => patch("factoryPhone", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="رقم التشغيلة (Batch No.)" placeholder="BCH-2025-000123" icon={<Hash size={16} />}
                       value={form.batchNumber} onChange={(v) => patch("batchNumber", v)} />
                <Field label="خط الإنتاج" placeholder="Line A-3" icon={<Package size={16} />}
                       value={form.productionLine} onChange={(v) => patch("productionLine", v)} />
              </div>
            </div>
          )}

          {active === 4 && (
            <div className="space-y-4">
              <Field label="تاريخ إنتاج العلاج" placeholder="YYYY-MM-DD" type="date" icon={<Calendar size={16} />}
                     value={form.manufactureDate} onChange={(v) => patch("manufactureDate", v)} />
              <Field label="تاريخ انتهاء العلاج" placeholder="YYYY-MM-DD" type="date" icon={<Calendar size={16} />}
                     value={form.expiryDate} onChange={(v) => patch("expiryDate", v)} />
              <Field label="الاستخدامات والملاحظات" placeholder="أدخل الاستخدامات أو الملاحظات العامة…" isTextarea icon={<FileText size={16} />}
                     value={form.usageNotes} onChange={(v) => patch("usageNotes", v)} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-neutral-200 px-5 py-4 gap-[9px] flex items-center justify-between">
          <div className="flex items-center gap-2 justify-end flex-1">
            <button
              className="h-[45px] w-[169px] px-8 rounded-[16px] text-sm border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              type="button" onClick={prev} disabled={active === 0}>
              رجوع
            </button>

            {active < steps.length - 1 ? (
              <button
                onClick={() => next()}
                className="h-[45px] w-[214px] px-10 rounded-[16px] text-sm text-white hover:opacity-90"
                style={{ backgroundColor: GREEN }}>
                التالي
              </button>
            ) : (
              <button
                className="h-[45px] w-[214px] px-10 rounded-[16px] text-sm text-white hover:opacity-90"
                style={{ backgroundColor: GREEN }}
                type="button" onClick={handleSubmit}>
                إضافة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= حقل عام ========= */
function Field({ label, placeholder, icon, isTextarea, type = "text", value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-neutral-700">{label}</label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-400">{icon}</div>
        {isTextarea ? (
          <textarea
            rows={3}
            placeholder={placeholder}
            className="w-full rounded-xl border border-neutral-300 pr-3 pl-10 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[--g]"
            style={{ "--g": GREEN }}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className="w-full rounded-xl border border-neutral-300 pr-3 pl-10 h-11 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[--g]"
            style={{ "--g": GREEN }}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
