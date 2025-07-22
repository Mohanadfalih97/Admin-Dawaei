import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidbar from "../components/Sidbar";
import { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

const MainLayout = () => {
   const [activeCycle, setActiveCycle] = useState(null);
         const token = localStorage.getItem("token"); // ✅ احصل على التوكن


  useEffect(() => {
    const fetchActiveCycle = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          params: {
            voteActveStatus: 1,
            PageNumber: 1,
            PageSize: 1, // نريد أول دورة نشطة فقط
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
        } else {
          toast.info("لا توجد دورة نشطة حالياً.");
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
            <h1 className="text-center text-blue-900 ">  {activeCycle ? `( ${activeCycle.dscrp} )` : "جارٍ التحميل..."}</h1>
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
