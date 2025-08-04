
import { DateTime } from "luxon";

const arabicMonthNames = {
  January: "كانون الثاني",
  February: "شباط",
  March: "آذار",
  April: "نيسان",
  May: "أيار",
  June: "حزيران",
  July: "تموز",
  August: "آب",
  September: "أيلول",
  October: "تشرين الأول",
  November: "تشرين الثاني",
  December: "كانون الأول",
};

const arabicWeekDays = {
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
  Sunday: "الأحد",
};

const formatDate = (datetime) => {
  if (!datetime) return "—";
  try {
    const dt = DateTime.fromISO(datetime, { zone: "utc" }).setZone("Asia/Baghdad");
    const englishMonth = dt.toFormat("LLLL");
    const arabicMonth = arabicMonthNames[englishMonth] || englishMonth;
    const arabicDay = arabicWeekDays[dt.toFormat("EEEE")] || dt.toFormat("EEEE");
    const formatted = dt.toFormat(`d '${arabicMonth}' yyyy - hh:mm a`);
    return `${arabicDay} ${formatted} (بغداد)`;
  } catch {
    return "تاريخ غير صالح";
  }
};

const DateTimeSelector = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  finishDate,
  setFinishDate,
  finishTime,
  setFinishTime,
}) => {
  const combinedStart = startDate && startTime ? `${startDate}T${startTime}` : null;
  const combinedFinish = finishDate && finishTime ? `${finishDate}T${finishTime}` : null;

  return (
    <section className="grid grid-cols-2 gap-4 w-full" dir="rtl">
      <div className="flex flex-col items-center py-5 gap-2" style={{ direction: "ltr" }}>
        <label>تاريخ ووقت بداية التصويت</label>
        <div className="flex flex-row gap-2 w-full">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded text-center"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-40 p-2 border rounded text-center"
          />
        </div>
      
      </div>

      <div className="flex flex-col items-center py-5 gap-2" style={{ direction: "ltr" }}>
        <label>تاريخ ووقت نهاية التصويت</label>
        <div className="flex flex-row gap-2 w-full">
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            className="w-full p-2 border rounded text-center"
          />
          <input
            type="time"
            value={finishTime}
            onChange={(e) => setFinishTime(e.target.value)}
            className="w-40 p-2 border rounded text-center"
          />
        </div>
       
      </div>
    </section>
  );
};

export default DateTimeSelector;
