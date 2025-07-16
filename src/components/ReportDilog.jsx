import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Ui/dialog";
import { Button } from "./Ui/Button";
import { FileChartColumn, Printer} from "lucide-react";
import { ScrollArea } from "../components/Ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/Ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const TOTAL_MEMBERS = 26;

const VoteReportDialog = ({ open, onOpenChange, report }) => {
  if (!report) return null;

  const formatDate = (date) => {
    return format(new Date(date), "EEEE d MMMM yyyy", { locale: ar });
  };

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
              font-family: Times New Roman", Times, serif;
              padding: 2rem;
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
    printWindow.print();
  };

  const votingPercentage = ((report.voteCount / TOTAL_MEMBERS) * 100).toFixed(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between print:pb-6" dir="rtl">
          <DialogTitle className="flex items-center gap-2 text-xl mt-4">
            <FileChartColumn className="h-6 w-6" />
            <span>تقرير التصويت</span>
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
        
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] overflow-auto" dir="rtl">
          <div className="mt-4 space-y-6 px-1" id="print-section">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{report.voteTitle}</h3>
              <p className="text-muted-foreground">{report.dscrp}</p>
            </div>

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
                  <TableCell>{formatDate(report.startDate)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">عدد المصوتين</TableCell>
                  <TableCell>
                    {report.voteCount} من أصل {TOTAL_MEMBERS} عضو ({votingPercentage}%)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">الحالة</TableCell>
                  <TableCell>
                    {report.votecompletestatus === 1 ? "مكتمل" : "غير مكتمل"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {report.results && (
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
                    {report.results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.option}</TableCell>
                        <TableCell className="text-center">{result.votes}</TableCell>
                        <TableCell className="text-center">{result.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VoteReportDialog;
