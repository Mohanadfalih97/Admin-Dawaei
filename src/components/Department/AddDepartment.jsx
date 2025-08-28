import React, { useState, useMemo } from "react";
import { X, User, Phone, Mail, MapPin, Image as ImageIcon, FileText } from "lucide-react";

// ✅ مكون واجهة إضافة صيدلية جديدة مطابقة للتصميم في الصور
export default function AddPharmacyWizard({ onSubmit, onCancel }) {
  const [step, setStep] = useState(0); // 0: بيانات الصيدلي، 1: بيانات الصيدلية، 2: المستندات

  const [pharmacist, setPharmacist] = useState({ name: "", phone: "", email: "" });
  const [pharmacy, setPharmacy] = useState({ name: "", description: "", address: "" });
  const [docs, setDocs] = useState({ storefront: null, license: null });

  const isPharmacistValid = useMemo(() => pharmacist.name && pharmacist.phone && pharmacist.email, [pharmacist]);
  const isPharmacyValid = useMemo(() => pharmacy.name && pharmacy.address, [pharmacy]);
  const areDocsValid = useMemo(() => docs.storefront && docs.license, [docs]);

  function handleSubmit() {
    if (onSubmit) onSubmit({ pharmacist, pharmacy, docs });
  }

  return (
    <div dir="rtl" className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">إضافة صيدلية جديدة</h2>
          <button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b px-6">
          <TabButton label="بيانات الصيدلي" active={step === 0} done={isPharmacistValid} onClick={() => setStep(0)} />
          <TabButton label="بيانات الصيدلية" active={step === 1} done={isPharmacyValid} onClick={() => setStep(1)} />
          <TabButton label="المستندات" active={step === 2} done={areDocsValid} onClick={() => setStep(2)} />
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 0 && <PharmacistForm data={pharmacist} onChange={setPharmacist} />}
          {step === 1 && <PharmacyForm data={pharmacy} onChange={setPharmacy} />}
          {step === 2 && <DocsForm data={docs} onChange={setDocs} />}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t p-4">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="rounded bg-gray-100 px-4 py-2 disabled:opacity-50"
          >
            السابق
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={(step === 0 && !isPharmacistValid) || (step === 1 && !isPharmacyValid)}
              className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
            >
              التالي
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!areDocsValid}
              className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
            >
              إضافة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, done, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 px-4 py-3 text-sm font-medium ${active ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500"}`}
    >
      {label}
      {done && <span className="absolute right-2 top-2 text-emerald-600">✔</span>}
    </button>
  );
}

function PharmacistForm({ data, onChange }) {
  return (
    <div className="grid gap-4">
      <InputField label="اسم الصيدلي" placeholder="اسم الصيدلي" value={data.name} onChange={(v) => onChange({ ...data, name: v })} icon={<User />} />
      <InputField label="رقم الهاتف" placeholder="077xxxxxxx" value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} icon={<Phone />} />
      <InputField label="البريد الإلكتروني" placeholder="example@gmail.com" value={data.email} onChange={(v) => onChange({ ...data, email: v })} icon={<Mail />} />
    </div>
  );
}

function PharmacyForm({ data, onChange }) {
  return (
    <div className="grid gap-4">
      <InputField label="اسم الصيدلية" placeholder="صيدلية الحياة" value={data.name} onChange={(v) => onChange({ ...data, name: v })} icon={<User />} />
      <InputField label="الوصف" placeholder="وصف الصيدلية" value={data.description} onChange={(v) => onChange({ ...data, description: v })} icon={<FileText />} textarea />
      <InputField label="العنوان" placeholder="بغداد - السيدية" value={data.address} onChange={(v) => onChange({ ...data, address: v })} icon={<MapPin />} />
    </div>
  );
}

function DocsForm({ data, onChange }) {
  return (
    <div className="grid gap-6">
      <UploadField label="صورة واجهة الصيدلية" file={data.storefront} onFile={(f) => onChange({ ...data, storefront: f })} />
      <UploadField label="صورة رخصة الصيدلية" file={data.license} onFile={(f) => onChange({ ...data, license: f })} />
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, icon, textarea }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-700">{label}</label>
      <div className="flex items-center gap-2 rounded border px-3 py-2">
        <span className="text-gray-400">{icon}</span>
        {textarea ? (
          <textarea className="flex-1 resize-none outline-none" rows={3} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input className="flex-1 outline-none" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    </div>
  );
}

function UploadField({ label, file, onFile }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-700">{label}</label>
      <label className={`flex cursor-pointer items-center justify-between rounded border-2 border-dashed p-4 ${file ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:bg-gray-50"}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-200 p-2">
            <ImageIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="text-sm text-gray-600">{file ? file.name : "اختر ملفًا (JPG, PNG, PDF)"}</div>
        </div>
        <input type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
      </label>
    </div>
  );
}
