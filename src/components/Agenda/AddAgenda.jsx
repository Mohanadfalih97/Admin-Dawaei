import React, { useId, useState } from "react";
import defaultProfileImage from "../../asset/Imge/profiledefautimg.png";

import {
  Phone,
  User,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Pill,
  Package,
  Upload,
  ShieldCheck,
  Trash2,
  Save,
  ChevronLeft,
  Info,
  Camera,
} from "lucide-react";

/**
 * PharmacyProfileForm
 * UI-only form that matches the provided Figma screen.
 * - Pure React + TailwindCSS (no external UI kit)
 * - RTL-friendly with Arabic labels
 * - Inputs are controlled to demonstrate interactivity
 * - Replace submit/delete handlers with real logic as needed
 */
export default function PharmacyProfileForm() {
  const inputId = useId();
    const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  const [state, setState] = useState({
    pharmacyName: "صيدلية الحياة",
    phone: "077xxxxxxxx",
    description:
      "صيدلية عامة توفر جميع انواع الادوية والمستحضرات الطبية والمستلزمات بما في ذلك ادوية الامراض المزمنة المضادات الحيوية والمكملات الغذائية.",
    joinDate: "2025-07-06",
    status: "نشطة",
    drugsCount: 5000,
    ordersCount: 10000,
    workFrom: "09:00",
    workTo: "00:00",
    address: "بغداد - السيدية",
    managerName: "الدكتور احمد عباس محمد",
    managerPhone: "077xxxxxxxx",
    managerEmail: "Ahmedmo@gmail.com",
    licenseFile: null,
  });

  const onChange = (key) => (e) => {
    const value = e?.target?.files ? e.target.files[0] : e.target.value;
    setState((s) => ({ ...s, [key]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: استبدل بهذا منطق الحفظ الحقيقي
    alert("تم النقر على حفظ (واجهة فقط)");
  };

  const onDelete = () => {
    // TODO: استبدل بهذا منطق الحذف الحقيقي
    if (confirm("هل تريد حذف الصيدلية؟")) alert("تم النقر على حذف (واجهة فقط)");
  };

  return (
    <div dir="rtl" >
    

      {/* Content */}
      <form onSubmit={onSubmit} className="w-full mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 overflow-hidden">
        {/* Status pill */}
        <div className="flex items-center gap-2 mb-4 justify-between">
     <div className="flex items-center gap-2 ">
                       <ChevronLeft className="w-5 h-5" />

                    <h1 className="text-lg font-semibold">الصيدلية</h1>
     </div>

      
        </div>

        {/* Card */}
        <div >
          {/* Title row */}
          <div className="px-4 md:px-6 py-4   flex justify-between items-center">
          
              <span>المعلومات العامة عن الصيدلية</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200 text-sm">
            <ShieldCheck className="w-4 h-4" /> نشطة
          </span>
          </div>
  <div className="flex justify-start items-start flex-row-reverse w-28">
  <div className="relative w-[75px] h-[75px] mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#D9D9D9] shadow-md group">
    <img
      src={imagePreview || defaultProfileImage}
      className="w-full h-full object-cover"
      alt="صورة العضو"
    />
    <input
      type="file"
      accept="image/*"
      id="imageUpload"
      onChange={handleImageChange}
      className="hidden"
    />
    <label
      htmlFor="imageUpload"
      className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white text-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition"
    >
      <Camera className="w-6 h-6" />
    </label>
  </div>
</div>

          {/* Body */}
          <div className="p-4 md:p-6 space-y-8">
            {/* Row: phone + name */}
            <div className="grid md:grid-cols-2 gap-4">
              <LabeledInput
                label="رقم الهاتف"
                icon={<Phone className="w-4 h-4" />}
                placeholder="077xxxxxxxx"
                value={state.phone}
                onChange={onChange("phone")}
                inputMode="tel"
              />
              <LabeledInput
                label="اسم الصيدلية"
                placeholder="اكتب اسم الصيدلية"
                value={state.pharmacyName}
                onChange={onChange("pharmacyName")}
              />
            </div>

            {/* Description */}
            <LabeledTextarea
              label="وصف الصيدلية"
              placeholder="اكتب وصفًا موجزًا عن الصيدلية"
              value={state.description}
              onChange={onChange("description")}
            />

            {/* Row: join date + status */}
            <div className="grid md:grid-cols-2 gap-4">
              <LabeledInput
                label="تاريخ الانضمام"
                icon={<Calendar className="w-4 h-4" />}
                type="date"
                value={state.joinDate}
                onChange={onChange("joinDate")}
              />
              <LabeledSelect
                label="حالة الصيدلية"
                value={state.status}
                onChange={onChange("status")}
                options={["نشطة", "متوقفة", "قيد المراجعة"]}
              />
            </div>

            {/* Row: counts */}
            <div className="grid md:grid-cols-2 gap-4">
              <LabeledStatic
                label="عدد الطلبات"
                icon={<Package className="w-4 h-4" />}
                value={state.ordersCount.toLocaleString()}
              />
              <LabeledStatic
                label="عدد الدواء"
                icon={<Pill className="w-4 h-4" />}
                value={state.drugsCount.toLocaleString()}
              />
            </div>

            {/* Working hours */}
            <SectionTitle title="مواعيد العمل" />
            <div className="grid md:grid-cols-2 gap-4">
              <LabeledInput
                label="من الساعة"
                icon={<Clock className="w-4 h-4" />}
                type="time"
                value={state.workFrom}
                onChange={onChange("workFrom")}
              />
              <LabeledInput
                label="الى الساعة"
                icon={<Clock className="w-4 h-4" />}
                type="time"
                value={state.workTo}
                onChange={onChange("workTo")}
              />
            </div>

            {/* Address */}
            <SectionTitle title="العنوان" />
            <LabeledInput
              label="العنوان"
              icon={<MapPin className="w-4 h-4" />}
              placeholder="اكتب العنوان"
              value={state.address}
              onChange={onChange("address")}
            />

            {/* Manager info */}
            <SectionTitle title="بيانات المسؤول عن الصيدلية" />
            <div className="grid md:grid-cols-2 gap-4">
              <LabeledInput
                label="اسم الصيدلي"
                icon={<User className="w-4 h-4" />}
                value={state.managerName}
                onChange={onChange("managerName")}
              />
              <LabeledInput
                label="رقم الهاتف"
                icon={<Phone className="w-4 h-4" />}
                inputMode="tel"
                value={state.managerPhone}
                onChange={onChange("managerPhone")}
              />
              <LabeledInput
                label="البريد الالكتروني"
                icon={<Mail className="w-4 h-4" />}
                type="email"
                value={state.managerEmail}
                onChange={onChange("managerEmail")}
              />
              <div />
            </div>

            {/* License upload */}
            <div className="space-y-2">
              <label className="block text-sm text-neutral-500">صورة رخصة الصيدلية</label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer w-fit">
                  <Upload className="w-4 h-4" />
                  <span>ارفع صورة رخصة الصيدلية</span>
                  <input
                    id={`${inputId}-license`}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={onChange("licenseFile")}
                  />
                </label>
                {state.licenseFile && (
                  <div className="text-sm text-neutral-600 truncate">
                    <span className="font-medium text-neutral-800">{state.licenseFile.name}</span>
                    <span className="mx-2">•</span>
                    <span>{(state.licenseFile.size / (1024 * 1024)).toFixed(1)}MB</span>
                  </div>
                )}
              </div>
              <div className="h-1 rounded bg-emerald-500/80 w-full" />
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-4 md:px-6 py-4 border-t border-neutral-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="submit"
              className="w-full md:w-64 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-neutral-200 text-neutral-500 cursor-not-allowed"
              disabled
            >
              <Save className="w-5 h-5" /> حفظ
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="w-full md:w-64 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="w-5 h-5" /> حذف الصيدلية
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* --------------------------- Sub Components --------------------------- */
function SectionTitle({ title }) {
  return (
    <div className="pt-2">
      <h3 className="text-neutral-800 font-semibold mb-2">{title}</h3>
    </div>
  );
}

function LabeledInput({ label, icon, className = "", ...props }) {
  return (
    <div className={"space-y-2 " + className}>
      <label className="block text-sm text-neutral-500">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>
        )}
        <input
          {...props}
          className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>
    </div>
  );
}

function LabeledTextarea({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-neutral-500">{label}</label>
      <textarea
        rows={3}
        {...props}
        className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}

function LabeledSelect({ label, options = [], ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-neutral-500">{label}</label>
      <div className="relative">
        <select
          {...props}
          className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {options.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function LabeledStatic({ label, icon, value }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-neutral-500">{label}</label>
      <div className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-3 flex items-center text-sm text-neutral-600">
        <span className="ml-2 text-neutral-400">{icon}</span>
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}
