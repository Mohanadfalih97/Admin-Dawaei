import React, { useState } from "react";
import InputsVote from "../components/Vote/InputsVote";
import DateTimeSelector from "../components/DateTimeSelector";
import VoteOptions from "../components/Vote/VoteOptions";
import VoteNominations from "../components/Vote/VoteNominations";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateVote = () => {
  const [voteTitle, setTitle] = useState("");
  const [dscrp, setDscrp] = useState("");
  const [file, setFile] = useState(null);

  const [minMumbersVoted, setMinMumbersVoted] = useState("");
  const [voteActveStatus, setVoteActveStatus] = useState(0);
  const [options, setOptions] = useState(["", ""]); // خيارات التصويت
  const [loading, setLoading] = useState(false);
  const [cycleId, setCycleId] = useState("");
const [startDate, setStartDate] = useState("");
const [startTime, setStartTime] = useState("");
const [finishDate, setFinishDate] = useState("");
const [finishTime, setFinishTime] = useState("");
 const navigate = useNavigate();
const onAddOption = () => setOptions([...options, ""]);
const onOptionChange = (index, value) => {
  const updated = [...options];
  updated[index] = value;
  setOptions(updated);
};
const onRemoveOption = (index) => {
  if (options.length <= 2) return;
  const updated = [...options];
  updated.splice(index, 1);
  setOptions(updated);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  // 🔴 التحقق من الدورة الانتخابية
  if (!cycleId || cycleId === "") {
    toast.error("لا يمكن تعديل التصويت. لا توجد دورة انتخابية نشطة.");
     setLoading(false);
    return;
  }
  let uploadedFileUrl = "string";
  try {
    // 1️⃣ رفع المرفق أولاً إذا كان موجودًا
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}attachments`, {
        method: "POST",
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },
        body: formData,
      });

      const uploadResult = await uploadRes.json();

      if (!uploadRes.ok || !uploadResult.data) {
        toast.error("فشل رفع الملف");
        setLoading(false);
        return;
      }

      uploadedFileUrl = uploadResult.data;
    }
const DateTime = require("luxon").DateTime;
const fullStartDate = DateTime.fromFormat(`${startDate} ${startTime}`, "yyyy-MM-dd HH:mm", {
  zone: "Asia/Baghdad"
}).toUTC().toISO();

const fullFinishDate = DateTime.fromFormat(`${finishDate} ${finishTime}`, "yyyy-MM-dd HH:mm", {
  zone: "Asia/Baghdad"
}).toUTC().toISO();
    // 2️⃣ إعداد البيانات لإرسال التصويت
    const payload = {
      voteTitle,
      dscrp,
      minMumbersVoted,
     creationDate: new Date().toISOString(),
  startDate: fullStartDate,
  finishDate: fullFinishDate,
      docUrl: uploadedFileUrl,
      voteInfo: 0,
      voteActveStatus,
      cycleId: Number(cycleId),
    };

    // 3️⃣ إرسال التصويت
    const response = await fetch(`${process.env.REACT_APP_API_URL}vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("تم إنشاء التصويت بنجاح");

      const voteId = result.data?.id;

      // 4️⃣ إرسال خيارات التصويت إذا تم إنشاء التصويت بنجاح
      if (voteId) {
        await Promise.all(
          options.map((option) =>
            fetch(`${process.env.REACT_APP_API_URL}vote-options`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept-Language": "en",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                voteId,
                voteDscrp: option,
              }),
            })
          )
        );
      }

      navigate("/VotePageMain");
    } else {
if (result.message) {
  switch (result.message) {
    case "Minimum members voted cannot exceed total members count":
      toast.error("لا يمكن أن يكون الحد الأدنى للمصوتين أكبر من العدد الكلي للأعضاء");
      break;
    default:
      toast.error(result.message);
  }
} else {
  toast.error("حدث خطأ أثناء إنشاء التصويت");
}


    }
  } catch (error) {
    toast.error("فشل الاتصال بالخادم");
  } finally {
    setLoading(false);
  }
};



  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-end gap-1">
        <h1 className="text-3xl font-semibold text-priamy">إنشاء تصويت جديد</h1>
        <p className="text-lg text-gray-500">أدخل تفاصيل التصويت وخيارات المشاركين</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 p-5 border rounded-lg">
        <InputsVote
          voteTitle={voteTitle}
          setTitle={setTitle}
          dscrp={dscrp}
          setDscrp={setDscrp}
          file={file}
          setFile={setFile}
          minMumbersVoted={minMumbersVoted}
          setMinMumbersVoted={setMinMumbersVoted}
        />

        <DateTimeSelector
       startDate={startDate}
  setStartDate={setStartDate}
  startTime={startTime}
  setStartTime={setStartTime}
  finishDate={finishDate}
  setFinishDate={setFinishDate}
  finishTime={finishTime}
  setFinishTime={setFinishTime}
        />

        <VoteOptions
          voteActveStatus={voteActveStatus}
          setVoteActveStatus={setVoteActveStatus}
           cycleId={cycleId}
  setCycleId={setCycleId}
        />

   <VoteNominations
        options={options}
        onAddOption={onAddOption}
        onOptionChange={onOptionChange}
        onRemoveOption={onRemoveOption}
      />


        <div className="w-full flex justify-between mt-5" style={{ direction: "rtl" }}>
          <button
            type="submit"
            disabled={loading}
            className={`p-2.5 border rounded-lg w-32 transition text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-priamy hover:bg-blue-800"
            }`}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء التصويت"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateVote;
