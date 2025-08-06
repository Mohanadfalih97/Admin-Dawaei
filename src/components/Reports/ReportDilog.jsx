import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Ui/dialog";
import { Button } from "../Ui/Button";
import { FileChartColumn, Printer } from "lucide-react";
import { ScrollArea } from "../Ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../Ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DateTime } from "luxon";

// ✅ دالة تنسيق الوقت إلى توقيت بغداد بالعربية
const formatDateBaghdad = (isoDate) => {
  return DateTime
    .fromISO(isoDate, { zone: "utc" })
    .setZone("Asia/Baghdad")
    .setLocale("ar")
    .toFormat("cccc dd-MM-yyyy - hh:mm a");
};

// ✅ جلب تفاصيل التصويت
const fetchVoteDetails = async (voteId) => {
  const token = localStorage.getItem("token");

  const resultRes = await axios.get(
    `${process.env.REACT_APP_API_URL}vote/calculate-result/${voteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "ar",
      },
    }
  );

  const data = resultRes.data?.data || {};

  const execRes = await axios.get(
    `${process.env.REACT_APP_API_URL}vote-excution?voteId=${voteId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const allExecutions = execRes.data?.data?.items || [];

  const votedOnly = allExecutions
    .filter((e) => e.voteResultId && e.voteId === voteId)
    .reduce((acc, curr) => {
      if (!acc.some((e) => e.memberVoterId === curr.memberVoterId)) {
        acc.push(curr);
      }
      return acc;
    }, []);

  const memberCache = {};
  const executionsWithNames = await Promise.all(
    votedOnly.map(async (exec) => {
      if (memberCache[exec.memberVoterId]) {
        return { ...exec, fullName: memberCache[exec.memberVoterId] };
      }
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}members/${exec.memberVoterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fullName = res.data?.data?.fullName || "غير معروف";
        memberCache[exec.memberVoterId] = fullName;
        return { ...exec, fullName };
      } catch {
        return { ...exec, fullName: "غير معروف" };
      }
    })
  );

  return {
    voteTitle: data.voteTitle,
    minMembersRequired: data.minMembersRequired,
    actualVoters: data.actualVoters,
    results: data.results,
    msg: resultRes.data?.msg,
    voters: executionsWithNames,
  };
};

// ✅ المكون الرئيسي
const VoteReportDialog = ({ open, onOpenChange, report, memberCount }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["voteDetails", report?.id],
    queryFn: () => fetchVoteDetails(report.id),
    enabled: !!report,
  });

  if (!report) return null;

  const handlePrint = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>تقرير التصويت</title>
          <style>
            body {
              font-family: "Times New Roman", Times, serif;
              padding: 20px;
              margin: 0;
              direction: rtl;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f0f0f0;
            }
            h3, h4 {
              margin: 0 0 1rem 0;
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between print:pb-6" dir="rtl">
          <DialogTitle className="flex items-center gap-2 text-xl mt-4">
            <FileChartColumn className="h-6 w-6" />
            <span>تقرير التصويت</span>
          </DialogTitle>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] overflow-auto" dir="rtl">
          <div className="mt-4 space-y-6 px-1" id="print-section">
            {isLoading ? (
              <p className="text-center py-10">جاري تحميل تفاصيل التصويت...</p>
            ) : (
              <>
                {/* عنوان التصويت ووصفه */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{data.voteTitle}</h3>
                  <p className="text-muted-foreground">{report.dscrp}</p>
                </div>

                {/* جدول تفاصيل التصويت */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">البيان</TableHead>
                      <TableHead>التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">تاريخ التصويت</TableCell>
                      <TableCell>{formatDateBaghdad(report.startDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">عدد الأعضاء الكلي في الدورة</TableCell>
                      <TableCell>{memberCount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">أقل نصاب مطلوب</TableCell>
                      <TableCell>{data.minMembersRequired}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">عدد المصوتين</TableCell>
                      <TableCell>{data.actualVoters}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">حالة النصاب</TableCell>
                      <TableCell>
                        {data.msg === "Quorum completed successfully" ? (
                          <span className="text-green-600 font-medium">تم تحقيق النصاب بنجاح</span>
                        ) : (
                          <span className="text-red-600 font-medium">النصاب غير مكتمل</span>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* جدول نتائج التصويت */}
                {data.results?.length > 0 && (
                  <div className="pb-4">
                    <h4 className="text-lg font-semibold mb-3">نتائج التصويت</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الخيار</TableHead>
                          <TableHead className="text-center">عدد الأصوات</TableHead>
                          <TableHead className="text-center">النسبة المئوية</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.results.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>{result.optionDescription}</TableCell>
                            <TableCell className="text-center">{result.count}</TableCell>
                            <TableCell className="text-center">
                              {((result.count / data.actualVoters) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* جدول المصوتين */}
                {data.voters?.length > 0 && (
                  <div className="pb-4">
                    <h4 className="text-lg font-semibold mb-3">عدد النصاب</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اسم العضو</TableHead>
                          <TableHead>تاريخ التصويت</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.voters.map((voter, i) => (
                          <TableRow key={i}>
                            <TableCell>{voter.fullName}</TableCell>
                            <TableCell>{formatDateBaghdad(voter.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VoteReportDialog;
