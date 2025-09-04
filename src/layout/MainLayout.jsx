import { Outlet } from "react-router-dom";
import Topbar from "../components/NavBar/Topbar";
import Sidbar from "../components/NavBar/Sidbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DateTime } from "luxon"; // ✅ استيراد luxon
import { Clock,Users } from "lucide-react";


const MainLayout = () => {








  return (
    <section className="">
      <div className="flex">
 {/* الوقت والدورة */}
        <section className="flex-1 w-full  px-2 py-4 "style={{backgroundColor: "#F8FCFB"}}>


       
            {/* المكون الفرعي */}
      <Outlet />
        </section>

        <section className="w-64 h-screen" >
          <Sidbar />
        </section>
      </div>
    </section>
  );
};

export default MainLayout;
