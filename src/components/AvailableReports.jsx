import React, { useEffect, useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import VoteReportDialog from "../components/ReportDilog";
import { FileText } from "lucide-react";
import axios from "axios";

const AvailableReports = () => {
  const [votes, setVotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

const fetchVotes = useCallback(async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}vote?votecompletestatus=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "ar",
        },
      }
    );

    const fetchedVotes = res.data.data.items || [];

    const enrichedVotes = await Promise.all(
      fetchedVotes.map(async (vote) => {
        const [optionsRes, execRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}vote-options?voteId=${vote.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}vote-excution?voteId=${vote.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const voteOptions = optionsRes.data.data.items || [];
        const voteExecutions = execRes.data.data.items || [];

        const optionMap = {};
        voteOptions.forEach((opt) => {
          optionMap[opt.id] = opt.voteDscrp;
        });

        const executionsWithNames = await Promise.all(
          voteExecutions.map(async (exec) => {
            try {
              const res = await axios.get(`${process.env.REACT_APP_API_URL}members/${exec.memberVoterId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Accept-Language": "ar",
                },
              });
              return {
                fullName: res.data?.data?.fullName || "غير معروف",
                voteResultId: exec.voteResultId,
              };
            } catch {
              return {
                fullName: "غير معروف",
                voteResultId: exec.voteResultId,
              };
            }
          })
        );

        const groupedVoters = {};
        executionsWithNames.forEach(({ voteResultId, fullName }) => {
          const option = optionMap[voteResultId] || "خيار غير معروف";
          if (!groupedVoters[option]) groupedVoters[option] = [];
          groupedVoters[option].push(fullName);
        });

        const results = countVoteResults(voteExecutions, voteOptions);

        return {
          ...vote,
          voteTotle: vote.minMumbersVoted,
          voteCount: voteExecutions.length,
          results,
          groupedVoters,
        };
      })
    );

    setVotes(enrichedVotes);
  } catch (error) {
    console.error("Error fetching votes:", error);
  } finally {
    setLoading(false);
  }
}, [token]);


  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const countVoteResults = (executions, options) => {
    const optionMap = {};
    options.forEach((opt) => {
      optionMap[opt.id] = opt.voteDscrp;
    });

    const counts = {};
    executions.forEach((exec) => {
      const desc = optionMap[exec.voteResultId];
      if (!desc) return;
      counts[desc] = (counts[desc] || 0) + 1;
    });

    const total = executions.length;
    return Object.entries(counts).map(([option, votes]) => ({
      option,
      votes,
      percentage: ((votes / total) * 100).toFixed(1),
    }));
  };

  const openDialog = (report) => {
    setSelectedReport(report);
    setOpen(true);
  };

  return (
    <section className="flex flex-col" style={{ direction: "ltr" }}>
      <div className="flex flex-col items-end gap-1">
        <h1 className="text-3xl text-primary font-semibold">تقارير التصويت</h1>
        <p className="text-lg font-normal text-gray-500">عرض نتائج وتقارير التصويتات السابقة</p>
      </div>

      <div className="mt-5 p-5 border rounded-lg">
        <div className="flex flex-col items-end gap-1 mb-4">
          <h1 className="text-2xl font-semibold">التقارير المتاحة</h1>
          <p className="text-lg font-normal text-gray-500">اطلع على نتائج وتفاصيل التصويتات السابقة</p>
        </div>

        {loading ? (
          <p className="text-center">جاري التحميل...</p>
        ) : (
          <div className="overflow-x-auto" style={{ direction: "rtl" }}>
            <table className="min-w-full text-center border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">عنوان التصويت</th>
                  <th className="p-3 border">الوصف</th>
                  <th className="p-3 border">تاريخ التصويت</th>
                  <th className="p-3 border">اقل عدد للنصاب</th>
                  <th className="p-3 border">عدد المصوتين</th>
                  <th className="p-3 border">خيارات التصويت</th>
                  <th className="p-3 border">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {votes.map((vote, index) => (
                  <tr key={vote.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{vote.voteTitle}</td>
                    <td className="p-3 border">{vote.dscrp}</td>
                    <td className="p-3 border">{new Date(vote.startDate).toLocaleDateString("ar-EG")}</td>
                    <td className="p-3 border">{vote.voteTotle}</td>
                    <td className="p-3 border">{vote.voteCount}</td>
                    <td className="p-3 border text-right">
                      {vote.results.map((result, i) => (
                        <div key={i} className="flex justify-between text-sm mb-1">
                          <span className="font-semibold">{result.option}</span>
                          <span>{result.votes} صوت ({result.percentage}%)</span>
                        </div>
                      ))}
                    </td>
                   
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => openDialog(vote)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog.Root
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setSelectedReport(null);
          }}
        >
          <VoteReportDialog open={open} onOpenChange={setOpen} report={selectedReport} />
        </Dialog.Root>
      </div>
    </section>
  );
};

export default AvailableReports;
