
import React from "react";



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
