import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import VoteReportDialog from "./ReportDilog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// ✅ تغذية كل تصويت بالنتائج المحسوبة
const enrichVote = async (vote, token) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}vote/calculate-result/${vote.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": "ar",
    },
  });

  const data = res.data?.data || {};
  return {
    ...vote,
    voteCount: data.actualVoters,
    minMumbersVoted: data.minMembersRequired,
    results: data.results.map((r) => ({
      option: r.optionDescription,
      votes: r.count,
      percentage: ((r.count / data.actualVoters) * 100).toFixed(1),
    })),
    quorumStatusMsg: res.data?.msg,
  };
};

// ✅ تحميل التصويتات حسب الدورة الانتخابية
const fetchVotes = async ({ page, cycleId }) => {
  const token = localStorage.getItem("token");

  console.log("📦 CycleId المرسل إلى API:", cycleId); // فقط للتأكد

  const res = await axios.get(`${process.env.REACT_APP_API_URL}vote`, {
    params: {
      isCalculated: 1,
      votecompletestatus: 1,
      CycleId: cycleId || undefined, // ✅ التعديل هنا
      PageNumber: page,
      PageSize: 10,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": "ar",
    },
  });

  const items = res.data.data.items || [];

  const enrichedItems = await Promise.all(
    items.map((vote) => enrichVote(vote, token))
  );

  return {
    items: enrichedItems,
    totalPages: res.data.data.totalPages,
  };
};



const AvailableReports = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [electionCycles, setElectionCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState("");

  // ✅ تحميل الدورات الانتخابية عند فتح الصفحة
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "ar",
          },
        });

        const items = res.data?.data?.items || [];
        setElectionCycles(items);

        // ✅ اختيار أول دورة تلقائياً إذا موجودة
        if (items.length > 0) {
          setSelectedCycleId(items[0].id);
        }
      } catch (err) {
        console.error("Error fetching election cycles:", err);
      }
    };

    fetchCycles();
  }, []);

  // ✅ تحميل التصويتات عند اختيار دورة أو تغيير الصفحة
  const { data, isLoading, isError } = useQuery({
    queryKey: ["votes", page, selectedCycleId],
    queryFn: () => fetchVotes({ page, cycleId: selectedCycleId }),
    enabled: selectedCycleId !== "",
    keepPreviousData: true,
  });

  const totalPages = data?.totalPages || 1;
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  return (
    <section className="flex flex-col" style={{ direction: "ltr" }}>
      <div className="flex flex-col items-end gap-1">
        <h1 className="text-3xl text-primary font-semibold">تقارير التصويت</h1>
        <p className="text-lg font-normal text-gray-500">
          عرض نتائج وتقارير التصويتات السابقة
        </p>
      </div>

      <div className="mt-5 p-5 border rounded-lg">
        <div className="flex flex-col items-end gap-1 mb-4">
          <h1 className="text-2xl font-semibold">التقارير المتاحة</h1>
          <p className="text-lg font-normal text-gray-500">
            اطلع على نتائج وتفاصيل التصويتات السابقة
          </p>
        </div>

        {/* ✅ فلتر الدورة الانتخابية */}
        <div className="mb-6 text-right" style={{ direction: "rtl" }}>
          <label htmlFor="cycleSelect" className="block mb-2 font-semibold">
            اختر الدورة الانتخابية:
          </label>
          <select
            id="cycleSelect"
            value={selectedCycleId}
            onChange={(e) => {
              setSelectedCycleId(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 w-full md:w-1/3"
          >
            <option value="">-- اختر الدورة --</option>
            {electionCycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.dscrp}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ عرض النتائج حسب الحالة */}
        {selectedCycleId === "" ? (
          <p className="text-center text-gray-600">يرجى اختيار دورة لعرض النتائج</p>
        ) : isLoading ? (
          <p className="text-center">جاري التحميل...</p>
        ) : isError ? (
          <p className="text-center text-red-600">حدث خطأ أثناء تحميل البيانات</p>
        ) : (
          <>
            {/* ✅ جدول التصويتات */}
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
                    <th className="p-3 border">حالة النصاب</th>
                    <th className="p-3 border">تفاصيل التصويت</th>
                    <th className="p-3 border">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((vote, index) => (
                    <tr key={vote.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{(page - 1) * 10 + index + 1}</td>
                      <td className="p-3 border">{vote.voteTitle}</td>
                      <td className="p-3 border">{vote.dscrp}</td>
                      <td className="p-3 border">
{format(new Date(vote.startDate), "eeee، dd MMMM yyyy", { locale: ar })}
                      </td>
                      <td className="p-3 border">{vote.minMumbersVoted}</td>
                      <td className="p-3 border">{vote.voteCount}</td>
                      <td className="p-3 border">
                        {vote.quorumStatusMsg === "Quorum completed successfully" ? (
                          <span className="text-green-600 font-medium">تم تحقيق النصاب بنجاح</span>
                        ) : (
                          <span className="text-red-600 font-medium">النصاب غير مكتمل</span>
                        )}
                      </td>
                      <td className="p-3 border text-right">
                        {vote?.results?.length > 0 ? (
                          vote.results.map((result, i) => (
                            <div key={i} className="flex justify-between text-sm mb-1">
                              <span className="font-semibold">{result.option}</span>
                              <span>{result.votes} صوت ({result.percentage}%)</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">لا توجد نتائج</span>
                        )}
                      </td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => {
                            setSelectedReport(vote);
                            setOpen(true);
                          }}
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

            {/* ✅ الترقيم */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  السابق
                </button>

                {(() => {
                  const visiblePages = 5;
                  const currentGroup = Math.floor((page - 1) / visiblePages);
                  const startPage = currentGroup * visiblePages + 1;
                  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

                  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        pageNum === page ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ نافذة التفاصيل */}
      <Dialog.Root
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setSelectedReport(null);
        }}
      >
        <VoteReportDialog
          open={open}
          onOpenChange={setOpen}
          report={selectedReport}
        />
      </Dialog.Root>
    </section>
  );
};

export default AvailableReports;
