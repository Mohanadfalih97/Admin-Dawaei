import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart,
  CalendarDays,
  Users,
  Vote,
  UserCog,
  Building2, // أيقونة للقطاعات
  ClipboardList // أيقونة للإسناد
} from "lucide-react";

const Sidbar = () => {
  return (
  
    <div className="flex flex-col bg-white shadow-lg h-full w-[300px] py-10 px-4 gap-4 rounded-lg">

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <LayoutDashboard /> لوحة التحكم
      </NavLink>

      <NavLink
        to="/VotePageMain"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <Vote /> التصويتات
      </NavLink>

      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <BarChart /> التقارير
      </NavLink>

      <NavLink
        to="/members"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <Users /> الأعضاء
      </NavLink>

      <NavLink
        to="/Electoralcycles"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <CalendarDays /> الدورات الانتخابية
      </NavLink>

      <NavLink
        to="/UsersInfo"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <UserCog /> المستخدمين
      </NavLink>

      <NavLink
        to="/ElectionCycleDetails"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <CalendarDays /> تفاصيل الدورات الانتخابيه
      </NavLink>

      {/* ✅ جديد: القطاعات */}
      <NavLink
        to="/Department"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <Building2 /> القطاعات
      </NavLink>

      {/* ✅ جديد: إسناد الأعضاء للدورات */}
      <NavLink
        to="/assign-members"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <ClipboardList /> إسناد الأعضاء
      </NavLink>
          <NavLink
        to="/InstitutionDetails"
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <Building2 />  تفاصيل المؤسسة
      </NavLink>

    </div>
  );
};

export default Sidbar;
