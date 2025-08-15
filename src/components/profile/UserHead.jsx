import React from "react";
import { Bell } from "lucide-react";
import { CalendarDays } from "lucide-react";
import profilpic from "../../asset/Imge/profilepic.jpg"

const Navbar = () => {
  return (
    <section>
  {/*   <div className=" h-[50px] flex justify-between items-center px-5 opacity-100"> */}
     

      {/* الإشعارات والمستخدم */}
      <div className="flex items-center gap-4 border h-[50px]  border-gray-300 bg-white rounded-full p-2" style={{direction:"ltr"}}>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <img
          src= {profilpic}// ✅ ضع الصورة المناسبة هنا
          alt="User"
          className="w-10 h-10 rounded-full border border-gray-300 object-cover"
        />
      </div>
    </section>

  );
};

export default Navbar;
  
  