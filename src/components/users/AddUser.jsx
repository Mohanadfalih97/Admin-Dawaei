import React, { useMemo, useState } from "react";
import { User2, Phone, Mail, ChevronDown } from "lucide-react";


 function AddUserForm() {


  return (
    <div dir="rtl" className="min-h-screen bg-transparent flex items-start sm:items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white/95 dark:bg-zinc-900/90 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">إضافة مستخدم جديد</h2>
        </div>

        <form onSubmit={onSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8">
          {/* اسم المستخدم */}
          <FieldBlock label="اسم المستخدم">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                <User2 className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => handle("username", e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full h-12 rounded-xl border border-zinc-300 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 pr-10 pl-3 outline-none placeholder:text-zinc-400"
              />
            </div>
          </FieldBlock>

          {/* رقم الهاتف */}
          <FieldBlock label="رقم الهاتف">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                <Phone className="w-5 h-5" />
              </span>

              <div className="absolute inset-y-0 left-0 pl-2 pr-3 flex items-center">
                <CountrySelect
                  countries={countries}
                  value={form.country}
                  onChange={(code) => handle("country", code)}
                />
              </div>

              <input
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => handle("phone", e.target.value)}
                placeholder="xxxxxxxxxxx"
                maxLength={20}
                className="w-full h-12 rounded-xl border border-zinc-300 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 pr-10 pl-32 sm:pl-36 outline-none placeholder:text-zinc-400"
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              سيتم استخدام كود الدولة: {currentCountry.dial}
              {!phoneOk && form.phone && " — رقم غير صالح"}
            </p>
          </FieldBlock>

          {/* البريد الإلكتروني */}
          <FieldBlock label="البريد الإلكتروني">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handle("email", e.target.value)}
                placeholder="example@gmail.com"
                className="w-full h-12 rounded-xl border border-zinc-300 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 pr-10 pl-3 outline-none placeholder:text-zinc-400"
              />
            </div>
            {!emailOk && form.email && (
              <p className="mt-1 text-xs text-rose-500">صيغة البريد غير صحيحة</p>
            )}
          </FieldBlock>

          {/* الأزرار */}
          <div className="mt-14 flex items-center gap-4">
            <button
              type="submit"
              disabled={disabledNext}
              className={`h-12 min-w-[140px] rounded-xl px-6 text-sm font-medium transition
                ${
                  disabledNext
                    ? "bg-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-400"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                }`}
            >
              التالي
            </button>

            <button
              type="button"
              onClick={() => setForm({ username: "", phone: "", email: "", country: "IQ" })}
              className="h-12 min-w-[140px] rounded-xl px-6 text-sm font-medium border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddUserForm;
/* =============== عناصر مساعدة =============== */


