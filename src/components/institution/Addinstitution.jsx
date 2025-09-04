// src/components/institution/Addinstitution.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Check, User, Phone, Mail, MapPin, ImageIcon, X } from "lucide-react";
import iraqflag from "../../asset/flags/iraqflag.png";
import vector from "../../asset/Imge/Vector.png";
import Addimg from "../../asset/Imge/09_add image.png";

const GREEN = "#54BEA0";

/* دول + كود اتصال + صورة العلم (الباقي fallback بإيموجي لو ما توفرت الصور) */
const COUNTRIES = [
  { code: "IQ", name: "العراق",   dial: "+964", flagSrc: iraqflag, emoji: "🇮🇶" },
  { code: "SA", name: "السعودية", dial: "+966", flagSrc: null,     emoji: "🇸🇦" },
  { code: "AE", name: "الإمارات", dial: "+971", flagSrc: null,     emoji: "🇦🇪" },
  { code: "KW", name: "الكويت",   dial: "+965", flagSrc: null,     emoji: "🇰🇼" },
  { code: "JO", name: "الأردن",   dial: "+962", flagSrc: null,     emoji: "🇯🇴" },
  { code: "TR", name: "تركيا",    dial: "+90",  flagSrc: null,     emoji: "🇹🇷" },
];

export default function Addinstitution() {
  const steps = useMemo(() => ["بيانات الصيدلاني", "بيانات الصيدلية", "المستندات"], []);
  const [active, setActive] = useState(0);

  // للعرض/الأنيميشن
  const [visualStep, setVisualStep] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [didIntro, setDidIntro] = useState(false);
  const introTimersRef = useRef([]);

  // نسبة تقدّم صفر-مرتكز: 0% لأول خطوة، 100% لآخر خطوة
  const progressFor = (step) => {
    const denom = Math.max(1, steps.length - 1);
    const clamped = Math.max(0, Math.min(step, steps.length - 1));
    return Math.round((clamped / denom) * 100);
  };

  // إيقاف العرض التمهيدي + تنظيف التايمرز
  const stopIntro = () => {
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    setDidIntro(true);
  };

  // العرض التمهيدي عند أول تحميل (يمرّ على الخطوات مثل الصور)
  useEffect(() => {
    if (didIntro) return;

    setVisualStep(0);
    setAnimatedProgress(0);

    const SEG = 900; // مدة كل مرحلة (ms)
    const ts = [];

    // 0% → 50% (الخطوة الثانية مرئية)
    ts.push(
      setTimeout(() => {
        setVisualStep(1);
        setAnimatedProgress(progressFor(1));
      }, 100)
    );

    // 50% → 100% (الخطوة الثالثة مرئية)
    ts.push(
      setTimeout(() => {
        setVisualStep(2);
        setAnimatedProgress(progressFor(2));
      }, 100 + SEG)
    );

    // رجوع للحالة الفعلية (عادة 0)
    ts.push(
      setTimeout(() => {
        setVisualStep(active);
        setAnimatedProgress(progressFor(active));
        setDidIntro(true);
      }, 100 + SEG * 2 + 250)
    );

    introTimersRef.current = ts;
    return () => stopIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didIntro, steps.length]);

  // الانتقال بين الخطوات مع تصفير الشريط ثم ملئه للنسبة الجديدة
  function goTo(step) {
    stopIntro(); // أي تفاعل يوقف العرض التمهيدي فورًا
    const clamped = Math.max(0, Math.min(step, steps.length - 1));
    setActive(clamped);
    setVisualStep(clamped); // اجعل الخطوة الحالية مرئية فورًا

    setAnimatedProgress(0); // الشريط يصير صفر
    setTimeout(() => setAnimatedProgress(progressFor(clamped)), 50); // ثم يتحرك للنسبة الصحيحة
  }

  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  // ملفات مرفوعة
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  return (
    <div dir="rtl" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-[701px] h-auto gap-[19px] rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative px-5 pt-5 pb-3">
          <div className="flex items-center justify-start">
            <button className="p-1 rounded-full hover:bg-neutral-100 w-[24px] h-[24px]" aria-label="إغلاق">
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-neutral-800">إضافة صيدلية جديدة</h2>
          </div>

          {/* Thin progress bar (صفر-مرتكز ويتحرك من الصفر في كل انتقال) */}
          <div className="mt-3 h-[5px] w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-[5px]"
              style={{
                width: `${animatedProgress}%`,
                backgroundColor: GREEN,
                transition: "width 700ms ease",
              }}
            />
          </div>

          {/* Stepper */}
          <div className="p-[10px] flex items-center justify-between gap-2 w-[800px] mx-auto h-[8px] mt-6">
            {steps.map((label, idx) => {
              const isCurrent = idx === visualStep;
              // الخطوة الحالية تعتبر مكتملة إلا إذا كانت الأولى (تظهر فارغة)
              const isCompleted = idx < visualStep || (isCurrent && idx > 0);

              return (
                <div key={label} className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={[
                        "size-6 rounded-full border grid place-items-center transition-colors duration-500",
                        isCompleted
                          ? "border-transparent bg-[--g] text-white" // مكتملة (مع ✓)
                          : isCurrent
                          ? "border-[--g] text-[--g]" // الحالية (فارغة) — يطبق على الأولى
                          : "border-neutral-300 text-neutral-400", // قادمة
                      ].join(" ")}
                      style={{ "--g": GREEN }}
                    >
                      {isCompleted ? <Check size={14} /> : <span className="text-[10px]" />}
                    </div>
                    <span
                      className={[
                        "text-sm transition-colors duration-500",
                        isCurrent
                          ? "text-neutral-800 font-medium" // تمييز عنوان الحالية
                          : isCompleted
                          ? "text-neutral-700"
                          : "text-neutral-400",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-4 pt-2">
          {active === 0 && <StepPharmacist />}
          {active === 1 && <StepPharmacy />}
          {active === 2 && (
            <StepDocuments
              licenseFront={licenseFront}
              licenseBack={licenseBack}
              setLicenseFront={setLicenseFront}
              setLicenseBack={setLicenseBack}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-neutral-200 px-5 py-4 gap-[9px] flex items-center justify-between">
          <div className="flex items-center gap-2 justify-end flex-1">
            <button
              className="h-[45px] w-[169px] px-8 rounded-[16px] text-sm border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              type="button"
              onClick={prev}
              disabled={active === 0}
            >
              رجوع
            </button>

            {active < steps.length - 1 ? (
              <button
                onClick={next}
                className="h-[45px] w-[214px] px-10 rounded-[16px] text-sm text-white hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                التالي
              </button>
            ) : (
              <button
                className="h-[45px] w-[214px] px-10 rounded-[16px] text-sm text-white hover:opacity-90"
                style={{ backgroundColor: GREEN }}
                type="submit"
              >
                إضافة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- الخطوة 1: بيانات الصيدلاني ---------- */
function StepPharmacist() {
  return (
    <div className="space-y-4">
      <Field
        label="اسم الصيدلاني"
        placeholder="الدكتور/احمد عباس محمد"
        icon={<User size={16} />}
      />

      {/* رقم الهاتف = دروب داون مخصص يظهر العلم فقط + حقل للرقم */}
      <PhoneField label="رقم الهاتف" />

      <Field
        label="البريد الإلكتروني"
        placeholder="ahmedmo@gmail.com"
        icon={<Mail size={16} />}
      />
    </div>
  );
}

/* ---------- الخطوة 2: بيانات الصيدلية ---------- */
function StepPharmacy() {
  return (
    <div className="space-y-4">
      <Field label="اسم الصيدلية" placeholder="صيدلية الحياة" icon={<User size={16} />} />
      <Field label="الوصف"  placeholder="وصف عام: توفر جميع أنواع الأدوية …" icon={<ImageIcon size={16} />} />
      <Field label="العنوان" placeholder="بغداد - السيدية" icon={<MapPin size={16} />} />
    </div>
  );
}

/* ---------- الخطوة 3: المستندات ---------- */
function StepDocuments({ licenseFront, licenseBack, setLicenseFront, setLicenseBack }) {
  return (
    <div className="space-y-6" dir="rtl">
      <FileUploadField
        label="صورة واجهة الصيدلية"
        placeholder="ارفع صورة واجهة الصيدلية"
        file={licenseFront}
        setFile={setLicenseFront}
      />

      <FileUploadField
        label="صورة رخصة الصيدلية"
        placeholder="ارفع صورة رخصة الصيدلية"
        file={licenseBack}
        setFile={setLicenseBack}
      />
    </div>
  );
}

/* ---------- مكوّن الحقل القابل للنقر + بطاقة المعاينة أسفله ---------- */
function FileUploadField({ label, placeholder, file, setFile }) {
  const [inputId] = useState(() => Math.random().toString(36).slice(2));
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file && file.type?.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  const onPick = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const onRemove = () => setFile(null);

  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-700">{label}</label>

      {/* الحقل النصي يفتح مُلتقط الملفات */}
      <div className="relative cursor-pointer" onClick={() => document.getElementById(inputId)?.click()} role="button">
        <input
          type="text"
          className="w-full rounded-xl border border-neutral-300 pr-3 pl-10 h-11 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[--g] cursor-pointer"
          placeholder={placeholder}
          style={{ "--g": GREEN }}
          readOnly
          value={file?.name ?? ""}
          img={<Addimg size={16} />}
        />
      </div>

      {/* البطاقة أسفل الحقل */}
      <AttachmentCard file={file} preview={preview} onRemove={onRemove} />

      {/* input الحقيقي */}
      <input id={inputId} type="file" className="hidden" accept="image/*" onChange={onPick} />
    </div>
  );
}

/* ---------- بطاقة المرفق ---------- */
function AttachmentCard({ file, preview, onRemove }) {
  const typeText = file ? file.type || "image/*" : "";
  const sizeText = file ? formatSize(file.size) : "الحدّ الأقصى 12MB";
  if (!file) return null;

  return (
    <div className="relative">
      <div className="p-[10px] flex items-start gap-3 border border-[#D9D9D9] border-[0.5px] rounded-[8px] bg-white">
        <div className="flex-1 w-full space-y-2">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            {/* المعاينة */}
            <div className="h-[50px] w-[50px] overflow-hidden ring-1 ring-neutral-200 grid place-items-center bg-neutral-50 rounded">
              {preview ? (
                <img src={preview} alt="preview" className="w-[50px] h-[50px] object-cover" />
              ) : (
                <div className="size-6 rounded-sm" style={{ backgroundColor: GREEN }} />
              )}
            </div>

            {/* المعلومات */}
            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[10px] text-emerald-600">مرفق</div>
                  <span className="text-[10px] text-emerald-600">- {typeText}</span>
                </div>

                {/* حذف */}
                <button
                  type="button"
                  onClick={onRemove}
                  className="grid place-items-center rounded-full border border-red-200 bg-[#FFCDCC] text-red-500 hover:bg-red-50 shadow-sm w-[18px] h-[18px]"
                  aria-label="حذف الملف"
                  title="حذف"
                >
                  <X size={12} />
                </button>
              </div>

              {/* الحجم */}
              <div className="mt-1 text-xs text-neutral-500" style={{ direction: "ltr" }}>
                {sizeText}
              </div>
            </div>
          </div>

          {/* شريط التقدم داخل البطاقة */}
          <div className="mt-2 h-[6px] w-full rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full" style={{ width: "100%", backgroundColor: "#55C964", transition: "width 400ms ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- حقل هاتف: دروب داون مخصص للأعلام + حقل الرقم ---------- */
function PhoneField({ label }) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [number, setNumber] = useState("");

  return (
    <div className="space-y-1.5" dir="rtl">
      <label className="text-sm text-neutral-700">{label}</label>

      <div className="flex items-center gap-2">
        {/* الدروب داون المخصص لصور الأعلام (بدون أسماء/أرقام مرئية) */}
        <FlagDropdown options={COUNTRIES} value={country} onChange={setCountry} />

        {/* حقل الرقم */}
        <div className="relative flex-1">
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-400">
            <Phone size={16} />
          </div>
          <input
            dir="ltr"
            inputMode="numeric"
            placeholder="+9647XXXXXXXXX"
            className="w-full rounded-xl border border-neutral-300 pr-3 pl-10 h-11 text-sm placeholder-neutral-400 focus:outline-none text-right focus:ring-2 focus:ring-[--g]"
            style={{ "--g": GREEN }}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Dropdown مخصص للأعلام ---------- */
function FlagDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* الزر يعرض العلم الحالي فقط */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-[61px] h-[40px]  rounded-[16px] border border-neutral-300 flex justify-center   items-center hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[--g] gap-1"
        style={{ "--g": GREEN }}
        aria-label={`الدولة المختارة: ${value?.name || ""} ${value?.dial || ""}`}
        title={`${value?.name || ""} ${value?.dial || ""}`}
        
      >
 
        <FlagIcon
         country={value}  />
                <img src={vector} alt="" srcset="" />
      </button>

      {/* القائمة: شبكة أعلام فقط */}
      {open && (
        <div
          className="absolute z-20 mt-2 w-[260px] max-h-64 overflow-auto rounded-xl border border-neutral-200 bg-white shadow-md p-2 right-0"
          role="listbox"
        >
          <ul className="grid grid-cols-5 gap-2">
            {options.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  className={[
                    "w-9 h-7 rounded-[16px] border grid place-items-center hover:bg-neutral-50",
                    c.code === value?.code ? "border-[--g] ring-1 ring-[--g]" : "border-neutral-200",
                  ].join(" ")}
                  style={{ "--g": GREEN }}
                  title={`${c.name} ${c.dial}`}
                  aria-label={`${c.name} ${c.dial}`}
                >
                  <FlagIcon country={c} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FlagIcon({ country }) {
  if (country?.flagSrc) {
    return (
      <img
        src={country.flagSrc}
        alt={country.name}
        className="w-[20px] h-[20px] rounded-full object-cover"
        draggable={false}
      />
    );
  }
  // باك-أب بالإيموجي لو ما عندنا صورة
  return <span className="text-base leading-none">{country?.emoji || "🏳️"}</span>;
}

/* ---------- حقول نموذج عامة ---------- */
function Field({ label, placeholder, icon, after, isTextarea }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-neutral-700">{label}</label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-400">{icon}</div>
        {after && <div className="absolute top-1/2 -translate-y-1/2 right-3">{after}</div>}

        {isTextarea ? (
          <textarea
            rows={3}
            placeholder={placeholder}
            className="w-full rounded-xl border border-neutral-300 pr-10 pl-10 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[--g]"
            style={{ "--g": GREEN }}
          />
        ) : (
          <input
            placeholder={placeholder}
            className="w-full rounded-xl border border-neutral-300 pr-3 pl-10 h-11 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[--g]"
            style={{ "--g": GREEN }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- مساعدات ---------- */
function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}
