import {
  LayoutDashboard,
  BarChart,
  CalendarDays,
  Users,
  Vote,
  UserCog,
  ClipboardList,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}institution`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("memberID");
    navigate("/LoginAsMember");
  };

  const handleToggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setShowMenu(false), 500);
    } else {
      setShowMenu(true);
      setTimeout(() => setIsOpen(true), 50);
    }
  };

  return (
    <div className="bg-primary text-white h-[65px] flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-4">
        <Link
          to="/Login"
          onClick={handleLogout}
          className="w-36 bg-blue-500 hover:bg-blue-700 text-white text-center p-2.5 rounded-md transition duration-300"
        >
          تسجيل الخروج
        </Link>
      </div>

      <div className="md:text-center flex items-center gap-3 py-3">
        <h2 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">
          منصة التصويت الإلكتروني
        </h2>
      </div>

      {/* ✅ زر القائمة الجانبية في الجوال */}
      <div className="md:hidden">
        <div
          className="relative flex flex-col gap-[4.5px] cursor-pointer"
          onClick={handleToggleMenu}
        >
          <div
            className={`w-6 h-1 bg-white rounded-sm ${isOpen ? "rotate-45" : ""} origin-left ease-in-out duration-500`}
          />
          <div
            className={`w-6 h-1 bg-white rounded-sm ${isOpen ? "opacity-0" : ""} ease-in-out duration-500`}
          />
          <div
            className={`w-6 h-1 bg-white rounded-sm ${isOpen ? "-rotate-45" : ""} origin-left ease-in-out duration-500`}
          />
        </div>

        {/* ✅ القائمة الجانبية */}
        {showMenu && (
          <div
            className={`absolute top-20 right-0 w-[300px] border-x-4 shadow-2xl bg-white text-black flex flex-col items-end justify-start p-5 gap-8 font-medium text-xl z-50 transform transition-all duration-500 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={handleToggleMenu}
          >
            {[
              { to: "/dashboard", icon: <LayoutDashboard />, label: "لوحة التحكم" },
              { to: "/VotePageMain", icon: <Vote />, label: "التصويتات" },
              { to: "/reports", icon: <BarChart />, label: "التقارير" },
              { to: "/members", icon: <Users />, label: "الأعضاء" },
              { to: "/UsersInfo", icon: <UserCog />, label: "المستخدمين" },
              { to: "/Electoralcycles", icon: <CalendarDays />, label: "الدورات الانتخابية" },
              { to: "/ElectionCycleDetails", icon: <CalendarDays />, label: "تفاصيل الدورات الانتخابية" },
              { to: "/assign-members", icon: <ClipboardList />, label: "إسناد الأعضاء" },
              { to: "/Department", icon: <Building2 />, label: "القطاعات" },
              {
                to: institution?.id
                  ? `/institution/edit/${institution.id}`
                  : `/institution/create`,
                icon: <Building2 />,
                label: "تفاصيل المؤسسة",
              },
            ].map(({ to, icon, label }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2 p-3 rounded-lg text-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
              >
                {icon} {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
