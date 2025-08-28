import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { GoArrowRight } from "react-icons/go";
import filtter from "../../asset/Imge/34_filter.png";


const notifications = [
  {
    id: 1,
    name: "محمد عباس علي",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "منذ 2 ساعة",
    status: "pending",
  },
  {
    id: 2,
    name: "نور محمد علي",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "منذ 2 ساعة",
    status: "pending",
  },
  {
    id: 3,
    name: "مصطفى عماد علي",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    time: "منذ 2 ساعة",
    status: "pending",
  },
  {
    id: 4,
    name: "سهيل محمد علي",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    time: "منذ 2 ساعة",
    status: "approved",
  },
  {
    id: 5,
    name: "زینب علي كاظم",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    time: "منذ 2 ساعة",
    status: "rejected",
  },
];

const statusMap = {
  pending: { label: "قبول", color: "bg-blue-600", text: "text-blue-600" },
  approved: { label: "نشطة", color: "bg-green-500", text: "text-green-500" },
  rejected: { label: "مرفوضة", color: "bg-red-500", text: "text-red-500" },
};

export default function Notifications() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4  flex  items-center justify-between" style={{direction:"rtl"}}>
   <div className="flex items-center gap-2">
      
        <GoArrowRight className="text-[#B3B3B3] w-6 h-6" />
          <h2 className="text-lg font-semibold text-gray-800">الإشعارات</h2>
   </div>
     <div>
        <img src={filtter} alt="Filter" className="w-6 h-6 cursor-pointer" />
     </div>
      </div>
      <div className="p-4 text-right text-gray-500">
           <span className="text-[#54BEA0] text-sm text-[18px]">لديك 2 إشعارات جديدة</span>
      </div>
<div className="divide-y" style={{ direction: "rtl" }}>
  {notifications.map((notif) => (
    <div
      key={notif.id}
      className="p-[10px] flex items-center flex-col "
    >
      {/* القسم الأول (الصورة + النص) */}
      <div className="flex items-center gap-4 w-[461px] h-[50px] p-5 ">
        <img
          src={notif.avatar}
          alt={notif.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="text-right">
          <p className="text-[14px]">
            طلب جديد لفتح صيدلية من قبل الصيدلاني{" "}
            <span className="font-semibold text-[14px] text-[#54BEA0]">{notif.name}</span>
          </p>
          <span className="text-xs text-gray-500">{notif.time}</span>
        </div>
      </div>

      {/* القسم الثاني (الأزرار أو الحالة) */}
      <div className="flex gap-2 items-center mt-2 w-full justify-end" >
        {notif.status === "pending" && (
          <>
            <button className="p-[10px] rounded-2xl outline-none text-white bg-blue-600 hover:bg-blue-700 text-[12px] transition w-[93.33px] h-[32px] flex items-center justify-center">
              قبول
            </button>
            <button className="p-[10px] rounded-2xl border outline-none text-[12px] border-[#D9D9D9] text-[#B3B3B3] bg-white transition w-[97px] h-[32px] flex items-center justify-center">
              عرض التفاصيل
            </button>
          </>
        )}
        {notif.status === "approved" && (
                <>
                   <span className="p-[10px] rounded-2xl text-white bg-[#55C964]  text-[12px] transition w-[93.33px] h-[32px] flex items-center justify-center">
            نشطة
          </span>
              <button className="p-[10px] rounded-2xl border text-[12px] border-[#D9D9D9] text-[#B3B3B3] bg-white transition w-[97px] h-[32px] flex items-center justify-center">
              عرض التفاصيل
            </button>
                </>
       
        )}
        {notif.status === "rejected" && (
                <>
                 <span className="p-[10px] rounded-2xl text-white bg-[#FF4742] hover:bg-blue-700 text-[12px] transition w-[93.33px] h-[32px] flex items-center justify-center">
            مرفوضة
          </span>
             <button className="p-[10px] rounded-2xl border text-[12px] border-[#D9D9D9] text-[#B3B3B3] bg-white transition w-[97px] h-[32px] flex items-center justify-center">
              عرض التفاصيل
            </button>

                </>
         
        )}
      </div>
    </div>
  ))}
</div>



    </div>
  );
}
