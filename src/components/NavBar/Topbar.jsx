import React from "react";
import { Bell } from "lucide-react";
import { CalendarDays } from "lucide-react";

const Navbar = () => {
  return (
    <div className=" h-[50px] flex justify-between items-center px-5 opacity-100">
      {/* Date filter section */}
      <div className="flex items-center gap-2">
        {/* زر آخر 30 يوم */}
        <button className="flex items-center gap-1 bg-white border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 shadow-sm hover:bg-gray-50">
          <span>آخر 30 يوم</span>
          <span className="text-xs">▼</span>
        </button>

        {/* التاريخ المختار */}
        <div className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 shadow-sm hover:bg-gray-50">
          <span>21 June 2025 _ 6 August 2025</span>
          <CalendarDays className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* الإشعارات والمستخدم */}
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <img
          src="/assets/user.png" // ✅ ضع الصورة المناسبة هنا
          alt="User"
          className="w-10 h-10 rounded-full border border-gray-300 object-cover"
        />
      </div>
    </div>
  );
};

export default Navbar;
  