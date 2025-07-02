import React from "react";
import { Calendar, ChartBar, UserRound } from "lucide-react";
import  { useEffect, useState } from "react";

import BoxCard from "./BoxCard";


const Cards = () => {
    const [membersCount, setMembersCount] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}members`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.data?.totalCount != null) {
          setMembersCount(result.data.totalCount);
        } else {
          console.error("فشل في جلب عدد الأعضاء", result);
        }
      } catch (error) {
        console.error("خطأ في جلب الأعضاء:", error);
      }
    };

    fetchMembers();
  }, []);
  const activeVotes = [
    {
      id: "1",
      title: "التصويت على ميزانية المشاريع لعام 2025",
      description:
        "التصويت على الميزانية المقترحة للمشاريع التطويرية للعام القادم",
      startDate: new Date(2025, 3, 25, 10, 0),
      endDate: new Date(2025, 3, 25, 18, 0),
      status: "نشط",
    },
    {
      id: "2",
      title: "انتخاب أعضاء اللجنة التنفيذية",
      description: "انتخاب أعضاء اللجنة التنفيذية للدورة الجديدة",
      startDate: new Date(2025, 3, 23, 9, 0),
      endDate: new Date(2025, 3, 28, 17, 0),
      status: "نشط",
    },
    {
      id: "3",
      title: "انتخاب أعضاء اللجنة التنفيذية",
      description: "انتخاب أعضاء اللجنة التنفيذية للدورة الجديدة",
      startDate: new Date(2025, 3, 23, 9, 0),
      endDate: new Date(2025, 3, 28, 17, 0),
      status: "غير مكتمل",
    },
  ];

  // Stats for the dashboard
  const stats = [
    {
      name: "عدد الأعضاء",
      value: membersCount,
      icon: <UserRound className="h-8 w-8 text-council-accent text-blue-400" />,
    },
    {
      name: "التصويتات المكتملة",
      value: "8",
      icon: <ChartBar className="h-8 w-8 text-green-600" />,
    },
    {
      name: "التصويتات النشطة",
      value: "2",
      icon: <Calendar className="h-8 w-8 text-cyan-800" />,
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {stats.map((stat) => (
          <div className="p-5 box-border border rounded-lg" key={stat.name}>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 p-5 box-border border rounded-lg" style={{direction:"ltr"}}>
        <div className="flex flex-col items-end justify-end gap-2">
          <h2 className="text-2xl font-semibold ">التصويتات النشطة</h2>
          <p className="text-sm text-gray-400 font-normal">
            التصويتات المتاحة حالياً للمشاركة
          </p>
        </div>
        <BoxCard votes={activeVotes} />
      </div>
     
    </section>
  );
};

export default Cards;
