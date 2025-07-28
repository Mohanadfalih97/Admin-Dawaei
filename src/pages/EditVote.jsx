import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InputsVote from "../components/Vote/InputsVote";
import DateTimeSelector from "../components/DateTimeSelector";
import { toast } from "react-toastify";
import VoteOptions from "../components/Vote/VoteOptions";

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
  const [minMumbersVoted, setMinMumbersVoted] = useState(0);
  const [voteActveStatus, setVoteActveStatus] = useState(0);
  const [cycleId, setCycleId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [voteOptions, setVoteOptions] = useState([]);
  const [cycles, setCycles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (voteData) {
          setTitle(voteData.voteTitle || "");
          setDscrp(voteData.dscrp || "");
          setMinMumbersVoted(Number(voteData.minMumbersVoted) || 0);
          setStartDate(voteData.startDate || "");
          setFinishDate(voteData.finishDate || "");
          setFile(voteData.docUrl ? { name: voteData.docUrl } : null);
          setVoteActveStatus(voteData.voteActveStatus ?? 0);
          setCycleId(voteData.cycleId ?? "");
        } else {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}vote/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": "en",
              Accept: "application/json",
            },
          });
          const data = res.data.data.items[0];
          setTitle(data.voteTitle || "");
          setDscrp(data.dscrp || "");
          setMinMumbersVoted(Number(data.minMumbersVoted) || 0);
          setStartDate(data.startDate || "");
          setFinishDate(data.finishDate || "");
          setFile(data.docUrl ? { name: data.docUrl } : null);
          setVoteActveStatus(data.voteActveStatus ?? 0);
          setCycleId(data.cycleId ?? "");
        }

        const cycleResponse = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
            Accept: "application/json",
          },
        });
        setCycles(cycleResponse.data.data.items || []);

        const optionsResponse = await axios.get(`${process.env.REACT_APP_API_URL}vote-options`, {
          params: { VoteId: id },
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
            Accept: "application/json",
          },
        });
        setVoteOptions(optionsResponse.data.data.items || []);
      } catch (err) {
        toast.error(" فشل تحميل بيانات التصويت");
      }
    };

    loadData();
  }, [voteData, id, token]);

  const handleAddOption = async () => {
    try {
      const newOption = { voteId: id, voteDscrp: "" };
      setSubmitting(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}vote-options`, newOption, {
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en",
          Accept: "application/json",
        },
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
   

    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const finish = new Date(finishDate);
    const finishDateOnly = new Date(finish.getFullYear(), finish.getMonth(), finish.getDate());

    if (voteActveStatus === 1 && finishDateOnly < todayDateOnly) {
      toast.error("📅 تاريخ التصويت منتهي، يرجى تحديث تاريخ الانتهاء قبل تنشيط التصويت.");
      return;
    }

    setSubmitting(true);
    let uploadedDocUrl = file?.name || "";

    if (file && file instanceof File) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(`${process.env.REACT_APP_API_URL}attachments`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedDocUrl = uploadRes.data.data;
      } catch {
        toast.error("فشل في رفع المرفق الجديد");
        setSubmitting(false);
        return;
      }
    }

    const finalVoteCompleteStatus = 0;

    const formPayload = {
      voteTitle: title,
      dscrp,
      startDate,
      minMumbersVoted,
      finishDate,
      docUrl: uploadedDocUrl,
      votecompletestatus: finalVoteCompleteStatus,
      voteActveStatus,
      voteInfo: 0,
      cycleId: Number(cycleId),
    };

try {
  const response = await axios.put(
    `${process.env.REACT_APP_API_URL}vote/${id}`,
    formPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "en",
        Accept: "application/json",
      },
    }
  );

  const result = response.data;

  if (result.message) {
    switch (result.message) {
      case "Minimum members voted cannot exceed total members count.":
        toast.error("لا يمكن أن يكون الحد الأدنى للمصوتين أكبر من العدد الكلي للأعضاء");
        break;
      default:
        toast.error(result.message);
    }
  } else {
    toast.success("تم تعديل التصويت بنجاح");
    navigate("/VotePageMain");
  }
} catch (error) {
  // ✅ التعامل مع الخطأ القادم من السيرفر
  const msg = error.response?.data?.message;
  if (msg === "Minimum members voted cannot exceed total members count.") {
    toast.error("لا يمكن أن يكون الحد الأدنى للمصوتين أكبر من العدد الكلي للأعضاء");
  } else if (msg) {
    toast.error(msg);
  } else {
    toast.error("فشل في تعديل التصويت");
  }
} finally {
  setSubmitting(false);
}

  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}vote/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });
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

        {file && file.name && typeof file.name === "string" && (
          <div className="mt-2 text-right">
            <a
              href={file.name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              📎 تحميل المرفق الحالي
            </a>
          </div>
        )}

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
          cycles={cycles}
        />

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
