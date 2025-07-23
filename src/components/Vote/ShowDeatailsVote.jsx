import React from "react";

const ShowDeatailsVote = () => {
  const candidates = ["أحمد", "محمد", "سلطان", "عبدالله"];

  return (
    <div className="flex flex-col mt-3 items-end justify-center">
      <h1 className="text-lg">خيارات التصويت</h1>
      <form className="w-full">
        {candidates.map((candidate, index) => (
          <div className=" flex items-center justify-end text-right mt-5 p-2.5 box-border border rounded-lg  gap-2">
            <label className="text-lg">{`المرشح ${candidate}`}</label>
            <input
              type="radio"
              name="candidate"
              value={candidate}
              className="h-5 w-5 text-blue-600"
            />
          </div>
        ))}
        <button className="w-full mt-3 text-white bg-priamy p-2.5 rounded-lg">
          تأكيد التصويت
        </button>
      </form>
    </div>
  );
};

export default ShowDeatailsVote;
