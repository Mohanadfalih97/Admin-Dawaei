import React from "react";
import Navbar from "../components/NavBar/Navbar";
import Cards from "../components/Vote/VoteCard";
import Statistics from "../components/Statistics";
import * as Tabs from "@radix-ui/react-tabs";

const Dashboard = () => {
  return (
    <div className="flex">
      <section className="flex-1 w-full lg:w-[80%] mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto">
        <Navbar />

        <Tabs.Root defaultValue="cards" className="w-full mt-6"  style={{ direction: "rtl" }}>
          <Tabs.List className="flex border-b border-gray-300 mb-4">
            <Tabs.Trigger
              value="cards"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
            >
              التصويت
            </Tabs.Trigger>
            <Tabs.Trigger
              value="statistics"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 cursor-pointer"
            >
              الدراسات
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="cards">
            <Cards />
          </Tabs.Content>
          <Tabs.Content value="statistics">
            <Statistics />
          </Tabs.Content>
        </Tabs.Root>
      </section>
    </div>
  );
};

export default Dashboard;
