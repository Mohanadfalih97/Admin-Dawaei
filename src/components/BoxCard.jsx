import { Calendar } from "lucide-react";
import React from "react";


const BoxCard = ({ votes }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {votes.map((vote) => (
        <div
          key={vote.id}
          className="border-2 rounded-lg shadow-sm p-3 bg-white flex flex-col justify-between hover:border-priamy duration-300"
        >
          {/* العنوان والوصف */}
          <div className="flex items-center justify-between gap-2" style={{ direction: "ltr" }}>
            <div className="flex justify-between">
              {vote.status === "نشط" && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  نشط
                </span>
              )}
              {vote.status === "مكتمل" && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  مكتمل
                </span>
              )}
                  {vote.status === "غير نشط" && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  غير نشط
                </span>
              )}
              {vote.status === "غير مكتمل" && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  غير مكتمل
                </span>
              )}
            </div>
            <h2 className="text-xl text-center font-bold text-priamy">
              {vote.title}
            </h2>
          </div>

          <div className="mt-4 space-y-2 text-gray-700 text-s flex flex-col items-center justify-end ">
            <p className="text-gray-600 text-sm mt-2 leading-relaxed text-center">
              {vote.description}
            </p>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 ml-2" />
              <span>يبدأ: {formatDate(vote.startDate)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 ml-2" />
              <span>ينتهي: {formatDate(vote.endDate)}</span>
            </div>
          </div>
      
        </div>
      ))}
    </div>
  );
};

export default BoxCard;
