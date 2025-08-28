import React, { useMemo, useRef, useState } from "react";
import { X, Trash2, Image as ImageIcon, User2, Mail, Phone } from "lucide-react";

/**
 * ProfileEditPanel
 * - لوحة جانبية ل  (مطابقة للتصميم المرفق)
 * - RTL افتراضيًا
 * - دعم رفع/تغيير الصورة + حذفها + تعطيل زر "تحديث الملف الشخصي" حتى حدوث تغيير صالح
 */
export default function ProfileEditPanel({
  initial = {
    fullName: "مصطفى عماد كاظم",
    email: "mustafae@gmail.com",
    phone: "+96477XXXXXXXXX",
    avatarUrl: "https://i.pravatar.cc/160?img=15",
  },
  onClose = () => {},
  onSubmit = async (data) => console.log("submit", data),
}) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(initial);
  const [avatar, setAvatar] = useState(initial.avatarUrl);
  const [avatarFile, setAvatarFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isChanged = useMemo(() => {
    return (
      form.fullName !== initial.fullName ||
      form.email !== initial.email ||
      form.phone !== initial.phone ||
      avatarFile !== null ||
      avatar !== initial.avatarUrl
    );
  }, [form, avatarFile, avatar, initial]);

  const isValid = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneOk = form.phone && form.phone.length >= 10;
    const nameOk = form.fullName && form.fullName.length >= 3;
    return emailOk && phoneOk && nameOk;
  }, [form]);

  const disabledUpdate = !isChanged || !isValid || submitting;

  const handlePick = () => fileRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleDeleteAvatar = () => {
    setAvatar("https://ui-avatars.com/api/?name=" + encodeURIComponent(form.fullName));
    setAvatarFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabledUpdate) return;
    try {
      setSubmitting(true);
      const payload = { ...form, avatarFile };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-[560px] bg-white rounded-2xl shadow border border-gray-100 overflow-hidden" style={{ direction: "ltr" }}>
      {/* Header */}
      <div className="flex items-center justify-end gap-2 p-3 ">
          <h2 className="text-[16px] font-semibold">تعديل الملف الشخصي</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="إغلاق">
          <X className="w-5 h-5" />
        </button>
       
      
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Top Row: actions + avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDeleteAvatar}
              className="flex items-center p-[10px] rounded-[16px] justify-center border border-[#E10600] w-[67px] h-[45px] text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-[24px] h-[24px]" />
            </button>

            <button
              type="button"
              onClick={handlePick}
              className="flex items-center gap-2 p-[10px] rounded-[16px] border text-gray-500 hover:bg-gray-50 w-[164px] h-[45px] flex items-center justify-center "
            >
              تحديث الصورة
            </button>
            <input ref={fileRef} onChange={handleFile} type="file" accept="image/*" hidden />
          </div>

          <img
            src={avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
          />
        </div>

        {/* Inputs */}
        <Field
          label="اسم المستخدم"
          icon={<User2 className="w-5 h-5 text-gray-400" />}
          value={form.fullName}
          onChange={(v) => setForm((s) => ({ ...s, fullName: v }))}
          placeholder="ادخل الاسم الكامل"
        />

        <Field
          label="البريد الالكتروني"
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          type="email"
          value={form.email}
          onChange={(v) => setForm((s) => ({ ...s, email: v }))}
          placeholder="example@mail.com"
        />

        <Field
          label="رقم الهاتف"
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          value={form.phone}
          onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
          placeholder="+96477XXXXXXXXX"
        />

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-4" >
       

          <button
            type="submit"
            disabled={disabledUpdate}
            className={[
              "px-6 py-3 rounded-full font-semibold transition",
              disabledUpdate
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white",
            ].join(" ")}
          >
            {submitting ? "...جارِ الحفظ" : "تحديث الملف الشخصي"}
          </button>
             <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-full border text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, icon, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-3">
        <span className="shrink-0">{icon}</span>
        <input
          dir="rtl"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
