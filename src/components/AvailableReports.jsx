import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import VoteReportDialog from "../components/ReportDilog";
import { FileText } from "lucide-react";

const AvailableReports = () => {
  const activeVotes = [
    {
      id: "1",
      title: "التصويت على ميزانية المشاريع لعام 2025",
      description: "التصويت على الميزانية المقترحة للمشاريع التطويرية للعام القادم",
      date: new Date("2024-03-15"),
      votesTotle: 20, // عدد الأعضاء
      votesCount: 7,  // عدد المصوتين
      status: "completed",
      results: [
        { option: "نعم", votes: 3, percentage: 42.9 },
        { option: "كلا", votes: 4, percentage: 57.1 },
      ],
    },
    // يمكنك إضافة المزيد لاحقاً...
  ];

  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);

  const openDialog = (report) => {
    setSelectedReport(report);
    setOpen(true);
  };

  return (
    <section className="flex flex-col" style={{ direction: "ltr" }}>
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
                <th className="p-3 border">عنوان التصويت</th>
                <th className="p-3 border">الوصف</th>
                <th className="p-3 border">تاريخ التصويت</th>
                <th className="p-3 border">عدد الأعضاء</th>
                <th className="p-3 border">عدد المصوتين</th>
                <th className="p-3 border">خيارات التصويت</th>
                <th className="p-3 border">الإجراء</th>
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
                  <td className="p-3 border">{vote.votesCount}</td>
                  <td className="p-3 border text-right">
                    {vote.results.map((result, i) => (
                      <div key={i} className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{result.option}</span>
                        <span>{result.votes} صوت</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => openDialog(vote)}
                      className="text-blue-600 hover:text-blue-800"
                      title="عرض التقرير"
                    >
                      <FileText size={18} />
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
          <VoteReportDialog open={open} onOpenChange={setOpen} report={selectedReport} />
        </Dialog.Root>
      </div>
    </section>
  );
};

export default AvailableReports;
