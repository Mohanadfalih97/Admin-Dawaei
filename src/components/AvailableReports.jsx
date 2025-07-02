import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import VoteReportDialog from "../components/ReportDilog";


const AvailableReports = () => {
  const activeVotes = [
    {
      id: "1",
      title: "التصويت على ميزانية المشاريع لعام 2025",
      description:
        "التصويت على الميزانية المقترحة للمشاريع التطويرية للعام القادم",
      date: new Date("2024-03-15"),
      votesTotle: 14,
      votesCount: 14,
      status: "completed",
      results: [
        { option: "موافق على الميزانية", votes: 10, percentage: 71.4 },
        { option: "غير موافق على الميزانية", votes: 3, percentage: 21.4 },
        { option: "امتناع عن التصويت", votes: 1, percentage: 7.2 },
      ],
    },
    // باقي البيانات كما هي...
  ];

  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);

  const openDialog = (report) => {
    setSelectedReport(report);
    setOpen(true);
  };




  return (
    <section className="flex flex-col"  style={{direction:"ltr"}}>
      <div className="flex flex-col items-end justify-end gap-1">
        <h1 className="text-3xl text-primary font-semibold">تقارير التصويت</h1>
        <p className="text-lg font-normal text-gray-500">
          عرض نتائج وتقارير التصويتات السابقة
        </p>
      </div>

      <div className="mt-5 p-5 box-border border rounded-lg">
        <div className="flex flex-col items-end justify-end gap-1 mb-4">
          <h1 className="text-2xl font-semibold">التقارير المتاحة</h1>
          <p className="text-lg font-normal text-gray-500">
            اطلع على نتائج وتفاصيل التصويتات السابقة
          </p>
        </div>

           <div className="overflow-x-auto" style={{ direction: "rtl" }}>
        <table className="min-w-full text-center border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">العنوان</th>
                <th className="p-3 border">الوصف</th>
                <th className="p-3 border">التاريخ</th>
                <th className="p-3 border">عدد الأصوات</th>
                <th className="p-3 border">الحالة</th>
                <th className="p-3 border"></th>
              </tr>
            </thead>
          <tbody>
            {activeVotes.map((vote, index) => (
              <tr key={vote.id} className="hover:bg-gray-50">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">{vote.title}</td>
                <td className="p-3 border">{vote.description}</td>
                <td className="p-3 border">{vote.date.toLocaleDateString("ar-EG")}</td>
                <td className="p-3 border">{vote.votesTotle}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      vote.status === "completed"
                        ? "bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                        : vote.status === "waiting"
                        ? "bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                        : "bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                    }`}
                  >
                    {vote.status === "completed"
                      ? "نشط"
                      : vote.status === "waiting"
                      ? "انتظار"
                      : "غير مكتمل"}
                  </span>
                </td>
                <td className="p-3 border">
                  <button
                    className="bg-blue-500 text-white text-xs font-bold p-3 rounded-full"
                    onClick={() => openDialog(vote)}
                  >
                    عرض التقرير
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مكون Radix Dialog */}
    <Dialog.Root
  open={open}
  onOpenChange={(isOpen) => {
    setOpen(isOpen);
    if (!isOpen) setSelectedReport(null);
  }}
>
  <VoteReportDialog
    open={open}
    onOpenChange={setOpen}
    report={selectedReport}
  />
  </Dialog.Root>
      </div>
    </section>
  );
};

export default AvailableReports;
