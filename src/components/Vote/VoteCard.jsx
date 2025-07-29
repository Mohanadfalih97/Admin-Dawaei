import React, { useEffect, useState } from "react";
import { Calendar, ChartBar, UserRound } from "lucide-react";
import BoxCard from "../BoxCard";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const [membersCount, setMembersCount] = useState(0);
  const [voteStats, setVoteStats] = useState({ completed: 0, active: 0 });
  const [allVotes, setAllVotes] = useState([]);
  const [voteExecutions, setVoteExecutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const votesPerPage = 6; // عدد التصويتات لكل صفحة


  const navigate = useNavigate();

  const handleVoteClick = (id) => {
    navigate(`/vote-user-details/${id}`);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}members`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.data?.totalCount != null) {
          setMembersCount(result.data.totalCount);
        }
      } catch (error) {
        console.error("خطأ في جلب الأعضاء:", error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchVoteStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}vote/status-counts`, {
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
        }
      } catch (error) {
        console.error("خطأ في جلب إحصائيات التصويت:", error);
      }
    };

    fetchVoteStats();
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}vote`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (res.ok && result.data?.items) {
          const mappedVotes = result.data.items
            .filter((vote) => vote.voteActveStatus === 1) // فقط النشطة
            .map((vote) => ({
              id: vote.id,
              title: vote.voteTitle,
              description: vote.dscrp,
              startDate: new Date(vote.startDate),
              endDate: new Date(vote.finishDate),
              status:
                vote.voteActveStatus === 1
                  ? "نشط"
                  : vote.votecompletestatus === 1
                  ? "مكتمل"
                  : "غير مكتمل",
            }));
          setAllVotes(mappedVotes);
        }
      } catch (err) {
        console.error("خطأ في جلب التصويتات:", err);
      }
    };

const fetchAllVoteExecutions = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}vote-excution`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await res.json();
    if (res.ok && result.data?.items) {
      setVoteExecutions(result.data.items);
    }
  } catch (err) {
    console.error("خطأ في جلب بيانات التصويتات المنفذة:", err);
  }
};

    fetchVotes();
    fetchAllVoteExecutions();
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
  const totalPages = Math.ceil(allVotes.length / votesPerPage);
const paginatedVotes = allVotes.slice(
  (currentPage - 1) * votesPerPage,
  currentPage * votesPerPage
);

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};


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

      {allVotes.length > 0 && (
        <div className="mt-5 p-5 box-border border rounded-lg" style={{ direction: "ltr" }}>
          <div className="flex flex-col items-end justify-end gap-2">
            <h2 className="text-2xl font-semibold">تصويتات نشطة</h2>
            <p className="text-sm text-gray-400 font-normal">
              جميع التصويتات النشطة المتاحة
            </p>
          </div>
          <div style={{ direction: "rtl" }}>
<BoxCard
  votes={paginatedVotes}
  voteExecutions={voteExecutions}
  onVoteClick={handleVoteClick}
/>

          </div>
          {totalPages > 1 && (
  <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      السابق
    </button>

    {(() => {
      const visiblePages = 5;
      const currentGroup = Math.floor((currentPage - 1) / visiblePages);
      const startPage = currentGroup * visiblePages + 1;
      const endPage = Math.min(startPage + visiblePages - 1, totalPages);

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          className={`px-3 py-1 border rounded ${
            pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
          }`}
        >
          {pageNum}
        </button>
      ));
    })()}

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      التالي
    </button>
  </div>
)}

        </div>
      )}
    </section>
  );
};

export default Cards;
