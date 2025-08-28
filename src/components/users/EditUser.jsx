// components/UserInfoSheet.jsx
import React from "react";

export default function UserInfoSheet({
  dir = "rtl",
  name = "سارة سعد كاظم",
  status = "نشط",
  phone = "+964 780XXXXXXX",
  email = "Ahmedmo@gmail.com",
  avatar =
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  locked = false,
  onLockedChange = () => {},
  onClose = () => {},
  onOpenProfile = () => {},
}) {
  return (
    <div
      dir={dir}
      className="w-[420px] max-w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onOpenProfile}
          className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          عرض الملف الشخصي
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">سارة سعد كاظم</h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="size-8 grid place-items-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xl font-bold">{name}</div>

          <span className="px-4 py-1 text-sm rounded-full bg-emerald-50 text-emerald-600">
            {status}
          </span>

          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4" />

        {/* Details rows */}
        <div className="space-y-2 text-sm">
          <DetailRow label="اسم المستخدم" value={name} />
          <DetailRow label="رقم الهاتف" value={phone} />
          <DetailRow label="البريد الالكتروني" value={email} />
        </div>

        {/* Permissions card */}
        <div className="mt-6">
          <div className="text-lg font-semibold mb-3">الصلاحيات</div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">قفل المستخدم</div>
                <p className="text-xs text-gray-500 mt-1">
                  لن يعد بإمكانه الاستفادة من خدمات التطبيق
                </p>
              </div>

              <Switch
                checked={locked}
                onChange={onLockedChange}
                ariaLabel="تفعيل / إلغاء قفل المستخدم"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- Small helpers --------- */

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-500 w-28 shrink-0">{label}</div>
      <div className="text-gray-900 truncate">{value}</div>
    </div>
  );
}

function Switch({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-7 w-12 items-center rounded-full border transition",
        checked
          ? "bg-emerald-500 border-emerald-500"
          : "bg-gray-200 border-gray-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
