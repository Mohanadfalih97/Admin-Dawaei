// src/components/institution/Addinstitution.jsx
import React, { useMemo, useState } from "react";
import {
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  RefreshCcw,
  X,
  Image as ImageIcon
} from "lucide-react";

const GREEN = "#54BEA0";

export default function Addinstitution() {
  const [active, setActive] = useState(0);
  const steps = useMemo(() => ["بيانات الصيدلاني", "بيانات الصيدلية", "المستندات"], []);
  const next = () => setActive((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setActive((i) => Math.max(i - 1, 0));
  const progress = Math.round(((active + 1) / steps.length) * 100);

  // ملفات مرفوعة (ديمو)
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  const onPick =
    (setter) =>
    (e) => {
      const f = e.target.files?.[0] ?? null;
      setter(f);
    };

  const removeFile = (setter) => () => setter(null);

  return (
    <div dir="rtl" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      {/* Modal Card */}
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-neutral-800">إضافة صيدلية جديدة</h2>
          <button
            className="absolute left-4 top-4 p-1 rounded-full hover:bg-neutral-100"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>

          {/* Thin progress bar */}
          <div className="mt-3 h-[3px] w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: GREEN,
                transition: "width 300ms ease"
              }}
            />
          </div>

          {/* Stepper */}
          <div className="mt-4 flex items-center justify-between gap-2">
            {steps.map((label, idx) => {
              const completed = idx < active;
              const current = idx === active;
              return (
                <div key={label} className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={[
                        "size-6 rounded-full border grid place-items-center",
                        completed
                          ? "border-transparent bg-[--g] text-white"
                          : current
                          ? "border-[--g] text-[--g]"
                          : "border-neutral-300 text-neutral-400"
                      ].join(" ")}
                      style={{ "--g": GREEN }}
                    >
                      {completed ? (
                        <Check size={14} />
                      ) : (
                        <span className="text-[10px]">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={[
                        "text-sm",
                        completed
                          ? "text-neutral-700"
                          : current
                          ? "text-neutral-800 font-medium"
                          : "text-neutral-400"
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </div>

                  {/* connector */}
                  {idx < steps.length - 1 && (
                    <div
                      className="h-[2px] flex-1 rounded-full"
                      style={{
                        background: idx < active ? GREEN : "rgb(229 231 235)"
                      }}
                    />
                  )}
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
              onPickFront={onPick(setLicenseFront)}
              onPickBack={onPick(setLicenseBack)}
              onRemoveFront={removeFile(setLicenseFront)}
              onRemoveBack={removeFile(setLicenseBack)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-5 py-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={active === 0}
            className={`h-11 px-8 rounded-xl text-sm border transition
              ${
                active === 0
                  ? "border-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              }`}
          >
            السابق
          </button>

          <div className="flex items-center gap-2">
            <button
              className="h-11 px-8 rounded-xl text-sm border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              type="button"
            >
              إلغاء
            </button>

            {active < steps.length - 1 ? (
              <button
                onClick={next}
                className="h-11 px-10 rounded-xl text-sm text-white hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                التالي
              </button>
            ) : (
              <button
                className="h-11 px-10 rounded-xl text-sm text-white hover:opacity-90"
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
      <Field
        label="رقم الهاتف"
        placeholder="+9647XXXXXXXXX"
        icon={<Phone size={16} />}
        after={<FlagIQ />}
      />
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
      <Field
        label="الوصف"
        isTextarea
        placeholder="وصف عام: توفر جميع أنواع الأدوية …"
        icon={<ImageIcon size={16} />}
      />
      <Field label="العنوان" placeholder="بغداد - السيدية" icon={<MapPin size={16} />} />
    </div>
  );
}

/* ---------- الخطوة 3: المستندات ---------- */
function StepDocuments({
  licenseFront,
  licenseBack,
  onPickFront,
  onPickBack,
  onRemoveFront,
  onRemoveBack
}) {
  return (
    <div className="space-y-5">
      <UploadRow
        title="صورة واجهة الصيدلية"
        file={licenseFront}
        onPick={onPickFront}
        onRemove={onRemoveFront}
      />
      <UploadRow
        title="صورة واجهة الصيدلية"
        file={licenseBack}
        onPick={onPickBack}
        onRemove={onRemoveBack}
      />
    </div>
  );
}

/* ---------- حقول مع أيقونات ---------- */
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
            className="w-full rounded-xl border border-neutral-300 pr-10 pl-10 h-11 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[--g]"
            style={{ "--g": GREEN }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- صف رفع ملف مطابق للتصميم ---------- */
function UploadRow({ title, file, onPick, onRemove }) {
  const [id] = useState(() => Math.random().toString(36).slice(2));
  const sizeText = file ? formatSize(file.size) : "أضف صورة واجهة الصيدلية (png, jpg …) حتى 12MB";

  return (
    <div className="space-y-2">
      <div className="text-sm text-neutral-700">{title}</div>

      <label
        htmlFor={id}
        className="block rounded-2xl border border-[--g] p-3 cursor-pointer hover:bg-emerald-50 transition"
        style={{ "--g": GREEN }}
      >
        <div className="flex items-start gap-3">
          {/* زر إعادة اختيار */}
          <div className="mt-0.5 shrink-0 grid place-items-center size-8 rounded-xl border border-[--g] text-[--g]">
            <RefreshCcw size={16} />
          </div>

          {/* معلومات الملف */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-neutral-500 truncate">
              {file ? file.name : "اسحب وأفلت أو انقر للاختيار"}
            </div>
            <div className="text-xs text-emerald-600">{file ? "image/*" : ""}</div>

            {/* شريط التقدم */}
            <div className="mt-2 h-[6px] w-full rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: file ? "100%" : "0%",
                  backgroundColor: GREEN,
                  transition: "width 400ms ease"
                }}
              />
            </div>

            <div className="mt-1 text-xs text-neutral-500">
              {file ? sizeText : "الحدّ الأقصى 12MB"}
            </div>
          </div>

          {/* حذف */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="mt-0.5 shrink-0 grid place-items-center size-8 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
            aria-label="حذف الملف"
          >
            <X size={16} />
          </button>
        </div>
      </label>

      <input id={id} type="file" className="hidden" onChange={onPick} />
    </div>
  );
}

/* ---------- بادج علم العراق البسيط ---------- */
function FlagIQ() {
  return (
    <div className="flex items-center gap-1 text-xs text-neutral-500">
      <span className="inline-block w-5 h-3 rounded overflow-hidden ring-1 ring-neutral-300">
        <span className="block h-1 bg-red-600" />
        <span className="block h-1 bg-white" />
        <span className="block h-1 bg-black" />
      </span>
      +964
    </div>
  );
}

/* ---------- مساعدات ---------- */
function formatSize(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}
