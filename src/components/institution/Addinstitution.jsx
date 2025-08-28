import React, { useState } from 'react'; 
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { FaCheckCircle } from "react-icons/fa";


export default function PharmacyProfileForm() {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            label: 'بيانات الصيدلاني'
        },
        {
            label: 'بيانات الصيدلية'
        },
        {
            label: 'المستندات'
        }
    ];

    const nextStep = () => setActiveIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1));
    const prevStep = () => setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));

    return (
        <div dir="rtl" className="card">
        
<div>
  <svg  xmlns="http://www.w3.org/2000/svg">
  <rect className='w-[656px] h-[5px] text-[#54BEA0]' fill="gray" />
</svg>
</div>
          
<svg  xmlns="http://www.w3.org/2000/svg">
  <rect className='w-[193px] h-[5px] text-[#54BEA0]' fill="blue" />
</svg>
  <Steps model={items} activeIndex={activeIndex} />
            {/* المحتوى حسب الخطوة الحالية */}
            <div className="p-4 md:p-6 space-y-8">
                {activeIndex === 0 && (
                    <div>
                       {/* شريط التقدّم */}
          
                        <div>
                            {/* هنا يمكن إضافة الحقول الخاصة بالبيانات */}
                            <label>اسم الصيدلي:</label>
                            <input type="text" placeholder="اكتب اسم الصيدلي" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div>
                            <label>رقم الهاتف:</label>
                            <input type="tel" placeholder="اكتب رقم الهاتف" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div>
                            <label>البريد الإلكتروني:</label>
                            <input type="email" placeholder="اكتب البريد الإلكتروني" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                    </div>
                )}

                {activeIndex === 1 && (
                    <div>
                        <h3>بيانات الصيدلية</h3>
                        <div>
                            <label>اسم الصيدلية:</label>
                            <input type="text" placeholder="اكتب اسم الصيدلية" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div>
                            <label>رقم الهاتف:</label>
                            <input type="tel" placeholder="اكتب رقم الهاتف" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div>
                            <label>وصف الصيدلية:</label>
                            <textarea placeholder="اكتب وصف الصيدلية" className="w-full p-2 border border-gray-300 rounded" rows="4"></textarea>
                        </div>
                    </div>
                )}

                {activeIndex === 2 && (
                    <div>
                        <h3>المستندات</h3>
                        <div>
                            <label>صورة رخصة الصيدلية:</label>
                            <input type="file" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div>
                            <label>إرفاق مستند آخر:</label>
                            <input type="file" className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                    </div>
                )}
            </div>

            {/* أزرار الأسفل */}
            <div className="px-4 md:px-6 py-4 border-t border-neutral-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={activeIndex === 0}
                        className={`w-1/2 md:w-32 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border
                            ${activeIndex === 0
                                ? "border-neutral-200 text-neutral-400 cursor-not-allowed"
                                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"}`}
                    >
                        السابق
                    </button>
                    {activeIndex < items.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-1/2 md:w-32 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            التالي
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={`w-1/2 md:w-40 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                                ${activeIndex === 2
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-neutral-200 text-neutral-500 cursor-not-allowed"}`}
                            disabled={activeIndex !== 2}
                        >
                            حفظ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
