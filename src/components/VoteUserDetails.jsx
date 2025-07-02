import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import defaultProfileImage from "../asset/Imge/profiledefautimg.png";
import logo from "../asset/Imge/logo.png";

const VotingPage = ({ enable = true }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [votes, setVotes] = useState({
    نعم: 6,
    كلا: 3,
    اتحفظ: 2,
  });

  const handleSelect = (option) => {
    if (!enable) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption && enable) {
      setVotes((prev) => ({
        ...prev,
        [selectedOption]: (prev[selectedOption] || 0) + 1,
      }));
      alert(`تم التصويت لـ: ${selectedOption}`);
    }
  };

  return (
    <div dir="rtl">
      {/* Header */}
      <header className="bg-white shadow p-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <img src={logo} alt="شعار المجلس" className="w-16 h-16 object-contain" />
          <div className="text-right">
            <h1 className="text-xl font-bold text-blue-700">مجلس تطوير القطاع الخاص</h1>
            <p className="text-sm text-gray-600">Private Sector Development Council</p>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-2">عنوان تصويت: نهائي لجنة انضباط</h1>
        <hr className="border-b border-gray-300 mb-6" />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* إدخال رمز التحقق */}
          <div className="flex flex-col gap-3 p-5 bg-white rounded-xl shadow">
            <label className="text-gray-700 font-medium">ادخل رمز التحقق</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="ادخل رمز تحقق"
              required
            />
          </div>

          {/* الملف الشخصي */}
          <div className="p-5 bg-white rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">الملف الشخصي</h2>
            <div className="flex flex-row gap-5 items-start">
              <div className="flex-1 space-y-1 text-right">
                <p><span className="font-semibold">الاسم:</span> اللاعب فلان</p>
                <p><span className="font-semibold">اللقب:</span> الهداف</p>
                <p><span className="font-semibold">معلومات أخرى...</span></p>
              </div>
              <div>
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md group mx-auto">
                  <img
                    src={defaultProfileImage}
                    alt="صورة الملف الشخصي"
                    className="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="imageUpload"
                    className="hidden"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white text-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition"
                  >
                    <i className="fa-solid fa-camera"></i>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* التصويت */}
        <div className="p-6 bg-white rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">التصويت</h2>
          <div className="flex flex-col gap-3">
            {["نعم", "كلا", "اتحفظ"].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="vote"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleSelect(option)}
                  disabled={!enable}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">
                  {option} - عدد الأصوات: {votes[option] || 0}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* زر التصويت */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!enable || !selectedOption}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition w-full ${
              !enable || !selectedOption
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            تصويت
          </button>

          {!enable && (
            <p className="text-red-600 mt-4 font-medium">التصويت غير مفعّل حالياً</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t p-6 text-right text-sm text-gray-700" style={{direction:"ltr"}}>
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="flex items-center gap-2 justify-end" >
           info@psdc.gov.iq <Mail size={18} /> 
          </p>
          <p className="flex items-center gap-2 justify-end">
            +9647801668811 <Phone size={18} />
          </p>
          <p className="flex items-center gap-2 justify-end">
           العراق - بغداد - كرادة مريم - مجاور جسر الجمهورية - مبنى وزارة التخطيط - الطابق الأول  <MapPin size={18} />
          </p>
          <p className="text-center text-gray-500 pt-4">www.psdc.gov.iq</p>
        </div>
      </footer>
    </div>
  );
};

export default VotingPage;
