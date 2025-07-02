import React from "react";
const DateTimeSelector = ({ startDate, setStartDate, finishDate, setFinishDate }) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-2 gap-3 w-full " dir="rtl">
      <div className="flex flex-col items-end py-5 gap-2"dir="ltr">
        <label>تاريخ بداية التصويت</label>
        <input
          type="datetime-local"
          className="w-full p-2.5 border rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col items-end py-5 gap-2" dir="ltr">
        <label>تاريخ نهاية التصويت</label>
        <input
          type="datetime-local"
          className="w-full p-2.5 border rounded-lg"
          value={finishDate}
          onChange={(e) => setFinishDate(e.target.value)}
          required
        />
      </div>
    </section>
  );
};


export default DateTimeSelector;
