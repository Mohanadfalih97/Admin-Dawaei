import React from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShoppingCart,
} from "lucide-react";

 function UserProfile() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700">
          المعلومات العامة عن المستخدم
        </h2>
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="user"
          className="w-16 h-16 rounded-full object-cover border"
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* اسم المستخدم */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            اسم المستخدم
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value="سارة سعد كاظم"
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            رقم الهاتف
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Phone className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value="077XXXXXXX"
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            البريد الالكتروني
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value="sarasaad@gmail.com"
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* تاريخ الانضمام */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            تاريخ الانضمام
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value="2025/7/6"
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* حالة الحساب */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            حالة الحساب
          </label>
          <select
            value="نشط"
            className="w-full border rounded-lg px-3 py-2 bg-white"
            disabled
          >
            <option>نشط</option>
            <option>غير نشط</option>
          </select>
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">العنوان</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value="بغداد - السيدية"
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* عدد الطلبات */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            عدد الطلبات
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <ShoppingCart className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value="10000"
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-10">
        <button
          disabled
          className="px-8 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
        >
          حفظ
        </button>
        <button className="px-8 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition">
          حذف المستخدم
        </button>
      </div>
    </div>
  );
}
export default UserProfile;