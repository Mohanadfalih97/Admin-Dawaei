import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Ui/dialog";
import { Button } from "./Ui/Button";
import { FileChartColumn, Printer, Scroll } from "lucide-react";
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

const TOTAL_MEMBERS = 26; // Total number of members from Members.tsx

const VoteReportDialog = ({ open, onOpenChange, report }) => {
  if (!report) return null;

  const formatDate = (date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: ar });
  };

  const handlePrint = () => {
    window.print();
  };

  const votingPercentage = ((report.votesCount / TOTAL_MEMBERS) * 100).toFixed(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl  bg-white print:bg-white" >
        <DialogHeader className="flex flex-row items-center justify-between print:pb-6" dir="rtl">
          <DialogTitle className="flex items-center gap-2 text-xl mt-4">
            <FileChartColumn className="h-6 w-6" />
            <span>تقرير التصويت</span>
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="print:hidden"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="print:hidden"
              onClick={() => onOpenChange(true)}
            >
              <Scroll className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] overflow-auto" dir="rtl">
          <div className="mt-4 space-y-6 px-1">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{report.title}</h3>
              <p className="text-muted-foreground">{report.description}</p>
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
                  <TableCell>{formatDate(report.date)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">عدد المصوتين</TableCell>
                  <TableCell>
                    {report.votesCount} من أصل {TOTAL_MEMBERS} عضو ({votingPercentage}
                    %)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">الحالة</TableCell>
                  <TableCell>{report.status}</TableCell>
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
