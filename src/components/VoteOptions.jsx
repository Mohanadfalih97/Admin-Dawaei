import React from "react";

const VoteOptions = ({ voteActveStatus, setVoteActveStatus }) => {
  console.log( "voteActveStatus:", voteActveStatus);

  return (
    <section className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row items-end gap-2 border p-4 rounded-md">
    {/*     <div className="w-full flex flex-col gap-3">
          <label className="text-right w-full">حالة التصويت</label>
          <select
            className="w-full p-2.5 border rounded-lg"
            style={{ direction: "rtl" }}
            value={voteStatus}
            onChange={(e) => setVoteStatus(Number(e.target.value))}
          >
            <option value="0">مكتمل</option>
            <option value="1">غير مكتمل</option>
          </select>
        </div> */}

        <div className="w-full flex flex-col gap-3">
          <label className="text-right w-full">الحالة العامة</label>
          <select
            className="w-full p-2.5 border rounded-lg"
            style={{ direction: "rtl" }}
            value={voteActveStatus}
            onChange={(e) => setVoteActveStatus(Number(e.target.value))}
          >
            <option value="0">نشط</option>
            <option value="1">غير نشط</option>
          </select>
        </div>
      </div>
    </section>
  );
};


export default VoteOptions;
