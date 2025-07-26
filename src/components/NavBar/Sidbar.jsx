import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import {
  LayoutDashboard,
  BarChart,
  CalendarDays,
  Users,
  Vote,
  UserCog,
  Building2,
  ClipboardList,
} from "lucide-react";

const Sidbar = () => {
  const [institution, setInstitution] = useState(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}institution`, {
          headers: {
           
            "Accept-Language": "en",
             Authorization: `Bearer ${token}`,
          },
        });

        const items = response.data?.data?.items;
        if (items && items.length > 0) {
          setInstitution(items[0]);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات المؤسسة", error);
      }
    };

    fetchInstitution();
  }, []);

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
        to={
          institution?.id
            ? `/institution/edit/${institution.id}`
            : `/institution/create`
        }
        className={({ isActive }) =>
          `flex items-center gap-2 p-3 rounded-lg text-md transition-all duration-300 ${
            isActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`
        }
      >
        <Building2 /> تفاصيل المؤسسة
      </NavLink>
    </div>
  );
};

export default Sidbar;
