// src/components/Sidebar.jsx
import {
  LayoutDashboard,
  Users,
  User,
  Pill,
  Plus,
  LogOut,
} from "lucide-react";
import logo from "../../asset/Imge/logo.png"; // ضع شعارك هنا
import userImg from "../../asset/Imge/profilepic.jpg"; // صورة المستخدم

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white shadow flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="px-3 py-3 flex items-center gap-4 justify-center" style={{direction:"rtl"}}>
          <img src={logo} alt="Logo" className="w-11 h-11" />
          <h1 className="text-4xl font-bold text-green-600">Dawaei</h1>
        </div>
<hr className="mt-1"/>
        {/* Navigation */}
        <nav className="mt-6 pl-2 space-y-4 text-gray-500 rounded-md " style={{direction:"rtl"}}>
          <SidebarLink icon={LayoutDashboard} label="الصفحة الرئيسية" active />
          <SidebarLink icon={Users} label="قائمة الصيدليات" />
          <SidebarLink icon={User} label="قائمة المستخدمين" />
          <SidebarLink icon={Pill} label="قائمة الدوية" />
        </nav>
      </div>

      {/* Bottom Actions */}

      <div className="p-4 flex justify-center items-center gap-6 flex-col">
        {/* Add Button */}
<div className="flex justify-center items-center">
        <hr className="mt-1 w-40"/>

</div>
        <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center justify-center mb-6 w-40">
          <button className="bg-[#54BEA0] text-white p-3 rounded-xl">
            <Plus />
          </button>
          <span className="mt-2 text-[#54BEA0] font-medium">إضافة</span>
        </div>

        {/* Profile and Logout */}
        <div className="flex items-center justify-center gap-4 p-1 rounded-full bg-[#DAF1EA]">
          <img
            src={userImg}
            alt="User"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <button className="text-red-500 bg-red-100 p-2 rounded-full">
            <LogOut />
          </button>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ icon: Icon, label, active }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 ${
        active
          ? "text-green-600 bg-green-50 font-bold border-r-4 border-[#54BEA0]"
          : "hover:bg-gray-100 text-gray-500"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
