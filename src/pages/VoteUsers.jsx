import * as Tabs from "@radix-ui/react-tabs";
import { LogOut } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import VoteUserDetails from "../components/Vote/VoteUserDetails";

const VoteUses = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🗑️ حذف البيانات من localStorage
    localStorage.removeItem("memberID");
    localStorage.removeItem("token");

    // 🚀 التوجيه إلى صفحة تسجيل الدخول
    navigate("/LoginAsMember");
  };

  return (
    <Tabs.Root defaultValue="vote" className="w-full mt-6" style={{ direction: "rtl" }}>
      <Tabs.List className="flex border-b border-gray-300 mb-4 justify-center flex-wrap gap-2">
        <Tabs.Trigger
          value="vote"
          className="flex items-center gap-2 px-4 py-2 text-xl font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
        >
          التصويت
        </Tabs.Trigger>

        <Tabs.Trigger
          value="archive"
          className="flex items-center gap-2 px-4 py-2 text-xl font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
        >
          الأرشيف
        </Tabs.Trigger>

        <Tabs.Trigger
          value="studies"
          className="flex items-center gap-2 px-4 py-2 text-xl font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
        >
          الدراسات
        </Tabs.Trigger>

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-xl font-medium text-red-600 hover:text-red-700 transition"
        >
          <LogOut className="w-6 h-6" />
          تسجيل الخروج
        </button>
      </Tabs.List>

      <Tabs.Content value="vote">
        <VoteUserDetails />
      </Tabs.Content>

      <Tabs.Content value="archive">
        {/* محتوى الأرشيف هنا */}
      </Tabs.Content>

      <Tabs.Content value="studies">
        {/* محتوى الدراسات هنا */}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default VoteUses;
