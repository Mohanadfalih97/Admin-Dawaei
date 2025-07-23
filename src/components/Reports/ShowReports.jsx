import React from "react";

const ShowReports = ({ votes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {votes.map((vote) => (
        <div
          key={vote.id}
          className="border-2 rounded-lg shadow-sm p-3 bg-white flex flex-col justify-between hover:border-priamy duration-300"
        >
          {/* العنوان والوصف */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex justify-between">
              {vote.status === "نشط" && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  نشط
                </span>
              )}
              {vote.status === "انتضار" && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  انتضار
                </span>
              )}
              {vote.status === "غير مكتمل" && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  مكتمل
                </span>
              )}
            </div>
            <div className="flex flex-col ">
              <h2 className="text-xl text-center font-bold text-priamy">
                {vote.title}
              </h2>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed text-center">
                {vote.description}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-gray-700 text-s flex flex-col items-center justify-end ">
            <div className="flex flex-col items-center">{vote.Date}</div>
            <div className="flex flex-col items-center">
              {vote.votesCount} : {vote.votesTotle}
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full bg-priamy text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
              عرض التقرير
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowReports;
