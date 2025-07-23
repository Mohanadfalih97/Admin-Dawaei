import React, { useEffect, useState } from "react";
import { Calendar, ChartBar, UserRound } from "lucide-react";
import BoxCard from "../BoxCard";

const Cards = () => {
  const [membersCount, setMembersCount] = useState(0);
  const [voteStats, setVoteStats] = useState({ completed: 0, active: 0 });
  const [allVotes, setAllVotes] = useState([]);

  // جلب عدد الأعضاء
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

  // جلب إحصائيات التصويتات (المكتملة والنشطة)
  useEffect(() => {
    const fetchVoteStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}vote/status-counts`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.data) {
          setVoteStats({
            completed: result.data.completedVotesCount || 0,
            active: result.data.activeVotesCount || 0,
          });
        } else {
          console.error("فشل في جلب بيانات التصويت", result);
        }
      } catch (error) {
        console.error("خطأ في جلب التصويت:", error);
      }
    };

    fetchVoteStats();
  }, []);

  // جلب جميع التصويتات بدون فلترة
  useEffect(() => {
    const fetchAllVotes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}vote`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.data?.items) {
          const mappedVotes = result.data.items.map((vote) => ({
            id: vote.id,
            title: vote.voteTitle,
            description: vote.dscrp,
            startDate: new Date(vote.startDate),
            endDate: new Date(vote.finishDate),
            status:
              vote.voteActveStatus === 0
      ? "غير نشط"
      : vote.voteActveStatus === 1
      ? "نشط"
      : vote.votecompletestatus === 1
      ? "مكتمل"
      : "غير مكتمل",
          }));
          setAllVotes(mappedVotes);
        } else {
          console.error("فشل في جلب جميع التصويتات", result);
        }
      } catch (error) {
        console.error("خطأ في جلب التصويتات:", error);
      }
    };

    fetchAllVotes();
  }, []);

  const stats = [
    {
      name: "عدد الأعضاء",
      value: membersCount,
      icon: <UserRound className="h-8 w-8 text-council-accent text-blue-400" />,
    },
    {
      name: "التصويتات المكتملة",
      value: voteStats.completed,
      icon: <ChartBar className="h-8 w-8 text-green-600" />,
    },
    {
      name: "التصويتات النشطة",
      value: voteStats.active,
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

      <div className="mt-5 p-5 box-border border rounded-lg" style={{ direction: "ltr" }}>
        <div className="flex flex-col items-end justify-end gap-2">
          <h2 className="text-2xl font-semibold">كل التصويتات</h2>
          <p className="text-sm text-gray-400 font-normal">
            جميع التصويتات سواء النشطة أو المكتملة أو غير المكتملة
          </p>
        </div>
        <div style={{ direction: "rtl"}}>
            <BoxCard  votes={allVotes}  />
        </div>
      
      </div>
    </section>
  );
};

export default Cards;
