import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InputsVote from "../components/InputsVote";
import DateTimeSelector from "../components/DateTimeSelector";
import VoteOptions from "../components/VoteOptions";
import { toast } from "react-toastify";

const EditVote = () => {
  const { id } = useParams();
  const location = useLocation();
  const voteData = location.state;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dscrp, setDscrp] = useState("");
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [votecompletestatus, setVoteStatus] = useState(0);
  const [minMumbersVoted, setMinMumbersVoted] = useState(0);
  const [voteActveStatus, setVoteActveStatus] = useState(0);
  const [submitting, setSubmitting] = useState(false);
const [deleting, setDeleting] = useState(false);


  // تحميل البيانات
  useEffect(() => {
    const loadData = async () => {
      try {
        if (voteData) {
          setTitle(voteData.voteTitle || "");
          setDscrp(voteData.dscrp || "");
          setMinMumbersVoted(Number(voteData.minMumbersVoted) || 0); // عند استخدام state
          setStartDate(voteData.startDate || "");
          setFinishDate(voteData.finishDate || "");
          setFile(voteData.docUrl ? { name: voteData.docUrl } : null);
          setVoteStatus(voteData.votecompletestatus ?? 0);
          setVoteActveStatus(voteData.voteActveStatus ?? 0);
        } else {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}vote/${id}`);
          const data = res.data.data.items[0];
          setTitle(data.voteTitle || "");
          setDscrp(data.dscrp || "");
          setMinMumbersVoted(Number(voteData.minMumbersVoted) || 0); // عند استخدام state
          setStartDate(data.startDate || "");
          setFinishDate(data.finishDate || "");
          setFile(data.docUrl ? { name: data.docUrl } : null);
          setVoteStatus(data.votecompletestatus ?? 0);
          setVoteActveStatus(data.voteActveStatus ?? 0);
        }
      } catch (err) {
        toast.error("❌ فشل تحميل بيانات التصويت");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [voteData, id]);

  // تعديل التصويت
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true); // ⬅️ تفعيل حالة التحميل للتعديل

  const formPayload = {
    voteTitle: title,
    dscrp,
    startDate,
    minMumbersVoted,
    finishDate,
    docUrl: file ? file.name : "",
    votecompletestatus,
    voteActveStatus,
    voteInfo: 0,
  };

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}vote/${id}`, formPayload, {
      headers: {
        "Accept-Language": "en",
        Accept: "application/json",
      },
    });
    toast.success("✅ تم تعديل التصويت بنجاح");
    navigate("/VotePageMain");
  } catch (err) {
    console.error("❌ فشل في تعديل التصويت:", err);
    toast.error("❌ حدث خطأ أثناء التعديل");
  } finally {
    setSubmitting(false); // ⬅️ إيقاف التحميل
  }
};


  // حذف التصويت
 const handleDelete = async () => {
  setDeleting(true); // ⬅️ تفعيل حالة التحميل للحذف
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}vote/${id}`, {
      headers: {
        "Accept-Language": "en",
        Accept: "application/json",
      },
    });
    toast.success("🗑️ تم حذف التصويت بنجاح");
    navigate("/VotePageMain");
  } catch (err) {
    console.error("❌ فشل في حذف التصويت:", err);
    toast.error("❌ حدث خطأ أثناء الحذف");
  } finally {
    setDeleting(false); // ⬅️ إيقاف التحميل
  }
};


  if (loading) return <p className="text-center mt-10">جارٍ تحميل البيانات...</p>;

  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-end justify-end gap-1">
        <h1 className="text-3xl text-priamy font-semibold">تعديل التصويت</h1>
        <p className="text-lg font-normal text-gray-500">
          أدخل تفاصيل التصويت وخيارات المشاركين
        </p>
      </div>

      <form className="mt-5 p-5 box-border border rounded-lg" onSubmit={handleSubmit}>
        <div className="flex flex-col items-end justify-end gap-1 mb-4">
          <h2 className="text-2xl font-semibold">معلومات التصويت</h2>
          <p className="text-lg font-normal text-gray-500">
            أدخل العنوان والوصف وتفاصيل التصويت
          </p>
        </div>

        <InputsVote
          title={title}
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

        {!loading && (
          <VoteOptions
        
            voteActveStatus={voteActveStatus}
            setVoteActveStatus={setVoteActveStatus}
          />
        )}

      <div className="w-full flex items-center justify-between mt-6" style={{ direction: "rtl" }}>
  <button
    type="submit"
    disabled={submitting || deleting}
    className={`p-2.5 box-border border rounded-lg w-32 transition text-white ${
      submitting ? "bg-gray-400 cursor-not-allowed" : "bg-priamy hover:bg-blue-800"
    }`}
  >
    {submitting ? "جاري التعديل..." : "تعديل التصويت"}
  </button>

  <button
    type="button"
    disabled={deleting || submitting}
    className={`p-2.5 box-border border rounded-lg w-32 transition text-white ${
      deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
    }`}
    onClick={handleDelete}
  >
    {deleting ? "جارٍ الحذف..." : "حذف التصويت"}
  </button>
</div>

      </form>
    </section>
  );
};

export default EditVote;
