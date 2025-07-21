import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InputsVote from "../components/InputsVote";
import DateTimeSelector from "../components/DateTimeSelector";
import { toast } from "react-toastify";
import VoteOptions from "../components/VoteOptions";

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
  const [votecompletestatus, setVoteStatus] = useState(0);
  const [minMumbersVoted, setMinMumbersVoted] = useState(0);
  const [voteActveStatus, setVoteActveStatus] = useState(0);
  const [cycleId, setCycleId] = useState(""); // الدورة الانتخابية

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [voteOptions, setVoteOptions] = useState([]);
  const [cycles, setCycles] = useState([]);


  useEffect(() => {
    const loadData = async () => {
      try {
        // بيانات التصويت
        if (voteData) {
          setTitle(voteData.voteTitle || "");
          setDscrp(voteData.dscrp || "");
          setMinMumbersVoted(Number(voteData.minMumbersVoted) || 0);
          setStartDate(voteData.startDate || "");
          setFinishDate(voteData.finishDate || "");
          setFile(voteData.docUrl ? { name: voteData.docUrl } : null);
          setVoteStatus(voteData.votecompletestatus ?? 0);
          setVoteActveStatus(voteData.voteActveStatus ?? 0);
          setCycleId(voteData.cycleId ?? "");
        } else {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}vote/${id}`);
          const data = res.data.data.items[0];
          setTitle(data.voteTitle || "");
          setDscrp(data.dscrp || "");
          setMinMumbersVoted(Number(data.minMumbersVoted) || 0);
          setStartDate(data.startDate || "");
          setFinishDate(data.finishDate || "");
          setFile(data.docUrl ? { name: data.docUrl } : null);
          setVoteStatus(data.votecompletestatus ?? 0);
          setVoteActveStatus(data.voteActveStatus ?? 0);
 setCycleId(data.cycleId ?? "");
        }

        // جلب الدورات الانتخابية
        const cycleResponse = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
setCycles(cycleResponse.data.data.items || []);
        // جلب خيارات التصويت
        const optionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}vote-options`,
          {
            params: { VoteId: id },
            headers: {
              "Accept-Language": "en",
              Accept: "application/json",
            },
          }
        );
        setVoteOptions(optionsResponse.data.data.items || []);
      } catch (err) {
        toast.error(" فشل تحميل بيانات التصويت");
      }
    };

    loadData();
  }, [voteData, id]);

  const handleAddOption = async () => {
    try {
      const newOption = {
        voteId: id,
        voteDscrp: "",
      };
      setSubmitting(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}vote-options`, newOption, {
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });
      setVoteOptions([...voteOptions, response.data.data]);
      toast.success(" تم إضافة خيار التصويت");
    } catch {
      toast.error(" فشل في إضافة خيار التصويت");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...voteOptions];
    updatedOptions[index].voteDscrp = value;
    setVoteOptions(updatedOptions);
  };

  const handleDeleteOption = async (index, optionId) => {
    const updatedOptions = [...voteOptions];
    updatedOptions.splice(index, 1);
    setVoteOptions(updatedOptions);

    try {
      setDeleting(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}vote-options/${optionId}`, {
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });
      toast.success(" تم حذف الخيار");
    } catch {
      toast.error(" فشل في حذف الخيار");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateOption = async (optionId, updatedDescription) => {
    try {
      setIsUpdating(true);
      await axios.put(`${process.env.REACT_APP_API_URL}vote-options/${optionId}`, {
        voteId: id,
        voteDscrp: updatedDescription,
      });
      toast.success(" تم تحديث الخيار");
    } catch {
      toast.error(" فشل في تحديث الخيار");
    } finally {
      setIsUpdating(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!cycleId) {
    toast.error(" يرجى اختيار الدورة الانتخابية");
    return;
  }

  // ✅ تحقق من أن finishDate صالح ومقارنة بالتاريخ الحالي
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const finish = new Date(finishDate);
  const finishDateOnly = new Date(finish.getFullYear(), finish.getMonth(), finish.getDate());

  if (voteActveStatus === 1 && finishDateOnly < todayDateOnly) {
    toast.error("📅 تاريخ التصويت منتهي، يرجى تحديث تاريخ الانتهاء قبل تنشيط التصويت.");
    return;
  }

  setSubmitting(true);

  const finalVoteCompleteStatus = voteActveStatus === 1 ? 0 : votecompletestatus;

  const formPayload = {
    voteTitle: title,
    dscrp,
    startDate,
    minMumbersVoted,
    finishDate,
    docUrl: file ? file.name : "",
    votecompletestatus: finalVoteCompleteStatus,
    voteActveStatus,
    voteInfo: 0,
    cycleId: Number(cycleId),
  };

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}vote/${id}`, formPayload, {
      headers: {
        "Accept-Language": "en",
        Accept: "application/json",
      },
    });
    toast.success(" تم تعديل التصويت بنجاح");
    navigate("/VotePageMain");
  } catch {
    toast.error(" فشل في تعديل التصويت");
  } finally {
    setSubmitting(false);
  }
};



  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}vote/${id}`);
      toast.success(" تم حذف التصويت");
      navigate("/VotePageMain");
    } catch {
      toast.error(" فشل في حذف التصويت");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-end justify-end gap-1">
        <h1 className="text-3xl text-priamy font-semibold">تعديل التصويت</h1>
        <p className="text-lg font-normal text-gray-500">أدخل تفاصيل التصويت وخيارات المشاركين</p>
      </div>

      <form className="mt-5 p-5 box-border border rounded-lg" onSubmit={handleSubmit}>
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

        {/* اختيار الدورة الانتخابية */}
        <VoteOptions     voteActveStatus={voteActveStatus}
  setVoteActveStatus={setVoteActveStatus}
  cycleId={cycleId}
    cycles={cycles}
  setCycleId={setCycleId} />
 

        {/* خيارات التصويت */}
        <div className="w-full flex flex-col items-end mt-6" style={{ direction: "rtl" }}>
          <div className="w-full flex justify-between items-center">
            <h3 className="text-xl font-semibold">خيارات التصويت</h3>
            <button
              type="button"
              className="p-2.5 border rounded-lg bg-blue-500 text-white"
              onClick={handleAddOption}
              disabled={submitting || deleting || isUpdating}
            >
              إضافة خيار
            </button>
          </div>

          {voteOptions.map((option, index) => (
            <div key={option.id || index} className="flex gap-2 mt-2 w-full">
              <input
                type="text"
                value={option.voteDscrp}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="p-2 w-full border rounded-lg"
                placeholder={`الخيار ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleDeleteOption(index, option.id)}
                className="p-2.5 border rounded-lg bg-red-500 text-white w-20"
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => handleUpdateOption(option.id, option.voteDscrp)}
                className="p-2.5 border rounded-lg bg-blue-600 text-white w-20"
              >
                تعديل
              </button>
            </div>
          ))}
        </div>

        {/* أزرار التحكم */}
        <div className="w-full flex items-center justify-between mt-6" style={{ direction: "rtl" }}>
          <button
            type="submit"
            disabled={submitting}
            className={`p-2.5 border rounded-lg w-32 text-white ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-priamy hover:bg-blue-800"
            }`}
          >
            {submitting ? "جاري التعديل..." : "تعديل التصويت"}
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className={`p-2.5 border rounded-lg w-32 text-white ${
              deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {deleting ? "جارٍ الحذف..." : "حذف التصويت"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditVote;
