import { LayoutDashboard, BarChart, CalendarDays, Users, Vote, UserCog ,User,ClipboardList, Building2 } from "lucide-react";

import { useState } from "react";
import { Link, NavLink,useNavigate} from "react-router-dom";
import logo from "../asset/Imge/logoAdmin.png";



const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

  const handleLogout = () => {
    // 🗑️ حذف البيانات من localStorage
    
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("memberID");

    // 🚀 التوجيه إلى صفحة تسجيل الدخول
    navigate("/LoginAsMember");
  };

  const handleToggleMenu = () => {
    if (isOpen) {
      // لما يريد يغلق: أولاً يخليه يغلق بحركة
      setIsOpen((prev) => !prev);
      setTimeout(() => {
        setShowMenu(false); // بعد 500ms يحذفه
      }, 500); // لازم يساوي مدة الـ duration
    } else {
      // لما يريد يفتح: مباشرة يظهره
      setShowMenu(true);
      setTimeout(() => {
        setIsOpen(true);
      }, 50); // تأخير بسيط لضمان transition
    }
  };

  return (
    <div className="bg-priamy text-white h-[65px] flex items-center justify-between px-5 py-4" >
      <div className="flex items-center gap-4">
    <Link
  to="/Login"
  onClick={handleLogout}

  className="w-36 bg-blue-500 hover:bg-blue-700 text-white text-center p-2.5 rounded-md transition duration-300"
>
  تسجيل الخروج
</Link>


        <div className="hidden md:flex items-center gap-2">
          <p> مرحبا، امير</p>
          <User />
        </div>
      </div>

      <div className="md:text-center flex items-center gap-3 py-3">
<h2 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">منصة التصويت الإلكتروني</h2>
            <img src={logo} alt="شعار المجلس" className="w-14 h-16 object-contain" />
       
      </div>

      <div className="md:hidden">
        <div
          className="relative  flex flex-col gap-[4.5px] cursor-pointer"
          onClick={handleToggleMenu}
        >
          <div
            className={`w-6 h-1 bg-white rounded-sm  ${
              isOpen ? "rotate-45" : ""
            } origin-left ease-in-out duration-500 `}
          />
          <div
            className={`w-6 h-1 bg-white rounded-sm ${
              isOpen ? "opacity-0" : ""
            } ease-in-out duration-500 `}
          />
          <div
            className={`w-6 h-1 bg-white rounded-sm ${
              isOpen ? "-rotate-45" : ""
            } origin-left ease-in-out duration-500 `}
          />
        </div>
        {showMenu && (
          <div
            className={`absolute top-20 right-0 h-screen w-[300px] border-x-4 shadow-2xl bg-white text-black flex flex-col items-end justify-start p-5 gap-8 font-medium text-xl z-50 transform transition-all duration-500 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={handleToggleMenu}
          >
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <LayoutDashboard /> لوحة التحكم
            </NavLink>

            <NavLink
                to="/VotePageMain"
                  className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
       <Vote /> التصويتات            
       </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <BarChart /> التقارير
            </NavLink>

            <NavLink
              to="/members"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <Users /> الأعضاء
            </NavLink>
                 <NavLink
        to="/UsersInfo"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <UserCog /> المستخدمين
            </NavLink>
         <NavLink
        to="/Electoralcycles"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <CalendarDays /> الدورات الانتخابية
            </NavLink>
           {/*      <NavLink
        to="/Candidates"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <UserCheck />  المرشحين
            </NavLink> */}
                <NavLink
        to="/ElectionCycleDetails"
              className={({ isActive }) =>
                ` w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
                  isActive
                    ? "bg-priamy text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
        <CalendarDays /> تفاصيل الدورات الانتخابية
            </NavLink>
            <NavLink
  to="/assign-members"
  className={({ isActive }) =>
    `w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
      isActive
        ? "bg-priamy text-white shadow-lg"
        : "text-gray-600 hover:bg-gray-100 hover:text-primary"
    }`
  }
>
  <ClipboardList /> إسناد الأعضاء
</NavLink>

<NavLink
  to="/Department"
  className={({ isActive }) =>
    `w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
      isActive
        ? "bg-priamy text-white shadow-lg"
        : "text-gray-600 hover:bg-gray-100 hover:text-primary"
    }`
  }
>
  <Building2 /> القطاعات
</NavLink>
<NavLink
  to="/InstitutionDetails"
  className={({ isActive }) =>
    `w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300  ${
      isActive
        ? "bg-priamy text-white shadow-lg"
        : "text-gray-600 hover:bg-gray-100 hover:text-primary"
    }`
  }
>
  <Building2 /> تفاصيل المؤسسة
</NavLink>

          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
