import { Outlet } from "react-router-dom";
import Topbar from "../components/NavBar/Topbar";
import Sidbar from "../components/NavBar/Sidbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DateTime } from "luxon"; // ✅ استيراد luxon
import { Clock } from "lucide-react";


const MainLayout = () => {
  const [activeCycle, setActiveCycle] = useState(null);
  const [currentBaghdadTime, setCurrentBaghdadTime] = useState("");
  const token = localStorage.getItem("token");

  // ✅ دالة تنسيق الوقت الحالي بتوقيت بغداد
  const getBaghdadTime = () => {
    return DateTime.now()
      .setZone("Asia/Baghdad")
      .setLocale("ar")
      .toFormat("cccc d LLLL yyyy - hh:mm:ss a");
  };

  // ✅ تحديث الوقت كل ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBaghdadTime(getBaghdadTime());
    }, 1000);

    return () => clearInterval(interval); // تنظيف عند إلغاء التركيب
  }, []);

  // ✅ جلب الدورة النشطة
  useEffect(() => {
    const fetchActiveCycle = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          params: {
            voteActveStatus: 1,
            PageNumber: 1,
            PageSize: 1,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Accept-Language": "en",
          },
        });

        const items = res.data?.data?.items;
        if (items && items.length > 0) {
          setActiveCycle(items[0]);
        }
      } catch (error) {
        console.error("Error fetching active cycle:", error);
        toast.error("فشل في تحميل الدورة النشطة.");
      }
    };

    fetchActiveCycle();
  }, [token]);

  return (
    <section className="">
      <Topbar />
      <div className="flex">
        <section className="flex-1 w-full lg:w-[75%] px-5 py-4">
          <h1 className="text-center text-blue-900 text-xl font-semibold">
            {activeCycle ? `( ${activeCycle.dscrp} )` : "(لا توجد دورة نشطة حالياً)"}
          </h1>

          {/* ✅ عرض الوقت الحالي بتوقيت بغداد */}
       <p className="text-center text-gray-600 mt-1 flex justify-center items-center gap-2">
  <Clock size={18} className="text-blue-800" />
  {currentBaghdadTime}
</p>


          <Outlet />
        </section>

        <section className="hidden md:flex md:w-[25%] px-5 py-4">
          <Sidbar />
        </section>
      </div>
    </section>
  );
};

export default MainLayout;
