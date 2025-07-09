import React, { useState } from "react";
import InputsVote from "../components/InputsVote";
import DateTimeSelector from "../components/DateTimeSelector";
import VoteOptions from "../components/VoteOptions";
import VoteNominations from "../components/VoteNominations";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateVote = () => {
  const [voteTitle, setTitle] = useState("");
  const [dscrp, setDscrp] = useState("");
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [minMumbersVoted, setMinMumbersVoted] = useState("");
  const [voteActveStatus, setVoteActveStatus] = useState(0);
  const [options, setOptions] = useState(["", ""]); // خيارات التصويت
  const [loading, setLoading] = useState(false);
  const [cycleId, setCycleId] = useState("");

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

  const payload = {
    voteTitle,
    dscrp,
    minMumbersVoted,
    creationDate: new Date().toISOString(),
    startDate,
    finishDate,
    docUrl: file ? file.name : "string",
    voteInfo: 0,
    voteActveStatus,
    cycleId: Number(cycleId),
  };

  try {
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

      // إرسال خيارات التصويت باستخدام voteId
      const voteId = result.data?.id;
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
        toast.success("تم إضافة الخيارات بنجاح");
      }

      navigate("/VotePageMain");
    } else {
      // 🔴 عرض كل رسالة خطأ على حدة
      if (result.msg) {
        const messages = result.msg.split(" | ");
        messages.forEach((m) => toast.error(m));
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
          finishDate={finishDate}
          setFinishDate={setFinishDate}
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
