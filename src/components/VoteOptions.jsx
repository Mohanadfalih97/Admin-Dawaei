import React, { useEffect, useState } from "react";

const VoteOptions = ({ voteActveStatus, setVoteActveStatus, cycleId, setCycleId }) => {
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.data?.items) {
          setCycles(result.data.items);
        }
      } catch (error) {
        console.error("فشل في تحميل الدورات:", error);
      }
    };

    fetchCycles();
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row items-end gap-2 border p-4 rounded-md">
        <div className="w-full flex flex-col gap-3">
          <label className="text-right w-full">الدورة الانتخابية</label>
          <select
            className="w-full p-2.5 border rounded-lg"
            style={{ direction: "rtl" }}
            value={cycleId}
            onChange={(e) => setCycleId(Number(e.target.value))}
          >
            <option value="">اختر الدورة</option>
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.dscrp}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col gap-3">
          <label className="text-right w-full">الحالة العامة</label>
          <select
            className="w-full p-2.5 border rounded-lg"
            style={{ direction: "rtl" }}
            value={voteActveStatus}
            onChange={(e) => setVoteActveStatus(Number(e.target.value))}
          >
            <option value="1">نشط</option>
            <option value="0">غير نشط</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default VoteOptions;
