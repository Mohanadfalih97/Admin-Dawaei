import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidbar from "../components/Sidbar";

const MainLayout = () => {
  return (
    <section className="">
      <Topbar />
      <div className="flex">
        <section className="flex-1 w-full lg:w-[75%] px-5 py-4">
            <h1 className="text-center text-blue-900 ">(الدوره الانتخابية الاولى)</h1>
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
