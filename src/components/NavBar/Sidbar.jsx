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
import userImg from "../../asset/Imge/profiledefautimg.png"; // صورة المستخدم

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white shadow flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="p-6 flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-green-600">Dawaei</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-4 text-gray-500">
          <SidebarLink icon={LayoutDashboard} label="الصفحة الرئيسية" active />
          <SidebarLink icon={Users} label="قائمة الصيدليات" />
          <SidebarLink icon={User} label="قائمة المستخدمين" />
          <SidebarLink icon={Pill} label="قائمة الدوية" />
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4">
        {/* Add Button */}
        <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center justify-center mb-6">
          <button className="bg-green-400 text-white p-3 rounded-full">
            <Plus />
          </button>
          <span className="mt-2 text-green-800 font-medium">إضافة</span>
        </div>

        {/* Profile and Logout */}
        <div className="flex items-center justify-center gap-4">
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
      className={`flex items-center gap-3 px-4 py-2 rounded-md ${
        active
          ? "text-green-600 bg-green-50 font-bold"
          : "hover:bg-gray-100 text-gray-500"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
