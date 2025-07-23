import React from "react";
import ShowDeatailsVote from "../components/Vote/ShowDeatailsVote";
import { Calendar } from "lucide-react";

const VoteDetails = () => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-end justify-end gap-1">
        <h1 className="text-3xl text-priamy font-semibold">
          انتخاب أعضاء اللجنة التنفيذية
        </h1>
        <p className="text-lg font-normal text-gray-500">
          انتخاب أعضاء اللجنة التنفيذية للدورة الجديدة{" "}
        </p>
      </div>

      <div className="mt-5 p-5 box-border border rounded-lg">
        <div className="flex flex-col items-end justify-end gap-1">
          <h1 className="text-2xl font-semibold">تفاصيل التصويت</h1>
          <p className="text-lg font-normal text-gray-500">
            معلومات التصويت والخيارات المتاحة
          </p>
        </div>

        <div className="mt-4  text-gray-700 text-s flex flex-col items-end justify-center gap-3 border-b ">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 ml-4 mr-1" />
            <span>يبدأ: تاريخ: 15 مارس 2024 </span>
          </div>
          <div className="flex items-center justify-center mb-3">
            <Calendar className="w-4 h-4 ml-2 mr-1" />
            <span>ينتهي: تاريخ: 15 مارس 2024 </span>
          </div>
        </div>

        <ShowDeatailsVote />
      </div>
    </section>
  );
};

export default VoteDetails;
